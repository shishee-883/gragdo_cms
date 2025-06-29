"use server";

import { clinicsApi } from '@/lib/services/api';

export async function createClinic(data: {
  name: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
  createdById: string;
}) {
  try {
    const response = await clinicsApi.createClinic({
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      description: data.description
    });
    
    if (response.success) {
      return { success: true, clinic: response.clinic };
    } else {
      return { success: false, error: response.error || 'Failed to create clinic' };
    }
  } catch (error) {
    console.error('Error creating clinic:', error);
    return { success: false, error: 'Failed to create clinic' };
  }
}

export async function updateClinic(id: string, data: {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}) {
  try {
    const response = await clinicsApi.updateClinic(id, data);
    
    if (response.success) {
      return { success: true, clinic: response.clinic };
    } else {
      return { success: false, error: response.error || 'Failed to update clinic' };
    }
  } catch (error) {
    console.error('Error updating clinic:', error);
    return { success: false, error: 'Failed to update clinic' };
  }
}

export async function deleteClinic(id: string) {
  try {
    const response = await clinicsApi.deleteClinic(id);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete clinic' };
    }
  } catch (error) {
    console.error('Error deleting clinic:', error);
    return { success: false, error: 'Failed to delete clinic' };
  }
}

export async function getClinics() {
  try {
    const response = await clinicsApi.getClinics();
    
    if (response.success) {
      return response.clinics;
    } else {
      console.error('Error fetching clinics:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching clinics:', error);
    return [];
  }
}

export async function getClinicById(id: string) {
  try {
    const response = await clinicsApi.getClinic(id);
    
    if (response.success) {
      return response.clinic;
    } else {
      console.error('Error fetching clinic:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching clinic:', error);
    return null;
  }
}