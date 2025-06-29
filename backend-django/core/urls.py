from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/clinics/', include('clinics.urls')),
    path('api/doctors/', include('doctors.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/prescriptions/', include('prescriptions.urls')),
    path('api/medicines/', include('medicines.urls')),
    path('api/rooms/', include('rooms.urls')),
    path('api/beds/', include('beds.urls')),
    path('api/treatments/', include('treatments.urls')),
    path('api/transactions/', include('transactions.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/profile/', include('users.profile_urls')),
    path('api/admin/', include('users.admin_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)