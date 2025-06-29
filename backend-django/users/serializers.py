from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Profile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'phone', 'role', 'clinic', 'clinic_ids', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new user."""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['email', 'name', 'phone', 'role', 'clinic', 'password', 'confirm_password']
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # For roles that require a clinic
        if attrs['role'] in ['ADMIN', 'STAFF', 'DOCTOR'] and not attrs.get('clinic'):
            raise serializers.ValidationError({"clinic": "Clinic is required for this role."})
        
        # For SUPER_ADMIN role, initialize clinic_ids as empty list
        if attrs['role'] == 'SUPER_ADMIN':
            attrs['clinic_ids'] = []
        
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request."""
    
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation."""
    
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for the Profile model."""
    
    name = serializers.CharField(source='user.name')
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone')
    role = serializers.CharField(source='user.role', read_only=True)
    clinic_name = serializers.CharField(source='user.clinic.name', read_only=True)
    clinic_address = serializers.CharField(source='user.clinic.address', read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'name', 'email', 'phone', 'role', 'address', 'bio', 
                  'profile_image', 'clinic_name', 'clinic_address', 'created_at']
        read_only_fields = ['id', 'email', 'role', 'created_at', 'clinic_name', 'clinic_address']
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        # Update user fields
        user = instance.user
        if 'name' in user_data:
            user.name = user_data['name']
        if 'phone' in user_data:
            user.phone = user_data['phone']
        user.save()
        
        # Update profile fields
        return super().update(instance, validated_data)