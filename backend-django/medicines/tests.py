from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date
from .models import Medicine
from clinics.models import Clinic

User = get_user_model()


class MedicineTests(TestCase):
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
        
        # Create test medicine
        self.medicine = Medicine.objects.create(
            name='Test Medicine',
            manufacturer='Test Manufacturer',
            batch_number='BATCH123',
            type='TABLET',
            dosage='10mg',
            manufactured_date=date(2024, 1, 1),
            expiry_date=date(2026, 1, 1),
            price=100.00,
            stock=100,
            reorder_level=10,
            clinic=self.clinic,
            created_by=self.admin
        )
        
        # Authenticate admin
        self.client.force_authenticate(user=self.admin)
    
    def test_create_medicine(self):
        """Test creating a new medicine."""
        data = {
            'name': 'New Medicine',
            'manufacturer': 'New Manufacturer',
            'batch_number': 'BATCH456',
            'type': 'CAPSULE',
            'dosage': '20mg',
            'manufactured_date': '2024-02-01',
            'expiry_date': '2026-02-01',
            'price': 200.00,
            'stock': 50,
            'reorder_level': 5,
            'clinic': str(self.clinic.id)
        }
        
        response = self.client.post('/api/medicines/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['medicine']['name'], data['name'])
        self.assertEqual(response.data['medicine']['type'], data['type'])
    
    def test_get_medicines(self):
        """Test retrieving medicines."""
        response = self.client.get('/api/medicines/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['medicines']), 1)
    
    def test_get_medicine(self):
        """Test retrieving a specific medicine."""
        response = self.client.get(f'/api/medicines/{self.medicine.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['medicine']['id'], str(self.medicine.id))
    
    def test_update_medicine(self):
        """Test updating a medicine."""
        data = {
            'name': 'Updated Medicine',
            'price': 150.00
        }
        
        response = self.client.patch(f'/api/medicines/{self.medicine.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['medicine']['name'], data['name'])
        self.assertEqual(float(response.data['medicine']['price']), data['price'])
    
    def test_update_stock(self):
        """Test updating medicine stock."""
        initial_stock = self.medicine.stock
        
        # Add stock
        data = {
            'quantity': 50,
            'is_addition': True
        }
        
        response = self.client.patch(f'/api/medicines/{self.medicine.id}/update-stock/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(int(response.data['medicine']['stock']), initial_stock + data['quantity'])
        
        # Remove stock
        data = {
            'quantity': 30,
            'is_addition': False
        }
        
        response = self.client.patch(f'/api/medicines/{self.medicine.id}/update-stock/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(int(response.data['medicine']['stock']), initial_stock + 50 - 30)