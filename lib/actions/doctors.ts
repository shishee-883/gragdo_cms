"use server";

import { doctorsApi } from '@/lib/services/api';
import { Doctor } from "@/lib/types";

export async function createDoctor(data: {
  name: string;
  email?: string;
  phone: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  clinicId: string;
  createdById: string;
}) {
  try {
    const response = await doctorsApi.createDoctor(data);
    
    if (response.success) {
      return { success: true, doctor: response.doctor };
    } else {
      return { success: false, error: response.error || 'Failed to create doctor' };
    }
  } catch (error) {
    console.error('Error creating doctor:', error);
    return { success: false, error: 'Failed to create doctor' };
  }
}

export async function updateDoctor(id: string, data: {
  name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  isAvailable?: boolean;
}) {
  try {
    const response = await doctorsApi.updateDoctor(id, data);
    
    if (response.success) {
      return { success: true, doctor: response.doctor };
    } else {
      return { success: false, error: response.error || 'Failed to update doctor' };
    }
  } catch (error) {
    console.error('Error updating doctor:', error);
    return { success: false, error: 'Failed to update doctor' };
  }
}

export async function deleteDoctor(id: string) {
  try {
    const response = await doctorsApi.deleteDoctor(id);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete doctor' };
    }
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return { success: false, error: 'Failed to delete doctor' };
  }
}

export async function getDoctors(clinicId?: string) {
  try {
    const response = await doctorsApi.getDoctors(clinicId);
    
    if (response.success) {
      return response.doctors;
    } else {
      console.error('Error fetching doctors:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export async function getDoctorById(id: string) {
  try {
    const response = await doctorsApi.getDoctor(id);
    
    if (response.success) {
      return response.doctor;
    } else {
      console.error('Error fetching doctor:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return null;
  }
}