from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    """Serializer for the Room model."""
    
    available_beds = serializers.IntegerField(read_only=True)
    occupied_beds = serializers.IntegerField(read_only=True)
    reserved_beds = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Room
        fields = [
            'id', 'room_id', 'room_number', 'room_type', 'floor', 
            'total_beds', 'available_beds', 'occupied_beds', 
            'reserved_beds', 'clinic', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'room_id', 'created_at', 'updated_at']


class RoomCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new room."""
    
    class Meta:
        model = Room
        fields = [
            'room_number', 'room_type', 'floor', 
            'total_beds', 'clinic'
        ]
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class RoomUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating a room."""
    
    class Meta:
        model = Room
        fields = [
            'room_number', 'room_type', 'floor', 
            'total_beds', 'is_active'
        ]