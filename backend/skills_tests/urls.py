"""
URL configuration for skills tests API
"""

from django.urls import path
from .django_integration import (
    StartTestView,
    SubmitAnswerView,
    GetQuestionView,
    GetTestResultsView,
    ListAvailableTestsView,
    ExportResultsView
)

app_name = 'skills_tests'

urlpatterns = [
    path('start/', StartTestView.as_view(), name='start_test'),
    path('submit-answer/', SubmitAnswerView.as_view(), name='submit_answer'),
    path('question/<str:session_id>/', GetQuestionView.as_view(), name='get_question'),
    path('results/<str:session_id>/', GetTestResultsView.as_view(), name='get_results'),
    path('available/', ListAvailableTestsView.as_view(), name='list_tests'),
    path('export/<str:session_id>/', ExportResultsView.as_view(), name='export_results'),
]
