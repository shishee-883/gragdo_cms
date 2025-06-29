from django.db import models
import uuid


class Treatment(models.Model):
    """Model for treatments."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.PositiveIntegerField(blank=True, null=True)  # In minutes
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, related_name='treatments')
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_treatments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name