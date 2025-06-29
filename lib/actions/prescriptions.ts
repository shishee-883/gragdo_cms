'use server'

import { prescriptionsApi } from '@/lib/services/api';

export async function createPrescriptionRecord(data: {
  patientId: string;
  doctorId: string;
  clinicId: string;
  appointmentId: string;
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    medicineId?: string;
    quantity: number;
  }[];
  instructions?: string;
  followUpDate?: string;
  document?: {
    file: Buffer;
    contentType: string;
  };
  createdById: string;
}) {
  try {
    const response = await prescriptionsApi.createPrescription(data);
    
    if (response.success) {
      return { success: true, prescription: response.prescription };
    } else {
      return { success: false, error: response.error || 'Failed to create prescription' };
    }
  } catch (error) {
    console.error('Error creating prescription:', error);
    return { success: false, error: 'Failed to create prescription' };
  }
}

export async function updatePrescriptionRecord(id: string, data: {
  diagnosis?: string;
  medications?: {
    id?: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    medicineId?: string;
    quantity: number;
  }[];
  instructions?: string;
  followUpDate?: string;
  isActive?: boolean;
  document?: {
    file: Buffer;
    contentType: string;
  };
}) {
  try {
    const response = await prescriptionsApi.updatePrescription(id, data);
    
    if (response.success) {
      return { success: true, prescription: response.prescription };
    } else {
      return { success: false, error: response.error || 'Failed to update prescription' };
    }
  } catch (error) {
    console.error('Error updating prescription:', error);
    return { success: false, error: 'Failed to update prescription' };
  }
}

export async function deletePrescriptionRecord(id: string) {
  try {
    const response = await prescriptionsApi.deletePrescription(id);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete prescription' };
    }
  } catch (error) {
    console.error('Error deleting prescription:', error);
    return { success: false, error: 'Failed to delete prescription' };
  }
}

export async function getPrescriptions(clinicId?: string, doctorId?: string, patientId?: string) {
  try {
    const response = await prescriptionsApi.getPrescriptions({
      clinicId,
      doctorId,
      patientId
    });
    
    if (response.success) {
      return response.prescriptions;
    } else {
      console.error('Error fetching prescriptions:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return [];
  }
}

export async function getPrescriptionById(id: string) {
  try {
    const response = await prescriptionsApi.getPrescription(id);
    
    if (response.success) {
      return response.prescription;
    } else {
      console.error('Error fetching prescription:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching prescription:', error);
    return null;
  }
}