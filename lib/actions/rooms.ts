'use server'

import { roomsApi } from '@/lib/services/api';

export async function createRoomRecord(data: {
  roomNumber: string;
  roomType: string;
  floor: number;
  totalBeds: number;
  clinicId: string;
  createdById: string;
}) {
  try {
    const response = await roomsApi.createRoom(data);
    
    if (response.success) {
      return { success: true, room: response.room };
    } else {
      return { success: false, error: response.error || 'Failed to create room' };
    }
  } catch (error) {
    console.error('Error creating room:', error);
    return { success: false, error: 'Failed to create room' };
  }
}

export async function updateRoomRecord(id: string, data: {
  roomNumber?: string;
  roomType?: string;
  floor?: number;
  totalBeds?: number;
  isActive?: boolean;
}) {
  try {
    const response = await roomsApi.updateRoom(id, data);
    
    if (response.success) {
      return { success: true, room: response.room };
    } else {
      return { success: false, error: response.error || 'Failed to update room' };
    }
  } catch (error) {
    console.error('Error updating room:', error);
    return { success: false, error: 'Failed to update room' };
  }
}

export async function deleteRoomRecord(id: string) {
  try {
    const response = await roomsApi.deleteRoom(id);
    
    if (response.success) {
      return { success: true };
    } else {
      return { success: false, error: response.error || 'Failed to delete room' };
    }
  } catch (error) {
    console.error('Error deleting room:', error);
    return { success: false, error: 'Failed to delete room' };
  }
}

export async function getRooms(clinicId?: string, isActive?: boolean) {
  try {
    const response = await roomsApi.getRooms(clinicId, isActive);
    
    if (response.success) {
      return response.rooms;
    } else {
      console.error('Error fetching rooms:', response.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

export async function getRoomById(id: string) {
  try {
    const response = await roomsApi.getRoom(id);
    
    if (response.success) {
      return response.room;
    } else {
      console.error('Error fetching room:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
}