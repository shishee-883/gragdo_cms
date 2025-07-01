// API client for making requests to the backend

import { config } from '@/lib/config';

/**
 * Base API client for making requests
 */
export const apiClient = {
  /**
   * Make a GET request
   * @param endpoint The API endpoint
   * @param params Optional query parameters
   * @returns The response data
   */
  async get(endpoint: string, params?: Record<string, string>, token?: string) {
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}`);
      
      // Add query parameters if provided
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value);
          }
        });
      }
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token is provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        credentials: 'include',
        cache: 'no-store', // Disable caching
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API GET error for ${endpoint}:`, error);
      throw error;
    }
  },
  
  /**
   * Make a POST request
   * @param endpoint The API endpoint
   * @param data The request body
   * @returns The response data
   */
  async post(endpoint: string, data: any, token?: string) {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token is provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
        cache: 'no-store', // Disable caching
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API POST error for ${endpoint}:`, error);
      throw error;
    }
  },
  
  /**
   * Make a PATCH request
   * @param endpoint The API endpoint
   * @param data The request body
   * @returns The response data
   */
  async patch(endpoint: string, data: any, token?: string) {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token is provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
        cache: 'no-store', // Disable caching
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API PATCH error for ${endpoint}:`, error);
      throw error;
    }
  },
  
  /**
   * Make a DELETE request
   * @param endpoint The API endpoint
   * @returns The response data
   */
  async delete(endpoint: string, token?: string) {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token is provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
        cache: 'no-store', // Disable caching
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API DELETE error for ${endpoint}:`, error);
      throw error;
    }
  },
  
  /**
   * Upload a file
   * @param endpoint The API endpoint
   * @param file The file to upload
   * @param additionalData Additional form data
   * @returns The response data
   */
  async uploadFile(endpoint: string, file: File, additionalData?: Record<string, string>, token?: string) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      
      const headers: HeadersInit = {};

      // Add authorization header if token is provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
        cache: 'no-store', // Disable caching
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API upload error for ${endpoint}:`, error);
      throw error;
    }
  }
};

/**
 * Auth API client
 */
export const authApi = {
  /**
   * Login a user
   * @param email User email
   * @param password User password
   * @returns Login response
   */
  async login(email: string, password: string) {
    return apiClient.post('/auth/login/', { email, password });
  },
  
  /**
   * Sign up a new user
   * @param data User signup data
   * @returns Signup response
   */
  async signup(data: {
    firstName:string;
    lastName:string;
    email:string;
    phone:string;
    password:string;
    address:string;
    profile_image:string;
  }) {
    return apiClient.post('/auth/signup/', data);
  },
  
  /**
   * Request a password reset
   * @param email User email
   * @returns Password reset request response
   */
  async forgotPassword(email: string) {
    return apiClient.post('/forgot-password/', { email });
  },
  
  /**
   * Reset a password
   * @param uidb64 User ID base64
   * @param token Reset token
   * @param newPassword New password
   * @param confirmPassword Confirm new password
   * @returns Password reset response
   */
  async resetPassword(uidb64: string, token: string, newPassword: string, confirmPassword: string) {
    return apiClient.post('/reset-password/', { 
      uidb64, 
      token, 
      new_password: newPassword, 
      confirm_password: confirmPassword 
    });
  },
  
  /**
   * Logout a user
   * @returns Logout response
   */
  async logout() {
    return apiClient.post('/auth/logout/', {});
  },
  
  /**
   * Get the current user
   * @returns Current user response
   */
  async getCurrentUser(token?: string) {
    return apiClient.get('/current-user-details/', {}, token);
  },
  
  /**
   * Refresh the access token
   * @param refreshToken Refresh token
   * @returns New access token
   */
  async refreshToken(refreshToken: string) {
    return apiClient.post('/auth/refresh/', { refreshToken });
  },
  
  /**
   * Change the user's password
   * @param currentPassword Current password
   * @param newPassword New password
   * @param confirmPassword Confirm new password
   * @returns Password change response
   */
  async updatePassword(currentPassword: string, newPassword: string, confirmPassword: string, token?: string) {
    return apiClient.post('/update-password/', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword
    }, token);
  },
  
  /**
   * Verify the user's email
   * @param uidb64 User ID base64
   * @param token Verification token
   * @returns Email verification response
   */
  async verifyEmail(uidb64: string, token: string) {
    return apiClient.get(`/verify/${uidb64}/${token}/`);
  },
  
  /**
   * Resend verification email
   * @param email User email
   * @returns Resend verification email response
   */
  async resendVerificationEmail(email: string) {
    return apiClient.post('/resend-verification-email/', { email });
  }
};

