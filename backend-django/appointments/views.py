from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Appointment
from .serializers import (
    AppointmentSerializer, AppointmentCreateSerializer,
    AppointmentUpdateSerializer, AppointmentCancelSerializer,
    AppointmentCheckInSerializer, AppointmentStartSerializer,
    AppointmentCompleteSerializer, AppointmentRescheduleSerializer
)


class AppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet for the Appointment model."""
    
    queryset = Appointment.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        elif self.action == 'update' or self.action == 'partial_update':
            return AppointmentUpdateSerializer
        elif self.action == 'cancel':
            return AppointmentCancelSerializer
        elif self.action == 'check_in':
            return AppointmentCheckInSerializer
        elif self.action == 'start':
            return AppointmentStartSerializer
        elif self.action == 'complete':
            return AppointmentCompleteSerializer
        elif self.action == 'reschedule':
            return AppointmentRescheduleSerializer
        return AppointmentSerializer
    
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
        
        # Filter by status if status is provided
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        
        return Response({
            'success': True,
            'appointment': AppointmentSerializer(appointment).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        
        return Response({
            'success': True,
            'appointment': AppointmentSerializer(appointment).data
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
            'appointments': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'appointment': serializer.data
        })
    
    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        """Cancel an appointment."""
        appointment = self.get_object()
        serializer = self.get_serializer(appointment, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        
        return Response({
            'success': True,
            'appointment': AppointmentSerializer(appointment).data
        })
    
    @action(detail=True, methods=['patch'])
    def check_in(self, request, pk=None):
        """Check in an appointment."""
        appointment = self.get_object()
        serializer = self.get_serializer(appointment, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        
        return Response({
            'success': True,
            'appointment': AppointmentSerializer(appointment).data
        })
    
    @action(detail=True, methods=['patch'])
    def start(self, request, pk=None):
        """Start an appointment."""
        appointment = self.get_object()
        serializer = self.get_serializer(appointment, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        
        return Response({
            'success': True,
            'appointment': AppointmentSerializer(appointment).data
        })
    
    @action(detail=True, methods=['patch'])
    def complete(self, request, pk=None):
        """Complete an appointment."""
        appointment = self.get_object()
        serializer = self.get_serializer(appointment, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        
        return Response({
            'success': True,
            'appointment': AppointmentSerializer(appointment).data
        })
    
    @action(detail=True, methods=['patch'])
    def reschedule(self, request, pk=None):
        """Reschedule an appointment."""
        appointment = self.get_object()
        serializer = self.get_serializer(appointment, data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        
        return Response({
            'success': True,
            'appointment': AppointmentSerializer(appointment).data
        })