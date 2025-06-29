import { v4 as uuidv4 } from 'uuid';

// Base model interface with common fields
export interface BaseModel {
  id: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Patient model
export interface Patient extends BaseModel {
  patientId: string; // Unique patient identifier (e.g., PAT123456)
  firstName: string;
  lastName: string;
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
  allergies?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    expiryDate: string; // ISO string
  };
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this patient
  documents: Document[]; // Medical records, reports, etc.
  isActive: boolean;
}

// Appointment model
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
}

// Prescription model
export interface Prescription extends BaseModel {
  prescriptionId: string; // Unique prescription identifier (e.g., PRE123456)
  patientId: string; // Reference to Patient
  doctorId: string; // Reference to Doctor
  clinicId: string; // Reference to Clinic
  appointmentId: string; // Reference to Appointment
  diagnosis: string;
  notes?: string;
  medications: Medication[];
  instructions?: string;
  followUpDate?: string; // ISO string
  isActive: boolean;
  documentUrl?: string; // URL to the prescription document in S3
}

// Medication model (for prescriptions)
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

// Medicine model (inventory)
export interface Medicine extends BaseModel {
  medicineId: string; // Unique medicine identifier (e.g., MED123456)
  name: string;
  manufacturer: string;
  batchNumber: string;
  type: MedicineType;
  dosage: string;
  manufacturedDate: string; // ISO string
  expiryDate: string; // ISO string
  price: number;
  stock: number;
  reorderLevel: number;
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this medicine
  isActive: boolean;
}

// Bed model
export interface Bed extends BaseModel {
  bedId: string; // Unique bed identifier (e.g., BED123456)
  bedNumber: number;
  roomId: string; // Reference to Room
  status: BedStatus;
  patientId?: string; // Reference to Patient (optional)
  admissionDate?: string; // ISO string
  dischargeDate?: string; // ISO string
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this bed
  notes?: string;
}

// Room model
export interface Room extends BaseModel {
  roomId: string; // Unique room identifier (e.g., ROOM123456)
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  totalBeds: number;
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this room
  isActive: boolean;
}

// Transaction model
export interface Transaction extends BaseModel {
  transactionId: string; // Unique transaction identifier (e.g., TXN123456)
  amount: number;
  type: TransactionType;
  description: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  invoiceId?: string; // Reference to Invoice
  appointmentId?: string; // Reference to Appointment (optional)
  patientId?: string; // Reference to Patient (optional)
  doctorId?: string; // Reference to Doctor (optional)
  clinicId: string; // Reference to Clinic
  createdById: string; // Reference to User who created this transaction
  receiptUrl?: string; // URL to the receipt document in S3
}

// Invoice model
export interface Invoice extends BaseModel {
  invoiceId: string; // Unique invoice identifier (e.g., INV123456)
  patientId: string; // Reference to Patient
  clinicId: string; // Reference to Clinic
  appointmentId?: string; // Reference to Appointment (optional)
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  dueDate: string; // ISO string
  status: InvoiceStatus;
  notes?: string;
  createdById: string; // Reference to User who created this invoice
  documentUrl?: string; // URL to the invoice document in S3
}

// Invoice item model
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  type: InvoiceItemType;
  medicineId?: string; // Reference to Medicine (optional)
  treatmentId?: string; // Reference to Treatment (optional)
}

// Document model (for patient records, reports, etc.)
export interface Document extends BaseModel {
  documentId: string; // Unique document identifier (e.g., DOC123456)
  name: string;
  type: DocumentType;
  url: string; // URL to the document in S3
  size: number; // In bytes
  patientId: string; // Reference to Patient
  appointmentId?: string; // Reference to Appointment (optional)
  uploadedById: string; // Reference to User who uploaded this document
  clinicId: string; // Reference to Clinic
  tags?: string[];
  notes?: string;
}

// Enums
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

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

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  CHECKED_IN = "CHECKED_IN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
  RESCHEDULED = "RESCHEDULED"
}

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

export enum MedicineType {
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

export enum BedStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  RESERVED = "RESERVED",
  MAINTENANCE = "MAINTENANCE"
}

export enum RoomType {
  GENERAL = "GENERAL",
  PRIVATE = "PRIVATE",
  SEMI_PRIVATE = "SEMI_PRIVATE",
  ICU = "ICU",
  EMERGENCY = "EMERGENCY",
  OPERATION_THEATER = "OPERATION_THEATER",
  LABOR = "LABOR",
  NURSERY = "NURSERY"
}

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  REFUND = "REFUND"
}

export enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  UPI = "UPI",
  BANK_TRANSFER = "BANK_TRANSFER",
  CHEQUE = "CHEQUE",
  INSURANCE = "INSURANCE"
}

export enum PaymentStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  PARTIALLY_PAID = "PARTIALLY_PAID"
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
  PARTIALLY_PAID = "PARTIALLY_PAID"
}

