from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from django.db.models import Count, Sum
from django.contrib.auth import get_user_model

from clinics.models import Clinic
from doctors.models import Doctor
from appointments.models import Appointment
from transactions.models import Transaction
from users.permissions import IsAdmin

User = get_user_model()


class AdminStatsView(APIView):
    """View for admin dashboard statistics."""
    
    permission_classes = [IsAdmin]
    
    def get(self, request):
        clinic_id = request.query_params.get('clinicId')
        
        if not clinic_id:
            return Response({
                'success': False,
                'error': 'Clinic ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        clinic = get_object_or_404(Clinic, id=clinic_id)
        
        # Check if user has permission to access this clinic
        if request.user.role == 'ADMIN' and request.user.clinic != clinic:
            return Response({
                'success': False,
                'error': 'You do not have permission to access this clinic'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if request.user.role == 'SUPER_ADMIN' and clinic_id not in request.user.clinic_ids:
            return Response({
                'success': False,
                'error': 'You do not have permission to access this clinic'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Get counts
        total_patients = clinic.patients.count()
        appointments = clinic.appointments.count()
        doctors = clinic.doctors.count()
        staff = User.objects.filter(clinic=clinic, role='STAFF').count()
        
        return Response({
            'success': True,
            'stats': {
                'totalPatients': total_patients,
                'appointments': appointments,
                'doctors': doctors,
                'staff': staff
            }
        })


class AdminDoctorsView(APIView):
    """View for admin doctors management."""
    
    permission_classes = [IsAdmin]
    
    def get(self, request):
        clinic_id = request.query_params.get('clinicId')
        
        if not clinic_id:
            return Response({
                'success': False,
                'error': 'Clinic ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        clinic = get_object_or_404(Clinic, id=clinic_id)
        
        # Check if user has permission to access this clinic
        if request.user.role == 'ADMIN' and request.user.clinic != clinic:
            return Response({
                'success': False,
                'error': 'You do not have permission to access this clinic'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if request.user.role == 'SUPER_ADMIN' and clinic_id not in request.user.clinic_ids:
            return Response({
                'success': False,
                'error': 'You do not have permission to access this clinic'
            }, status=status.HTTP_403_FORBIDDEN)
        
        doctors = Doctor.objects.filter(clinic=clinic)
        
        # Serialize doctors with appointment counts
        doctors_data = []
        for doctor in doctors:
            appointment_count = Appointment.objects.filter(doctor=doctor).count()
            doctors_data.append({
                'id': str(doctor.id),
                'name': doctor.name,
                'specialization': doctor.specialization,
                'isAvailable': doctor.is_available,
                'appointmentCount': appointment_count
            })
        
        return Response({
            'success': True,
            'doctors': doctors_data
        })


class AdminStaffView(APIView):
    """View for admin staff management."""
    
    permission_classes = [IsAdmin]
    
    def get(self, request):
        clinic_id = request.query_params.get('clinicId')
        
        if not clinic_id:
            return Response({
                'success': False,
                'error': 'Clinic ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        clinic = get_object_or_404(Clinic, id=clinic_id)
        
        # Check if user has permission to access this clinic
        if request.user.role == 'ADMIN' and request.user.clinic != clinic:
            return Response({
                'success': False,
                'error': 'You do not have permission to access this clinic'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if request.user.role == 'SUPER_ADMIN' and clinic_id not in request.user.clinic_ids:
            return Response({
                'success': False,
                'error': 'You do not have permission to access this clinic'
            }, status=status.HTTP_403_FORBIDDEN)
        
        staff = User.objects.filter(clinic=clinic, role='STAFF')
        
        staff_data = [{
            'id': str(user.id),
            'name': user.name,
            'role': user.get_role_display(),
            'isAvailable': user.is_active
        } for user in staff]
        
        return Response({
            'success': True,
            'staff': staff_data
        })


class AdminTransactionsView(APIView):
    """View for admin transactions management."""
    
    permission_classes = [IsAdmin]
    
    def get(self, request):
        clinic_id = request.query_params.get('clinicId')
        
        if not clinic_id:
            return Response({
                'success': False,
                'error': 'Clinic ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        clinic = get_object_or_404(Clinic, id=clinic_id)
        
        # Check if user has permission to access this clinic
        if request.user.role == 'ADMIN' and request.user.clinic != clinic:
            return Response({
                'success': False,
                'error': 'You do not have permission to access this clinic'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if request.user.role == 'SUPER_ADMIN' and clinic_id not in request.user.clinic_ids:
            return Response({
                'success': False,
                'error': 'You do not have permission to access this clinic'
            }, status=status.HTTP_403_FORBIDDEN)
        
        transactions = Transaction.objects.filter(clinic=clinic).order_by('-created_at')[:10]
        
        transactions_data = [{
            'id': str(transaction.id),
            'doctorName': transaction.doctor.name if transaction.doctor else None,
            'testName': transaction.description,
            'date': transaction.created_at.strftime('%d-%m-%Y'),
            'amount': transaction.amount
        } for transaction in transactions]
        
        return Response({
            'success': True,
            'transactions': transactions_data
        })


class AdminAppointmentsView(APIView):
    """View for admin appointments management."""
    
    permission_classes = [IsAdmin]
    
    def get(self, request):
        clinic_id = request.query_params.get('clinicId')
        
        if not clinic_id:
            return Response({
                'success': False,
                'error': 'Clinic ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        clinic = get_object_or_404(Clinic, id=clinic_id)
        
        # Check if user has permission to access this clinic
        if request.user.role == 'ADMIN' and request.user.clinic != clinic:
            return Response({
                'success': False,
                'error': 'You do not have permission to access this clinic'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if request.user.role == 'SUPER_ADMIN' and clinic_id not in request.user.clinic_ids:
            return Response({
                'success': False,
                'error': 'You do not have permission to access this clinic'
            }, status=status.HTTP_403_FORBIDDEN)
        
        appointments = Appointment.objects.filter(clinic=clinic).order_by('-created_at')[:10]
        
        appointments_data = [{
            'id': str(appointment.id),
            'sNo': idx + 1,
            'name': appointment.patient.get_full_name(),
            'phoneNumber': appointment.patient.phone,
            'email': appointment.patient.email,
            'age': appointment.patient.age,
            'gender': appointment.patient.gender,
            'action': 'Accept' if appointment.status == 'PENDING' else 'Decline'
        } for idx, appointment in enumerate(appointments)]
        
        return Response({
            'success': True,
            'appointments': appointments_data
        })