from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Room
from clinics.models import Clinic

User = get_user_model()


class RoomTests(TestCase):
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
        
        # Authenticate admin
        self.client.force_authenticate(user=self.admin)
    
    def test_create_room(self):
        """Test creating a new room."""
        data = {
            'room_number': '102',
            'room_type': 'GENERAL',
            'floor': 1,
            'total_beds': 4,
            'clinic': str(self.clinic.id)
        }
        
        response = self.client.post('/api/rooms/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['room']['room_number'], data['room_number'])
        self.assertEqual(response.data['room']['room_type'], data['room_type'])
        self.assertEqual(response.data['room']['total_beds'], data['total_beds'])
    
    def test_get_rooms(self):
        """Test retrieving rooms."""
        response = self.client.get('/api/rooms/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['rooms']), 1)
    
    def test_get_room(self):
        """Test retrieving a specific room."""
        response = self.client.get(f'/api/rooms/{self.room.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['room']['id'], str(self.room.id))
    
    def test_update_room(self):
        """Test updating a room."""
        data = {
            'room_number': '101-A',
            'total_beds': 4
        }
        
        response = self.client.patch(f'/api/rooms/{self.room.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['room']['room_number'], data['room_number'])
        self.assertEqual(response.data['room']['total_beds'], data['total_beds'])