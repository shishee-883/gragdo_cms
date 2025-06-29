from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Patient, Document
from .serializers import (
    PatientSerializer, PatientCreateSerializer,
    DocumentSerializer, DocumentCreateSerializer
)


class PatientViewSet(viewsets.ModelViewSet):
    """ViewSet for the Patient model."""
    
    queryset = Patient.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PatientCreateSerializer
        return PatientSerializer
    
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
        patient = serializer.save()
        
        return Response({
            'success': True,
            'patient': PatientSerializer(patient).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        patient = serializer.save()
        
        return Response({
            'success': True,
            'patient': PatientSerializer(patient).data
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
            'patients': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'patient': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def documents(self, request, pk=None):
        """Get all documents for a patient."""
        patient = self.get_object()
        documents = Document.objects.filter(patient=patient)
        serializer = DocumentSerializer(documents, many=True)
        
        return Response({
            'success': True,
            'documents': serializer.data
        })


class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Document model."""
    
    queryset = Document.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DocumentCreateSerializer
        return DocumentSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by patient if patientId is provided
        patient_id = self.request.query_params.get('patientId')
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        
        # Filter by type if type is provided
        doc_type = self.request.query_params.get('type')
        if doc_type:
            queryset = queryset.filter(type=doc_type)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        document = serializer.save()
        
        return Response({
            'success': True,
            'document': DocumentSerializer(document).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        document = serializer.save()
        
        return Response({
            'success': True,
            'document': DocumentSerializer(document).data
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
            'documents': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'document': serializer.data
        })