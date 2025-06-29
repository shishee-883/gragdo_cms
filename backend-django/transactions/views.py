from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from .models import Transaction, Invoice
from .serializers import (
    TransactionSerializer, TransactionCreateSerializer,
    TransactionUpdateSerializer, InvoiceSerializer,
    InvoiceCreateSerializer, InvoiceUpdateSerializer,
    PaymentSerializer
)


class TransactionViewSet(viewsets.ModelViewSet):
    """ViewSet for the Transaction model."""
    
    queryset = Transaction.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TransactionCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TransactionUpdateSerializer
        return TransactionSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by clinic if clinicId is provided
        clinic_id = self.request.query_params.get('clinicId')
        if clinic_id:
            queryset = queryset.filter(clinic_id=clinic_id)
        
        # Filter by patient if patientId is provided
        patient_id = self.request.query_params.get('patientId')
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        
        # Filter by type if type is provided
        type_param = self.request.query_params.get('type')
        if type_param:
            queryset = queryset.filter(type=type_param)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        transaction = serializer.save()
        
        return Response({
            'success': True,
            'transaction': TransactionSerializer(transaction).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        transaction = serializer.save()
        
        return Response({
            'success': True,
            'transaction': TransactionSerializer(transaction).data
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        
        return Response({
            'success': True
        }, status=status.HTTP_200_OK)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'transactions': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'transaction': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get transaction summary."""
        clinic_id = request.query_params.get('clinicId')
        period = request.query_params.get('period', 'month')
        
        if not clinic_id:
            return Response({
                'success': False,
                'error': 'Clinic ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Determine date range based on period
        today = timezone.now().date()
        if period == 'day':
            start_date = today
            end_date = today
        elif period == 'week':
            start_date = today - timedelta(days=today.weekday())
            end_date = start_date + timedelta(days=6)
        elif period == 'month':
            start_date = today.replace(day=1)
            if today.month == 12:
                end_date = today.replace(year=today.year + 1, month=1, day=1) - timedelta(days=1)
            else:
                end_date = today.replace(month=today.month + 1, day=1) - timedelta(days=1)
        elif period == 'year':
            start_date = today.replace(month=1, day=1)
            end_date = today.replace(month=12, day=31)
        else:
            return Response({
                'success': False,
                'error': 'Invalid period'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Filter transactions by date range and clinic
        transactions = Transaction.objects.filter(
            clinic_id=clinic_id,
            created_at__date__gte=start_date,
            created_at__date__lte=end_date
        )
        
        # Calculate summary
        income = transactions.filter(type='INCOME').aggregate(Sum('amount'))['amount__sum'] or 0
        expense = transactions.filter(type='EXPENSE').aggregate(Sum('amount'))['amount__sum'] or 0
        refund = transactions.filter(type='REFUND').aggregate(Sum('amount'))['amount__sum'] or 0
        net = income - expense - refund
        
        # Get payment method breakdown
        payment_methods = {}
        for method, _ in Transaction.PAYMENT_METHOD_CHOICES:
            amount = transactions.filter(
                type='INCOME',
                payment_method=method
            ).aggregate(Sum('amount'))['amount__sum'] or 0
            payment_methods[method] = amount
        
        return Response({
            'success': True,
            'summary': {
                'period': period,
                'income': income,
                'expense': expense,
                'refund': refund,
                'net': net,
                'paymentMethods': payment_methods,
                'transactionCount': transactions.count()
            }
        })


class InvoiceViewSet(viewsets.ModelViewSet):
    """ViewSet for the Invoice model."""
    
    queryset = Invoice.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InvoiceCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return InvoiceUpdateSerializer
        return InvoiceSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by clinic if clinicId is provided
        clinic_id = self.request.query_params.get('clinicId')
        if clinic_id:
            queryset = queryset.filter(clinic_id=clinic_id)
        
        # Filter by patient if patientId is provided
        patient_id = self.request.query_params.get('patientId')
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        
        # Filter by status if status is provided
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        invoice = serializer.save()
        
        return Response({
            'success': True,
            'invoice': InvoiceSerializer(invoice).data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        invoice = serializer.save()
        
        return Response({
            'success': True,
            'invoice': InvoiceSerializer(invoice).data
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if invoice has associated transactions
        if instance.transactions.exists():
            return Response({
                'success': False,
                'error': 'Cannot delete invoice with associated transactions'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_destroy(instance)
        
        return Response({
            'success': True
        }, status=status.HTTP_200_OK)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'invoices': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        return Response({
            'success': True,
            'invoice': serializer.data
        })


class PaymentViewSet(viewsets.ViewSet):
    """ViewSet for recording payments."""
    
    def create(self, request):
        """Record a payment."""
        serializer = PaymentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        transaction = serializer.save()
        
        return Response({
            'success': True,
            'transaction': TransactionSerializer(transaction).data
        }, status=status.HTTP_201_CREATED)