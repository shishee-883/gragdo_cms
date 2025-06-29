from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Bed
from .serializers import (
    BedSerializer, BedCreateSerializer,
    BedUpdateSerializer, BedAssignSerializer,
    BedDischargeSerializer, BedReserveSerializer
)


class BedViewSet(viewsets.ModelViewSet):
    """ViewSet for the Bed model."""
    
    queryset = Bed.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BedCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return BedUpdateSerializer
        elif self.action == 'assign':
            return BedAssignSerializer
        elif self.action == 'discharge':
            return BedDischargeSerializer
        elif self.action == 'reserve':
            return BedReserveSerializer
        return BedSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by room if roomId is provided
        room_id = self.request.query_params.get('roomId')
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        
        # Filter by status if status is provided
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        bed = serializer.save()
        
        return Response({
            'success': True,
            'bed': BedSerializer(bed).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        bed = serializer.save()
        
        return Response({
            'success': True,
            'bed': BedSerializer(bed).data
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if bed is occupied
        if instance.status == 'OCCUPIED':
            return Response({
                'success': False,
                'error': 'Cannot delete an occupied bed'
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
            'beds': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'bed': serializer.data
        })
    
    @action(detail=True, methods=['patch'])
    def assign(self, request, pk=None):
        """Assign a patient to a bed."""
        bed = self.get_object()
        
        # Check if bed is available
        if bed.status != 'AVAILABLE' and bed.status != 'RESERVED':
            return Response({
                'success': False,
                'error': 'Bed is not available for assignment'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(bed, data=request.data)
        serializer.is_valid(raise_exception=True)
        bed = serializer.save()
        
        return Response({
            'success': True,
            'bed': BedSerializer(bed).data
        })
    
    @action(detail=True, methods=['patch'])
    def discharge(self, request, pk=None):
        """Discharge a patient from a bed."""
        bed = self.get_object()
        
        # Check if bed is occupied
        if bed.status != 'OCCUPIED':
            return Response({
                'success': False,
                'error': 'Bed is not occupied'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(bed, data=request.data)
        serializer.is_valid(raise_exception=True)
        bed = serializer.save()
        
        return Response({
            'success': True,
            'bed': BedSerializer(bed).data
        })
    
    @action(detail=True, methods=['patch'])
    def reserve(self, request, pk=None):
        """Reserve a bed."""
        bed = self.get_object()
        
        # Check if bed is available
        if bed.status != 'AVAILABLE':
            return Response({
                'success': False,
                'error': 'Bed is not available for reservation'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(bed, data=request.data)
        serializer.is_valid(raise_exception=True)
        bed = serializer.save()
        
        return Response({
            'success': True,
            'bed': BedSerializer(bed).data
        })