export enum InvoiceItemType {
  CONSULTATION = "CONSULTATION",
  MEDICINE = "MEDICINE",
  TREATMENT = "TREATMENT",
  PROCEDURE = "PROCEDURE",
  LABORATORY = "LABORATORY",
  ROOM_CHARGE = "ROOM_CHARGE",
  OTHER = "OTHER"
}

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

// Helper functions for creating new model instances
export function createPatient(data: Partial<Patient>): Patient {
  const now = new Date().toISOString();
  const patientId = `PAT${Math.floor(100000 + Math.random() * 900000)}`;
  
  return {
    id: uuidv4(),
    patientId,
    firstName: '',
    lastName: '',
    phone: '',
    gender: Gender.MALE,
    dateOfBirth: '',
    age: 0,
    clinicId: '',
    createdById: '',
    documents: [],
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...data
  };
}

export function createAppointment(data: Partial<Appointment>): Appointment {
  const now = new Date().toISOString();
  const appointmentId = `APT${Math.floor(100000 + Math.random() * 900000)}`;
  
  return {
    id: uuidv4(),
    appointmentId,
    patientId: '',
    doctorId: '',
    clinicId: '',
    appointmentDate: now,
    startTime: '',
    endTime: '',
    duration: 30,
    type: AppointmentType.REGULAR,
    status: AppointmentStatus.SCHEDULED,
    concern: '',
    createdById: '',
    isFollowUp: false,
    createdAt: now,
    updatedAt: now,
    ...data
  };
}

export function createPrescription(data: Partial<Prescription>): Prescription {
  const now = new Date().toISOString();
  const prescriptionId = `PRE${Math.floor(100000 + Math.random() * 900000)}`;
  
  return {
    id: uuidv4(),
    prescriptionId,
    patientId: '',
    doctorId: '',
    clinicId: '',
    appointmentId: '',
    diagnosis: '',
    medications: [],
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...data
  };
}

export function createMedicine(data: Partial<Medicine>): Medicine {
  const now = new Date().toISOString();
  const medicineId = `MED${Math.floor(100000 + Math.random() * 900000)}`;
  
  return {
    id: uuidv4(),
    medicineId,
    name: '',
    manufacturer: '',
    batchNumber: '',
    type: MedicineType.TABLET,
    dosage: '',
    manufacturedDate: '',
    expiryDate: '',
    price: 0,
    stock: 0,
    reorderLevel: 10,
    clinicId: '',
    createdById: '',
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...data
  };
}

export function createBed(data: Partial<Bed>): Bed {
  const now = new Date().toISOString();
  const bedId = `BED${Math.floor(100000 + Math.random() * 900000)}`;
  
  return {
    id: uuidv4(),
    bedId,
    bedNumber: 0,
    roomId: '',
    status: BedStatus.AVAILABLE,
    clinicId: '',
    createdById: '',
    createdAt: now,
    updatedAt: now,
    ...data
  };
}

export function createRoom(data: Partial<Room>): Room {
  const now = new Date().toISOString();
  const roomId = `ROOM${Math.floor(100000 + Math.random() * 900000)}`;
  
  return {
    id: uuidv4(),
    roomId,
    roomNumber: '',
    roomType: RoomType.GENERAL,
    floor: 1,
    totalBeds: 0,
    clinicId: '',
    createdById: '',
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...data
  };
}

export function createTransaction(data: Partial<Transaction>): Transaction {
  const now = new Date().toISOString();
  const transactionId = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
  
  return {
    id: uuidv4(),
    transactionId,
    amount: 0,
    type: TransactionType.INCOME,
    description: '',
    paymentMethod: PaymentMethod.CASH,
    paymentStatus: PaymentStatus.PAID,
    clinicId: '',
    createdById: '',
    createdAt: now,
    updatedAt: now,
    ...data
  };
}

export function createInvoice(data: Partial<Invoice>): Invoice {
  const now = new Date().toISOString();
  const invoiceId = `INV${Math.floor(100000 + Math.random() * 900000)}`;
  
  return {
    id: uuidv4(),
    invoiceId,
    patientId: '',
    clinicId: '',
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    dueDate: '',
    status: InvoiceStatus.DRAFT,
    createdById: '',
    createdAt: now,
    updatedAt: now,
    ...data
  };
}

export function createDocument(data: Partial<Document>): Document {
  const now = new Date().toISOString();
  const documentId = `DOC${Math.floor(100000 + Math.random() * 900000)}`;
  
  return {
    id: uuidv4(),
    documentId,
    name: '',
    type: DocumentType.OTHER,
    url: '',
    size: 0,
    patientId: '',
    uploadedById: '',
    clinicId: '',
    createdAt: now,
    updatedAt: now,
    ...data
  };
}