from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

User = get_user_model()


class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.signup_url = reverse('signup')
        self.login_url = reverse('login')
        
        # Create test user
        self.user_data = {
            'email': 'test@example.com',
            'name': 'Test User',
            'password': 'testpassword123',
            'role': 'STAFF'
        }
        self.user = User.objects.create_user(
            email=self.user_data['email'],
            name=self.user_data['name'],
            password=self.user_data['password'],
            role=self.user_data['role']
        )
    
    def test_signup(self):
        """Test user signup."""
        data = {
            'email': 'newuser@example.com',
            'name': 'New User',
            'password': 'newpassword123',
            'confirm_password': 'newpassword123',
            'role': 'STAFF'
        }
        
        response = self.client.post(self.signup_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user']['email'], data['email'])
        self.assertEqual(response.data['user']['name'], data['name'])
        self.assertEqual(response.data['user']['role'], data['role'])
    
    def test_login(self):
        """Test user login."""
        data = {
            'email': self.user_data['email'],
            'password': self.user_data['password'],
            'role': self.user_data['role']
        }
        
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user']['email'], data['email'])
        self.assertEqual(response.data['user']['role'], data['role'])
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)