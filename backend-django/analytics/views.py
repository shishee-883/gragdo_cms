from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta
from patients.models import Patient
from appointments.models import Appointment
from transactions.models import Transaction
from users.permissions import IsAdmin, IsStaff


class AnalyticsView(APIView):
    """View for analytics data."""
    
    permission_classes = [IsAdmin | IsStaff]
    
    def get(self, request):
        # Get date ranges
        today = timezone.now().date()
        this_month_start = today.replace(day=1)
        last_month_end = this_month_start - timedelta(days=1)
        last_month_start = last_month_end.replace(day=1)
        
        # Filter based on user's role and clinic
        user = request.user
        clinic_filter = {}
        if user.role == 'SUPER_ADMIN' and user.clinic_ids:
            clinic_filter = {'clinic_id__in': user.clinic_ids}
        elif user.role in ['ADMIN', 'STAFF'] and user.clinic:
            clinic_filter = {'clinic': user.clinic}
        
        # Revenue analytics
        this_month_revenue = Transaction.objects.filter(
            type='INCOME',
            created_at__date__gte=this_month_start,
            created_at__date__lte=today,
            **clinic_filter
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        last_month_revenue = Transaction.objects.filter(
            type='INCOME',
            created_at__date__gte=last_month_start,
            created_at__date__lte=last_month_end,
            **clinic_filter
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Calculate growth percentage
        if last_month_revenue > 0:
            revenue_growth = ((this_month_revenue - last_month_revenue) / last_month_revenue) * 100
        else:
            revenue_growth = 100 if this_month_revenue > 0 else 0
        
        # Patient analytics
        total_patients = Patient.objects.filter(**clinic_filter).count()
        last_month_patients = Patient.objects.filter(
            created_at__date__gte=last_month_start,
            created_at__date__lte=last_month_end,
            **clinic_filter
        ).count()
        
        this_month_patients = Patient.objects.filter(
            created_at__date__gte=this_month_start,
            created_at__date__lte=today,
            **clinic_filter
        ).count()
        
        # Calculate patient growth percentage
        if last_month_patients > 0:
            patient_growth = ((this_month_patients - last_month_patients) / last_month_patients) * 100
        else:
            patient_growth = 100 if this_month_patients > 0 else 0
        
        # Appointment analytics
        total_appointments = Appointment.objects.filter(**clinic_filter).count()
        completed_appointments = Appointment.objects.filter(status='COMPLETED', **clinic_filter).count()
        
        # Calculate completion rate
        if total_appointments > 0:
            completion_rate = (completed_appointments / total_appointments) * 100
        else:
            completion_rate = 0
        
        return Response({
            'success': True,
            'data': {
                'revenue': {
                    'thisMonth': this_month_revenue,
                    'lastMonth': last_month_revenue,
                    'growth': round(revenue_growth, 2)
                },
                'patients': {
                    'total': total_patients,
                    'growth': round(patient_growth, 2)
                },
                'appointments': {
                    'completionRate': round(completion_rate, 2),
                    'total': total_appointments
                }
            }
        })