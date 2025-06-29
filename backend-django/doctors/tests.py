from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Doctor, Schedule
from clinics.models import Clinic

User = get_user_model()


class DoctorTests(TestCase):
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
        
        # Authenticate admin
        self.client.force_authenticate(user=self.admin)
    
    def test_create_doctor(self):
        """Test creating a new doctor."""
        data = {
            'name': 'Dr. New',
            'phone': '5555555555',
            'specialization': 'Cardiology',
            'qualification': 'MBBS, MD',
            'experience': 10,
            'consultation_fee': 500,
            'clinic': str(self.clinic.id)
        }
        
        response = self.client.post('/api/doctors/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['doctor']['name'], data['name'])
        self.assertEqual(response.data['doctor']['specialization'], data['specialization'])
    
    def test_get_doctors(self):
        """Test retrieving doctors."""
        response = self.client.get('/api/doctors/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['doctors']), 1)
    
    def test_get_doctor(self):
        """Test retrieving a specific doctor."""
        response = self.client.get(f'/api/doctors/{self.doctor.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['doctor']['id'], str(self.doctor.id))
    
    def test_update_doctor(self):
        """Test updating a doctor."""
        data = {
            'name': 'Dr. Updated',
            'specialization': 'Updated Specialization'
        }
        
        response = self.client.patch(f'/api/doctors/{self.doctor.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['doctor']['name'], data['name'])
        self.assertEqual(response.data['doctor']['specialization'], data['specialization'])
    
    def test_toggle_availability(self):
        """Test toggling doctor availability."""
        initial_availability = self.doctor.is_available
        
        response = self.client.post(f'/api/doctors/{self.doctor.id}/toggle-availability/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['doctor']['is_available'], not initial_availability)