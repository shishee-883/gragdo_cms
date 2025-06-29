from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, time
from .models import Appointment
from patients.models import Patient
from doctors.models import Doctor
from clinics.models import Clinic

User = get_user_model()


class AppointmentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test admin
        self.admin = User.objects.create_user(
            email='admin@example.com',
            name='Admin User',
            password='password123',
            role='ADMIN'
        )
        
        # Create test clinic
        self.clinic = Clinic.objects.create(
            name='Test Clinic',
            address='123 Test Street',
            phone='1234567890',
            email='clinic@example.com',
            created_by=self.admin
        )
        
        # Set admin's clinic
        self.admin.clinic = self.clinic
        self.admin.save()
        
        # Create test doctor
        self.doctor = Doctor.objects.create(
            name='Dr. Test',
            phone='9876543210',
            specialization='General Medicine',
            clinic=self.clinic,
            created_by=self.admin
        )
        
        # Create test patient
        self.patient = Patient.objects.create(
            first_name='Test',
            last_name='Patient',
            phone='9876543210',
            gender='MALE',
            date_of_birth='1990-01-01',
            clinic=self.clinic,
            created_by=self.admin
        )
        
        # Create test appointment
        self.appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            clinic=self.clinic,
            appointment_date=date.today(),
            start_time=time(9, 0),
            end_time=time(9, 30),
            duration=30,
            concern='Test concern',
            created_by=self.admin
        )
        
        # Authenticate admin
        self.client.force_authenticate(user=self.admin)
    
    def test_create_appointment(self):
        """Test creating a new appointment."""
        data = {
            'patient': str(self.patient.id),
            'doctor': str(self.doctor.id),
            'clinic': str(self.clinic.id),
            'appointment_date': '2025-06-01',
            'start_time': '10:00:00',
            'end_time': '10:30:00',
            'duration': 30,
            'type': 'REGULAR',
            'concern': 'New concern'
        }
        
        response = self.client.post('/api/appointments/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['appointment']['concern'], data['concern'])
    
    def test_get_appointments(self):
        """Test retrieving appointments."""
        response = self.client.get('/api/appointments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['appointments']), 1)
    
    def test_get_appointment(self):
        """Test retrieving a specific appointment."""
        response = self.client.get(f'/api/appointments/{self.appointment.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['appointment']['id'], str(self.appointment.id))
    
    def test_update_appointment(self):
        """Test updating an appointment."""
        data = {
            'concern': 'Updated concern',
            'notes': 'New notes'
        }
        
        response = self.client.patch(f'/api/appointments/{self.appointment.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['appointment']['concern'], data['concern'])
        self.assertEqual(response.data['appointment']['notes'], data['notes'])
    
    def test_cancel_appointment(self):
        """Test cancelling an appointment."""
        data = {
            'cancel_reason': 'Test cancellation'
        }
        
        response = self.client.patch(f'/api/appointments/{self.appointment.id}/cancel/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['appointment']['status'], 'CANCELLED')
        self.assertEqual(response.data['appointment']['cancel_reason'], data['cancel_reason'])