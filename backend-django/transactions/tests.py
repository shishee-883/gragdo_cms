from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date
from .models import Transaction, Invoice
from patients.models import Patient
from doctors.models import Doctor
from clinics.models import Clinic

User = get_user_model()


class TransactionTests(TestCase):
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
        
        # Create test invoice
        self.invoice = Invoice.objects.create(
            patient=self.patient,
            clinic=self.clinic,
            items=[{
                'id': '1',
                'description': 'Test item',
                'quantity': 1,
                'unit_price': 1000.00,
                'amount': 1000.00,
                'type': 'CONSULTATION'
            }],
            subtotal=1000.00,
            discount=0.00,
            tax=0.00,
            total=1000.00,
            due_date=date.today(),
            created_by=self.admin
        )
        
        # Authenticate admin
        self.client.force_authenticate(user=self.admin)
    
    def test_create_transaction(self):
        """Test creating a new transaction."""
        data = {
            'amount': 500.00,
            'type': 'INCOME',
            'description': 'New transaction',
            'payment_method': 'CREDIT_CARD',
            'payment_status': 'PAID',
            'patient': str(self.patient.id),
            'doctor': str(self.doctor.id),
            'clinic': str(self.clinic.id)
        }
        
        response = self.client.post('/api/transactions/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(float(response.data['transaction']['amount']), data['amount'])
        self.assertEqual(response.data['transaction']['type'], data['type'])
        self.assertEqual(response.data['transaction']['payment_method'], data['payment_method'])
    
    def test_get_transactions(self):
        """Test retrieving transactions."""
        response = self.client.get('/api/transactions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['transactions']), 1)
    
    def test_get_transaction(self):
        """Test retrieving a specific transaction."""
        response = self.client.get(f'/api/transactions/{self.transaction.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['transaction']['id'], str(self.transaction.id))
    
    def test_update_transaction(self):
        """Test updating a transaction."""
        data = {
            'description': 'Updated transaction',
            'payment_method': 'UPI'
        }
        
        response = self.client.patch(f'/api/transactions/{self.transaction.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['transaction']['description'], data['description'])
        self.assertEqual(response.data['transaction']['payment_method'], data['payment_method'])
    
    def test_create_invoice(self):
        """Test creating a new invoice."""
        data = {
            'patient': str(self.patient.id),
            'clinic': str(self.clinic.id),
            'items': [{
                'description': 'New item',
                'quantity': 2,
                'unit_price': 500.00,
                'amount': 1000.00,
                'type': 'CONSULTATION'
            }],
            'subtotal': 1000.00,
            'discount': 100.00,
            'tax': 90.00,
            'total': 990.00,
            'due_date': '2025-06-30',
            'notes': 'Test notes'
        }
        
        response = self.client.post('/api/transactions/invoices/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(float(response.data['invoice']['subtotal']), data['subtotal'])
        self.assertEqual(float(response.data['invoice']['total']), data['total'])
        self.assertEqual(len(response.data['invoice']['items']), 1)
    
    def test_record_payment(self):
        """Test recording a payment."""
        data = {
            'invoice_id': str(self.invoice.id),
            'amount': 500.00,
            'payment_method': 'CASH',
            'description': 'Partial payment',
            'patient_id': str(self.patient.id),
            'clinic_id': str(self.clinic.id)
        }
        
        response = self.client.post('/api/transactions/payment/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(float(response.data['transaction']['amount']), data['amount'])
        self.assertEqual(response.data['transaction']['payment_method'], data['payment_method'])
        self.assertEqual(response.data['transaction']['description'], data['description'])
        
        # Check if invoice status was updated
        self.invoice.refresh_from_db()
        self.assertEqual(self.invoice.status, 'PARTIALLY_PAID')