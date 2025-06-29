from rest_framework import serializers
from .models import Bed
from patients.serializers import PatientSerializer


class BedSerializer(serializers.ModelSerializer):
    """Serializer for the Bed model."""
    
    patient_details = serializers.SerializerMethodField()
    room_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Bed
        fields = [
            'id', 'bed_id', 'bed_number', 'room', 'status', 
            'patient', 'admission_date', 'discharge_date', 
            'clinic', 'notes', 'patient_details', 'room_details', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'bed_id', 'created_at', 'updated_at']
    
    def get_patient_details(self, obj):
        if obj.patient:
            return {
                'patientId': obj.patient.patient_id,
                'name': obj.patient.get_full_name(),
                'gender': obj.patient.gender,
                'age': obj.patient.age
            }
        return None
    
    def get_room_details(self, obj):
        return {
            'roomNumber': obj.room.room_number,
            'roomType': obj.room.room_type,
            'floor': obj.room.floor
        }


class BedCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new bed."""
    
    class Meta:
        model = Bed
        fields = [
            'bed_number', 'room', 'clinic', 'notes'
        ]
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class BedUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating a bed."""
    
    class Meta:
        model = Bed
        fields = [
            'bed_number', 'status', 'notes'
        ]


class BedAssignSerializer(serializers.ModelSerializer):
    """Serializer for assigning a patient to a bed."""
    
    class Meta:
        model = Bed
        fields = [
            'patient', 'admission_date', 'discharge_date'
        ]
    
    def validate(self, attrs):
        if not attrs.get('patient'):
            raise serializers.ValidationError({"patient": "Patient is required."})
        if not attrs.get('admission_date'):
            raise serializers.ValidationError({"admission_date": "Admission date is required."})
        return attrs
    
    def update(self, instance, validated_data):
        instance.status = 'OCCUPIED'
        return super().update(instance, validated_data)


class BedDischargeSerializer(serializers.ModelSerializer):
    """Serializer for discharging a patient from a bed."""
    
    class Meta:
        model = Bed
        fields = []
    
    def update(self, instance, validated_data):
        instance.patient = None
        instance.admission_date = None
        instance.discharge_date = None
        instance.status = 'AVAILABLE'
        instance.save()
        return instance


class BedReserveSerializer(serializers.ModelSerializer):
    """Serializer for reserving a bed."""
    
    class Meta:
        model = Bed
        fields = []
    
    def update(self, instance, validated_data):
        instance.status = 'RESERVED'
        instance.save()
        return instance