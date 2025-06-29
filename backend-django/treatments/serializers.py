from rest_framework import serializers
from .models import Treatment


class TreatmentSerializer(serializers.ModelSerializer):
    """Serializer for the Treatment model."""
    
    class Meta:
        model = Treatment
        fields = [
            'id', 'name', 'description', 'cost', 
            'duration', 'clinic', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TreatmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new treatment."""
    
    class Meta:
        model = Treatment
        fields = [
            'name', 'description', 'cost', 
            'duration', 'clinic'
        ]
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)