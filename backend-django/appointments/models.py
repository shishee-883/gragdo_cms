from django.db import models
import uuid


class Appointment(models.Model):
    """Model for appointments."""
    
    STATUS_CHOICES = (
        ('SCHEDULED', 'Scheduled'),
        ('CONFIRMED', 'Confirmed'),
        ('CHECKED_IN', 'Checked In'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('NO_SHOW', 'No Show'),
        ('RESCHEDULED', 'Rescheduled'),
    )
    
    TYPE_CHOICES = (
        ('REGULAR', 'Regular'),
        ('EMERGENCY', 'Emergency'),
        ('FOLLOW_UP', 'Follow Up'),
        ('CONSULTATION', 'Consultation'),
        ('PROCEDURE', 'Procedure'),
        ('CHECKUP', 'Checkup'),
        ('VACCINATION', 'Vaccination'),
        ('LABORATORY', 'Laboratory'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appointment_id = models.CharField(max_length=20, unique=True)  # Custom appointment ID (e.g., APT123456)
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE, related_name='appointments')
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration = models.PositiveIntegerField()  # In minutes
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='REGULAR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    concern = models.TextField()
    notes = models.TextField(blank=True, null=True)
    vitals = models.JSONField(blank=True, null=True)  # Store as JSON
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_appointments')
    cancelled_at = models.DateTimeField(blank=True, null=True)
    cancelled_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='cancelled_appointments')
    cancel_reason = models.TextField(blank=True, null=True)
    follow_up_date = models.DateField(blank=True, null=True)
    is_follow_up = models.BooleanField(default=False)
    previous_appointment = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='follow_up_appointments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient} - {self.appointment_date} {self.start_time}"
    
    def save(self, *args, **kwargs):
        # Generate appointment_id if not provided
        if not self.appointment_id:
            # Format: APT + 6 random digits
            import random
            self.appointment_id = f"APT{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)