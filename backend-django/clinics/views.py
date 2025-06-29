from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Clinic
from .serializers import ClinicSerializer, ClinicCreateSerializer

User = get_user_model()


class ClinicViewSet(viewsets.ModelViewSet):
    """ViewSet for the Clinic model."""
    
    queryset = Clinic.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ClinicCreateSerializer
        return ClinicSerializer
    
    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        clinic = serializer.save()
        
        # If the user is a SUPER_ADMIN, add this clinic to their clinic_ids
        user = request.user
        if user.role == 'SUPER_ADMIN':
            clinic_ids = user.clinic_ids or []
            clinic_ids.append(str(clinic.id))
            user.clinic_ids = clinic_ids
            user.save()
        
        return Response({
            'success': True,
            'clinic': ClinicSerializer(clinic).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        clinic = serializer.save()
        
        return Response({
            'success': True,
            'clinic': ClinicSerializer(clinic).data
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if clinic has associated data
        if instance.doctors.exists() or instance.patients.exists():
            return Response({
                'success': False,
                'error': 'Cannot delete clinic with associated doctors or patients'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete clinic
        self.perform_destroy(instance)
        
        # If the user is a SUPER_ADMIN, remove this clinic from their clinic_ids
        user = request.user
        if user.role == 'SUPER_ADMIN' and user.clinic_ids:
            clinic_ids = user.clinic_ids
            if str(instance.id) in clinic_ids:
                clinic_ids.remove(str(instance.id))
                user.clinic_ids = clinic_ids
                user.save()
        
        return Response({
            'success': True
        }, status=status.HTTP_200_OK)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        # Filter clinics based on user's role and clinic_ids
        user = request.user
        if user.role == 'SUPER_ADMIN' and user.clinic_ids:
            queryset = queryset.filter(id__in=user.clinic_ids)
        elif user.role in ['ADMIN', 'STAFF', 'DOCTOR'] and user.clinic:
            queryset = queryset.filter(id=user.clinic.id)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'clinics': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'clinic': serializer.data
        })