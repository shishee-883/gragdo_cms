from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Treatment
from .serializers import (
    TreatmentSerializer, TreatmentCreateSerializer
)


class TreatmentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Treatment model."""
    
    queryset = Treatment.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TreatmentCreateSerializer
        return TreatmentSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by clinic if clinicId is provided
        clinic_id = self.request.query_params.get('clinicId')
        if clinic_id:
            queryset = queryset.filter(clinic_id=clinic_id)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        treatment = serializer.save()
        
        return Response({
            'success': True,
            'treatment': TreatmentSerializer(treatment).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        treatment = serializer.save()
        
        return Response({
            'success': True,
            'treatment': TreatmentSerializer(treatment).data
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
            'treatments': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'treatment': serializer.data
        })