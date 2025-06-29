from rest_framework import serializers
from .models import Transaction, Invoice
from patients.serializers import PatientSerializer
from doctors.serializers import DoctorSerializer


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for the Transaction model."""
    
    patient_details = serializers.SerializerMethodField()
    doctor_details = serializers.SerializerMethodField()
    receipt_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_id', 'amount', 'type', 'description', 
            'payment_method', 'payment_status', 'invoice', 'appointment', 
            'patient', 'doctor', 'clinic', 'receipt', 'receipt_url', 
            'patient_details', 'doctor_details', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'transaction_id', 'created_at', 'updated_at', 'receipt_url']
    
    def get_patient_details(self, obj):
        if obj.patient:
            return {
                'patientId': obj.patient.patient_id,
                'name': obj.patient.get_full_name(),
                'gender': obj.patient.gender,
                'age': obj.patient.age
            }
        return None
    
    def get_doctor_details(self, obj):
        if obj.doctor:
            return {
                'name': obj.doctor.name,
                'specialization': obj.doctor.specialization
            }
        return None
    
    def get_receipt_url(self, obj):
        if obj.receipt:
            return obj.receipt.url
        return None


class TransactionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new transaction."""
    
    class Meta:
        model = Transaction
        fields = [
            'amount', 'type', 'description', 'payment_method', 
            'payment_status', 'invoice', 'appointment', 
            'patient', 'doctor', 'clinic', 'receipt'
        ]
    
    def create(self, validated_data):
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TransactionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating a transaction."""
    
    class Meta:
        model = Transaction
        fields = [
            'description', 'payment_method', 'payment_status', 'receipt'
        ]


class InvoiceItemSerializer(serializers.Serializer):
    """Serializer for invoice items."""
    
    id = serializers.CharField(required=False)
    description = serializers.CharField(required=True)
    quantity = serializers.IntegerField(required=True, min_value=1)
    unit_price = serializers.DecimalField(required=True, max_digits=10, decimal_places=2)
    amount = serializers.DecimalField(required=True, max_digits=10, decimal_places=2)
    type = serializers.CharField(required=True)
    medicine_id = serializers.CharField(required=False, allow_null=True)
    treatment_id = serializers.CharField(required=False, allow_null=True)


class InvoiceSerializer(serializers.ModelSerializer):
    """Serializer for the Invoice model."""
    
    items = InvoiceItemSerializer(many=True)
    patient_details = serializers.SerializerMethodField()
    document_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_id', 'patient', 'clinic', 'appointment', 
            'items', 'subtotal', 'discount', 'tax', 'total', 
            'due_date', 'status', 'notes', 'document', 'document_url', 
            'patient_details', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'invoice_id', 'created_at', 'updated_at', 'document_url']
    
    def get_patient_details(self, obj):
        return {
            'patientId': obj.patient.patient_id,
            'name': obj.patient.get_full_name(),
            'gender': obj.patient.gender,
            'age': obj.patient.age
        }
    
    def get_document_url(self, obj):
        if obj.document:
            return obj.document.url
        return None


class InvoiceCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new invoice."""
    
    items = InvoiceItemSerializer(many=True, required=True)
    
    class Meta:
        model = Invoice
        fields = [
            'patient', 'clinic', 'appointment', 'items', 
            'subtotal', 'discount', 'tax', 'total', 
            'due_date', 'notes', 'document'
        ]
    
    def validate(self, attrs):
        # Validate items
        items = attrs.get('items', [])
        if not items:
            raise serializers.ValidationError({"items": "At least one item is required."})
        
        # Calculate subtotal
        subtotal = sum(item['amount'] for item in items)
        if attrs.get('subtotal') != subtotal:
            attrs['subtotal'] = subtotal
        
        # Calculate total
        total = subtotal - attrs.get('discount', 0) + attrs.get('tax', 0)
        if attrs.get('total') != total:
            attrs['total'] = total
        
        return attrs
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        
        # Create invoice
        invoice = Invoice.objects.create(**validated_data)
        
        # Set items as JSON
        invoice.items = items_data
        invoice.save()
        
        return invoice


class InvoiceUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating an invoice."""
    
    items = InvoiceItemSerializer(many=True, required=False)
    
    class Meta:
        model = Invoice
        fields = [
            'items', 'discount', 'tax', 'due_date', 
            'status', 'notes', 'document'
        ]
    
    def validate(self, attrs):
        # If items are provided, recalculate subtotal and total
        items = attrs.get('items')
        if items:
            # Calculate subtotal
            subtotal = sum(item['amount'] for item in items)
            attrs['subtotal'] = subtotal
            
            # Calculate total
            discount = attrs.get('discount', self.instance.discount if self.instance else 0)
            tax = attrs.get('tax', self.instance.tax if self.instance else 0)
            attrs['total'] = subtotal - discount + tax
        
        return attrs
    
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        
        # Update invoice fields
        instance = super().update(instance, validated_data)
        
        # Update items if provided
        if items_data is not None:
            instance.items = items_data
            instance.save()
        
        return instance


class PaymentSerializer(serializers.Serializer):
    """Serializer for recording a payment."""
    
    invoice_id = serializers.UUIDField(required=True)
    amount = serializers.DecimalField(required=True, max_digits=10, decimal_places=2)
    payment_method = serializers.ChoiceField(required=True, choices=Transaction.PAYMENT_METHOD_CHOICES)
    description = serializers.CharField(required=True)
    patient_id = serializers.UUIDField(required=True)
    clinic_id = serializers.UUIDField(required=True)
    receipt = serializers.FileField(required=False)
    
    def validate(self, attrs):
        # Check if invoice exists
        from django.shortcuts import get_object_or_404
        invoice = get_object_or_404(Invoice, id=attrs['invoice_id'])
        
        # Check if payment amount is valid
        if attrs['amount'] <= 0:
            raise serializers.ValidationError({"amount": "Payment amount must be positive."})
        
        # Check if payment amount exceeds the remaining balance
        paid_amount = Transaction.objects.filter(
            invoice=invoice,
            type='INCOME',
            payment_status='PAID'
        ).aggregate(models.Sum('amount'))['amount__sum'] or 0
        
        remaining_balance = invoice.total - paid_amount
        
        if attrs['amount'] > remaining_balance:
            raise serializers.ValidationError({"amount": "Payment amount exceeds the remaining balance."})
        
        return attrs
    
    def create(self, validated_data):
        from django.shortcuts import get_object_or_404
        
        # Get invoice
        invoice = get_object_or_404(Invoice, id=validated_data['invoice_id'])
        
        # Create transaction
        transaction = Transaction.objects.create(
            amount=validated_data['amount'],
            type='INCOME',
            description=validated_data['description'],
            payment_method=validated_data['payment_method'],
            payment_status='PAID',
            invoice=invoice,
            patient_id=validated_data['patient_id'],
            clinic_id=validated_data['clinic_id'],
            created_by=self.context['request'].user,
            receipt=validated_data.get('receipt')
        )
        
        # Update invoice status
        paid_amount = Transaction.objects.filter(
            invoice=invoice,
            type='INCOME',
            payment_status='PAID'
        ).aggregate(models.Sum('amount'))['amount__sum'] or 0
        
        if paid_amount >= invoice.total:
            invoice.status = 'PAID'
        elif paid_amount > 0:
            invoice.status = 'PARTIALLY_PAID'
        
        invoice.save()
        
        return transaction