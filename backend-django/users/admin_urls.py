from django.urls import path
from .admin_views import (
    AdminStatsView, AdminDoctorsView, 
    AdminStaffView, AdminTransactionsView, 
    AdminAppointmentsView
)

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('doctors/', AdminDoctorsView.as_view(), name='admin_doctors'),
    path('staff/', AdminStaffView.as_view(), name='admin_staff'),
    path('transactions/', AdminTransactionsView.as_view(), name='admin_transactions'),
    path('appointments/', AdminAppointmentsView.as_view(), name='admin_appointments'),
]