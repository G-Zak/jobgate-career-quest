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
    path('api/', include(router.urls)),
    path('api/tests-alt/', tests_list_view, name='tests-alt'),  # Route alternative
    path('api/tests-alt/<int:test_id>/', test_detail_view, name='test-detail-alt'),  # Détail d'un test
]
