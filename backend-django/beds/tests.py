from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date
from .models import Bed
from rooms.models import Room
from patients.models import Patient
from clinics.models import Clinic

User = get_user_model()


class BedTests(TestCase):
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
        
        # Create test room
        self.room = Room.objects.create(
            room_number='101',
            room_type='PRIVATE',
            floor=1,
            total_beds=3,
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
        
        # Create test bed
        self.bed = Bed.objects.create(
            bed_number=1,
            room=self.room,
            clinic=self.clinic,
            created_by=self.admin
        )
        
        # Authenticate admin
        self.client.force_authenticate(user=self.admin)
    
    def test_create_bed(self):
        """Test creating a new bed."""
        data = {
            'bed_number': 2,
            'room': str(self.room.id),
            'clinic': str(self.clinic.id),
            'notes': 'Test notes'
        }
        
        response = self.client.post('/api/beds/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['bed']['bed_number'], data['bed_number'])
        self.assertEqual(response.data['bed']['notes'], data['notes'])
    
    def test_get_beds(self):
        """Test retrieving beds."""
        response = self.client.get('/api/beds/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['beds']), 1)
    
    def test_get_bed(self):
        """Test retrieving a specific bed."""
        response = self.client.get(f'/api/beds/{self.bed.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['bed']['id'], str(self.bed.id))
    
    def test_update_bed(self):
        """Test updating a bed."""
        data = {
            'bed_number': 3,
            'notes': 'Updated notes'
        }
        
        response = self.client.patch(f'/api/beds/{self.bed.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['bed']['bed_number'], data['bed_number'])
        self.assertEqual(response.data['bed']['notes'], data['notes'])
    
    def test_assign_bed(self):
        """Test assigning a patient to a bed."""
        data = {
            'patient': str(self.patient.id),
            'admission_date': '2025-06-01',
            'discharge_date': '2025-06-07'
        }
        
        response = self.client.patch(f'/api/beds/{self.bed.id}/assign/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['bed']['status'], 'OCCUPIED')
        self.assertEqual(response.data['bed']['patient'], str(self.patient.id))
        self.assertEqual(response.data['bed']['admission_date'], data['admission_date'])
        self.assertEqual(response.data['bed']['discharge_date'], data['discharge_date'])
    
    def test_discharge_bed(self):
        """Test discharging a patient from a bed."""
        # First assign a patient
        self.bed.patient = self.patient
        self.bed.admission_date = date.today()
        self.bed.status = 'OCCUPIED'
        self.bed.save()
        
        response = self.client.patch(f'/api/beds/{self.bed.id}/discharge/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['bed']['status'], 'AVAILABLE')
        self.assertIsNone(response.data['bed']['patient'])
        self.assertIsNone(response.data['bed']['admission_date'])
        self.assertIsNone(response.data['bed']['discharge_date'])