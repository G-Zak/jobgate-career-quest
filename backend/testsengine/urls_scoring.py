"""
URL patterns for Universal Scoring System API
"""

from django.urls import path
from . import views_scoring

app_name = 'scoring'

urlpatterns = [
 # Test session management
 path('start-session/', views_scoring.StartTestSessionView.as_view(), name='start_session'),
 path('record-response/', views_scoring.RecordResponseView.as_view(), name='record_response'),
 path('complete-session/', views_scoring.CompleteTestSessionView.as_view(), name='complete_session'),

 # Results and history
 path('results/<int:session_id>/', views_scoring.GetTestResultsView.as_view(), name='get_results'),
 path('history/', views_scoring.GetUserTestHistoryView.as_view(), name='get_history'),

 # Question management
 path('question/<str:question_id>/', views_scoring.get_question_details, name='get_question'),
 path('import-questions/', views_scoring.ImportQuestionsView.as_view(), name='import_questions'),

 # Session status
 path('session/<int:session_id>/status/', views_scoring.get_session_status, name='session_status'),

 # Scoring utilities
 path('calculate-score/', views_scoring.CalculateScoreView.as_view(), name='calculate_score'),
 path('configs/', views_scoring.GetScoringConfigsView.as_view(), name='get_configs'),
]

