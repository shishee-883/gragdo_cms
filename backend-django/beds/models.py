from django.db import models
import uuid


class Bed(models.Model):
    """Model for beds."""
    
    STATUS_CHOICES = (
        ('AVAILABLE', 'Available'),
        ('OCCUPIED', 'Occupied'),
        ('RESERVED', 'Reserved'),
        ('MAINTENANCE', 'Maintenance'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bed_id = models.CharField(max_length=20, unique=True)  # Custom bed ID (e.g., BED123456)
    bed_number = models.PositiveIntegerField()
    room = models.ForeignKey('rooms.Room', on_delete=models.CASCADE, related_name='beds')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    patient = models.ForeignKey('patients.Patient', on_delete=models.SET_NULL, null=True, blank=True, related_name='beds')
    admission_date = models.DateField(null=True, blank=True)
    discharge_date = models.DateField(null=True, blank=True)
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, related_name='beds')
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_beds')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('room', 'bed_number')

    def __str__(self):
        return f"Bed {self.bed_number} in {self.room}"
    
    def save(self, *args, **kwargs):
        # Generate bed_id if not provided
        if not self.bed_id:
            # Format: BED + 6 random digits
            import random
            self.bed_id = f"BED{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)