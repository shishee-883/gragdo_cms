from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BedViewSet

router = DefaultRouter()
router.register('', BedViewSet, basename='bed')

urlpatterns = [
    path('', include(router.urls)),
    path('<uuid:pk>/assign/', BedViewSet.as_view({'patch': 'assign'}), name='bed-assign'),
    path('<uuid:pk>/discharge/', BedViewSet.as_view({'patch': 'discharge'}), name='bed-discharge'),
    path('<uuid:pk>/reserve/', BedViewSet.as_view({'patch': 'reserve'}), name='bed-reserve'),
    path('room/<uuid:room_id>/', BedViewSet.as_view({'get': 'list'}), name='bed-by-room'),
]