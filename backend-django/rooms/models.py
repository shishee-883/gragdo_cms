from django.db import models
import uuid


class Room(models.Model):
    """Model for rooms."""
    
    TYPE_CHOICES = (
        ('GENERAL', 'General'),
        ('PRIVATE', 'Private'),
        ('SEMI_PRIVATE', 'Semi Private'),
        ('ICU', 'ICU'),
        ('EMERGENCY', 'Emergency'),
        ('OPERATION_THEATER', 'Operation Theater'),
        ('LABOR', 'Labor'),
        ('NURSERY', 'Nursery'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room_id = models.CharField(max_length=20, unique=True)  # Custom room ID (e.g., ROOM123456)
    room_number = models.CharField(max_length=20)
    room_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    floor = models.PositiveIntegerField()
    total_beds = models.PositiveIntegerField()
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, related_name='rooms')
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_rooms')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Room {self.room_number} - {self.get_room_type_display()}"
    
    def save(self, *args, **kwargs):
        # Generate room_id if not provided
        if not self.room_id:
            # Format: ROOM + 6 random digits
            import random
            self.room_id = f"ROOM{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)
    
    @property
    def available_beds(self):
        """Get the number of available beds."""
        return self.beds.filter(status='AVAILABLE').count()
    
    @property
    def occupied_beds(self):
        """Get the number of occupied beds."""
        return self.beds.filter(status='OCCUPIED').count()
    
    @property
    def reserved_beds(self):
        """Get the number of reserved beds."""
        return self.beds.filter(status='RESERVED').count()