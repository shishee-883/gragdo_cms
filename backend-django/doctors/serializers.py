from rest_framework import serializers
from .models import Doctor, Schedule


class ScheduleSerializer(serializers.ModelSerializer):
    """Serializer for the Schedule model."""
    
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = Schedule
        fields = ['id', 'day_of_week', 'day_name', 'start_time', 'end_time', 'is_active']


class DoctorSerializer(serializers.ModelSerializer):
    """Serializer for the Doctor model."""
    
    schedules = ScheduleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Doctor
        fields = [
            'id', 'name', 'email', 'phone', 'specialization', 
            'qualification', 'experience', 'consultation_fee', 
            'is_available', 'clinic', 'schedules', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DoctorCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new doctor."""
    
    class Meta:
        model = Doctor
        fields = [
            'name', 'email', 'phone', 'specialization', 
            'qualification', 'experience', 'consultation_fee', 
            'clinic'
        ]
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ScheduleCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new schedule."""
    
    class Meta:
        model = Schedule
        fields = ['doctor', 'day_of_week', 'start_time', 'end_time', 'is_active']