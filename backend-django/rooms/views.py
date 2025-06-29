from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Room
from .serializers import (
    RoomSerializer, RoomCreateSerializer,
    RoomUpdateSerializer
)


class RoomViewSet(viewsets.ModelViewSet):
    """ViewSet for the Room model."""
    
    queryset = Room.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RoomCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return RoomUpdateSerializer
        return RoomSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by clinic if clinicId is provided
        clinic_id = self.request.query_params.get('clinicId')
        if clinic_id:
            queryset = queryset.filter(clinic_id=clinic_id)
        
        # Filter by active status if isActive is provided
        is_active = self.request.query_params.get('isActive')
        if is_active is not None:
            is_active_bool = is_active.lower() == 'true'
            queryset = queryset.filter(is_active=is_active_bool)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        room = serializer.save()
        
        return Response({
            'success': True,
            'room': RoomSerializer(room).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        room = serializer.save()
        
        return Response({
            'success': True,
            'room': RoomSerializer(room).data
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if room has associated beds
        if instance.beds.exists():
            return Response({
                'success': False,
                'error': 'Cannot delete room with associated beds'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_destroy(instance)
        
        return Response({
            'success': True
        }, status=status.HTTP_200_OK)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'rooms': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'room': serializer.data
        })