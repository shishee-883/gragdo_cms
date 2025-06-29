from django.db import models
import uuid


class Prescription(models.Model):
    """Model for prescriptions."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prescription_id = models.CharField(max_length=20, unique=True)  # Custom prescription ID (e.g., PRE123456)
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='prescriptions')
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE, related_name='prescriptions')
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, related_name='prescriptions')
    appointment = models.ForeignKey('appointments.Appointment', on_delete=models.CASCADE, related_name='prescriptions')
    diagnosis = models.TextField()
    instructions = models.TextField(blank=True, null=True)
    follow_up_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    document = models.FileField(upload_to='prescriptions/', blank=True, null=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_prescriptions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Prescription for {self.patient} by {self.doctor}"
    
    def save(self, *args, **kwargs):
        # Generate prescription_id if not provided
        if not self.prescription_id:
            # Format: PRE + 6 random digits
            import random
            self.prescription_id = f"PRE{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)


class Medication(models.Model):
    """Model for medications in prescriptions."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='medications')
    name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    instructions = models.TextField(blank=True, null=True)
    medicine = models.ForeignKey('medicines.Medicine', on_delete=models.SET_NULL, null=True, blank=True, related_name='prescriptions')
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.dosage}"