'use server'

import { UserRole } from '@/lib/types';
import { profileApi } from '@/lib/services/api';

export async function getUserProfile(userId?: string, token?: string) {
  try {
    const response = await profileApi.getProfile(userId);
    
    if (response.success) {
      return response.profile;
    }
    
    // For demo purposes, return a default profile if not found
    if (!userId) {
      return {
        id: 'default-user',
        name: 'Demo User',
        email: 'demo@digigo.com',
        phone: '+91-9999999999',
        role: UserRole.STAFF,
        clinic: {
          id: 'cli-001',
          name: 'Vishnu Clinic',
          address: '123 Health Street, Medical District, Hyderabad'
        },
        createdAt: new Date()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    
    // For demo purposes, return a default profile on error
    if (!userId) {
      return {
        id: 'default-user',
        name: 'Demo User',
        email: 'demo@digigo.com',
        phone: '+91-9999999999',
        role: UserRole.STAFF,
        clinic: {
          id: 'cli-001',
          name: 'Vishnu Clinic',
          address: '123 Health Street, Medical District, Hyderabad'
        },
        createdAt: new Date()
      };
    }
    
    return null;
  }
}

export async function updateUserProfile(userId: string, data: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  profileImage?: string;
}) {
  try {
    const response = await profileApi.updateProfile(userId, data);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to update profile' };
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}