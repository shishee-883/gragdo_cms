"use server";

import { treatmentsApi } from '@/lib/services/api';

export async function getTreatments() {
  try {
    const response = await treatmentsApi.getTreatments();
    
    if (response.success) {
      return response.treatments;
    } else {
      console.error('Error fetching treatments:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return [];
  }
}

export async function getTreatmentById(id: string) {
  try {
    const response = await treatmentsApi.getTreatment(id);
    
    if (response.success) {
      return response.treatment;
    } else {
      console.error('Error fetching treatment:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching treatment:', error);
    return null;
  }
}

export async function createTreatment(data: {
  name: string;
  description?: string;
  cost: number;
  duration?: number;
  clinicId: string;
}) {
  try {
    const response = await treatmentsApi.createTreatment(data);
    
    if (response.success) {
      return { success: true, treatment: response.treatment };
    } else {
      return { success: false, error: response.error || 'Failed to create treatment' };
    }
  } catch (error) {
    console.error('Error creating treatment:', error);
    return { success: false, error: 'Failed to create treatment' };
  }
}

export async function updateTreatment(id: string, data: {
  name?: string;
  description?: string;
  cost?: number;
  duration?: number;
}) {
  try {
    const response = await treatmentsApi.updateTreatment(id, data);
    
    if (response.success) {
      return { success: true, treatment: response.treatment };
    } else {
      return { success: false, error: response.error || 'Failed to update treatment' };
    }
  } catch (error) {
    console.error('Error updating treatment:', error);
    return { success: false, error: 'Failed to update treatment' };
  }
}

export async function deleteTreatment(id: string) {
  try {
    const response = await treatmentsApi.deleteTreatment(id);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete treatment' };
    }
  } catch (error) {
    console.error('Error deleting treatment:', error);
    return { success: false, error: 'Failed to delete treatment' };
  }
}