// Update all other API clients to accept token parameter
// Only showing a few examples here, you should update all of them

export const profileApi = {
  async getProfile(userId?: string, token?: string) {
    const params: Record<string, string> = {};
    if (userId) {
      params.userId = userId;
    }
    return apiClient.get('/profile/', params, token);
  },
  
  async updateProfile(userId: string, data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    bio?: string;
    profileImage?: string;
  }, token?: string) {
    return apiClient.patch('/profile/', { userId, ...data }, token);
  }
};

export const clinicsApi = {
  async getClinics(token?: string) {
    return apiClient.get('/clinics/', {}, token);
  },
  
  async getClinic(id: string, token?: string) {
    return apiClient.get(`/clinics/${id}/`, {}, token);
  },
  
  async createClinic(data: {
    name: string;
    address: string;
    phone: string;
    email?: string;
    description?: string;
  }, token?: string) {
    return apiClient.post('/clinics/', data, token);
  },
  
  async updateClinic(id: string, data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;
  }, token?: string) {
    return apiClient.patch(`/clinics/${id}/`, data, token);
  },
  
  async deleteClinic(id: string, token?: string) {
    return apiClient.delete(`/clinics/${id}/`, token);
  }
};

// Continue updating all other API clients similarly...
export const adminApi = {
  async getStats(clinicId: string, token?: string) {
    return apiClient.get('/admin/stats/', { clinicId }, token);
  },
  
  async getDoctors(clinicId: string, token?: string) {
    return apiClient.get('/admin/doctors/', { clinicId }, token);
  },
  
  async getStaff(clinicId: string, token?: string) {
    return apiClient.get('/admin/staff/', { clinicId }, token);
  },
  
  async getTransactions(clinicId: string, token?: string) {
    return apiClient.get('/admin/transactions/', { clinicId }, token);
  },
  
  async getAppointments(clinicId: string, token?: string) {
    return apiClient.get('/admin/appointments/', { clinicId }, token);
  }
};

export const analyticsApi = {
  async getData(token?: string) {
    return apiClient.get('/analytics/', {}, token);
  }
};

export const appointmentsApi = {
  async getAppointments(params: {
    clinicId?: string;
    doctorId?: string;
    patientId?: string;
    status?: string;
  }, token?: string) {
    return apiClient.get('/appointments/', params, token);
  },
  
  async getAppointment(id: string, token?: string) {
    return apiClient.get(`/appointments/${id}/`, {}, token);
  },
  
  async createAppointment(data: any, token?: string) {
    return apiClient.post('/appointments/', data, token);
  },
  
  async updateAppointment(id: string, data: any, token?: string) {
    return apiClient.patch(`/appointments/${id}/`, data, token);
  },
  
  async deleteAppointment(id: string, token?: string) {
    return apiClient.delete(`/appointments/${id}/`, token);
  },
  
  async checkInAppointment(id: string, token?: string) {
    return apiClient.patch(`/appointments/${id}/check-in/`, {}, token);
  },
  
  async startAppointment(id: string, token?: string) {
    return apiClient.patch(`/appointments/${id}/start/`, {}, token);
  },
  
  async completeAppointment(id: string, data: any, token?: string) {
    return apiClient.patch(`/appointments/${id}/complete/`, data, token);
  },
  
  async rescheduleAppointment(id: string, data: any, token?: string) {
    return apiClient.patch(`/appointments/${id}/reschedule/`, data, token);
  },
  
  async cancelAppointment(id: string, data: any, token?: string) {
    return apiClient.patch(`/appointments/${id}/cancel/`, data, token);
  }
};

export const bedsApi = {
  async getBeds(params?: {
    roomId?: string;
    status?: string;
  }, token?: string) {
    return apiClient.get('/beds/', params, token);
  },
  
  async getBed(id: string, token?: string) {
    return apiClient.get(`/beds/${id}/`, {}, token);
  },
  
  async getBedsByRoom(roomId: string, token?: string) {
    return apiClient.get(`/beds/room/${roomId}/`, {}, token);
  },
  
  async createBed(data: any, token?: string) {
    return apiClient.post('/beds/', data, token);
  },
  
  async updateBed(id: string, data: any, token?: string) {
    return apiClient.patch(`/beds/${id}/`, data, token);
  },
  
  async deleteBed(id: string, token?: string) {
    return apiClient.delete(`/beds/${id}/`, token);
  },
  
  async assignBed(id: string, patientId: string, admissionDate: string, dischargeDate?: string, token?: string) {
    return apiClient.patch(`/beds/${id}/assign/`, {
      patientId,
      admissionDate,
      dischargeDate
    }, token);
  },
  
  async dischargeBed(id: string, token?: string) {
    return apiClient.patch(`/beds/${id}/discharge/`, {}, token);
  },
  
  async reserveBed(id: string, token?: string) {
    return apiClient.patch(`/beds/${id}/reserve/`, {}, token);
  }
};

