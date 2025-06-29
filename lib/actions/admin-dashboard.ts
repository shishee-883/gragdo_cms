'use server'

import { adminApi } from '@/lib/services/api';

export async function getAdminDashboardStats(clinicId: string) {
  try {
    const response = await adminApi.getStats(clinicId);
    
    if (response.success) {
      return response.stats;
    } else {
      console.error('Error fetching admin dashboard stats:', response.error);
      return {
        totalPatients: 0,
        appointments: 0,
        doctors: 0,
        staff: 0
      };
    }
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return {
      totalPatients: 0,
      appointments: 0,
      doctors: 0,
      staff: 0
    };
  }
}

export async function getAdminDoctors(clinicId: string) {
  try {
    const response = await adminApi.getDoctors(clinicId);
    
    if (response.success) {
      return response.doctors;
    } else {
      console.error('Error fetching admin doctors:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching admin doctors:', error);
    return [];
  }
}

export async function getAdminStaff(clinicId: string) {
  try {
    const response = await adminApi.getStaff(clinicId);
    
    if (response.success) {
      return response.staff;
    } else {
      console.error('Error fetching admin staff:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching admin staff:', error);
    return [];
  }
}

export async function getAdminTransactions(clinicId: string) {
  try {
    const response = await adminApi.getTransactions(clinicId);
    
    if (response.success) {
      return response.transactions;
    } else {
      console.error('Error fetching admin transactions:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching admin transactions:', error);
    return [];
  }
}

export async function getAdminAppointments(clinicId: string) {
  try {
    const response = await adminApi.getAppointments(clinicId);
    
    if (response.success) {
      return response.appointments;
    } else {
      console.error('Error fetching admin appointments:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching admin appointments:', error);
    return [];
  }
}