'use server'

import { bedsApi } from '@/lib/services/api';

export async function createBedRecord(data: {
  bedNumber: number;
  roomId: string;
  clinicId: string;
  createdById: string;
  notes?: string;
}) {
  try {
    const response = await bedsApi.createBed(data);
    
    if (response.success) {
      return { success: true, bed: response.bed };
    } else {
      return { success: false, error: response.error || 'Failed to create bed' };
    }
  } catch (error) {
    console.error('Error creating bed:', error);
    return { success: false, error: 'Failed to create bed' };
  }
}

export async function updateBedRecord(id: string, data: {
  bedNumber?: number;
  status?: string;
  notes?: string;
}) {
  try {
    const response = await bedsApi.updateBed(id, data);
    
    if (response.success) {
      return { success: true, bed: response.bed };
    } else {
      return { success: false, error: response.error || 'Failed to update bed' };
    }
  } catch (error) {
    console.error('Error updating bed:', error);
    return { success: false, error: 'Failed to update bed' };
  }
}

export async function assignBed(id: string, data: {
  patientId: string;
  admissionDate: string;
  dischargeDate?: string;
}) {
  try {
    const response = await bedsApi.assignBed(id, data.patientId, data.admissionDate, data.dischargeDate);
    
    if (response.success) {
      return { success: true, bed: response.bed };
    } else {
      return { success: false, error: response.error || 'Failed to assign bed' };
    }
  } catch (error) {
    console.error('Error assigning bed:', error);
    return { success: false, error: 'Failed to assign bed' };
  }
}

export async function dischargeBed(id: string) {
  try {
    const response = await bedsApi.dischargeBed(id);
    
    if (response.success) {
      return { success: true, bed: response.bed };
    } else {
      return { success: false, error: response.error || 'Failed to discharge bed' };
    }
  } catch (error) {
    console.error('Error discharging bed:', error);
    return { success: false, error: 'Failed to discharge bed' };
  }
}

export async function reserveBed(id: string) {
  try {
    const response = await bedsApi.reserveBed(id);
    
    if (response.success) {
      return { success: true, bed: response.bed };
    } else {
      return { success: false, error: response.error || 'Failed to reserve bed' };
    }
  } catch (error) {
    console.error('Error reserving bed:', error);
    return { success: false, error: 'Failed to reserve bed' };
  }
}

export async function deleteBed(id: string) {
  try {
    const response = await bedsApi.deleteBed(id);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete bed' };
    }
  } catch (error) {
    console.error('Error deleting bed:', error);
    return { success: false, error: 'Failed to delete bed' };
  }
}

export async function getBedsByRoom(roomId: string) {
  try {
    const response = await bedsApi.getBedsByRoom(roomId);
    
    if (response.success) {
      return response.beds;
    } else {
      console.error('Error fetching beds:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching beds:', error);
    return [];
  }
}

export async function getBedById(id: string) {
  try {
    const response = await bedsApi.getBed(id);
    
    if (response.success) {
      return response.bed;
    } else {
      console.error('Error fetching bed:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching bed:', error);
    return null;
  }
}