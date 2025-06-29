from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Doctor, Schedule
from .serializers import (
    DoctorSerializer, DoctorCreateSerializer,
    ScheduleSerializer, ScheduleCreateSerializer
)


class DoctorViewSet(viewsets.ModelViewSet):
    """ViewSet for the Doctor model."""
    
    queryset = Doctor.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DoctorCreateSerializer
        return DoctorSerializer
    
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
        doctor = serializer.save()
        
        return Response({
            'success': True,
            'doctor': DoctorSerializer(doctor).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        doctor = serializer.save()
        
        return Response({
            'success': True,
            'doctor': DoctorSerializer(doctor).data
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
            'doctors': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'doctor': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def toggle_availability(self, request, pk=None):
        """Toggle doctor availability."""
        doctor = self.get_object()
        doctor.is_available = not doctor.is_available
        doctor.save()
        
        return Response({
            'success': True,
            'doctor': DoctorSerializer(doctor).data
        })


class ScheduleViewSet(viewsets.ModelViewSet):
    """ViewSet for the Schedule model."""
    
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ScheduleCreateSerializer
        return ScheduleSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by doctor if doctorId is provided
        doctor_id = self.request.query_params.get('doctorId')
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        schedule = serializer.save()
        
        return Response({
            'success': True,
            'schedule': ScheduleSerializer(schedule).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        schedule = serializer.save()
        
        return Response({
            'success': True,
            'schedule': ScheduleSerializer(schedule).data
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
            'schedules': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'schedule': serializer.data
        })