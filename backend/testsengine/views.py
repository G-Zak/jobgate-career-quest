from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db.models import Q
from .models import Test, Question, TestSession, TestAnswer
from .serializers import (
    TestSerializer, QuestionSerializer, TestSessionSerializer, 
    TestAnswerSerializer, SubmitAnswerSerializer
)

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.filter(is_active=True)
    serializer_class = TestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['list', 'retrieve', 'spatial_reasoning']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def verbal_reasoning(self, request):
        """Get the verbal reasoning test"""
        try:
            test = Test.objects.get(test_type='verbal_reasoning', is_active=True)
            serializer = self.get_serializer(test)
            return Response(serializer.data)
        except Test.DoesNotExist:
            return Response(
                {'error': 'Verbal reasoning test not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def spatial_reasoning(self, request):
        """Get the spatial reasoning test with visual content"""
        try:
            test = Test.objects.get(test_type='spatial_reasoning', is_active=True)
            serializer = self.get_serializer(test)
            return Response(serializer.data)
        except Test.DoesNotExist:
            return Response(
                {'error': 'Spatial reasoning test not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

class TestSessionViewSet(viewsets.ModelViewSet):
    serializer_class = TestSessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return TestSession.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def start_test(self, request):
        """Start a new test session"""
        test_id = request.data.get('test_id')
        if not test_id:
            return Response(
                {'error': 'test_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            test = Test.objects.get(id=test_id, is_active=True)
        except Test.DoesNotExist:
            return Response(
                {'error': 'Test not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user already has a session for this test
        existing_session = TestSession.objects.filter(
            user=request.user, 
            test=test,
            status__in=['not_started', 'in_progress']
        ).first()
        
        if existing_session:
            serializer = self.get_serializer(existing_session)
            return Response(serializer.data)
        
        # Create new session
        session = TestSession.objects.create(
            user=request.user,
            test=test,
            status='in_progress'
        )
        
        serializer = self.get_serializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def submit_answer(self, request, pk=None):
        """Submit an answer for a question"""
        session = self.get_object()
        
        if session.status != 'in_progress':
            return Response(
                {'error': 'Test session is not in progress'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = SubmitAnswerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        try:
            question = Question.objects.get(
                id=data['question_id'], 
                test=session.test
            )
        except Question.DoesNotExist:
            return Response(
                {'error': 'Question not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if answer already exists
        answer, created = TestAnswer.objects.get_or_create(
            session=session,
            question=question,
            defaults={
                'selected_answer': data['selected_answer'],
                'is_correct': data['selected_answer'] == question.correct_answer,
                'time_taken': data['time_taken']
            }
        )
        
        if not created:
            # Update existing answer
            answer.selected_answer = data['selected_answer']
            answer.is_correct = data['selected_answer'] == question.correct_answer
            answer.time_taken = data['time_taken']
            answer.save()
        
        # Update session progress
        session.current_question = max(session.current_question, question.order + 1)
        session.save()
        
        return Response({
            'success': True,
            'is_correct': answer.is_correct,
            'current_question': session.current_question
        })
    
    @action(detail=True, methods=['post'])
    def finish_test(self, request, pk=None):
        """Finish the test and calculate score"""
        session = self.get_object()
        
        if session.status != 'in_progress':
            return Response(
                {'error': 'Test session is not in progress'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate score
        total_questions = session.test.total_questions
        correct_answers = TestAnswer.objects.filter(
            session=session, 
            is_correct=True
        ).count()
        
        score = round((correct_answers / total_questions) * 100)
        
        # Update session
        session.status = 'completed'
        session.end_time = timezone.now()
        session.score = score
        session.save()
        
        serializer = self.get_serializer(session)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def get_question(self, request, pk=None):
        """Get a specific question for the test session"""
        session = self.get_object()
        question_number = request.query_params.get('number', 1)
        
        try:
            question = Question.objects.get(
                test=session.test,
                order=question_number
            )
            
            # Don't include correct answer in response
            serializer = QuestionSerializer(question)
            data = serializer.data
            data.pop('correct_answer', None)
            
            # Check if user has already answered this question
            try:
                user_answer = TestAnswer.objects.get(
                    session=session,
                    question=question
                )
                data['user_answer'] = user_answer.selected_answer
            except TestAnswer.DoesNotExist:
                data['user_answer'] = None
            
            return Response(data)
            
        except Question.DoesNotExist:
            return Response(
                {'error': 'Question not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
