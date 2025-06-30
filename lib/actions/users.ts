// lib/actions/users.ts
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

export async function getClinicUsers(clinicId: string) {
  try {
    const response = await usersApi.getClinicUsers(clinicId);
    
    if (response.success) {
      return { success: true, users: response.users };
    } else {
      return { success: false, error: response.error || 'Failed to get clinic users' };
    }
  } catch (error) {
    console.error('Error getting clinic users:', error);
    return { success: false, error: 'Failed to get clinic users' };
  }
}

export async function updateUser(userId: string, data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  role?: 'admin' | 'doctor' | 'staff';
}) {
  try {
    const response = await usersApi.updateUser(userId, {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber,
      address: data.address,
      role: data.role
    });
    
    if (response.success) {
      return { success: true, user: response.user };
    } else {
      return { success: false, error: response.error || 'Failed to update user' };
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: 'Failed to update user' };
  }
}

export async function deleteUser(userId: string, password: string) {
  try {
    const response = await usersApi.deleteUser(userId, password);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete user' };
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}
