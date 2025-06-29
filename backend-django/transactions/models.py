from django.db import models
import uuid


class Transaction(models.Model):
    """Model for transactions."""
    
    TYPE_CHOICES = (
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense'),
        ('REFUND', 'Refund'),
    )
    
    PAYMENT_METHOD_CHOICES = (
        ('CASH', 'Cash'),
        ('CREDIT_CARD', 'Credit Card'),
        ('DEBIT_CARD', 'Debit Card'),
        ('UPI', 'UPI'),
        ('BANK_TRANSFER', 'Bank Transfer'),
        ('CHEQUE', 'Cheque'),
        ('INSURANCE', 'Insurance'),
    )
    
    PAYMENT_STATUS_CHOICES = (
        ('PAID', 'Paid'),
        ('PENDING', 'Pending'),
        ('CANCELLED', 'Cancelled'),
        ('REFUNDED', 'Refunded'),
        ('PARTIALLY_PAID', 'Partially Paid'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction_id = models.CharField(max_length=20, unique=True)  # Custom transaction ID (e.g., TXN123456)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES)
    invoice = models.ForeignKey('transactions.Invoice', on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    appointment = models.ForeignKey('appointments.Appointment', on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    patient = models.ForeignKey('patients.Patient', on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, related_name='transactions')
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_transactions')
    receipt = models.FileField(upload_to='receipts/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transaction_id} - {self.amount}"
    
    def save(self, *args, **kwargs):
        # Generate transaction_id if not provided
        if not self.transaction_id:
            # Format: TXN + 6 random digits
            import random
            self.transaction_id = f"TXN{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)


class Invoice(models.Model):
    """Model for invoices."""
    
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('SENT', 'Sent'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
        ('CANCELLED', 'Cancelled'),
        ('PARTIALLY_PAID', 'Partially Paid'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice_id = models.CharField(max_length=20, unique=True)  # Custom invoice ID (e.g., INV123456)
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='invoices')
    clinic = models.ForeignKey('clinics.Clinic', on_delete=models.CASCADE, related_name='invoices')
    appointment = models.ForeignKey('appointments.Appointment', on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    items = models.JSONField()  # Store as JSON
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='created_invoices')
    document = models.FileField(upload_to='invoices/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.invoice_id} - {self.patient}"
    
    def save(self, *args, **kwargs):
        # Generate invoice_id if not provided
        if not self.invoice_id:
            # Format: INV + 6 random digits
            import random
            self.invoice_id = f"INV{random.randint(100000, 999999)}"
        
        # Calculate total if not set
        if not self.total:
            self.total = self.subtotal - self.discount + self.tax
        
        super().save(*args, **kwargs)