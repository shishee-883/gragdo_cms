'use server'

import { dashboardApi } from '@/lib/services/api';

export async function getDashboardStats(clinicId?: string, doctorId?: string) {
  try {
    const response = await dashboardApi.getStats(clinicId, doctorId);
    
    if (response.success) {
      return response.stats;
    } else {
      console.error('Error fetching dashboard stats:', response.error);
      return {
        todayAppointments: 0,
        todayPatients: 0,
        totalPatients: 0,
        malePatients: 0,
        femalePatients: 0,
        childPatients: 0,
        availableDoctors: 0,
        checkIns: 0,
        appointments: 0
      };
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      todayAppointments: 0,
      todayPatients: 0,
      totalPatients: 0,
      malePatients: 0,
      femalePatients: 0,
      childPatients: 0,
      availableDoctors: 0,
      checkIns: 0,
      appointments: 0
    };
  }
}

export async function getRecentAppointments(clinicId?: string, doctorId?: string) {
  try {
    const response = await dashboardApi.getRecentAppointments(clinicId, doctorId);
    
    if (response.success) {
      return response.appointments;
    } else {
      console.error('Error fetching recent appointments:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    return [];
  }
}

export async function getDoctorsActivity(clinicId?: string) {
  try {
    const response = await dashboardApi.getDoctorsActivity(clinicId);
    
    if (response.success) {
      return response.doctorsActivity;
    } else {
      console.error('Error fetching doctors activity:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching doctors activity:', error);
    return [];
  }
}

export async function getRecentReports(clinicId?: string) {
  try {
    const response = await dashboardApi.getRecentReports(clinicId);
    
    if (response.success) {
      return response.reports;
    } else {
      console.error('Error fetching recent reports:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching recent reports:', error);
    return [];
  }
}