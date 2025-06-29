from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet

router = DefaultRouter()
router.register('', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', include(router.urls)),
    path('<uuid:pk>/cancel/', AppointmentViewSet.as_view({'patch': 'cancel'}), name='appointment-cancel'),
    path('<uuid:pk>/check-in/', AppointmentViewSet.as_view({'patch': 'check_in'}), name='appointment-check-in'),
    path('<uuid:pk>/start/', AppointmentViewSet.as_view({'patch': 'start'}), name='appointment-start'),
    path('<uuid:pk>/complete/', AppointmentViewSet.as_view({'patch': 'complete'}), name='appointment-complete'),
    path('<uuid:pk>/reschedule/', AppointmentViewSet.as_view({'patch': 'reschedule'}), name='appointment-reschedule'),
]