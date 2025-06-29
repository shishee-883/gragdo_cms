# DigiGo Care API Documentation

This document provides a comprehensive reference for all API endpoints available in the DigiGo Care system.

## Base URL

```
https://api.digigocare.com/api
```

For local development:

```
http://localhost:8000/api
```

## Authentication

Most endpoints require authentication. The API uses JWT (JSON Web Token) for authentication.

### Headers

For authenticated requests, include the following header:

```
Authorization: Bearer <access_token>
```

## Authentication Endpoints

### Login

Authenticate a user and get access and refresh tokens.

- **URL**: `/auth/login/`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "your-password",
  "role": "ADMIN" // One of: "SUPER_ADMIN", "ADMIN", "STAFF", "DOCTOR"
}
```

**Response**:

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "ADMIN",
    "clinicId": "clinic-id",
    "clinicIds": ["clinic-id-1", "clinic-id-2"] // Only for SUPER_ADMIN
  },
  "access": "access-token",
  "refresh": "refresh-token"
}
```

### Signup

Register a new user.

- **URL**: `/auth/signup/`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "phone": "1234567890",
  "role": "ADMIN", // One of: "SUPER_ADMIN", "ADMIN", "STAFF", "DOCTOR"
  "clinic": "clinic-id", // Optional, required for ADMIN, STAFF, DOCTOR
  "password": "your-password",
  "confirm_password": "your-password"
}
```

**Response**:

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "ADMIN",
    "clinicId": "clinic-id"
  },
  "access": "access-token",
  "refresh": "refresh-token"
}
```

### Logout

Log out a user by invalidating their tokens.

- **URL**: `/auth/logout/`
- **Method**: `POST`
- **Auth Required**: Yes

**Response**:

```json
{
  "success": true
}
```

### Get Current User

Get the currently authenticated user's information.

- **URL**: `/auth/me/`
- **Method**: `GET`
- **Auth Required**: Yes

**Response**:

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "ADMIN",
    "clinicId": "clinic-id",
    "clinicIds": ["clinic-id-1", "clinic-id-2"] // Only for SUPER_ADMIN
  }
}
```

### Forgot Password

Request a password reset link.

- **URL**: `/auth/forgot-password/`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Response**:

```json
{
  "success": true,
  "message": "If your email is registered, you will receive a password reset link"
}
```

### Reset Password

Reset a user's password using a token.

- **URL**: `/auth/reset-password/`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "token": "reset-token",
  "new_password": "new-password",
  "confirm_password": "new-password"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### Refresh Token

Get a new access token using a refresh token.

- **URL**: `/auth/token/refresh/`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "refresh": "refresh-token"
}
```

**Response**:

```json
{
  "access": "new-access-token"
}
```

### Change Password

Change the password of the currently authenticated user.

- **URL**: `/auth/change-password/`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "current_password": "current-password",
  "new_password": "new-password",
  "confirm_password": "new-password"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Verify Email

Verify a user's email address using a token.

- **URL**: `/auth/verify-email/`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "token": "verification-token"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Resend Verification Email

Resend the email verification link.

- **URL**: `/auth/resend-verification-email/`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Verification email sent"
}
```

## Profile Endpoints

### Get User Profile

Get a user's profile information.

- **URL**: `/profile/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `userId` (optional): Get another user's profile (requires appropriate permissions)

**Response**:

```json
{
  "success": true,
  "profile": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "1234567890",
    "role": "ADMIN",
    "address": "123 Main St",
    "bio": "User bio",
    "profileImage": "profile-image-url",
    "clinic": {
      "id": "clinic-id",
      "name": "Clinic Name",
      "address": "Clinic Address"
    },
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

### Update User Profile

Update a user's profile information.

- **URL**: `/profile/`
- **Method**: `PATCH`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "userId": "user-id",
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "9876543210",
  "address": "456 New St",
  "bio": "Updated bio",
  "profileImage": "new-profile-image-url"
}
```

**Response**:

```json
{
  "success": true
}
```

## Clinic Endpoints

### Get All Clinics

Get a list of all clinics.

- **URL**: `/clinics/`
- **Method**: `GET`
- **Auth Required**: Yes

**Response**:

```json
{
  "success": true,
  "clinics": [
    {
      "id": "clinic-id",
      "name": "Clinic Name",
      "address": "Clinic Address",
      "phone": "1234567890",
      "email": "clinic@example.com",
      "description": "Clinic description",
      "stats": {
        "patients": 100,
        "appointments": 50,
        "doctors": 5
      },
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Get Clinic by ID

Get a specific clinic by ID.

- **URL**: `/clinics/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Clinic ID

**Response**:

