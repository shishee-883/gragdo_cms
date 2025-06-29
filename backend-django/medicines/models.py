from django.db import models
import uuid


class Medicine(models.Model):
    """Model for medicines."""
    
    TYPE_CHOICES = (
        ('TABLET', 'Tablet'),
        ('CAPSULE', 'Capsule'),
        ('SYRUP', 'Syrup'),
        ('INJECTION', 'Injection'),
        ('CREAM', 'Cream'),
        ('OINTMENT', 'Ointment'),
        ('DROPS', 'Drops'),
        ('INHALER', 'Inhaler'),
        ('POWDER', 'Powder'),
        ('LOTION', 'Lotion'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    medicine_id = models.CharField(max_length=20, unique=True)  # Custom medicine ID (e.g., MED123456)
    name = models.CharField(max_length=255)
    manufacturer = models.CharField(max_length=255)
    batch_number = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    dosage = models.CharField(max_length=100)
    manufactured_date = models.DateField()
    expiry_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    reorder_level = models.PositiveIntegerField()
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, related_name='medicines')
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_medicines')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.dosage}"
    
    def save(self, *args, **kwargs):
        # Generate medicine_id if not provided
        if not self.medicine_id:
            # Format: MED + 6 random digits
            import random
            self.medicine_id = f"MED{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)