// Define the appointment status enum
export enum AppointmentStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  CHECKED_IN = "CHECKED_IN",
  NO_SHOW = "NO_SHOW",
  RESCHEDULED = "RESCHEDULED"
}

// Define the appointment type enum
export enum AppointmentType {
  REGULAR = "REGULAR",
  EMERGENCY = "EMERGENCY",
  FOLLOW_UP = "FOLLOW_UP",
  CONSULTATION = "CONSULTATION",
  PROCEDURE = "PROCEDURE",
  CHECKUP = "CHECKUP",
  VACCINATION = "VACCINATION",
  LABORATORY = "LABORATORY"
}

// Define the gender enum
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

// Define the user roles
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  DOCTOR = "DOCTOR"
}

// Define the blood group enum
export enum BloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-"
}

// Define the document type enum
export enum DocumentType {
  REPORT = "REPORT",
  PRESCRIPTION = "PRESCRIPTION",
  INVOICE = "INVOICE",
  RECEIPT = "RECEIPT",
  CONSENT_FORM = "CONSENT_FORM",
  MEDICAL_RECORD = "MEDICAL_RECORD",
  INSURANCE = "INSURANCE",
  OTHER = "OTHER"
}

// Define the base model interface with common fields
interface BaseModel {
  id: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Define the user interface
export interface User extends BaseModel {
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  phone?: string;
  role: UserRole;
  clinicId?: string; // Required for ADMIN, STAFF, DOCTOR roles
  clinicIds?: string[]; // Array of clinic IDs for SUPER_ADMIN role
  isActive: boolean;
}

// Define the clinic interface
export interface Clinic extends BaseModel {
  name: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
  // Relationships
  admins?: User[]; // ADMIN users associated with this clinic
  doctors?: Doctor[]; // Doctors associated with this clinic
  staff?: User[]; // STAFF users associated with this clinic
  patients?: Patient[]; // Patients associated with this clinic
}

// Define the doctor interface
export interface Doctor extends BaseModel {
  userId: string; // Reference to User with role DOCTOR
  name: string;
  email?: string;
  phone: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  isAvailable: boolean;
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this doctor
  // Relationships
  user?: User; // The user account associated with this doctor
  clinic?: Clinic; // The clinic this doctor belongs to
  appointments?: Appointment[]; // Appointments assigned to this doctor
  patients?: Patient[]; // Patients this doctor has treated
}

// Define the patient interface
export interface Patient extends BaseModel {
  patientId: string; // Unique patient identifier (e.g., PAT123456)
  firstName: string;
  lastName: string;
  name?: string; // Computed from firstName and lastName
  email?: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string; // ISO string
  age: number;
  bloodGroup?: BloodGroup;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  medicalHistory?: string;
  allergies?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this patient
  isActive: boolean;
  // Relationships
  clinic?: Clinic; // The clinic this patient belongs to
  appointments?: Appointment[]; // Appointments for this patient
  prescriptions?: Prescription[]; // Prescriptions for this patient
}

// Define the appointment interface
export interface Appointment extends BaseModel {
  appointmentId: string; // Unique appointment identifier (e.g., APT123456)
  patientId: string; // Reference to Patient
  doctorId: string; // Reference to Doctor
  clinicId: string; // Reference to Clinic
  appointmentDate: string; // ISO string
  startTime: string; // 24-hour format (HH:MM)
  endTime: string; // 24-hour format (HH:MM)
  duration: number; // In minutes
  type: AppointmentType;
  status: AppointmentStatus;
  concern: string;
  notes?: string;
  vitals?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
  };
  createdById: string; // Reference to User who created this appointment
  cancelledAt?: string; // ISO string
  cancelledById?: string; // Reference to User who cancelled this appointment
  cancelReason?: string;
  followUpDate?: string; // ISO string
  isFollowUp: boolean;
  previousAppointmentId?: string; // Reference to previous Appointment
  // Relationships
  patient?: Patient; // The patient for this appointment
  doctor?: Doctor; // The doctor for this appointment
  clinic?: Clinic; // The clinic where this appointment takes place
  createdBy?: User; // The user who created this appointment
}

// Define the prescription interface
export interface Prescription extends BaseModel {
  prescriptionId: string; // Unique prescription identifier (e.g., PRE123456)
  patientId: string; // Reference to Patient
  doctorId: string; // Reference to Doctor
  clinicId: string; // Reference to Clinic
  appointmentId: string; // Reference to Appointment
  diagnosis: string;
  medications: string | Medication[];
  instructions?: string;
  followUpDate?: string; // ISO string
  isActive: boolean;
  documentUrl?: string; // URL to the prescription document
  // Relationships
  patient?: Patient; // The patient for this prescription
  doctor?: Doctor; // The doctor who wrote this prescription
  clinic?: Clinic; // The clinic where this prescription was written
}

// Define the medication interface
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  medicineId?: string; // Reference to Medicine in inventory
  quantity: number;
}

// Define the enhanced prescription interface for client-side use
export interface EnhancedPrescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  concern: string;
  gender: string;
  age: number;
  reports: {
    id: string;
    name: string;
    type: string;
    url: string;
    size?: string;
  }[];
  prescriptions: {
    id: string;
    name: string;
    type: string;
    url: string;
    size?: string;
  }[];
  createdAt: Date;
}