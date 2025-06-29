from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Clinic

User = get_user_model()


class ClinicTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test super admin
        self.super_admin = User.objects.create_user(
            email='superadmin@example.com',
            name='Super Admin',
            password='password123',
            role='SUPER_ADMIN',
            clinic_ids=[]
        )
        
        # Create test clinic
        self.clinic = Clinic.objects.create(
            name='Test Clinic',
            address='123 Test Street',
            phone='1234567890',
            email='clinic@example.com',
            created_by=self.super_admin
        )
        
        # Authenticate super admin
        self.client.force_authenticate(user=self.super_admin)
    
    def test_create_clinic(self):
        """Test creating a new clinic."""
        data = {
            'name': 'New Clinic',
            'address': '456 New Street',
            'phone': '0987654321',
            'email': 'newclinic@example.com',
            'description': 'A new test clinic'
        }
        
        response = self.client.post('/api/clinics/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['clinic']['name'], data['name'])
        
        # Check if clinic was added to super admin's clinic_ids
        self.super_admin.refresh_from_db()
        self.assertIn(response.data['clinic']['id'], self.super_admin.clinic_ids)
    
    def test_get_clinics(self):
        """Test retrieving clinics."""
        response = self.client.get('/api/clinics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['clinics']), 1)
    
    def test_get_clinic(self):
        """Test retrieving a specific clinic."""
        response = self.client.get(f'/api/clinics/{self.clinic.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['clinic']['id'], str(self.clinic.id))
    
    def test_update_clinic(self):
        """Test updating a clinic."""
        data = {
            'name': 'Updated Clinic',
            'address': 'Updated Address'
        }
        
        response = self.client.patch(f'/api/clinics/{self.clinic.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['clinic']['name'], data['name'])
        self.assertEqual(response.data['clinic']['address'], data['address'])
    
    def test_delete_clinic(self):
        """Test deleting a clinic."""
        response = self.client.delete(f'/api/clinics/{self.clinic.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        # Check if clinic was removed from super admin's clinic_ids
        self.super_admin.refresh_from_db()
        self.assertNotIn(str(self.clinic.id), self.super_admin.clinic_ids)