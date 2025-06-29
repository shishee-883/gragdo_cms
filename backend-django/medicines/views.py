from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Medicine
from .serializers import (
    MedicineSerializer, MedicineCreateSerializer,
    MedicineUpdateSerializer, MedicineStockUpdateSerializer
)


class MedicineViewSet(viewsets.ModelViewSet):
    """ViewSet for the Medicine model."""
    
    queryset = Medicine.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MedicineCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return MedicineUpdateSerializer
        elif self.action == 'update_stock':
            return MedicineStockUpdateSerializer
        return MedicineSerializer
    
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
        medicine = serializer.save()
        
        return Response({
            'success': True,
            'medicine': MedicineSerializer(medicine).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        medicine = serializer.save()
        
        return Response({
            'success': True,
            'medicine': MedicineSerializer(medicine).data
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        
        return Response({
            'success': True
        }, status=status.HTTP_200_OK)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'medicines': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'medicine': serializer.data
        })
    
    @action(detail=True, methods=['patch'])
    def update_stock(self, request, pk=None):
        """Update medicine stock."""
        medicine = self.get_object()
        serializer = self.get_serializer(medicine, data=request.data)
        serializer.is_valid(raise_exception=True)
        medicine = serializer.save()
        
        return Response({
            'success': True,
            'medicine': MedicineSerializer(medicine).data
        })