from rest_framework import serializers
from .models import Prescription, Medication
from patients.serializers import PatientSerializer
from doctors.serializers import DoctorSerializer


class MedicationSerializer(serializers.ModelSerializer):
    """Serializer for the Medication model."""
    
    class Meta:
        model = Medication
        fields = [
            'id', 'name', 'dosage', 'frequency', 'duration', 
            'instructions', 'medicine', 'quantity'
        ]
        read_only_fields = ['id']


class PrescriptionSerializer(serializers.ModelSerializer):
    """Serializer for the Prescription model."""
    
    medications = MedicationSerializer(many=True, read_only=True)
    patient_details = serializers.SerializerMethodField()
    doctor_details = serializers.SerializerMethodField()
    document_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Prescription
        fields = [
            'id', 'prescription_id', 'patient', 'doctor', 'clinic', 
            'appointment', 'diagnosis', 'instructions', 'follow_up_date', 
            'is_active', 'document', 'document_url', 'medications', 
            'patient_details', 'doctor_details', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'prescription_id', 'created_at', 'updated_at', 'document_url']
    
    def get_patient_details(self, obj):
        return {
            'patientId': obj.patient.patient_id,
            'name': obj.patient.get_full_name(),
            'gender': obj.patient.gender,
            'age': obj.patient.age
        }
    
    def get_doctor_details(self, obj):
        return {
            'name': obj.doctor.name,
            'specialization': obj.doctor.specialization
        }
    
    def get_document_url(self, obj):
        if obj.document:
            return obj.document.url
        return None


class PrescriptionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new prescription."""
    
    medications = MedicationSerializer(many=True, required=True)
    
    class Meta:
        model = Prescription
        fields = [
            'patient', 'doctor', 'clinic', 'appointment', 
            'diagnosis', 'instructions', 'follow_up_date', 
            'document', 'medications'
        ]
    
    def create(self, validated_data):
        medications_data = validated_data.pop('medications')
        
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        
        # Create prescription
        prescription = Prescription.objects.create(**validated_data)
        
        # Create medications
        for medication_data in medications_data:
            Medication.objects.create(prescription=prescription, **medication_data)
        
        return prescription


class PrescriptionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating a prescription."""
    
    medications = MedicationSerializer(many=True, required=False)
    
    class Meta:
        model = Prescription
        fields = [
            'diagnosis', 'instructions', 'follow_up_date', 
            'is_active', 'document', 'medications'
        ]
    
    def update(self, instance, validated_data):
        medications_data = validated_data.pop('medications', None)
        
        # Update prescription fields
        instance = super().update(instance, validated_data)
        
        # Update medications if provided
        if medications_data is not None:
            # Delete existing medications
            instance.medications.all().delete()
            
            # Create new medications
            for medication_data in medications_data:
                Medication.objects.create(prescription=instance, **medication_data)
        
        return instance