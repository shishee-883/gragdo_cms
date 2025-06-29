from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Patient, Document
from clinics.models import Clinic

User = get_user_model()


class PatientTests(TestCase):
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
        
        # Authenticate admin
        self.client.force_authenticate(user=self.admin)
    
    def test_create_patient(self):
        """Test creating a new patient."""
        data = {
            'first_name': 'New',
            'last_name': 'Patient',
            'phone': '5555555555',
            'gender': 'FEMALE',
            'date_of_birth': '1995-05-05',
            'clinic': str(self.clinic.id)
        }
        
        response = self.client.post('/api/patients/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['patient']['first_name'], data['first_name'])
        self.assertEqual(response.data['patient']['last_name'], data['last_name'])
        self.assertEqual(response.data['patient']['gender'], data['gender'])
    
    def test_get_patients(self):
        """Test retrieving patients."""
        response = self.client.get('/api/patients/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['patients']), 1)
    
    def test_get_patient(self):
        """Test retrieving a specific patient."""
        response = self.client.get(f'/api/patients/{self.patient.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['patient']['id'], str(self.patient.id))
    
    def test_update_patient(self):
        """Test updating a patient."""
        data = {
            'first_name': 'Updated',
            'medical_history': 'New medical history'
        }
        
        response = self.client.patch(f'/api/patients/{self.patient.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['patient']['first_name'], data['first_name'])
        self.assertEqual(response.data['patient']['medical_history'], data['medical_history'])
    
    def test_delete_patient(self):
        """Test deleting a patient."""
        response = self.client.delete(f'/api/patients/{self.patient.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        # Verify patient is deleted
        self.assertFalse(Patient.objects.filter(id=self.patient.id).exists())