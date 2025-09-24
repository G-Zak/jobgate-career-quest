from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from django.http import JsonResponse
from .models import TechnicalTest
from .serializers import TechnicalTestSerializer

# Vue alternative pour les tests
def tests_list_view(request):
    tests = TechnicalTest.objects.filter(is_active=True)
    serializer = TechnicalTestSerializer(tests, many=True)
    return JsonResponse(serializer.data, safe=False)

def test_detail_view(request, test_id):
    try:
        test = TechnicalTest.objects.get(id=test_id, is_active=True)
        serializer = TechnicalTestSerializer(test)
        return JsonResponse(serializer.data, safe=False)
    except TechnicalTest.DoesNotExist:
        return JsonResponse({'error': 'Test not found'}, status=404)

router = DefaultRouter()
router.register(r'skills', views.SkillViewSet)
router.register(r'candidates', views.CandidateProfileViewSet)
router.register(r'tests', views.TechnicalTestViewSet)
router.register(r'results', views.TestResultViewSet)

urlpatterns = [
    # New skill tests API endpoints - these should come before router URLs
    path('api/skills/tests/', views.get_skill_tests, name='skill-tests'),
    path('api/skills/tests/<int:skill_id>/', views.get_skill_tests, name='skill-tests-by-skill'),
    path('api/skills/tests/<int:test_id>/questions/', views.get_test_questions, name='test-questions'),
    path('api/skills/tests/<int:test_id>/submit/', views.submit_test_answers, name='submit-test'),
    path('api/skills/results/<int:candidate_id>/', views.get_user_test_results, name='user-test-results'),
    
    # Router URLs - these come after custom endpoints
    path('api/', include(router.urls)),
    path('api/tests-alt/', tests_list_view, name='tests-alt'),  # Route alternative
    path('api/tests-alt/<int:test_id>/', test_detail_view, name='test-detail-alt'),  # Détail d'un test
]
