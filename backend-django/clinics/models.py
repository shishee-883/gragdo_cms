from django.db import models
import uuid


class Clinic(models.Model):
    """Model for clinics."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_clinics')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    @property
    def stats(self):
        """Get clinic statistics."""
        return {
            'patients': self.patients.count(),
            'appointments': self.appointments.count(),
            'doctors': self.doctors.count()
        }