'use server'

import { medicinesApi } from '@/lib/services/api';

export async function createMedicineRecord(data: {
  name: string;
  manufacturer: string;
  batchNumber: string;
  type: string;
  dosage: string;
  manufacturedDate: string;
  expiryDate: string;
  price: number;
  stock: number;
  reorderLevel: number;
  clinicId: string;
  createdById: string;
}) {
  try {
    const response = await medicinesApi.createMedicine(data);
    
    if (response.success) {
      return { success: true, medicine: response.medicine };
    } else {
      return { success: false, error: response.error || 'Failed to create medicine' };
    }
  } catch (error) {
    console.error('Error creating medicine:', error);
    return { success: false, error: 'Failed to create medicine' };
  }
}

export async function updateMedicineRecord(id: string, data: {
  name?: string;
  manufacturer?: string;
  batchNumber?: string;
  type?: string;
  dosage?: string;
  manufacturedDate?: string;
  expiryDate?: string;
  price?: number;
  stock?: number;
  reorderLevel?: number;
  isActive?: boolean;
}) {
  try {
    const response = await medicinesApi.updateMedicine(id, data);
    
    if (response.success) {
      return { success: true, medicine: response.medicine };
    } else {
      return { success: false, error: response.error || 'Failed to update medicine' };
    }
  } catch (error) {
    console.error('Error updating medicine:', error);
    return { success: false, error: 'Failed to update medicine' };
  }
}

export async function deleteMedicineRecord(id: string) {
  try {
    const response = await medicinesApi.deleteMedicine(id);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete medicine' };
    }
  } catch (error) {
    console.error('Error deleting medicine:', error);
    return { success: false, error: 'Failed to delete medicine' };
  }
}

export async function getMedicines(clinicId?: string, isActive?: boolean) {
  try {
    const response = await medicinesApi.getMedicines(clinicId, isActive);
    
    if (response.success) {
      return response.medicines;
    } else {
      console.error('Error fetching medicines:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching medicines:', error);
    return [];
  }
}

export async function getMedicineById(id: string) {
  try {
    const response = await medicinesApi.getMedicine(id);
    
    if (response.success) {
      return response.medicine;
    } else {
      console.error('Error fetching medicine:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching medicine:', error);
    return null;
  }
}

export async function updateMedicineStock(id: string, quantity: number, isAddition: boolean = true) {
  try {
    const response = await medicinesApi.updateStock(id, quantity, isAddition);
    
    if (response.success) {
      return { success: true, medicine: response.medicine };
    } else {
      return { success: false, error: response.error || 'Failed to update medicine stock' };
    }
  } catch (error) {
    console.error('Error updating medicine stock:', error);
    return { success: false, error: 'Failed to update medicine stock' };
  }
}