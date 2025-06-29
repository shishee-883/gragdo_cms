from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, DocumentViewSet

router = DefaultRouter()
router.register('', PatientViewSet, basename='patient')
router.register('documents', DocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
    path('<uuid:pk>/documents/', PatientViewSet.as_view({'get': 'documents'}), name='patient-documents'),
]