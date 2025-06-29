from django.db import models
from django.utils import timezone
import uuid


class Patient(models.Model):
    """Model for patients."""
    
    GENDER_CHOICES = (
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    )
    
    BLOOD_GROUP_CHOICES = (
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_id = models.CharField(max_length=20, unique=True)  # Custom patient ID (e.g., PAT123456)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_birth = models.DateField()
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    medical_history = models.TextField(blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    emergency_contact = models.JSONField(blank=True, null=True)  # Store as JSON
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, related_name='patients')
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_patients')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self):
        """Calculate age based on date of birth."""
        today = timezone.now().date()
        born = self.date_of_birth
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))
    
    def save(self, *args, **kwargs):
        # Generate patient_id if not provided
        if not self.patient_id:
            # Format: PAT + 6 random digits
            import random
            self.patient_id = f"PAT{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)


class Document(models.Model):
    """Model for patient documents."""
    
    DOCUMENT_TYPE_CHOICES = (
        ('REPORT', 'Report'),
        ('PRESCRIPTION', 'Prescription'),
        ('INVOICE', 'Invoice'),
        ('RECEIPT', 'Receipt'),
        ('CONSENT_FORM', 'Consent Form'),
        ('MEDICAL_RECORD', 'Medical Record'),
        ('INSURANCE', 'Insurance'),
        ('OTHER', 'Other'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document_id = models.CharField(max_length=20, unique=True)  # Custom document ID (e.g., DOC123456)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES)
    file = models.FileField(upload_to='documents/')
    size = models.PositiveIntegerField()  # In bytes
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='documents')
    appointment = models.ForeignKey('appointments.Appointment', on_delete=models.SET_NULL, null=True, blank=True, related_name='documents')
    uploaded_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='uploaded_documents')
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, related_name='documents')
    tags = models.JSONField(blank=True, null=True)  # Store as JSON
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # Generate document_id if not provided
        if not self.document_id:
            # Format: DOC + 6 random digits
            import random
            self.document_id = f"DOC{random.randint(100000, 999999)}"
        
        # Calculate file size if not provided
        if not self.size and self.file:
            self.size = self.file.size
        
        super().save(*args, **kwargs)