from rest_framework import status, viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone
from django.shortcuts import get_object_or_404
from datetime import timedelta
import uuid

from .models import Profile, PasswordReset
from .serializers import (
    UserSerializer, UserCreateSerializer, LoginSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    ProfileSerializer
)
from .permissions import (
    IsSuperAdmin, IsAdmin, IsStaff, IsDoctor,
    IsClinicAdmin, IsClinicStaff, IsClinicDoctor,
    IsOwner, ReadOnly
)

User = get_user_model()


class SignupView(generics.CreateAPIView):
    """View for user registration."""
    
    permission_classes = [permissions.AllowAny]
    serializer_class = UserCreateSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create profile for the user
        Profile.objects.create(user=user)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'success': True,
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """View for user login."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        role = serializer.validated_data['role']
        
        # Check if user exists with the given email and role
        try:
            user = User.objects.get(email=email, role=role)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Authenticate user
        user = authenticate(email=email, password=password)
        if not user:
            return Response({
                'success': False,
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'success': True,
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


class LogoutView(APIView):
    """View for user logout."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        # In a token-based authentication system, the client should discard the token
        return Response({'success': True})


class PasswordResetRequestView(APIView):
    """View for requesting a password reset."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal that the user doesn't exist
            return Response({
                'success': True,
                'message': 'If your email is registered, you will receive a password reset link'
            })
        
        # Generate token
        token = str(uuid.uuid4())
        expires_at = timezone.now() + timedelta(hours=24)
        
        # Save token
        PasswordReset.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
        
        # In a real application, send an email with the reset link
        # For now, just return the token for testing
        reset_link = f"http://localhost:3000/reset-password?token={token}"
        
        return Response({
            'success': True,
            'message': 'Password reset email sent',
            'reset_link': reset_link  # Remove this in production
        })


class PasswordResetConfirmView(APIView):
    """View for confirming a password reset."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        # Find the token
        try:
            reset = PasswordReset.objects.get(
                token=token,
                is_used=False,
                expires_at__gt=timezone.now()
            )
        except PasswordReset.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Invalid or expired token'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Reset the password
        user = reset.user
        user.set_password(new_password)
        user.save()
        
        # Mark token as used
        reset.is_used = True
        reset.save()
        
        return Response({
            'success': True,
            'message': 'Password reset successful'
        })


class CurrentUserView(APIView):
    """View for getting the current user."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'user': serializer.data
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    """View for retrieving and updating user profile."""
    
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        user_id = self.request.query_params.get('userId')
        
        if user_id:
            # If userId is provided, get that user's profile
            profile = get_object_or_404(Profile, user__id=user_id)
            
            # Check if the user has permission to view this profile
            if self.request.user.role == 'SUPER_ADMIN':
                # Super admins can view any profile
                pass
            elif self.request.user.role in ['ADMIN', 'STAFF']:
                # Admins and staff can view profiles in their clinic
                if profile.user.clinic != self.request.user.clinic:
                    self.permission_denied(self.request)
            elif profile.user != self.request.user:
                # Regular users can only view their own profile
                self.permission_denied(self.request)
                
            return profile
        
        # Otherwise, get the current user's profile
        return get_object_or_404(Profile, user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if the user has permission to update this profile
        if request.user.role != 'SUPER_ADMIN' and instance.user != request.user:
            return Response({
                'success': False,
                'error': 'You do not have permission to update this profile'
            }, status=status.HTTP_403_FORBIDDEN)
            
        return super().update(request, *args, **kwargs)