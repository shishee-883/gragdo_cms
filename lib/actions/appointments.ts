"use server";

import { appointmentsApi } from '@/lib/services/api';
import { AppointmentStatus, AppointmentType } from "@/lib/types";

export async function createAppointmentRecord(data: {
  patientId: string;
  doctorId: string;
  clinicId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: AppointmentType;
  concern: string;
  notes?: string;
  isFollowUp: boolean;
  previousAppointmentId?: string;
  createdById: string;
}) {
  try {
    const response = await appointmentsApi.createAppointment(data);
    
    if (response.success) {
      return { success: true, appointment: response.appointment };
    } else {
      return { success: false, error: response.error || 'Failed to create appointment' };
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false, error: 'Failed to create appointment' };
  }
}

export async function updateAppointmentRecord(id: string, data: {
  appointmentDate?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  type?: AppointmentType;
  concern?: string;
  notes?: string;
  status?: AppointmentStatus;
  vitals?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
  };
  followUpDate?: string;
}) {
  try {
    const response = await appointmentsApi.updateAppointment(id, data);
    
    if (response.success) {
      return { success: true, appointment: response.appointment };
    } else {
      return { success: false, error: response.error || 'Failed to update appointment' };
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { success: false, error: 'Failed to update appointment' };
  }
}

export async function cancelAppointment(id: string, data: {
  cancelledById: string;
  cancelReason: string;
}) {
  try {
    const response = await appointmentsApi.updateAppointment(id, {
      action: 'cancel',
      cancelledById: data.cancelledById,
      cancelReason: data.cancelReason
    });
    
    if (response.success) {
      return { success: true, appointment: response.appointment };
    } else {
      return { success: false, error: response.error || 'Failed to cancel appointment' };
    }
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return { success: false, error: 'Failed to cancel appointment' };
  }
}

export async function deleteAppointment(id: string) {
  try {
    const response = await appointmentsApi.deleteAppointment(id);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete appointment' };
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return { success: false, error: 'Failed to delete appointment' };
  }
}

export async function getAppointments(clinicId?: string, doctorId?: string, patientId?: string, status?: AppointmentStatus) {
  try {
    const response = await appointmentsApi.getAppointments({
      clinicId,
      doctorId,
      patientId,
      status
    });
    
    if (response.success) {
      return response.appointments;
    } else {
      console.error('Error fetching appointments:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

export async function getAppointmentById(id: string) {
  try {
    const response = await appointmentsApi.getAppointment(id);
    
    if (response.success) {
      return response.appointment;
    } else {
      console.error('Error fetching appointment:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return null;
  }
}

export async function checkInAppointment(id: string) {
  try {
    const response = await appointmentsApi.checkInAppointment(id);
    
    if (response.success) {
      return { success: true, appointment: response.appointment };
    } else {
      return { success: false, error: response.error || 'Failed to check in appointment' };
    }
  } catch (error) {
    console.error('Error checking in appointment:', error);
    return { success: false, error: 'Failed to check in appointment' };
  }
}

export async function startAppointment(id: string) {
  try {
    const response = await appointmentsApi.startAppointment(id);
    
    if (response.success) {
      return { success: true, appointment: response.appointment };
    } else {
      return { success: false, error: response.error || 'Failed to start appointment' };
    }
  } catch (error) {
    console.error('Error starting appointment:', error);
    return { success: false, error: 'Failed to start appointment' };
  }
}

export async function completeAppointment(id: string, data: {
  vitals?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
  };
  notes?: string;
  followUpDate?: string;
}) {
  try {
    const response = await appointmentsApi.completeAppointment(id, data);
    
    if (response.success) {
      return { success: true, appointment: response.appointment };
    } else {
      return { success: false, error: response.error || 'Failed to complete appointment' };
    }
  } catch (error) {
    console.error('Error completing appointment:', error);
    return { success: false, error: 'Failed to complete appointment' };
  }
}

export async function rescheduleAppointment(id: string, data: {
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: number;
}) {
  try {
    const response = await appointmentsApi.updateAppointment(id, {
      action: 'reschedule',
      appointmentDate: data.appointmentDate,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration
    });
    
    if (response.success) {
      return { success: true, appointment: response.appointment };
    } else {
      return { success: false, error: response.error || 'Failed to reschedule appointment' };
    }
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    return { success: false, error: 'Failed to reschedule appointment' };
  }
}

export async function updateAppointment(id: string, data: any) {
  try {
    const response = await appointmentsApi.updateAppointment(id, data);
    
    if (response.success) {
      return { success: true, appointment: response.appointment };
    } else {
      return { success: false, error: response.error || 'Failed to update appointment' };
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { success: false, error: 'Failed to update appointment' };
  }
}