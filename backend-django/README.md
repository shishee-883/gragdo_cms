# DigiGo Care Backend (Django)

This is the Django backend for the DigiGo Care Clinic Management System.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

5. Run migrations:
   ```
   python manage.py migrate
   ```

6. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```
   python manage.py runserver
   ```

## Project Structure

The backend is organized into the following apps:

- `users`: User authentication and management
- `clinics`: Clinic management
- `doctors`: Doctor profiles and schedules
- `patients`: Patient records and documents
- `appointments`: Appointment scheduling and management
- `prescriptions`: Prescription management
- `medicines`: Medicine inventory
- `rooms`: Room management
- `beds`: Bed management
- `treatments`: Treatment catalog
- `transactions`: Financial transactions and invoices
- `analytics`: Data analytics and reporting

## API Endpoints

### Authentication
- `POST /api/auth/signup/`: Register a new user
- `POST /api/auth/login/`: Login a user
- `POST /api/auth/logout/`: Logout a user
- `POST /api/auth/token/refresh/`: Refresh JWT token
- `POST /api/auth/forgot-password/`: Request password reset
- `POST /api/auth/reset-password/`: Reset password
- `GET /api/auth/me/`: Get current user

### Profile
- `GET /api/profile/`: Get user profile
- `PATCH /api/profile/`: Update user profile

### Clinics
- `GET /api/clinics/`: List all clinics
- `POST /api/clinics/`: Create a new clinic
- `GET /api/clinics/{id}/`: Get a specific clinic
- `PATCH /api/clinics/{id}/`: Update a clinic
- `DELETE /api/clinics/{id}/`: Delete a clinic

### Doctors
- `GET /api/doctors/`: List all doctors
- `POST /api/doctors/`: Create a new doctor
- `GET /api/doctors/{id}/`: Get a specific doctor
- `PATCH /api/doctors/{id}/`: Update a doctor
- `DELETE /api/doctors/{id}/`: Delete a doctor
- `POST /api/doctors/{id}/toggle-availability/`: Toggle doctor availability
- `GET /api/doctors/schedules/`: List all schedules
- `POST /api/doctors/schedules/`: Create a new schedule
- `GET /api/doctors/schedules/{id}/`: Get a specific schedule
- `PATCH /api/doctors/schedules/{id}/`: Update a schedule
- `DELETE /api/doctors/schedules/{id}/`: Delete a schedule

### Patients
- `GET /api/patients/`: List all patients
- `POST /api/patients/`: Create a new patient
- `GET /api/patients/{id}/`: Get a specific patient
- `PATCH /api/patients/{id}/`: Update a patient
- `DELETE /api/patients/{id}/`: Delete a patient
- `GET /api/patients/{id}/documents/`: Get patient documents
- `GET /api/patients/documents/`: List all documents
- `POST /api/patients/documents/`: Create a new document
- `GET /api/patients/documents/{id}/`: Get a specific document
- `PATCH /api/patients/documents/{id}/`: Update a document
- `DELETE /api/patients/documents/{id}/`: Delete a document

### Appointments
- `GET /api/appointments/`: List all appointments
- `POST /api/appointments/`: Create a new appointment
- `GET /api/appointments/{id}/`: Get a specific appointment
- `PATCH /api/appointments/{id}/`: Update an appointment
- `DELETE /api/appointments/{id}/`: Delete an appointment
- `PATCH /api/appointments/{id}/cancel/`: Cancel an appointment
- `PATCH /api/appointments/{id}/check-in/`: Check in an appointment
- `PATCH /api/appointments/{id}/start/`: Start an appointment
- `PATCH /api/appointments/{id}/complete/`: Complete an appointment
- `PATCH /api/appointments/{id}/reschedule/`: Reschedule an appointment

### Prescriptions
- `GET /api/prescriptions/`: List all prescriptions
- `POST /api/prescriptions/`: Create a new prescription
- `GET /api/prescriptions/{id}/`: Get a specific prescription
- `PATCH /api/prescriptions/{id}/`: Update a prescription
- `DELETE /api/prescriptions/{id}/`: Delete a prescription

### Medicines
- `GET /api/medicines/`: List all medicines
- `POST /api/medicines/`: Create a new medicine
- `GET /api/medicines/{id}/`: Get a specific medicine
- `PATCH /api/medicines/{id}/`: Update a medicine
- `DELETE /api/medicines/{id}/`: Delete a medicine
- `PATCH /api/medicines/{id}/update-stock/`: Update medicine stock

### Rooms
- `GET /api/rooms/`: List all rooms
- `POST /api/rooms/`: Create a new room
- `GET /api/rooms/{id}/`: Get a specific room
- `PATCH /api/rooms/{id}/`: Update a room
- `DELETE /api/rooms/{id}/`: Delete a room

### Beds
- `GET /api/beds/`: List all beds
- `POST /api/beds/`: Create a new bed
- `GET /api/beds/{id}/`: Get a specific bed
- `PATCH /api/beds/{id}/`: Update a bed
- `DELETE /api/beds/{id}/`: Delete a bed
- `PATCH /api/beds/{id}/assign/`: Assign a patient to a bed
- `PATCH /api/beds/{id}/discharge/`: Discharge a patient from a bed
- `PATCH /api/beds/{id}/reserve/`: Reserve a bed
- `GET /api/beds/room/{room_id}/`: Get beds by room

### Treatments
- `GET /api/treatments/`: List all treatments
- `POST /api/treatments/`: Create a new treatment
- `GET /api/treatments/{id}/`: Get a specific treatment
- `PATCH /api/treatments/{id}/`: Update a treatment
- `DELETE /api/treatments/{id}/`: Delete a treatment

### Transactions
- `GET /api/transactions/`: List all transactions
- `POST /api/transactions/`: Create a new transaction
- `GET /api/transactions/{id}/`: Get a specific transaction
- `PATCH /api/transactions/{id}/`: Update a transaction
- `DELETE /api/transactions/{id}/`: Delete a transaction
- `GET /api/transactions/summary/`: Get transaction summary
- `GET /api/transactions/invoices/`: List all invoices
- `POST /api/transactions/invoices/`: Create a new invoice
- `GET /api/transactions/invoices/{id}/`: Get a specific invoice
- `PATCH /api/transactions/invoices/{id}/`: Update an invoice
- `DELETE /api/transactions/invoices/{id}/`: Delete an invoice
- `POST /api/transactions/payment/`: Record a payment

### Analytics
- `GET /api/analytics/`: Get analytics data

### Admin
- `GET /api/admin/stats/`: Get admin dashboard stats
- `GET /api/admin/doctors/`: Get admin doctors
- `GET /api/admin/staff/`: Get admin staff
- `GET /api/admin/transactions/`: Get admin transactions
- `GET /api/admin/appointments/`: Get admin appointments