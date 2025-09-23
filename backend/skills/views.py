from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
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
