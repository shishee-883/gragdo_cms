from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Prescription
from .serializers import (
    PrescriptionSerializer, PrescriptionCreateSerializer,
    PrescriptionUpdateSerializer
)


class PrescriptionViewSet(viewsets.ModelViewSet):
    """ViewSet for the Prescription model."""
    
    queryset = Prescription.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PrescriptionCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return PrescriptionUpdateSerializer
        return PrescriptionSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by clinic if clinicId is provided
        clinic_id = self.request.query_params.get('clinicId')
        if clinic_id:
            queryset = queryset.filter(clinic_id=clinic_id)
        
        # Filter by doctor if doctorId is provided
        doctor_id = self.request.query_params.get('doctorId')
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        
        # Filter by patient if patientId is provided
        patient_id = self.request.query_params.get('patientId')
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        prescription = serializer.save()
        
        return Response({
            'success': True,
            'prescription': PrescriptionSerializer(prescription).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        prescription = serializer.save()
        
        return Response({
            'success': True,
            'prescription': PrescriptionSerializer(prescription).data
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
            'prescriptions': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'prescription': serializer.data
        })