export const billingApi = {
  async getInvoices(params?: {
    clinicId?: string;
    patientId?: string;
    status?: string;
  }, token?: string) {
    return apiClient.get('/billing/invoices/', params, token);
  },
  
  async getInvoice(id: string, token?: string) {
    return apiClient.get(`/billing/invoices/${id}/`, {}, token);
  },
  
  async createInvoice(data: any, token?: string) {
    return apiClient.post('/billing/invoices/', data, token);
  },
  
  async updateInvoice(id: string, data: any, token?: string) {
    return apiClient.patch(`/billing/invoices/${id}/`, data, token);
  },
  
  async deleteInvoice(id: string, token?: string) {
    return apiClient.delete(`/billing/invoices/${id}/`, token);
  },
  
  async recordPayment(data: any, token?: string) {
    return apiClient.post('/billing/payment/', data, token);
  }
};

export const dashboardApi = {
  async getStats(clinicId?: string, doctorId?: string, token?: string) {
    const params: Record<string, string> = {};
    if (clinicId) params.clinicId = clinicId;
    if (doctorId) params.doctorId = doctorId;
    return apiClient.get('/dashboard/stats/', params, token);
  },
  
  async getRecentAppointments(clinicId?: string, doctorId?: string, token?: string) {
    const params: Record<string, string> = {};
    if (clinicId) params.clinicId = clinicId;
    if (doctorId) params.doctorId = doctorId;
    return apiClient.get('/dashboard/appointments/', params, token);
  },
  
  async getDoctorsActivity(clinicId?: string, token?: string) {
    const params: Record<string, string> = {};
    if (clinicId) params.clinicId = clinicId;
    return apiClient.get('/dashboard/doctors-activity/', params, token);
  },
  
  async getRecentReports(clinicId?: string, token?: string) {
    const params: Record<string, string> = {};
    if (clinicId) params.clinicId = clinicId;
    return apiClient.get('/dashboard/reports/', params, token);
  }
};

export const doctorsApi = {
  async getDoctors(clinicId?: string, token?: string) {
    const params: Record<string, string> = {};
    if (clinicId) params.clinicId = clinicId;
    return apiClient.get('/doctors/', params, token);
  },
  
  async getDoctor(id: string, token?: string) {
    return apiClient.get(`/doctors/${id}/`, {}, token);
  },
  
  async createDoctor(data: any, token?: string) {
    return apiClient.post('/doctors/', data, token);
  },
  
  async updateDoctor(id: string, data: any, token?: string) {
    return apiClient.patch(`/doctors/${id}/`, data, token);
  },
  
  async deleteDoctor(id: string, token?: string) {
    return apiClient.delete(`/doctors/${id}/`, token);
  },
  
  async toggleAvailability(id: string, token?: string) {
    return apiClient.post(`/doctors/${id}/toggle-availability/`, {}, token);
  }
};

export const medicinesApi = {
  async getMedicines(clinicId?: string, isActive?: boolean, token?: string) {
    const params: Record<string, string> = {};
    if (clinicId) params.clinicId = clinicId;
    if (isActive !== undefined) params.isActive = isActive.toString();
    return apiClient.get('/medicines/', params, token);
  },
  
  async getMedicine(id: string, token?: string) {
    return apiClient.get(`/medicines/${id}/`, {}, token);
  },
  
  async createMedicine(data: any, token?: string) {
    return apiClient.post('/medicines/', data, token);
  },
  
  async updateMedicine(id: string, data: any, token?: string) {
    return apiClient.patch(`/medicines/${id}/`, data, token);
  },
  
  async deleteMedicine(id: string, token?: string) {
    return apiClient.delete(`/medicines/${id}/`, token);
  },
  
  async updateStock(id: string, quantity: number, isAddition: boolean = true, token?: string) {
    return apiClient.patch(`/medicines/${id}/update-stock/`, {
      quantity,
      isAddition,
      action: 'updateStock'
    }, token);
  }
};

