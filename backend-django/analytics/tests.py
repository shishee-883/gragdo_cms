from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, timedelta
from patients.models import Patient
from appointments.models import Appointment
from transactions.models import Transaction
from clinics.models import Clinic
from doctors.models import Doctor

User = get_user_model()


class AnalyticsTests(TestCase):
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
        
        # Create test doctor
        self.doctor = Doctor.objects.create(
            name='Dr. Test',
            phone='9876543210',
            specialization='General Medicine',
            clinic=self.clinic,
            created_by=self.admin
        )
        
        # Create test appointment
        self.appointment = Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            clinic=self.clinic,
            appointment_date=date.today(),
            start_time='09:00:00',
            end_time='09:30:00',
            duration=30,
            concern='Test concern',
            status='COMPLETED',
            created_by=self.admin
        )
        
        # Create test transaction
        self.transaction = Transaction.objects.create(
            amount=1000.00,
            type='INCOME',
            description='Test transaction',
            payment_method='CASH',
            payment_status='PAID',
            patient=self.patient,
            doctor=self.doctor,
            clinic=self.clinic,
            created_by=self.admin
        )
        
        # Authenticate admin
        self.client.force_authenticate(user=self.admin)
    
    def test_get_analytics(self):
        """Test retrieving analytics data."""
        response = self.client.get('/api/analytics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        # Check if all required data is present
        self.assertIn('revenue', response.data['data'])
        self.assertIn('patients', response.data['data'])
        self.assertIn('appointments', response.data['data'])
        
        # Check revenue data
        self.assertIn('thisMonth', response.data['data']['revenue'])
        self.assertIn('lastMonth', response.data['data']['revenue'])
        self.assertIn('growth', response.data['data']['revenue'])
        
        # Check patient data
        self.assertIn('total', response.data['data']['patients'])
        self.assertIn('growth', response.data['data']['patients'])
        
        # Check appointment data
        self.assertIn('completionRate', response.data['data']['appointments'])
        self.assertIn('total', response.data['data']['appointments'])