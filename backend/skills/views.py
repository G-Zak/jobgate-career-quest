from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Count, Avg
from .models import Skill, CandidateProfile, TechnicalTest, TestQuestion, TestResult
from .serializers import (
    SkillSerializer, CandidateProfileSerializer, TechnicalTestSerializer, 
    TestQuestionSerializer, TestResultSerializer
)

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        skills = self.queryset.all()
        grouped = {}
        for skill in skills:
            category = skill.get_category_display()
            if category not in grouped:
                grouped[category] = []
            grouped[category].append(SkillSerializer(skill).data)
        return Response(grouped)

class CandidateProfileViewSet(viewsets.ModelViewSet):
    queryset = CandidateProfile.objects.all()
    serializer_class = CandidateProfileSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def update_skills(self, request):
        """Mettre à jour les compétences d'un candidat"""
        candidate_id = request.data.get('candidate_id', 1)  # Par défaut candidat 1
        skill_ids = request.data.get('skill_ids', [])
        skills_with_proficiency = request.data.get('skills_with_proficiency', [])
        
        # Créer ou récupérer le profil candidat
        candidate, created = CandidateProfile.objects.get_or_create(
            id=candidate_id,
            defaults={
                'first_name': f'Candidat',
                'last_name': f'{candidate_id}',
                'email': f'candidat{candidate_id}@example.com'
            }
        )
        
        # Mettre à jour les compétences
        skills = Skill.objects.filter(id__in=skill_ids)
        candidate.skills.set(skills)
        
        # Mettre à jour les compétences avec niveau de maîtrise
        if skills_with_proficiency:
            candidate.skills_with_proficiency = skills_with_proficiency
            candidate.save()
        
        return Response({
            'message': 'Compétences mises à jour avec succès',
            'candidate': CandidateProfileSerializer(candidate).data
        })
    
    @action(detail=False, methods=['get'])
    def get_user_skills(self, request):
        """Récupérer les compétences d'un candidat"""
        candidate_id = request.query_params.get('candidate_id', 1)
        
        try:
            candidate = CandidateProfile.objects.get(id=candidate_id)
            return Response({
                'candidate': CandidateProfileSerializer(candidate).data,
                'skills': SkillSerializer(candidate.skills.all(), many=True).data
            })
        except CandidateProfile.DoesNotExist:
            return Response({
                'candidate': None,
                'skills': []
            })
    
    @action(detail=True, methods=['post'])
    def add_skill(self, request, pk=None):
        candidate = self.get_object()
        skill_id = request.data.get('skill_id')
        if skill_id:
            skill = get_object_or_404(Skill, id=skill_id)
            candidate.skills.add(skill)
            return Response({'message': 'Compétence ajoutée'})
        return Response({'error': 'skill_id requis'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def remove_skill(self, request, pk=None):
        candidate = self.get_object()
        skill_id = request.data.get('skill_id')
        if skill_id:
            skill = get_object_or_404(Skill, id=skill_id)
            candidate.skills.remove(skill)
            return Response({'message': 'Compétence supprimée'})
        return Response({'error': 'skill_id requis'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def upload_photo(self, request, pk=None):
        """Upload profile photo"""
        candidate = self.get_object()
        photo = request.FILES.get('photo')
        if photo:
            candidate.photo = photo
            candidate.save()
            return Response({'message': 'Photo uploaded successfully'})
        return Response({'error': 'No photo provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def remove_photo(self, request, pk=None):
        """Remove profile photo"""
        candidate = self.get_object()
        if candidate.photo:
            candidate.photo.delete()
            candidate.photo = None
            candidate.save()
            return Response({'message': 'Photo removed successfully'})
        return Response({'message': 'No photo to remove'})

class TechnicalTestViewSet(viewsets.ModelViewSet):
    queryset = TechnicalTest.objects.filter(is_active=True)
    serializer_class = TechnicalTestSerializer
    
    def list(self, request):
        """Override list to ensure it works"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_skills(self, request):
        skill_ids = request.query_params.get('skills', '').split(',')
        if skill_ids and skill_ids[0]:
            tests = self.queryset.filter(skill__id__in=skill_ids)
            serializer = self.get_serializer(tests, many=True)
            return Response(serializer.data)
        return Response([])

class TestResultViewSet(viewsets.ModelViewSet):
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer
    
    @action(detail=False, methods=['post'])
    def submit_test(self, request):
        candidate_id = request.data.get('candidate_id')
        test_id = request.data.get('test_id')
        answers = request.data.get('answers')
        time_taken = request.data.get('time_taken')
        
        candidate = get_object_or_404(CandidateProfile, id=candidate_id)
        test = get_object_or_404(TechnicalTest, id=test_id)
        
        # Calculer le score
        score = 0
        questions = test.testquestion_set.all()
        answers_data = {}
        
        for question in questions:
            user_answer = answers.get(str(question.id))
            is_correct = user_answer == question.correct_answer
            if is_correct:
                score += question.points
            
            answers_data[str(question.id)] = {
                'user_answer': user_answer,
                'correct_answer': question.correct_answer,
                'is_correct': is_correct,
                'points': question.points if is_correct else 0
            }
        
        # Créer ou mettre à jour le résultat
        result, created = TestResult.objects.update_or_create(
            candidate=candidate,
            test=test,
            defaults={
                'score': score,
                'answers_data': answers_data,
                'time_taken': time_taken,
                'status': 'completed'
            }
        )
        
        serializer = self.get_serializer(result)
        return Response(serializer.data)


# New API endpoints for skill tests
@api_view(['GET'])
@permission_classes([AllowAny])
def get_skill_tests(request, skill_id=None):
    """
    Get skill tests for a specific skill or all skills
    GET /api/skills/tests/ - Get all skill tests
    GET /api/skills/tests/<skill_id>/ - Get tests for specific skill
    """
    try:
        if skill_id:
            # Get tests for specific skill
            skill = get_object_or_404(Skill, id=skill_id)
            tests = TechnicalTest.objects.filter(
                skill=skill, 
                is_active=True
            ).select_related('skill').prefetch_related('testquestion_set')
        else:
            # Get all active tests grouped by skill
            tests = TechnicalTest.objects.filter(
                is_active=True
            ).select_related('skill').prefetch_related('testquestion_set')
        
        # Group tests by skill
        skills_data = {}
        for test in tests:
            skill_name = test.skill.name
            if skill_name not in skills_data:
                skills_data[skill_name] = {
                    'skill': {
                        'id': test.skill.id,
                        'name': test.skill.name,
                        'category': test.skill.category,
                        'description': test.skill.description
                    },
                    'tests': []
                }
            
            # Get question count
            question_count = test.testquestion_set.count()
            
            skills_data[skill_name]['tests'].append({
                'id': test.id,
                'test_name': test.test_name,
                'description': test.description,
                'instructions': test.instructions,
                'time_limit': test.time_limit,
                'total_score': test.total_score,
                'question_count': question_count,
                'difficulty': 'Intermediate',  # Default difficulty
                'created_at': test.created_at.isoformat()
            })
        
        return Response({
            'success': True,
            'data': skills_data,
            'total_skills': len(skills_data),
            'total_tests': sum(len(skill_data['tests']) for skill_data in skills_data.values())
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'data': {}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_test_questions(request, test_id):
    """
    Get questions for a specific test (without correct answers)
    GET /api/skills/tests/<test_id>/questions/
    """
    try:
        test = get_object_or_404(TechnicalTest, id=test_id, is_active=True)
        questions = TestQuestion.objects.filter(test=test).order_by('order')
        
        questions_data = []
        for question in questions:
            questions_data.append({
                'id': question.id,
                'order': question.order,
                'question_text': question.question_text,
                'options': {
                    'A': question.option_a,
                    'B': question.option_b,
                    'C': question.option_c,
                    'D': question.option_d
                }
            })
        
        return Response({
            'success': True,
            'test': {
                'id': test.id,
                'test_name': test.test_name,
                'skill': test.skill.name,
                'description': test.description,
                'instructions': test.instructions,
                'time_limit': test.time_limit,
                'total_score': test.total_score,
                'question_count': len(questions_data)
            },
            'questions': questions_data
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_test_answers(request, test_id):
    """
    Submit test answers and get results
    POST /api/skills/tests/<test_id>/submit/
    """
    try:
        test = get_object_or_404(TechnicalTest, id=test_id, is_active=True)
        answers = request.data.get('answers', {})
        candidate_id = request.data.get('candidate_id', 1)
        
        # Get all questions for this test
        questions = TestQuestion.objects.filter(test=test).order_by('order')
        
        # Calculate score
        correct_answers = 0
        total_questions = questions.count()
        results = []
        
        for question in questions:
            user_answer = answers.get(str(question.id), '').upper()
            is_correct = user_answer == question.correct_answer
            
            if is_correct:
                correct_answers += 1
            
            results.append({
                'question_id': question.id,
                'question_text': question.question_text,
                'user_answer': user_answer,
                'correct_answer': question.correct_answer,
                'is_correct': is_correct,
                'explanation': question.explanation
            })
        
        # Calculate percentage score
        score_percentage = (correct_answers / total_questions * 100) if total_questions > 0 else 0
        score_points = int((score_percentage / 100) * test.total_score)
        
        # Determine grade
        if score_percentage >= 90:
            grade = 'Excellent'
        elif score_percentage >= 80:
            grade = 'Very Good'
        elif score_percentage >= 70:
            grade = 'Good'
        elif score_percentage >= 60:
            grade = 'Satisfactory'
        else:
            grade = 'Needs Improvement'
        
        # Save test result
        try:
            candidate = CandidateProfile.objects.get(id=candidate_id)
        except CandidateProfile.DoesNotExist:
            candidate = CandidateProfile.objects.create(
                id=candidate_id,
                first_name=f'Candidate',
                last_name=f'{candidate_id}',
                email=f'candidate{candidate_id}@example.com'
            )
        
        test_result = TestResult.objects.create(
            candidate=candidate,
            test=test,
            score=score_points,
            total_score=test.total_score,
            percentage=score_percentage,
            answers_data=answers,
            status='completed'
        )
        
        return Response({
            'success': True,
            'result': {
                'test_id': test.id,
                'test_name': test.test_name,
                'skill': test.skill.name,
                'score_points': score_points,
                'total_points': test.total_score,
                'percentage': round(score_percentage, 2),
                'correct_answers': correct_answers,
                'total_questions': total_questions,
                'grade': grade,
                'result_id': test_result.id,
                'submitted_at': test_result.created_at.isoformat()
            },
            'detailed_results': results
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_test_results(request, candidate_id):
    """
    Get test results for a specific user
    GET /api/skills/results/<candidate_id>/
    """
    try:
        results = TestResult.objects.filter(
            candidate_id=candidate_id,
            status='completed'
        ).select_related('test', 'test__skill').order_by('-created_at')
        
        results_data = []
        for result in results:
            results_data.append({
                'id': result.id,
                'test': {
                    'id': result.test.id,
                    'name': result.test.test_name,
                    'skill': result.test.skill.name
                },
                'score': result.score,
                'total_score': result.total_score,
                'percentage': result.percentage,
                'grade': 'Excellent' if result.percentage >= 90 else
                        'Very Good' if result.percentage >= 80 else
                        'Good' if result.percentage >= 70 else
                        'Satisfactory' if result.percentage >= 60 else
                        'Needs Improvement',
                'submitted_at': result.created_at.isoformat()
            })
        
        return Response({
            'success': True,
            'results': results_data,
            'total_tests': len(results_data),
            'average_score': round(
                sum(r.percentage for r in results) / len(results), 2
            ) if results else 0
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


