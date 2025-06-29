from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Treatment
from clinics.models import Clinic

User = get_user_model()


class TreatmentTests(TestCase):
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
        
        # Create test treatment
        self.treatment = Treatment.objects.create(
            name='Test Treatment',
            description='Test description',
            cost=1000.00,
            duration=60,
            clinic=self.clinic,
            created_by=self.admin
        )
        
        # Authenticate admin
        self.client.force_authenticate(user=self.admin)
    
    def test_create_treatment(self):
        """Test creating a new treatment."""
        data = {
            'name': 'New Treatment',
            'description': 'New description',
            'cost': 2000.00,
            'duration': 90,
            'clinic': str(self.clinic.id)
        }
        
        response = self.client.post('/api/treatments/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['treatment']['name'], data['name'])
        self.assertEqual(response.data['treatment']['description'], data['description'])
        self.assertEqual(float(response.data['treatment']['cost']), data['cost'])
        self.assertEqual(response.data['treatment']['duration'], data['duration'])
    
    def test_get_treatments(self):
        """Test retrieving treatments."""
        response = self.client.get('/api/treatments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['treatments']), 1)
    
    def test_get_treatment(self):
        """Test retrieving a specific treatment."""
        response = self.client.get(f'/api/treatments/{self.treatment.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['treatment']['id'], str(self.treatment.id))
    
    def test_update_treatment(self):
        """Test updating a treatment."""
        data = {
            'name': 'Updated Treatment',
            'cost': 1500.00
        }
        
        response = self.client.patch(f'/api/treatments/{self.treatment.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['treatment']['name'], data['name'])
        self.assertEqual(float(response.data['treatment']['cost']), data['cost'])
    
    def test_delete_treatment(self):
        """Test deleting a treatment."""
        response = self.client.delete(f'/api/treatments/{self.treatment.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        # Verify treatment is deleted
        self.assertFalse(Treatment.objects.filter(id=self.treatment.id).exists())