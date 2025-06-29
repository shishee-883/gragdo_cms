from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, InvoiceViewSet, PaymentViewSet

router = DefaultRouter()
router.register('', TransactionViewSet, basename='transaction')

invoice_router = DefaultRouter()
invoice_router.register('', InvoiceViewSet, basename='invoice')

urlpatterns = [
    path('', include(router.urls)),
    path('summary/', TransactionViewSet.as_view({'get': 'summary'}), name='transaction-summary'),
    path('invoices/', include(invoice_router.urls)),
    path('payment/', PaymentViewSet.as_view({'post': 'create'}), name='payment'),
]