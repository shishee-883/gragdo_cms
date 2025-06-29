from rest_framework import serializers
from .models import Appointment
from patients.serializers import PatientSerializer
from doctors.serializers import DoctorSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for the Appointment model."""
    
    patient_details = serializers.SerializerMethodField()
    doctor_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'appointment_id', 'patient', 'doctor', 'clinic', 
            'appointment_date', 'start_time', 'end_time', 'duration', 
            'type', 'status', 'concern', 'notes', 'vitals', 
            'cancelled_at', 'cancelled_by', 'cancel_reason', 
            'follow_up_date', 'is_follow_up', 'previous_appointment', 
            'patient_details', 'doctor_details', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'appointment_id', 'created_at', 'updated_at']
    
    def get_patient_details(self, obj):
        return {
            'patientId': obj.patient.patient_id,
            'name': obj.patient.get_full_name(),
            'phone': obj.patient.phone,
            'gender': obj.patient.gender,
            'age': obj.patient.age
        }
    
    def get_doctor_details(self, obj):
        return {
            'name': obj.doctor.name,
            'specialization': obj.doctor.specialization
        }


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new appointment."""
    
    class Meta:
        model = Appointment
        fields = [
            'patient', 'doctor', 'clinic', 'appointment_date', 
            'start_time', 'end_time', 'duration', 'type', 
            'concern', 'notes', 'is_follow_up', 'previous_appointment'
        ]
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class AppointmentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating an appointment."""
    
    class Meta:
        model = Appointment
        fields = [
            'appointment_date', 'start_time', 'end_time', 
            'duration', 'type', 'status', 'concern', 
            'notes', 'vitals', 'follow_up_date'
        ]


class AppointmentCancelSerializer(serializers.ModelSerializer):
    """Serializer for cancelling an appointment."""
    
    class Meta:
        model = Appointment
        fields = ['cancel_reason']
    
    def update(self, instance, validated_data):
        # Set cancelled_at and cancelled_by
        instance.cancelled_at = serializers.DateTimeField().to_representation(
            serializers.DateTimeField().to_internal_value(serializers.DateTimeField().to_representation(
                serializers.DateTimeField().get_default()
            ))
        )
        instance.cancelled_by = self.context['request'].user
        instance.status = 'CANCELLED'
        
        # Update cancel_reason
        instance.cancel_reason = validated_data.get('cancel_reason', instance.cancel_reason)
        
        instance.save()
        return instance


class AppointmentCheckInSerializer(serializers.ModelSerializer):
    """Serializer for checking in an appointment."""
    
    class Meta:
        model = Appointment
        fields = []
    
    def update(self, instance, validated_data):
        instance.status = 'CHECKED_IN'
        instance.save()
        return instance


class AppointmentStartSerializer(serializers.ModelSerializer):
    """Serializer for starting an appointment."""
    
    class Meta:
        model = Appointment
        fields = []
    
    def update(self, instance, validated_data):
        instance.status = 'IN_PROGRESS'
        instance.save()
        return instance


class AppointmentCompleteSerializer(serializers.ModelSerializer):
    """Serializer for completing an appointment."""
    
    class Meta:
        model = Appointment
        fields = ['vitals', 'notes', 'follow_up_date']
    
    def update(self, instance, validated_data):
        instance.status = 'COMPLETED'
        
        # Update fields
        instance.vitals = validated_data.get('vitals', instance.vitals)
        instance.notes = validated_data.get('notes', instance.notes)
        instance.follow_up_date = validated_data.get('follow_up_date', instance.follow_up_date)
        
        instance.save()
        return instance


class AppointmentRescheduleSerializer(serializers.ModelSerializer):
    """Serializer for rescheduling an appointment."""
    
    class Meta:
        model = Appointment
        fields = ['appointment_date', 'start_time', 'end_time', 'duration']
    
    def update(self, instance, validated_data):
        instance.status = 'RESCHEDULED'
        
        # Update fields
        instance.appointment_date = validated_data.get('appointment_date', instance.appointment_date)
        instance.start_time = validated_data.get('start_time', instance.start_time)
        instance.end_time = validated_data.get('end_time', instance.end_time)
        instance.duration = validated_data.get('duration', instance.duration)
        
        instance.save()
        return instance