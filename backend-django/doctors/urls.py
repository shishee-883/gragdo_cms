from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, ScheduleViewSet

router = DefaultRouter()
router.register('', DoctorViewSet, basename='doctor')
router.register('schedules', ScheduleViewSet, basename='schedule')

urlpatterns = [
    path('', include(router.urls)),
    path('<uuid:pk>/toggle-availability/', DoctorViewSet.as_view({'post': 'toggle_availability'}), name='doctor-toggle-availability'),
]