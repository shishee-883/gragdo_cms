from rest_framework import serializers
from .models import Clinic


class ClinicSerializer(serializers.ModelSerializer):
    """Serializer for the Clinic model."""
    
    stats = serializers.SerializerMethodField()
    
    class Meta:
        model = Clinic
        fields = ['id', 'name', 'address', 'phone', 'email', 'description', 'stats', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'stats']
    
    def get_stats(self, obj):
        return obj.stats


class ClinicCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new clinic."""
    
    class Meta:
        model = Clinic
        fields = ['name', 'address', 'phone', 'email', 'description']
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)