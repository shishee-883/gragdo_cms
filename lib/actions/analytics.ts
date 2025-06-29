'use server'

import { analyticsApi } from '@/lib/services/api';

export async function getAnalyticsData() {
  try {
    const response = await analyticsApi.getData();
    
    if (response.success) {
      return response.data;
    } else {
      console.error('Error fetching analytics data:', response.error);
      return {
        revenue: {
          thisMonth: 250000,
          lastMonth: 220000,
          growth: 13
        },
        patients: {
          total: 2427,
          growth: 8
        },
        appointments: {
          completionRate: 85,
          total: 1850
        }
      };
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {
      revenue: {
        thisMonth: 250000,
        lastMonth: 220000,
        growth: 13
      },
      patients: {
        total: 2427,
        growth: 8
      },
      appointments: {
        completionRate: 85,
        total: 1850
      }
    };
  }
}