"use server";

import { patientsApi } from '@/lib/services/api';
import { Gender, Patient } from "@/lib/types";
import { Document, DocumentType } from "@/lib/models";

export async function createPatientRecord(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  bloodGroup?: string;
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
  clinicId: string;
  createdById: string;
  documents?: {
    name: string;
    type: string;
    file: Buffer;
    contentType: string;
  }[];
}) {
  try {
    const response = await patientsApi.createPatient(data);
    
    if (response.success) {
      return { success: true, patient: response.patient };
    } else {
      return { success: false, error: response.error || 'Failed to create patient' };
    }
  } catch (error) {
    console.error('Error creating patient:', error);
    return { success: false, error: 'Failed to create patient' };
  }
}

export async function updatePatientRecord(id: string, data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: string;
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
  isActive?: boolean;
  documents?: {
    name: string;
    type: string;
    file: Buffer;
    contentType: string;
  }[];
}) {
  try {
    const response = await patientsApi.updatePatient(id, data);
    
    if (response.success) {
      return { success: true, patient: response.patient };
    } else {
      return { success: false, error: response.error || 'Failed to update patient' };
    }
  } catch (error) {
    console.error('Error updating patient:', error);
    return { success: false, error: 'Failed to update patient' };
  }
}

export async function deletePatientRecord(id: string) {
  try {
    const response = await patientsApi.deletePatient(id);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete patient' };
    }
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: 'Failed to delete patient' };
  }
}

export async function getPatients(clinicId?: string) {
  try {
    const response = await patientsApi.getPatients(clinicId);
    
    if (response.success) {
      return response.patients;
    } else {
      console.error('Error fetching patients:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
}

export async function getPatientById(id: string) {
  try {
    const response = await patientsApi.getPatient(id);
    
    if (response.success) {
      return response.patient;
    } else {
      console.error('Error fetching patient:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching patient:', error);
    return null;
  }
}