export const patientsApi = {
  async getPatients(clinicId?: string, token?: string) {
    const params: Record<string, string> = {};
    if (clinicId) params.clinicId = clinicId;
    return apiClient.get('/patients/', params, token);
  },
  
  async getPatient(id: string, token?: string) {
    return apiClient.get(`/patients/${id}/`, {}, token);
  },
  
  async createPatient(data: any, token?: string) {
    return apiClient.post('/patients/', data, token);
  },
  
  async updatePatient(id: string, data: any, token?: string) {
    return apiClient.patch(`/patients/${id}/`, data, token);
  },
  
  async deletePatient(id: string, token?: string) {
    return apiClient.delete(`/patients/${id}/`, token);
  }
};

export const prescriptionsApi = {
  async getPrescriptions(params?: {
    clinicId?: string;
    doctorId?: string;
    patientId?: string;
  }, token?: string) {
    return apiClient.get('/prescriptions/', params, token);
  },
  
  async getPrescription(id: string, token?: string) {
    return apiClient.get(`/prescriptions/${id}/`, {}, token);
  },
  
  async createPrescription(data: any, token?: string) {
    return apiClient.post('/prescriptions/', data, token);
  },
  
  async updatePrescription(id: string, data: any, token?: string) {
    return apiClient.patch(`/prescriptions/${id}/`, data, token);
  },
  
  async deletePrescription(id: string, token?: string) {
    return apiClient.delete(`/prescriptions/${id}/`, token);
  }
};

export const roomsApi = {
  async getRooms(clinicId?: string, isActive?: boolean, token?: string) {
    const params: Record<string, string> = {};
    if (clinicId) params.clinicId = clinicId;
    if (isActive !== undefined) params.isActive = isActive.toString();
    return apiClient.get('/rooms/', params, token);
  },
  
  async getRoom(id: string, token?: string) {
    return apiClient.get(`/rooms/${id}/`, {}, token);
  },
  
  async createRoom(data: any, token?: string) {
    return apiClient.post('/rooms/', data, token);
  },
  
  async updateRoom(id: string, data: any, token?: string) {
    return apiClient.patch(`/rooms/${id}/`, data, token);
  },
  
  async deleteRoom(id: string, token?: string) {
    return apiClient.delete(`/rooms/${id}/`, token);
  }
};

export const transactionsApi = {
  async getTransactions(params?: {
    clinicId?: string;
    patientId?: string;
    type?: string;
  }, token?: string) {
    return apiClient.get('/transactions/', params, token);
  },
  
  async getTransaction(id: string, token?: string) {
    return apiClient.get(`/transactions/${id}/`, {}, token);
  },
  
  async createTransaction(data: any, token?: string) {
    return apiClient.post('/transactions/', data, token);
  },
  
  async updateTransaction(id: string, data: any, token?: string) {
    return apiClient.patch(`/transactions/${id}/`, data, token);
  },
  
  async deleteTransaction(id: string, token?: string) {
    return apiClient.delete(`/transactions/${id}/`, token);
  },
  
  async getTransactionSummary(clinicId: string, period: string, token?: string) {
    return apiClient.get('/transactions/summary/', {
      clinicId,
      period
    }, token);
  }
};

export const treatmentsApi = {
  async getTreatments(token?: string) {
    return apiClient.get('/treatments/', {}, token);
  },
  
  async getTreatment(id: string, token?: string) {
    return apiClient.get(`/treatments/${id}/`, {}, token);
  },
  
  async createTreatment(data: any, token?: string) {
    return apiClient.post('/treatments/', data, token);
  },
  
  async updateTreatment(id: string, data: any, token?: string) {
    return apiClient.patch(`/treatments/${id}/`, data, token);
  },
  
  async deleteTreatment(id: string, token?: string) {
    return apiClient.delete(`/treatments/${id}/`, token);
  }
};

export const usersApi = {
  async createClinicUser(clinicId: string, data: any, token?: string) {
    return apiClient.post(`/create-clinic-user/${clinicId}/`, data, token);
  },
  
  async getClinicUsers(clinicId: string, token?: string) {
    return apiClient.get(`/get-clinic-users/${clinicId}/`, {}, token);
  },
  
  async updateUser(userId: string, data: any, token?: string) {
    return apiClient.put(`/update-user/${userId}/`, data, token);
  },
  
  async deleteUser(userId: string, password: string, token?: string) {
    return apiClient.delete(`/delete-user/${userId}/`, token);
  }
};