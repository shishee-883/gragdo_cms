from rest_framework import serializers
from .models import Patient, Document


class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for the Document model."""
    
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'document_id', 'name', 'type', 'file', 'file_url', 
            'size', 'patient', 'appointment', 'clinic', 'tags', 
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'document_id', 'size', 'file_url', 'created_at', 'updated_at']
    
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None


class PatientSerializer(serializers.ModelSerializer):
    """Serializer for the Patient model."""
    
    age = serializers.IntegerField(read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Patient
        fields = [
            'id', 'patient_id', 'first_name', 'last_name', 'email', 
            'phone', 'gender', 'date_of_birth', 'age', 'blood_group', 
            'address', 'city', 'state', 'postal_code', 'medical_history', 
            'allergies', 'emergency_contact', 'clinic', 'is_active', 
            'documents', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'patient_id', 'age', 'created_at', 'updated_at']


class PatientCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new patient."""
    
    class Meta:
        model = Patient
        fields = [
            'first_name', 'last_name', 'email', 'phone', 'gender', 
            'date_of_birth', 'blood_group', 'address', 'city', 'state', 
            'postal_code', 'medical_history', 'allergies', 
            'emergency_contact', 'clinic'
        ]
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class DocumentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new document."""
    
    class Meta:
        model = Document
        fields = [
            'name', 'type', 'file', 'patient', 'appointment', 
            'clinic', 'tags', 'notes'
        ]
    
    def create(self, validated_data):
        # Set the uploaded_by field to the current user
        validated_data['uploaded_by'] = self.context['request'].user
        
        # Calculate file size
        file = validated_data.get('file')
        if file:
            validated_data['size'] = file.size
        
        return super().create(validated_data)