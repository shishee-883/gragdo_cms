import db from './sqlite';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read JSON data files
const dataDir = join(process.cwd(), 'data');

const users = JSON.parse(readFileSync(join(dataDir, 'users.json'), 'utf8'));
const clinics = JSON.parse(readFileSync(join(dataDir, 'clinics.json'), 'utf8'));
const doctors = JSON.parse(readFileSync(join(dataDir, 'doctors.json'), 'utf8'));
const patients = JSON.parse(readFileSync(join(dataDir, 'patients.json'), 'utf8'));
const rooms = JSON.parse(readFileSync(join(dataDir, 'rooms.json'), 'utf8'));
const beds = JSON.parse(readFileSync(join(dataDir, 'beds.json'), 'utf8'));
const appointments = JSON.parse(readFileSync(join(dataDir, 'appointments.json'), 'utf8'));
const medicines = JSON.parse(readFileSync(join(dataDir, 'medicines.json'), 'utf8'));
const treatments = JSON.parse(readFileSync(join(dataDir, 'treatments.json'), 'utf8'));
const prescriptions = JSON.parse(readFileSync(join(dataDir, 'prescriptions.json'), 'utf8'));
const transactions = JSON.parse(readFileSync(join(dataDir, 'transactions.json'), 'utf8'));

export function initializeDatabase() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      clinic_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS clinics (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      specialization TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      clinic_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clinic_id) REFERENCES clinics (id)
    );

    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT,
      clinic_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clinic_id) REFERENCES clinics (id)
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      clinic_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clinic_id) REFERENCES clinics (id)
    );

    CREATE TABLE IF NOT EXISTS beds (
      id TEXT PRIMARY KEY,
      number TEXT NOT NULL,
      room_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms (id)
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      doctor_id TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id),
      FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    );

    CREATE TABLE IF NOT EXISTS medicines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      clinic_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clinic_id) REFERENCES clinics (id)
    );

    CREATE TABLE IF NOT EXISTS treatments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      clinic_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (clinic_id) REFERENCES clinics (id)
    );

    CREATE TABLE IF NOT EXISTS prescriptions (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      doctor_id TEXT NOT NULL,
      medicines TEXT NOT NULL,
      instructions TEXT,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id),
      FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id)
    );
  `);

  // Insert seed data
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password, role, name, phone, clinic_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertClinic = db.prepare(`
    INSERT OR REPLACE INTO clinics (id, name, address, phone, email)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertDoctor = db.prepare(`
    INSERT OR REPLACE INTO doctors (id, name, specialization, phone, email, clinic_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertPatient = db.prepare(`
    INSERT OR REPLACE INTO patients (id, name, age, gender, phone, email, address, clinic_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertRoom = db.prepare(`
    INSERT OR REPLACE INTO rooms (id, name, type, clinic_id)
    VALUES (?, ?, ?, ?)
  `);

  const insertBed = db.prepare(`
    INSERT OR REPLACE INTO beds (id, number, room_id, status)
    VALUES (?, ?, ?, ?)
  `);

  const insertAppointment = db.prepare(`
    INSERT OR REPLACE INTO appointments (id, patient_id, doctor_id, date, time, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMedicine = db.prepare(`
    INSERT OR REPLACE INTO medicines (id, name, description, price, stock, clinic_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertTreatment = db.prepare(`
    INSERT OR REPLACE INTO treatments (id, name, description, price, clinic_id)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertPrescription = db.prepare(`
    INSERT OR REPLACE INTO prescriptions (id, patient_id, doctor_id, medicines, instructions, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertTransaction = db.prepare(`
    INSERT OR REPLACE INTO transactions (id, patient_id, amount, type, description, date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // Insert all data
  users.forEach((user: any) => {
    insertUser.run(user.id, user.email, user.password, user.role, user.name, user.phone, user.clinic_id);
  });

  clinics.forEach((clinic: any) => {
    insertClinic.run(clinic.id, clinic.name, clinic.address, clinic.phone, clinic.email);
  });

  doctors.forEach((doctor: any) => {
    insertDoctor.run(doctor.id, doctor.name, doctor.specialization, doctor.phone, doctor.email, doctor.clinic_id);
  });

  patients.forEach((patient: any) => {
    insertPatient.run(patient.id, patient.name, patient.age, patient.gender, patient.phone, patient.email, patient.address, patient.clinic_id);
  });

  rooms.forEach((room: any) => {
    insertRoom.run(room.id, room.name, room.type, room.clinic_id);
  });

  beds.forEach((bed: any) => {
    insertBed.run(bed.id, bed.number, bed.room_id, bed.status);
  });

  appointments.forEach((appointment: any) => {
    insertAppointment.run(appointment.id, appointment.patient_id, appointment.doctor_id, appointment.date, appointment.time, appointment.status, appointment.notes);
  });

  medicines.forEach((medicine: any) => {
    insertMedicine.run(medicine.id, medicine.name, medicine.description, medicine.price, medicine.stock, medicine.clinic_id);
  });

  treatments.forEach((treatment: any) => {
    insertTreatment.run(treatment.id, treatment.name, treatment.description, treatment.price, treatment.clinic_id);
  });

  prescriptions.forEach((prescription: any) => {
    insertPrescription.run(prescription.id, prescription.patient_id, prescription.doctor_id, JSON.stringify(prescription.medicines), prescription.instructions, prescription.date);
  });

  transactions.forEach((transaction: any) => {
    insertTransaction.run(transaction.id, transaction.patient_id, transaction.amount, transaction.type, transaction.description, transaction.date, transaction.status);
  });

  console.log('Database seeded successfully!');
}