'use server'

import { usersApi } from '@/lib/services/api';

export async function createClinicUser(clinicId: string, data: {
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  address?: string;
  password: string;
  role: 'admin' | 'doctor' | 'staff';
}) {
  try {
    const response = await usersApi.createClinicUser(clinicId, {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber,
      address: data.address,
      password: data.password,
      role: data.role
    });
    
    if (response.success) {
      return { success: true, user: response.user };
    } else {
      return { success: false, error: response.error || 'Failed to create clinic user' };
    }
  } catch (error) {
    console.error('Error creating clinic user:', error);
    return { success: false, error: 'Failed to create clinic user' };
  }
}