```json
{
  "success": true,
  "clinic": {
    "id": "clinic-id",
    "name": "Clinic Name",
    "address": "Clinic Address",
    "phone": "1234567890",
    "email": "clinic@example.com",
    "description": "Clinic description",
    "stats": {
      "patients": 100,
      "appointments": 50,
      "doctors": 5
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Create Clinic

Create a new clinic.

- **URL**: `/clinics/`
- **Method**: `POST`
- **Auth Required**: Yes (SUPER_ADMIN only)

**Request Body**:

```json
{
  "name": "New Clinic",
  "address": "Clinic Address",
  "phone": "1234567890",
  "email": "clinic@example.com",
  "description": "Clinic description"
}
```

**Response**:

```json
{
  "success": true,
  "clinic": {
    "id": "clinic-id",
    "name": "New Clinic",
    "address": "Clinic Address",
    "phone": "1234567890",
    "email": "clinic@example.com",
    "description": "Clinic description",
    "stats": {
      "patients": 0,
      "appointments": 0,
      "doctors": 0
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Update Clinic

Update a clinic.

- **URL**: `/clinics/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes (SUPER_ADMIN or ADMIN of the clinic)
- **URL Parameters**:
  - `id`: Clinic ID

**Request Body**:

```json
{
  "name": "Updated Clinic",
  "address": "Updated Address",
  "phone": "9876543210",
  "email": "updated@example.com",
  "description": "Updated description"
}
```

**Response**:

```json
{
  "success": true,
  "clinic": {
    "id": "clinic-id",
    "name": "Updated Clinic",
    "address": "Updated Address",
    "phone": "9876543210",
    "email": "updated@example.com",
    "description": "Updated description",
    "stats": {
      "patients": 100,
      "appointments": 50,
      "doctors": 5
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Delete Clinic

Delete a clinic.

- **URL**: `/clinics/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes (SUPER_ADMIN only)
- **URL Parameters**:
  - `id`: Clinic ID

**Response**:

```json
{
  "success": true
}
```

## Doctor Endpoints

### Get All Doctors

Get a list of all doctors, optionally filtered by clinic.

- **URL**: `/doctors/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID

**Response**:

```json
{
  "success": true,
  "doctors": [
    {
      "id": "doctor-id",
      "name": "Doctor Name",
      "email": "doctor@example.com",
      "phone": "1234567890",
      "specialization": "Cardiology",
      "qualification": "MBBS, MD",
      "experience": 5,
      "consultationFee": 500,
      "isAvailable": true,
      "clinicId": "clinic-id",
      "schedules": [
        {
          "id": "schedule-id",
          "dayOfWeek": 1,
          "startTime": "09:00",
          "endTime": "17:00",
          "isActive": true
        }
      ],
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Get Doctor by ID

Get a specific doctor by ID.

- **URL**: `/doctors/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Doctor ID

**Response**:

```json
{
  "success": true,
  "doctor": {
    "id": "doctor-id",
    "name": "Doctor Name",
    "email": "doctor@example.com",
    "phone": "1234567890",
    "specialization": "Cardiology",
    "qualification": "MBBS, MD",
    "experience": 5,
    "consultationFee": 500,
    "isAvailable": true,
    "clinicId": "clinic-id",
    "schedules": [
      {
        "id": "schedule-id",
        "dayOfWeek": 1,
        "startTime": "09:00",
        "endTime": "17:00",
        "isActive": true
      }
    ],
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Create Doctor

Create a new doctor.

- **URL**: `/doctors/`
- **Method**: `POST`
- **Auth Required**: Yes (SUPER_ADMIN or ADMIN)

**Request Body**:

```json
{
  "name": "New Doctor",
  "email": "doctor@example.com",
  "phone": "1234567890",
  "specialization": "Cardiology",
  "qualification": "MBBS, MD",
  "experience": 5,
  "consultationFee": 500,
  "clinicId": "clinic-id"
}
```

**Response**:

```json
{
  "success": true,
  "doctor": {
    "id": "doctor-id",
    "name": "New Doctor",
    "email": "doctor@example.com",
    "phone": "1234567890",
    "specialization": "Cardiology",
    "qualification": "MBBS, MD",
    "experience": 5,
    "consultationFee": 500,
    "isAvailable": true,
    "clinicId": "clinic-id",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Update Doctor

Update a doctor.

- **URL**: `/doctors/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes (SUPER_ADMIN, ADMIN, or the doctor themselves)
- **URL Parameters**:
  - `id`: Doctor ID

**Request Body**:

```json
{
  "name": "Updated Doctor",
  "email": "updated@example.com",
  "phone": "9876543210",
  "specialization": "Neurology",
  "qualification": "MBBS, MD, DM",
  "experience": 10,
  "consultationFee": 1000,
  "isAvailable": false
}
```

**Response**:

```json
{
  "success": true,
  "doctor": {
    "id": "doctor-id",
    "name": "Updated Doctor",
    "email": "updated@example.com",
    "phone": "9876543210",
    "specialization": "Neurology",
    "qualification": "MBBS, MD, DM",
    "experience": 10,
    "consultationFee": 1000,
    "isAvailable": false,
    "clinicId": "clinic-id",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Delete Doctor

Delete a doctor.

- **URL**: `/doctors/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes (SUPER_ADMIN or ADMIN)
- **URL Parameters**:
  - `id`: Doctor ID

**Response**:

```json
{
  "success": true
}
```

### Toggle Doctor Availability

Toggle a doctor's availability status.

- **URL**: `/doctors/{id}/toggle-availability/`
- **Method**: `POST`
- **Auth Required**: Yes (SUPER_ADMIN, ADMIN, or the doctor themselves)
- **URL Parameters**:
  - `id`: Doctor ID

**Response**:

```json
{
  "success": true,
  "doctor": {
    "id": "doctor-id",
    "name": "Doctor Name",
    "isAvailable": false,
    // Other doctor fields...
  }
}
```

## Patient Endpoints

### Get All Patients

Get a list of all patients, optionally filtered by clinic.

- **URL**: `/patients/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID

**Response**:

```json
{
  "success": true,
  "patients": [
    {
      "id": "patient-id",
      "patientId": "PAT123456",
      "firstName": "John",
      "lastName": "Doe",
      "email": "patient@example.com",
      "phone": "1234567890",
      "gender": "MALE",
      "dateOfBirth": "1990-01-01",
      "age": 33,
      "bloodGroup": "O+",
      "address": "123 Patient St",
      "city": "City",
      "state": "State",
      "postalCode": "12345",
      "medicalHistory": "None",
      "allergies": ["Peanuts"],
      "emergencyContact": {
        "name": "Jane Doe",
        "relationship": "Spouse",
        "phone": "9876543210"
      },
      "clinicId": "clinic-id",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Get Patient by ID

Get a specific patient by ID.

- **URL**: `/patients/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Patient ID

**Response**:

```json
{
  "success": true,
  "patient": {
    "id": "patient-id",
    "patientId": "PAT123456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "patient@example.com",
    "phone": "1234567890",
    "gender": "MALE",
    "dateOfBirth": "1990-01-01",
    "age": 33,
    "bloodGroup": "O+",
    "address": "123 Patient St",
    "city": "City",
    "state": "State",
    "postalCode": "12345",
    "medicalHistory": "None",
    "allergies": ["Peanuts"],
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "9876543210"
    },
    "clinicId": "clinic-id",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Create Patient

Create a new patient.

- **URL**: `/patients/`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "patient@example.com",
  "phone": "1234567890",
  "gender": "MALE",
  "dateOfBirth": "1990-01-01",
  "bloodGroup": "O+",
  "address": "123 Patient St",
  "city": "City",
  "state": "State",
  "postalCode": "12345",
  "medicalHistory": "None",
  "allergies": ["Peanuts"],
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "9876543210"
  },
  "clinicId": "clinic-id"
}
```

**Response**:

```json
{
  "success": true,
  "patient": {
    "id": "patient-id",
    "patientId": "PAT123456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "patient@example.com",
    "phone": "1234567890",
    "gender": "MALE",
    "dateOfBirth": "1990-01-01",
    "age": 33,
    "bloodGroup": "O+",
    "address": "123 Patient St",
    "city": "City",
    "state": "State",
    "postalCode": "12345",
    "medicalHistory": "None",
    "allergies": ["Peanuts"],
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "9876543210"
    },
    "clinicId": "clinic-id",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Update Patient

Update a patient.

- **URL**: `/patients/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Patient ID

**Request Body**:

```json
{
  "firstName": "Updated",
  "lastName": "Patient",
  "email": "updated@example.com",
  "phone": "9876543210",
  "gender": "FEMALE",
  "dateOfBirth": "1995-01-01",
  "bloodGroup": "A+",
  "address": "456 Updated St",
  "city": "New City",
  "state": "New State",
  "postalCode": "54321",
  "medicalHistory": "Updated history",
  "allergies": ["Shellfish"],
  "emergencyContact": {
    "name": "John Doe",
    "relationship": "Spouse",
    "phone": "1234567890"
  },
  "isActive": true
}
```

**Response**:

```json
{
  "success": true,
  "patient": {
    "id": "patient-id",
    "patientId": "PAT123456",
    "firstName": "Updated",
    "lastName": "Patient",
    "email": "updated@example.com",
    "phone": "9876543210",
    "gender": "FEMALE",
    "dateOfBirth": "1995-01-01",
    "age": 28,
    "bloodGroup": "A+",
    "address": "456 Updated St",
    "city": "New City",
    "state": "New State",
    "postalCode": "54321",
    "medicalHistory": "Updated history",
    "allergies": ["Shellfish"],
    "emergencyContact": {
      "name": "John Doe",
      "relationship": "Spouse",
      "phone": "1234567890"
    },
    "clinicId": "clinic-id",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Delete Patient

Delete a patient.

- **URL**: `/patients/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Patient ID

**Response**:

```json
{
  "success": true
}
```

### Get Patient Documents

Get all documents for a patient.

- **URL**: `/patients/{id}/documents/`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Patient ID

**Response**:

```json
{
  "success": true,
  "documents": [
    {
      "id": "document-id",
      "documentId": "DOC123456",
      "name": "Blood Test Report",
      "type": "REPORT",
      "url": "https://example.com/documents/blood-test.pdf",
      "size": 1024000,
      "patientId": "patient-id",
      "appointmentId": "appointment-id",
      "uploadedById": "user-id",
      "clinicId": "clinic-id",
      "tags": ["blood-test", "routine"],
      "notes": "Routine blood test",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

## Appointment Endpoints

### Get All Appointments

Get a list of all appointments, with optional filtering.

- **URL**: `/appointments/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `doctorId` (optional): Filter by doctor ID
  - `patientId` (optional): Filter by patient ID
  - `status` (optional): Filter by status

**Response**:

```json
{
  "success": true,
  "appointments": [
    {
      "id": "appointment-id",
      "appointmentId": "APT123456",
      "patient": "patient-id",
      "doctor": "doctor-id",
      "clinic": "clinic-id",
      "appointmentDate": "2023-01-01",
      "startTime": "09:00",
      "endTime": "09:30",
      "duration": 30,
      "type": "REGULAR",
      "status": "SCHEDULED",
      "concern": "Routine checkup",
      "notes": "Patient notes",
      "vitals": {
        "temperature": 98.6,
        "bloodPressure": "120/80",
        "heartRate": 72
      },
      "patient_details": {
        "patientId": "PAT123456",
        "name": "John Doe",
        "phone": "1234567890",
        "gender": "MALE",
        "age": 33
      },
      "doctor_details": {
        "name": "Dr. Smith",
        "specialization": "Cardiology"
      },
      "createdAt": "2022-12-15T00:00:00Z",
      "updatedAt": "2022-12-15T00:00:00Z"
    }
  ]
}
```

### Get Appointment by ID

Get a specific appointment by ID.

- **URL**: `/appointments/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Appointment ID

**Response**:

```json
{
  "success": true,
  "appointment": {
    "id": "appointment-id",
    "appointmentId": "APT123456",
    "patient": "patient-id",
    "doctor": "doctor-id",
    "clinic": "clinic-id",
    "appointmentDate": "2023-01-01",
    "startTime": "09:00",
    "endTime": "09:30",
    "duration": 30,
    "type": "REGULAR",
    "status": "SCHEDULED",
    "concern": "Routine checkup",
    "notes": "Patient notes",
    "vitals": {
      "temperature": 98.6,
      "bloodPressure": "120/80",
      "heartRate": 72
    },
    "patient_details": {
      "patientId": "PAT123456",
      "name": "John Doe",
      "phone": "1234567890",
      "gender": "MALE",
      "age": 33
    },
    "doctor_details": {
      "name": "Dr. Smith",
      "specialization": "Cardiology"
    },
    "createdAt": "2022-12-15T00:00:00Z",
    "updatedAt": "2022-12-15T00:00:00Z"
  }
}
```

### Create Appointment

Create a new appointment.

- **URL**: `/appointments/`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "patient": "patient-id",
  "doctor": "doctor-id",
  "clinic": "clinic-id",
  "appointmentDate": "2023-01-01",
  "startTime": "09:00",
  "endTime": "09:30",
  "duration": 30,
  "type": "REGULAR",
  "concern": "Routine checkup",
  "notes": "Patient notes",
  "isFollowUp": false,
  "previousAppointment": null
}
```

**Response**:

```json
{
  "success": true,
  "appointment": {
    "id": "appointment-id",
    "appointmentId": "APT123456",
    "patient": "patient-id",
    "doctor": "doctor-id",
    "clinic": "clinic-id",
    "appointmentDate": "2023-01-01",
    "startTime": "09:00",
    "endTime": "09:30",
    "duration": 30,
    "type": "REGULAR",
    "status": "SCHEDULED",
    "concern": "Routine checkup",
    "notes": "Patient notes",
    "patient_details": {
      "patientId": "PAT123456",
      "name": "John Doe",
      "phone": "1234567890",
      "gender": "MALE",
      "age": 33
    },
    "doctor_details": {
      "name": "Dr. Smith",
      "specialization": "Cardiology"
    },
    "createdAt": "2022-12-15T00:00:00Z",
    "updatedAt": "2022-12-15T00:00:00Z"
  }
}
```

### Update Appointment

Update an appointment.

- **URL**: `/appointments/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Appointment ID

**Request Body**:

```json
{
  "appointmentDate": "2023-01-02",
  "startTime": "10:00",
  "endTime": "10:30",
  "duration": 30,
  "type": "FOLLOW_UP",
  "status": "CONFIRMED",
  "concern": "Follow-up checkup",
  "notes": "Updated notes",
  "vitals": {
    "temperature": 98.6,
    "bloodPressure": "120/80",
    "heartRate": 72
  },
  "followUpDate": "2023-01-15"
}
```

**Response**:

```json
{
  "success": true,
  "appointment": {
    "id": "appointment-id",
    "appointmentId": "APT123456",
    "patient": "patient-id",
    "doctor": "doctor-id",
    "clinic": "clinic-id",
    "appointmentDate": "2023-01-02",
    "startTime": "10:00",
    "endTime": "10:30",
    "duration": 30,
    "type": "FOLLOW_UP",
    "status": "CONFIRMED",
    "concern": "Follow-up checkup",
    "notes": "Updated notes",
    "vitals": {
      "temperature": 98.6,
      "bloodPressure": "120/80",
      "heartRate": 72
    },
    "followUpDate": "2023-01-15",
    "patient_details": {
      "patientId": "PAT123456",
      "name": "John Doe",
      "phone": "1234567890",
      "gender": "MALE",
      "age": 33
    },
    "doctor_details": {
      "name": "Dr. Smith",
      "specialization": "Cardiology"
    },
    "createdAt": "2022-12-15T00:00:00Z",
    "updatedAt": "2022-12-15T00:00:00Z"
  }
}
```

### Delete Appointment

Delete an appointment.

- **URL**: `/appointments/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Appointment ID

**Response**:

```json
{
  "success": true
}
```

### Cancel Appointment

Cancel an appointment.

- **URL**: `/appointments/{id}/cancel/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Appointment ID

**Request Body**:

```json
{
  "cancel_reason": "Patient requested cancellation"
}
```

**Response**:

```json
{
  "success": true,
  "appointment": {
    "id": "appointment-id",
    "status": "CANCELLED",
    "cancelReason": "Patient requested cancellation",
    "cancelledAt": "2023-01-01T00:00:00Z",
    "cancelledBy": "user-id",
    // Other appointment fields...
  }
}
```

### Check In Appointment

Check in a patient for an appointment.

- **URL**: `/appointments/{id}/check-in/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Appointment ID

**Response**:

```json
{
  "success": true,
  "appointment": {
    "id": "appointment-id",
    "status": "CHECKED_IN",
    // Other appointment fields...
  }
}
```

### Start Appointment

Start an appointment.

- **URL**: `/appointments/{id}/start/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Appointment ID

**Response**:

```json
{
  "success": true,
  "appointment": {
    "id": "appointment-id",
    "status": "IN_PROGRESS",
    // Other appointment fields...
  }
}
```

### Complete Appointment

Complete an appointment.

- **URL**: `/appointments/{id}/complete/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Appointment ID

**Request Body**:

```json
{
  "vitals": {
    "temperature": 98.6,
    "bloodPressure": "120/80",
    "heartRate": 72,
    "respiratoryRate": 16,
    "oxygenSaturation": 98,
    "weight": 70,
    "height": 175
  },
  "notes": "Patient is doing well",
  "followUpDate": "2023-01-15"
}
```

**Response**:

```json
{
  "success": true,
  "appointment": {
    "id": "appointment-id",
    "status": "COMPLETED",
    "vitals": {
      "temperature": 98.6,
      "bloodPressure": "120/80",
      "heartRate": 72,
      "respiratoryRate": 16,
      "oxygenSaturation": 98,
      "weight": 70,
      "height": 175
    },
    "notes": "Patient is doing well",
    "followUpDate": "2023-01-15",
    // Other appointment fields...
  }
}
```

### Reschedule Appointment

Reschedule an appointment.

- **URL**: `/appointments/{id}/reschedule/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Appointment ID

**Request Body**:

```json
{
  "appointmentDate": "2023-01-10",
  "startTime": "14:00",
  "endTime": "14:30",
  "duration": 30
}
```

**Response**:

```json
{
  "success": true,
  "appointment": {
    "id": "appointment-id",
    "status": "RESCHEDULED",
    "appointmentDate": "2023-01-10",
    "startTime": "14:00",
    "endTime": "14:30",
    "duration": 30,
    // Other appointment fields...
  }
}
```

## Prescription Endpoints

### Get All Prescriptions

Get a list of all prescriptions, with optional filtering.

- **URL**: `/prescriptions/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `doctorId` (optional): Filter by doctor ID
  - `patientId` (optional): Filter by patient ID

**Response**:

```json
{
  "success": true,
  "prescriptions": [
    {
      "id": "prescription-id",
      "prescriptionId": "PRE123456",
      "patient": "patient-id",
      "doctor": "doctor-id",
      "clinic": "clinic-id",
      "appointment": "appointment-id",
      "diagnosis": "Hypertension",
      "medications": [
        {
          "id": "medication-id",
          "name": "Amlodipine",
          "dosage": "5mg",
          "frequency": "Once daily",
          "duration": "30 days",
          "instructions": "Take after breakfast",
          "quantity": 30
        }
      ],
      "instructions": "Avoid salty foods",
      "followUpDate": "2023-02-01",
      "isActive": true,
      "document": "document-url",
      "document_url": "document-url",
      "patient_details": {
        "patientId": "PAT123456",
        "name": "John Doe",
        "gender": "MALE",
        "age": 33
      },
      "doctor_details": {
        "name": "Dr. Smith",
        "specialization": "Cardiology"
      },
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Get Prescription by ID

Get a specific prescription by ID.

- **URL**: `/prescriptions/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Prescription ID

**Response**:

```json
{
  "success": true,
  "prescription": {
    "id": "prescription-id",
    "prescriptionId": "PRE123456",
    "patient": "patient-id",
    "doctor": "doctor-id",
    "clinic": "clinic-id",
    "appointment": "appointment-id",
    "diagnosis": "Hypertension",
    "medications": [
      {
        "id": "medication-id",
        "name": "Amlodipine",
        "dosage": "5mg",
        "frequency": "Once daily",
        "duration": "30 days",
        "instructions": "Take after breakfast",
        "quantity": 30
      }
    ],
    "instructions": "Avoid salty foods",
    "followUpDate": "2023-02-01",
    "isActive": true,
    "document": "document-url",
    "document_url": "document-url",
    "patient_details": {
      "patientId": "PAT123456",
      "name": "John Doe",
      "gender": "MALE",
      "age": 33
    },
    "doctor_details": {
      "name": "Dr. Smith",
      "specialization": "Cardiology"
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Create Prescription

Create a new prescription.

- **URL**: `/prescriptions/`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "patient": "patient-id",
  "doctor": "doctor-id",
  "clinic": "clinic-id",
  "appointment": "appointment-id",
  "diagnosis": "Hypertension",
  "medications": [
    {
      "name": "Amlodipine",
      "dosage": "5mg",
      "frequency": "Once daily",
      "duration": "30 days",
      "instructions": "Take after breakfast",
      "medicine": "medicine-id",
      "quantity": 30
    }
  ],
  "instructions": "Avoid salty foods",
  "followUpDate": "2023-02-01",
  "document": "document-file"
}
```

**Response**:

```json
{
  "success": true,
  "prescription": {
    "id": "prescription-id",
    "prescriptionId": "PRE123456",
    "patient": "patient-id",
    "doctor": "doctor-id",
    "clinic": "clinic-id",
    "appointment": "appointment-id",
    "diagnosis": "Hypertension",
    "medications": [
      {
        "id": "medication-id",
        "name": "Amlodipine",
        "dosage": "5mg",
        "frequency": "Once daily",
        "duration": "30 days",
        "instructions": "Take after breakfast",
        "medicine": "medicine-id",
        "quantity": 30
      }
    ],
    "instructions": "Avoid salty foods",
    "followUpDate": "2023-02-01",
    "isActive": true,
    "document": "document-url",
    "document_url": "document-url",
    "patient_details": {
      "patientId": "PAT123456",
      "name": "John Doe",
      "gender": "MALE",
      "age": 33
    },
    "doctor_details": {
      "name": "Dr. Smith",
      "specialization": "Cardiology"
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Update Prescription

Update a prescription.

- **URL**: `/prescriptions/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Prescription ID

**Request Body**:

```json
{
  "diagnosis": "Updated diagnosis",
  "medications": [
    {
      "id": "medication-id",
      "name": "Updated medication",
      "dosage": "10mg",
      "frequency": "Twice daily",
      "duration": "15 days",
      "instructions": "Take after meals",
      "quantity": 30
    }
  ],
  "instructions": "Updated instructions",
  "followUpDate": "2023-02-15",
  "isActive": true,
  "document": "updated-document-file"
}
```

**Response**:

```json
{
  "success": true,
  "prescription": {
    "id": "prescription-id",
    "prescriptionId": "PRE123456",
    "patient": "patient-id",
    "doctor": "doctor-id",
    "clinic": "clinic-id",
    "appointment": "appointment-id",
    "diagnosis": "Updated diagnosis",
    "medications": [
      {
        "id": "medication-id",
        "name": "Updated medication",
        "dosage": "10mg",
        "frequency": "Twice daily",
        "duration": "15 days",
        "instructions": "Take after meals",
        "quantity": 30
      }
    ],
    "instructions": "Updated instructions",
    "followUpDate": "2023-02-15",
    "isActive": true,
    "document": "updated-document-url",
    "document_url": "updated-document-url",
    "patient_details": {
      "patientId": "PAT123456",
      "name": "John Doe",
      "gender": "MALE",
      "age": 33
    },
    "doctor_details": {
      "name": "Dr. Smith",
      "specialization": "Cardiology"
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Delete Prescription

Delete a prescription.

- **URL**: `/prescriptions/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Prescription ID

**Response**:

```json
{
  "success": true
}
```

## Medicine Endpoints

### Get All Medicines

Get a list of all medicines, with optional filtering.

- **URL**: `/medicines/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `isActive` (optional): Filter by active status (true/false)

**Response**:

```json
{
  "success": true,
  "medicines": [
    {
      "id": "medicine-id",
      "medicineId": "MED123456",
      "name": "Amlodipine",
      "manufacturer": "Pfizer",
      "batchNumber": "BATCH123",
      "type": "TABLET",
      "dosage": "5mg",
      "manufacturedDate": "2022-01-01",
      "expiryDate": "2024-01-01",
      "price": 10.5,
      "stock": 100,
      "reorderLevel": 20,
      "clinic": "clinic-id",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Get Medicine by ID

Get a specific medicine by ID.

- **URL**: `/medicines/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Medicine ID

**Response**:

```json
{
  "success": true,
  "medicine": {
    "id": "medicine-id",
    "medicineId": "MED123456",
    "name": "Amlodipine",
    "manufacturer": "Pfizer",
    "batchNumber": "BATCH123",
    "type": "TABLET",
    "dosage": "5mg",
    "manufacturedDate": "2022-01-01",
    "expiryDate": "2024-01-01",
    "price": 10.5,
    "stock": 100,
    "reorderLevel": 20,
    "clinic": "clinic-id",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Create Medicine

Create a new medicine.

- **URL**: `/medicines/`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "name": "Amlodipine",
  "manufacturer": "Pfizer",
  "batchNumber": "BATCH123",
  "type": "TABLET",
  "dosage": "5mg",
  "manufacturedDate": "2022-01-01",
  "expiryDate": "2024-01-01",
  "price": 10.5,
  "stock": 100,
  "reorderLevel": 20,
  "clinic": "clinic-id"
}
```

**Response**:

```json
{
  "success": true,
  "medicine": {
    "id": "medicine-id",
    "medicineId": "MED123456",
    "name": "Amlodipine",
    "manufacturer": "Pfizer",
    "batchNumber": "BATCH123",
    "type": "TABLET",
    "dosage": "5mg",
    "manufacturedDate": "2022-01-01",
    "expiryDate": "2024-01-01",
    "price": 10.5,
    "stock": 100,
    "reorderLevel": 20,
    "clinic": "clinic-id",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Update Medicine

Update a medicine.

- **URL**: `/medicines/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Medicine ID

**Request Body**:

```json
{
  "name": "Updated Medicine",
  "manufacturer": "Updated Manufacturer",
  "batchNumber": "BATCH456",
  "type": "CAPSULE",
  "dosage": "10mg",
  "manufacturedDate": "2022-02-01",
  "expiryDate": "2024-02-01",
  "price": 15.75,
  "stock": 200,
  "reorderLevel": 30,
  "isActive": true
}
```

**Response**:

```json
{
  "success": true,
  "medicine": {
    "id": "medicine-id",
    "medicineId": "MED123456",
    "name": "Updated Medicine",
    "manufacturer": "Updated Manufacturer",
    "batchNumber": "BATCH456",
    "type": "CAPSULE",
    "dosage": "10mg",
    "manufacturedDate": "2022-02-01",
    "expiryDate": "2024-02-01",
    "price": 15.75,
    "stock": 200,
    "reorderLevel": 30,
    "clinic": "clinic-id",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Delete Medicine

Delete a medicine.

- **URL**: `/medicines/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Medicine ID

**Response**:

```json
{
  "success": true
}
```

### Update Medicine Stock

Update the stock of a medicine.

- **URL**: `/medicines/{id}/update-stock/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Medicine ID

**Request Body**:

```json
{
  "quantity": 50,
  "isAddition": true
}
```

**Response**:

```json
{
  "success": true,
  "medicine": {
    "id": "medicine-id",
    "medicineId": "MED123456",
    "name": "Amlodipine",
    "stock": 150,
    // Other medicine fields...
  }
}
```

## Room Endpoints

### Get All Rooms

Get a list of all rooms, with optional filtering.

- **URL**: `/rooms/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `isActive` (optional): Filter by active status (true/false)

**Response**:

```json
{
  "success": true,
  "rooms": [
    {
      "id": "room-id",
      "roomId": "ROOM123456",
      "roomNumber": "101",
      "roomType": "PRIVATE",
      "floor": 1,
      "totalBeds": 2,
      "available_beds": 1,
      "occupied_beds": 1,
      "reserved_beds": 0,
      "clinic": "clinic-id",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Get Room by ID

Get a specific room by ID.

- **URL**: `/rooms/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Room ID

**Response**:

```json
{
  "success": true,
  "room": {
    "id": "room-id",
    "roomId": "ROOM123456",
    "roomNumber": "101",
    "roomType": "PRIVATE",
    "floor": 1,
    "totalBeds": 2,
    "available_beds": 1,
    "occupied_beds": 1,
    "reserved_beds": 0,
    "clinic": "clinic-id",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Create Room

Create a new room.

- **URL**: `/rooms/`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "roomNumber": "101",
  "roomType": "PRIVATE",
  "floor": 1,
  "totalBeds": 2,
  "clinic": "clinic-id"
}
```

**Response**:

```json
{
  "success": true,
  "room": {
    "id": "room-id",
    "roomId": "ROOM123456",
    "roomNumber": "101",
    "roomType": "PRIVATE",
    "floor": 1,
    "totalBeds": 2,
    "available_beds": 2,
    "occupied_beds": 0,
    "reserved_beds": 0,
    "clinic": "clinic-id",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Update Room

Update a room.

- **URL**: `/rooms/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Room ID

**Request Body**:

```json
{
  "roomNumber": "102",
  "roomType": "GENERAL",
  "floor": 2,
  "totalBeds": 4,
  "isActive": true
}
```

**Response**:

```json
{
  "success": true,
  "room": {
    "id": "room-id",
    "roomId": "ROOM123456",
    "roomNumber": "102",
    "roomType": "GENERAL",
    "floor": 2,
    "totalBeds": 4,
    "available_beds": 4,
    "occupied_beds": 0,
    "reserved_beds": 0,
    "clinic": "clinic-id",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Delete Room

Delete a room.

- **URL**: `/rooms/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Room ID

**Response**:

```json
{
  "success": true
}
```

## Bed Endpoints

### Get All Beds by Room

Get all beds for a specific room.

- **URL**: `/beds/room/{roomId}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `roomId`: Room ID

**Response**:

```json
{
  "success": true,
  "beds": [
    {
      "id": "bed-id",
      "bedId": "BED123456",
      "bedNumber": 1,
      "room": "room-id",
      "status": "AVAILABLE",
      "patient": null,
      "admissionDate": null,
      "dischargeDate": null,
      "clinic": "clinic-id",
      "notes": "Bed notes",
      "patient_details": null,
      "room_details": {
        "roomNumber": "101",
        "roomType": "PRIVATE",
        "floor": 1
      },
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Get Bed by ID

Get a specific bed by ID.

- **URL**: `/beds/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Bed ID

**Response**:

```json
{
  "success": true,
  "bed": {
    "id": "bed-id",
    "bedId": "BED123456",
    "bedNumber": 1,
    "room": "room-id",
    "status": "AVAILABLE",
    "patient": null,
    "admissionDate": null,
    "dischargeDate": null,
    "clinic": "clinic-id",
    "notes": "Bed notes",
    "patient_details": null,
    "room_details": {
      "roomNumber": "101",
      "roomType": "PRIVATE",
      "floor": 1
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Create Bed

Create a new bed.

- **URL**: `/beds/`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "bedNumber": 1,
  "room": "room-id",
  "clinic": "clinic-id",
  "notes": "Bed notes"
}
```

**Response**:

```json
{
  "success": true,
  "bed": {
    "id": "bed-id",
    "bedId": "BED123456",
    "bedNumber": 1,
    "room": "room-id",
    "status": "AVAILABLE",
    "patient": null,
    "admissionDate": null,
    "dischargeDate": null,
    "clinic": "clinic-id",
    "notes": "Bed notes",
    "patient_details": null,
    "room_details": {
      "roomNumber": "101",
      "roomType": "PRIVATE",
      "floor": 1
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Update Bed

Update a bed.

- **URL**: `/beds/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Bed ID

**Request Body**:

```json
{
  "bedNumber": 2,
  "status": "MAINTENANCE",
  "notes": "Updated notes"
}
```

**Response**:

```json
{
  "success": true,
  "bed": {
    "id": "bed-id",
    "bedId": "BED123456",
    "bedNumber": 2,
    "room": "room-id",
    "status": "MAINTENANCE",
    "patient": null,
    "admissionDate": null,
    "dischargeDate": null,
    "clinic": "clinic-id",
    "notes": "Updated notes",
    "patient_details": null,
    "room_details": {
      "roomNumber": "101",
      "roomType": "PRIVATE",
      "floor": 1
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Delete Bed

Delete a bed.

- **URL**: `/beds/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Bed ID

**Response**:

```json
{
  "success": true
}
```

### Assign Bed

Assign a patient to a bed.

- **URL**: `/beds/{id}/assign/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Bed ID

**Request Body**:

```json
{
  "patient": "patient-id",
  "admission_date": "2023-01-01",
  "discharge_date": "2023-01-07"
}
```

**Response**:

```json
{
  "success": true,
  "bed": {
    "id": "bed-id",
    "bedId": "BED123456",
    "bedNumber": 1,
    "room": "room-id",
    "status": "OCCUPIED",
    "patient": "patient-id",
    "admissionDate": "2023-01-01",
    "dischargeDate": "2023-01-07",
    "clinic": "clinic-id",
    "notes": "Bed notes",
    "patient_details": {
      "patientId": "PAT123456",
      "name": "John Doe",
      "gender": "MALE",
      "age": 33
    },
    "room_details": {
      "roomNumber": "101",
      "roomType": "PRIVATE",
      "floor": 1
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Discharge Bed

Discharge a patient from a bed.

- **URL**: `/beds/{id}/discharge/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Bed ID

**Response**:

```json
{
  "success": true,
  "bed": {
    "id": "bed-id",
    "bedId": "BED123456",
    "bedNumber": 1,
    "room": "room-id",
    "status": "AVAILABLE",
    "patient": null,
    "admissionDate": null,
    "dischargeDate": null,
    "clinic": "clinic-id",
    "notes": "Bed notes",
    "patient_details": null,
    "room_details": {
      "roomNumber": "101",
      "roomType": "PRIVATE",
      "floor": 1
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Reserve Bed

Reserve a bed.

- **URL**: `/beds/{id}/reserve/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Bed ID

**Response**:

```json
{
  "success": true,
  "bed": {
    "id": "bed-id",
    "bedId": "BED123456",
    "bedNumber": 1,
    "room": "room-id",
    "status": "RESERVED",
    "patient": null,
    "admissionDate": null,
    "dischargeDate": null,
    "clinic": "clinic-id",
    "notes": "Bed notes",
    "patient_details": null,
    "room_details": {
      "roomNumber": "101",
      "roomType": "PRIVATE",
      "floor": 1
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

## Transaction Endpoints

### Get All Transactions

Get a list of all transactions, with optional filtering.

- **URL**: `/transactions/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `patientId` (optional): Filter by patient ID
  - `type` (optional): Filter by transaction type

**Response**:

```json
{
  "success": true,
  "transactions": [
    {
      "id": "transaction-id",
      "transactionId": "TXN123456",
      "amount": 500,
      "type": "INCOME",
      "description": "Consultation fee",
      "paymentMethod": "CASH",
      "paymentStatus": "PAID",
      "invoice": "invoice-id",
      "appointment": "appointment-id",
      "patient": "patient-id",
      "doctor": "doctor-id",
      "clinic": "clinic-id",
      "receipt": "receipt-url",
      "receipt_url": "receipt-url",
      "patient_details": {
        "patientId": "PAT123456",
        "name": "John Doe",
        "gender": "MALE",
        "age": 33
      },
      "doctor_details": {
        "name": "Dr. Smith",
        "specialization": "Cardiology"
      },
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Get Transaction by ID

Get a specific transaction by ID.

- **URL**: `/transactions/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Transaction ID

**Response**:

```json
{
  "success": true,
  "transaction": {
    "id": "transaction-id",
    "transactionId": "TXN123456",
    "amount": 500,
    "type": "INCOME",
    "description": "Consultation fee",
    "paymentMethod": "CASH",
    "paymentStatus": "PAID",
    "invoice": "invoice-id",
    "appointment": "appointment-id",
    "patient": "patient-id",
    "doctor": "doctor-id",
    "clinic": "clinic-id",
    "receipt": "receipt-url",
    "receipt_url": "receipt-url",
    "patient_details": {
      "patientId": "PAT123456",
      "name": "John Doe",
      "gender": "MALE",
      "age": 33
    },
    "doctor_details": {
      "name": "Dr. Smith",
      "specialization": "Cardiology"
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Create Transaction

Create a new transaction.

- **URL**: `/transactions/`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "amount": 500,
  "type": "INCOME",
  "description": "Consultation fee",
  "paymentMethod": "CASH",
  "paymentStatus": "PAID",
  "invoice": "invoice-id",
  "appointment": "appointment-id",
  "patient": "patient-id",
  "doctor": "doctor-id",
  "clinic": "clinic-id",
  "receipt": "receipt-file"
}
```

**Response**:

```json
{
  "success": true,
  "transaction": {
    "id": "transaction-id",
    "transactionId": "TXN123456",
    "amount": 500,
    "type": "INCOME",
    "description": "Consultation fee",
    "paymentMethod": "CASH",
    "paymentStatus": "PAID",
    "invoice": "invoice-id",
    "appointment": "appointment-id",
    "patient": "patient-id",
    "doctor": "doctor-id",
    "clinic": "clinic-id",
    "receipt": "receipt-url",
    "receipt_url": "receipt-url",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Update Transaction

Update a transaction.

- **URL**: `/transactions/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Transaction ID

**Request Body**:

```json
{
  "description": "Updated description",
  "paymentMethod": "CREDIT_CARD",
  "paymentStatus": "PAID",
  "receipt": "updated-receipt-file"
}
```

**Response**:

```json
{
  "success": true,
  "transaction": {
    "id": "transaction-id",
    "transactionId": "TXN123456",
    "amount": 500,
    "type": "INCOME",
    "description": "Updated description",
    "paymentMethod": "CREDIT_CARD",
    "paymentStatus": "PAID",
    "invoice": "invoice-id",
    "appointment": "appointment-id",
    "patient": "patient-id",
    "doctor": "doctor-id",
    "clinic": "clinic-id",
    "receipt": "updated-receipt-url",
    "receipt_url": "updated-receipt-url",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Delete Transaction

Delete a transaction.

- **URL**: `/transactions/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Transaction ID

**Response**:

```json
{
  "success": true
}
```

### Get Transaction Summary

Get a summary of transactions for a clinic.

- **URL**: `/transactions/summary/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId`: Clinic ID
  - `period` (optional): Period for the summary (day, week, month, year)

**Response**:

```json
{
  "success": true,
  "summary": {
    "period": "month",
    "income": 5000,
    "expense": 2000,
    "refund": 500,
    "net": 2500,
    "paymentMethods": {
      "CASH": 3000,
      "CREDIT_CARD": 1500,
      "UPI": 500
    },
    "transactionCount": 20
  }
}
```

## Billing Endpoints

### Get All Invoices

Get a list of all invoices, with optional filtering.

- **URL**: `/billing/invoices/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `patientId` (optional): Filter by patient ID
  - `status` (optional): Filter by status

**Response**:

```json
{
  "success": true,
  "invoices": [
    {
      "id": "invoice-id",
      "invoiceId": "INV123456",
      "patient": "patient-id",
      "clinic": "clinic-id",
      "appointment": "appointment-id",
      "items": [
        {
          "id": "item-id",
          "description": "Consultation",
          "quantity": 1,
          "unitPrice": 500,
          "amount": 500,
          "type": "CONSULTATION"
        }
      ],
      "subtotal": 500,
      "discount": 0,
      "tax": 50,
      "total": 550,
      "dueDate": "2023-01-15",
      "status": "PAID",
      "notes": "Invoice notes",
      "document": "document-url",
      "document_url": "document-url",
      "patient_details": {
        "patientId": "PAT123456",
        "name": "John Doe",
        "gender": "MALE",
        "age": 33
      },
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Get Invoice by ID

Get a specific invoice by ID.

- **URL**: `/billing/invoices/{id}/`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Invoice ID

**Response**:

```json
{
  "success": true,
  "invoice": {
    "id": "invoice-id",
    "invoiceId": "INV123456",
    "patient": "patient-id",
    "clinic": "clinic-id",
    "appointment": "appointment-id",
    "items": [
      {
        "id": "item-id",
        "description": "Consultation",
        "quantity": 1,
        "unitPrice": 500,
        "amount": 500,
        "type": "CONSULTATION"
      }
    ],
    "subtotal": 500,
    "discount": 0,
    "tax": 50,
    "total": 550,
    "dueDate": "2023-01-15",
    "status": "PAID",
    "notes": "Invoice notes",
    "document": "document-url",
    "document_url": "document-url",
    "patient_details": {
      "patientId": "PAT123456",
      "name": "John Doe",
      "gender": "MALE",
      "age": 33
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Create Invoice

Create a new invoice.

- **URL**: `/billing/invoices/`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "patient": "patient-id",
  "clinic": "clinic-id",
  "appointment": "appointment-id",
  "items": [
    {
      "description": "Consultation",
      "quantity": 1,
      "unitPrice": 500,
      "amount": 500,
      "type": "CONSULTATION"
    }
  ],
  "subtotal": 500,
  "discount": 0,
  "tax": 50,
  "total": 550,
  "dueDate": "2023-01-15",
  "notes": "Invoice notes",
  "document": "document-file"
}
```

**Response**:

```json
{
  "success": true,
  "invoice": {
    "id": "invoice-id",
    "invoiceId": "INV123456",
    "patient": "patient-id",
    "clinic": "clinic-id",
    "appointment": "appointment-id",
    "items": [
      {
        "id": "item-id",
        "description": "Consultation",
        "quantity": 1,
        "unitPrice": 500,
        "amount": 500,
        "type": "CONSULTATION"
      }
    ],
    "subtotal": 500,
    "discount": 0,
    "tax": 50,
    "total": 550,
    "dueDate": "2023-01-15",
    "status": "DRAFT",
    "notes": "Invoice notes",
    "document": "document-url",
    "document_url": "document-url",
    "patient_details": {
      "patientId": "PAT123456",
      "name": "John Doe",
      "gender": "MALE",
      "age": 33
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Update Invoice

Update an invoice.

- **URL**: `/billing/invoices/{id}/`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Invoice ID

**Request Body**:

```json
{
  "items": [
    {
      "id": "item-id",
      "description": "Updated Item",
      "quantity": 2,
      "unitPrice": 300,
      "amount": 600,
      "type": "CONSULTATION"
    }
  ],
  "discount": 50,
  "tax": 55,
  "dueDate": "2023-01-20",
  "status": "SENT",
  "notes": "Updated notes",
  "document": "updated-document-file"
}
```

**Response**:

```json
{
  "success": true,
  "invoice": {
    "id": "invoice-id",
    "invoiceId": "INV123456",
    "patient": "patient-id",
    "clinic": "clinic-id",
    "appointment": "appointment-id",
    "items": [
      {
        "id": "item-id",
        "description": "Updated Item",
        "quantity": 2,
        "unitPrice": 300,
        "amount": 600,
        "type": "CONSULTATION"
      }
    ],
    "subtotal": 600,
    "discount": 50,
    "tax": 55,
    "total": 605,
    "dueDate": "2023-01-20",
    "status": "SENT",
    "notes": "Updated notes",
    "document": "updated-document-url",
    "document_url": "updated-document-url",
    "patient_details": {
      "patientId": "PAT123456",
      "name": "John Doe",
      "gender": "MALE",
      "age": 33
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

### Delete Invoice

Delete an invoice.

- **URL**: `/billing/invoices/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Invoice ID

**Response**:

```json
{
  "success": true
}
```

### Record Payment

Record a payment for an invoice.

- **URL**: `/billing/payment/`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "invoice": "invoice-id",
  "amount": 550,
  "paymentMethod": "CASH",
  "description": "Full payment",
  "patient": "patient-id",
  "clinic": "clinic-id",
  "receipt": "receipt-file"
}
```

**Response**:

```json
{
  "success": true,
  "transaction": {
    "id": "transaction-id",
    "transactionId": "TXN123456",
    "amount": 550,
    "type": "INCOME",
    "description": "Full payment",
    "paymentMethod": "CASH",
    "paymentStatus": "PAID",
    "invoice": "invoice-id",
    "patient": "patient-id",
    "clinic": "clinic-id",
    "receipt": "receipt-url",
    "receipt_url": "receipt-url",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

## Treatment Endpoints

### Get All Treatments

Get a list of all treatments.

- **URL**: `/treatments/`
- **Method**: `GET`
- **Auth Required**: Yes

**Response**:

```json
{
  "success": true,
  "treatments": [
    {
      "id": "treatment-id",
      "name": "X-Ray",
      "description": "X-Ray imaging",
      "cost": 1000,
      "duration": 30,
      "clinic": "clinic-id",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

### Delete Treatment

Delete a treatment.

- **URL**: `/treatments/{id}/`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: Treatment ID

**Response**:

```json
{
  "success": true
}
```

## Admin Dashboard Endpoints

### Get Admin Dashboard Stats

Get statistics for the admin dashboard.

- **URL**: `/admin/stats/`
- **Method**: `GET`
- **Auth Required**: Yes (SUPER_ADMIN or ADMIN)
- **Query Parameters**:
  - `clinicId`: Clinic ID

**Response**:

```json
{
  "success": true,
  "stats": {
    "totalPatients": 100,
    "appointments": 50,
    "doctors": 5,
    "staff": 10
  }
}
```

### Get Admin Doctors

Get doctors for the admin dashboard.

- **URL**: `/admin/doctors/`
- **Method**: `GET`
- **Auth Required**: Yes (SUPER_ADMIN or ADMIN)
- **Query Parameters**:
  - `clinicId`: Clinic ID

**Response**:

```json
{
  "success": true,
  "doctors": [
    {
      "id": "doctor-id",
      "name": "Dr. Smith",
      "specialization": "Cardiology",
      "isAvailable": true,
      "appointmentCount": 20
    }
  ]
}
```

### Get Admin Staff

Get staff for the admin dashboard.

- **URL**: `/admin/staff/`
- **Method**: `GET`
- **Auth Required**: Yes (SUPER_ADMIN or ADMIN)
- **Query Parameters**:
  - `clinicId`: Clinic ID

**Response**:

```json
{
  "success": true,
  "staff": [
    {
      "id": "staff-id",
      "name": "Staff Name",
      "role": "Staff",
      "isAvailable": true
    }
  ]
}
```

### Get Admin Transactions

Get transactions for the admin dashboard.

- **URL**: `/admin/transactions/`
- **Method**: `GET`
- **Auth Required**: Yes (SUPER_ADMIN or ADMIN)
- **Query Parameters**:
  - `clinicId`: Clinic ID

**Response**:

```json
{
  "success": true,
  "transactions": [
    {
      "id": "transaction-id",
      "doctorName": "Dr. Smith",
      "testName": "X-Ray",
      "date": "01-01-2023",
      "amount": 1000
    }
  ]
}
```

### Get Admin Appointments

Get appointments for the admin dashboard.

- **URL**: `/admin/appointments/`
- **Method**: `GET`
- **Auth Required**: Yes (SUPER_ADMIN or ADMIN)
- **Query Parameters**:
  - `clinicId`: Clinic ID

**Response**:

```json
{
  "success": true,
  "appointments": [
    {
      "id": "appointment-id",
      "sNo": 1,
      "name": "John Doe",
      "phoneNumber": "1234567890",
      "email": "john@example.com",
      "age": 33,
      "gender": "MALE",
      "action": "Accept"
    }
  ]
}
```

## Analytics Endpoints

### Get Analytics Data

Get analytics data.

- **URL**: `/analytics/`
- **Method**: `GET`
- **Auth Required**: Yes (SUPER_ADMIN or ADMIN)

**Response**:

```json
{
  "success": true,
  "data": {
    "revenue": {
      "thisMonth": 50000,
      "lastMonth": 45000,
      "growth": 11.11
    },
    "patients": {
      "total": 500,
      "growth": 5.26
    },
    "appointments": {
      "completionRate": 85.5,
      "total": 200
    }
  }
}
```

## Dashboard Endpoints

### Get Dashboard Stats

Get statistics for the dashboard.

- **URL**: `/dashboard/stats/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `doctorId` (optional): Filter by doctor ID

**Response**:

```json
{
  "success": true,
  "stats": {
    "todayAppointments": 10,
    "todayPatients": 8,
    "totalPatients": 500,
    "malePatients": 250,
    "femalePatients": 230,
    "childPatients": 20,
    "availableDoctors": 5,
    "checkIns": 8,
    "appointments": 10
  }
}
```

### Get Recent Appointments

Get recent appointments for the dashboard.

- **URL**: `/dashboard/appointments/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID
  - `doctorId` (optional): Filter by doctor ID

**Response**:

```json
{
  "success": true,
  "appointments": [
    {
      "id": "appointment-id",
      "appointmentId": "APT123456",
      "patient": {
        "patientId": "PAT123456",
        "name": "John Doe",
        "phone": "1234567890",
        "gender": "MALE",
        "age": 33
      },
      "doctor": {
        "name": "Dr. Smith",
        "specialization": "Cardiology"
      },
      "appointmentDate": "2023-01-01T09:00:00Z",
      "status": "SCHEDULED",
      "concern": "Routine checkup"
    }
  ]
}
```

### Get Doctors Activity

Get doctors activity for the dashboard.

- **URL**: `/dashboard/doctors-activity/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID

**Response**:

```json
{
  "success": true,
  "doctorsActivity": [
    {
      "id": "doctor-id",
      "name": "Dr. Smith",
      "specialization": "Cardiology",
      "isAvailable": true,
      "appointments": {
        "inProgress": 2,
        "completed": 5,
        "pending": 3,
        "total": 10
      }
    }
  ]
}
```

### Get Recent Reports

Get recent reports for the dashboard.

- **URL**: `/dashboard/reports/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `clinicId` (optional): Filter by clinic ID

**Response**:

```json
{
  "success": true,
  "reports": [
    {
      "id": "report-id",
      "title": "Blood Test Report",
      "type": "Blood Test",
      "generatedDate": "2023-01-01T00:00:00Z",
      "size": "1.2 MB",
      "format": "PDF"
    }
  ]
}
```

## Data Types and Enums

### User Roles

```typescript
enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  DOCTOR = "DOCTOR"
}
```

### Gender

```typescript
enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}
```

### Blood Group

```typescript
enum BloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-"
}
```

### Appointment Status

```typescript
enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  CHECKED_IN = "CHECKED_IN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
  RESCHEDULED = "RESCHEDULED"
}
```

### Appointment Type

```typescript
enum AppointmentType {
  REGULAR = "REGULAR",
  EMERGENCY = "EMERGENCY",
  FOLLOW_UP = "FOLLOW_UP",
  CONSULTATION = "CONSULTATION",
  PROCEDURE = "PROCEDURE",
  CHECKUP = "CHECKUP",
  VACCINATION = "VACCINATION",
  LABORATORY = "LABORATORY"
}
```

### Medicine Type

```typescript
enum MedicineType {
  TABLET = "TABLET",
  CAPSULE = "CAPSULE",
  SYRUP = "SYRUP",
  INJECTION = "INJECTION",
  CREAM = "CREAM",
  OINTMENT = "OINTMENT",
  DROPS = "DROPS",
  INHALER = "INHALER",
  POWDER = "POWDER",
  LOTION = "LOTION"
}
```

### Bed Status

```typescript
enum BedStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  RESERVED = "RESERVED",
  MAINTENANCE = "MAINTENANCE"
}
```

### Room Type

```typescript
enum RoomType {
  GENERAL = "GENERAL",
  PRIVATE = "PRIVATE",
  SEMI_PRIVATE = "SEMI_PRIVATE",
  ICU = "ICU",
  EMERGENCY = "EMERGENCY",
  OPERATION_THEATER = "OPERATION_THEATER",
  LABOR = "LABOR",
  NURSERY = "NURSERY"
}
```

### Transaction Type

```typescript
enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  REFUND = "REFUND"
}
```

### Payment Method

```typescript
enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  UPI = "UPI",
  BANK_TRANSFER = "BANK_TRANSFER",
  CHEQUE = "CHEQUE",
  INSURANCE = "INSURANCE"
}
```

### Payment Status

```typescript
enum PaymentStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  PARTIALLY_PAID = "PARTIALLY_PAID"
}
```

### Invoice Status

```typescript
enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
  PARTIALLY_PAID = "PARTIALLY_PAID"
}
```

### Invoice Item Type

```typescript
enum InvoiceItemType {
  CONSULTATION = "CONSULTATION",
  MEDICINE = "MEDICINE",
  TREATMENT = "TREATMENT",
  PROCEDURE = "PROCEDURE",
  LABORATORY = "LABORATORY",
  ROOM_CHARGE = "ROOM_CHARGE",
  OTHER = "OTHER"
}
```

### Document Type

```typescript
enum DocumentType {
  REPORT = "REPORT",
  PRESCRIPTION = "PRESCRIPTION",
  INVOICE = "INVOICE",
  RECEIPT = "RECEIPT",
  CONSENT_FORM = "CONSENT_FORM",
  MEDICAL_RECORD = "MEDICAL_RECORD",
  INSURANCE = "INSURANCE",
  OTHER = "OTHER"
}
```