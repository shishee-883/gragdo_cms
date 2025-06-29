from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, time
from .models import Prescription, Medication
from patients.models import Patient
from doctors.models import Doctor
from clinics.models import Clinic
from appointments.models import Appointment

User = get_user_model()


class PrescriptionTests(TestCase):
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
        
        # Create test prescription
        self.prescription = Prescription.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            clinic=self.clinic,
            appointment=self.appointment,
            diagnosis='Test diagnosis',
            created_by=self.admin
        )
        
        # Create test medication
        self.medication = Medication.objects.create(
            prescription=self.prescription,
            name='Test Medication',
            dosage='10mg',
            frequency='Once daily',
            duration='7 days',
            quantity=7
        )
        
        # Authenticate admin
        self.client.force_authenticate(user=self.admin)
    
    def test_create_prescription(self):
        """Test creating a new prescription."""
        data = {
            'patient': str(self.patient.id),
            'doctor': str(self.doctor.id),
            'clinic': str(self.clinic.id),
            'appointment': str(self.appointment.id),
            'diagnosis': 'New diagnosis',
            'instructions': 'Take with food',
            'medications': [
                {
                    'name': 'New Medication',
                    'dosage': '20mg',
                    'frequency': 'Twice daily',
                    'duration': '5 days',
                    'quantity': 10
                }
            ]
        }
        
        response = self.client.post('/api/prescriptions/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['prescription']['diagnosis'], data['diagnosis'])
        self.assertEqual(len(response.data['prescription']['medications']), 1)
    
    def test_get_prescriptions(self):
        """Test retrieving prescriptions."""
        response = self.client.get('/api/prescriptions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['prescriptions']), 1)
    
    def test_get_prescription(self):
        """Test retrieving a specific prescription."""
        response = self.client.get(f'/api/prescriptions/{self.prescription.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['prescription']['id'], str(self.prescription.id))
    
    def test_update_prescription(self):
        """Test updating a prescription."""
        data = {
            'diagnosis': 'Updated diagnosis',
            'instructions': 'Updated instructions',
            'medications': [
                {
                    'name': 'Updated Medication',
                    'dosage': '30mg',
                    'frequency': 'Three times daily',
                    'duration': '10 days',
                    'quantity': 30
                }
            ]
        }
        
        response = self.client.patch(f'/api/prescriptions/{self.prescription.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['prescription']['diagnosis'], data['diagnosis'])
        self.assertEqual(response.data['prescription']['instructions'], data['instructions'])
        
        # Check if medication was updated
        self.prescription.refresh_from_db()
        self.assertEqual(self.prescription.medications.count(), 1)
        medication = self.prescription.medications.first()
        self.assertEqual(medication.name, data['medications'][0]['name'])