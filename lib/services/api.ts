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
  async get(endpoint: string, params?: Record<string, string>) {
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
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
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
  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', // Include cookies
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
  async patch(endpoint: string, data: any) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', // Include cookies
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
  async delete(endpoint: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
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
  async uploadFile(endpoint: string, file: File, additionalData?: Record<string, string>) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}${endpoint}`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies
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
   * @param role User role
   * @returns Login response
   */
  async login(email: string, password: string, role: string) {
    return apiClient.post('/auth/login/', { email, password, role });
  },
  
  /**
   * Sign up a new user
   * @param data User signup data
   * @returns Signup response
   */
  async signup(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    clinicId?: string;
    password: string;
  }) {
    return apiClient.post('/auth/signup/', {
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      role: data.role,
      clinic: data.clinicId,
      password: data.password,
      confirm_password: data.password
    });
  },
  
  /**
   * Request a password reset
   * @param email User email
   * @returns Password reset request response
   */
  async forgotPassword(email: string) {
    return apiClient.post('/auth/forgot-password/', { email });
  },
  
  /**
   * Reset a password
   * @param token Reset token
   * @param newPassword New password
   * @returns Password reset response
   */
  async resetPassword(token: string, newPassword: string) {
    return apiClient.post('/auth/reset-password/', { 
      token, 
      new_password: newPassword,
      confirm_password: newPassword
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
  async getCurrentUser() {
    return apiClient.get('/auth/me/');
  },
  
  /**
   * Refresh the access token
   * @param refreshToken Refresh token
   * @returns New access token
   */
  async refreshToken(refreshToken: string) {
    return apiClient.post('/auth/token/refresh/', { refresh: refreshToken });
  },
  
  /**
   * Change the user's password
   * @param currentPassword Current password
   * @param newPassword New password
   * @returns Password change response
   */
  async changePassword(currentPassword: string, newPassword: string) {
    return apiClient.post('/auth/change-password/', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: newPassword
    });
  },
  
  /**
   * Verify the user's email
   * @param token Verification token
   * @returns Email verification response
   */
  async verifyEmail(token: string) {
    return apiClient.post('/auth/verify-email/', { token });
  }
};

/**
 * Profile API client
 */
export const profileApi = {
  /**
   * Get a user profile
   * @param userId Optional user ID
   * @returns Profile response
   */
  async getProfile(userId?: string) {
    const params: Record<string, string> = {};
    if (userId) {
      params.userId = userId;
    }
    return apiClient.get('/profile/', params);
  },
  
  /**
   * Update a user profile
   * @param userId User ID
   * @param data Profile update data
   * @returns Profile update response
   */
  async updateProfile(userId: string, data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    bio?: string;
    profileImage?: string;
  }) {
    return apiClient.patch('/profile/', { userId, ...data });
  }
};

/**
 * Clinics API client
 */
export const clinicsApi = {
  /**
   * Get all clinics
   * @returns Clinics response
   */
  async getClinics() {
    return apiClient.get('/clinics/');
  },
  
  /**
   * Get a clinic by ID
   * @param id Clinic ID
   * @returns Clinic response
   */
  async getClinic(id: string) {
    return apiClient.get(`/clinics/${id}/`);
  },
  
  /**
   * Create a new clinic
   * @param data Clinic data
   * @returns Clinic creation response
   */
  async createClinic(data: {
    name: string;
    address: string;
    phone: string;
    email?: string;
    description?: string;
  }) {
    return apiClient.post('/clinics/', data);
  },
  
  /**
   * Update a clinic
   * @param id Clinic ID
   * @param data Clinic update data
   * @returns Clinic update response
   */
  async updateClinic(id: string, data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;
  }) {
    return apiClient.patch(`/clinics/${id}/`, data);
  },
  
  /**
   * Delete a clinic
   * @param id Clinic ID
   * @returns Clinic deletion response
   */
  async deleteClinic(id: string) {
    return apiClient.delete(`/clinics/${id}/`);
  }
};

// Export other API clients as needed
export const doctorsApi = {
  async getDoctors(clinicId?: string) {
    const params: Record<string, string> = {};
    if (clinicId) {
      params.clinicId = clinicId;
    }
    return apiClient.get('/doctors/', params);
  },
  
  async getDoctor(id: string) {
    return apiClient.get(`/doctors/${id}/`);
  },
  
  async createDoctor(data: any) {
    return apiClient.post('/doctors/', data);
  },
  
  async updateDoctor(id: string, data: any) {
    return apiClient.patch(`/doctors/${id}/`, data);
  },
  
  async deleteDoctor(id: string) {
    return apiClient.delete(`/doctors/${id}/`);
  },
  
  async toggleAvailability(id: string) {
    return apiClient.post(`/doctors/${id}/toggle-availability/`, {});
  }
};

export const patientsApi = {
  async getPatients(clinicId?: string) {
    const params: Record<string, string> = {};
    if (clinicId) {
      params.clinicId = clinicId;
    }
    return apiClient.get('/patients/', params);
  },
  
  async getPatient(id: string) {
    return apiClient.get(`/patients/${id}/`);
  },
  
  async createPatient(data: any) {
    return apiClient.post('/patients/', data);
  },
  
  async updatePatient(id: string, data: any) {
    return apiClient.patch(`/patients/${id}/`, data);
  },
  
  async deletePatient(id: string) {
    return apiClient.delete(`/patients/${id}/`);
  },
  
  async getPatientDocuments(id: string) {
    return apiClient.get(`/patients/${id}/documents/`);
  },
  
  async uploadDocument(patientId: string, file: File, data: any) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/patients/documents/`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }
};

export const appointmentsApi = {
  async getAppointments(params?: {
    clinicId?: string;
    doctorId?: string;
    patientId?: string;
    status?: string;
  }) {
    return apiClient.get('/appointments/', params as Record<string, string>);
  },
  
  async getAppointment(id: string) {
    return apiClient.get(`/appointments/${id}/`);
  },
  
  async createAppointment(data: any) {
    return apiClient.post('/appointments/', data);
  },
  
  async updateAppointment(id: string, data: any) {
    return apiClient.patch(`/appointments/${id}/`, data);
  },
  
  async deleteAppointment(id: string) {
    return apiClient.delete(`/appointments/${id}/`);
  },
  
  async checkInAppointment(id: string) {
    return apiClient.patch(`/appointments/${id}/check-in/`, {});
  },
  
  async startAppointment(id: string) {
    return apiClient.patch(`/appointments/${id}/start/`, {});
  },
  
  async completeAppointment(id: string, data: {
    vitals?: any;
    notes?: string;
    followUpDate?: string;
  }) {
    return apiClient.patch(`/appointments/${id}/complete/`, data);
  },
  
  async cancelAppointment(id: string, data: {
    cancelReason: string;
  }) {
    return apiClient.patch(`/appointments/${id}/cancel/`, data);
  },
  
  async rescheduleAppointment(id: string, data: {
    appointmentDate: string;
    startTime: string;
    endTime: string;
    duration: number;
  }) {
    return apiClient.patch(`/appointments/${id}/reschedule/`, data);
  }
};

export const prescriptionsApi = {
  async getPrescriptions(params?: {
    clinicId?: string;
    doctorId?: string;
    patientId?: string;
  }) {
    return apiClient.get('/prescriptions/', params as Record<string, string>);
  },
  
  async getPrescription(id: string) {
    return apiClient.get(`/prescriptions/${id}/`);
  },
  
  async createPrescription(data: any) {
    return apiClient.post('/prescriptions/', data);
  },
  
  async updatePrescription(id: string, data: any) {
    return apiClient.patch(`/prescriptions/${id}/`, data);
  },
  
  async deletePrescription(id: string) {
    return apiClient.delete(`/prescriptions/${id}/`);
  },
  
  async uploadPrescriptionDocument(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prescriptionId', id);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/prescriptions/${id}/upload/`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }
};

export const dashboardApi = {
  async getStats(clinicId?: string, doctorId?: string) {
    const params: Record<string, string> = {};
    if (clinicId) {
      params.clinicId = clinicId;
    }
    if (doctorId) {
      params.doctorId = doctorId;
    }
    return apiClient.get('/dashboard/stats/', params);
  },
  
  async getRecentAppointments(clinicId?: string, doctorId?: string) {
    const params: Record<string, string> = {};
    if (clinicId) {
      params.clinicId = clinicId;
    }
    if (doctorId) {
      params.doctorId = doctorId;
    }
    return apiClient.get('/dashboard/appointments/', params);
  },
  
  async getDoctorsActivity(clinicId?: string) {
    const params: Record<string, string> = {};
    if (clinicId) {
      params.clinicId = clinicId;
    }
    return apiClient.get('/dashboard/doctors-activity/', params);
  },
  
  async getRecentReports(clinicId?: string) {
    const params: Record<string, string> = {};
    if (clinicId) {
      params.clinicId = clinicId;
    }
    return apiClient.get('/dashboard/reports/', params);
  }
};

export const adminApi = {
  async getStats(clinicId: string) {
    return apiClient.get('/admin/stats/', { clinicId });
  },
  
  async getDoctors(clinicId: string) {
    return apiClient.get('/admin/doctors/', { clinicId });
  },
  
  async getStaff(clinicId: string) {
    return apiClient.get('/admin/staff/', { clinicId });
  },
  
  async getTransactions(clinicId: string) {
    return apiClient.get('/admin/transactions/', { clinicId });
  },
  
  async getAppointments(clinicId: string) {
    return apiClient.get('/admin/appointments/', { clinicId });
  }
};

export const analyticsApi = {
  async getData() {
    return apiClient.get('/analytics/');
  }
};

export const medicinesApi = {
  async getMedicines(clinicId?: string, isActive?: boolean) {
    const params: Record<string, string> = {};
    if (clinicId) {
      params.clinicId = clinicId;
    }
    if (isActive !== undefined) {
      params.isActive = isActive.toString();
    }
    return apiClient.get('/medicines/', params);
  },
  
  async getMedicine(id: string) {
    return apiClient.get(`/medicines/${id}/`);
  },
  
  async createMedicine(data: any) {
    return apiClient.post('/medicines/', data);
  },
  
  async updateMedicine(id: string, data: any) {
    return apiClient.patch(`/medicines/${id}/`, data);
  },
  
  async deleteMedicine(id: string) {
    return apiClient.delete(`/medicines/${id}/`);
  },
  
  async updateStock(id: string, quantity: number, isAddition: boolean) {
    return apiClient.patch(`/medicines/${id}/update-stock/`, {
      quantity,
      isAddition,
      action: 'updateStock'
    });
  }
};

export const treatmentsApi = {
  async getTreatments() {
    return apiClient.get('/treatments/');
  },
  
  async getTreatment(id: string) {
    return apiClient.get(`/treatments/${id}/`);
  },
  
  async createTreatment(data: any) {
    return apiClient.post('/treatments/', data);
  },
  
  async updateTreatment(id: string, data: any) {
    return apiClient.patch(`/treatments/${id}/`, data);
  },
  
  async deleteTreatment(id: string) {
    return apiClient.delete(`/treatments/${id}/`);
  }
};

export const roomsApi = {
  async getRooms(clinicId?: string, isActive?: boolean) {
    const params: Record<string, string> = {};
    if (clinicId) {
      params.clinicId = clinicId;
    }
    if (isActive !== undefined) {
      params.isActive = isActive.toString();
    }
    return apiClient.get('/rooms/', params);
  },
  
  async getRoom(id: string) {
    return apiClient.get(`/rooms/${id}/`);
  },
  
  async createRoom(data: any) {
    return apiClient.post('/rooms/', data);
  },
  
  async updateRoom(id: string, data: any) {
    return apiClient.patch(`/rooms/${id}/`, data);
  },
  
  async deleteRoom(id: string) {
    return apiClient.delete(`/rooms/${id}/`);
  }
};

export const bedsApi = {
  async getBedsByRoom(roomId: string) {
    return apiClient.get(`/beds/room/${roomId}/`);
  },
  
  async getBed(id: string) {
    return apiClient.get(`/beds/${id}/`);
  },
  
  async createBed(data: any) {
    return apiClient.post('/beds/', data);
  },
  
  async updateBed(id: string, data: any) {
    return apiClient.patch(`/beds/${id}/`, data);
  },
  
  async deleteBed(id: string) {
    return apiClient.delete(`/beds/${id}/`);
  },
  
  async assignBed(id: string, patientId: string, admissionDate: string, dischargeDate?: string) {
    return apiClient.patch(`/beds/${id}/assign/`, {
      patient: patientId,
      admission_date: admissionDate,
      discharge_date: dischargeDate,
      action: 'assign'
    });
  },
  
  async dischargeBed(id: string) {
    return apiClient.patch(`/beds/${id}/discharge/`, {
      action: 'discharge'
    });
  },
  
  async reserveBed(id: string) {
    return apiClient.patch(`/beds/${id}/reserve/`, {
      action: 'reserve'
    });
  }
};

export const transactionsApi = {
  async getTransactions(params?: {
    clinicId?: string;
    patientId?: string;
    type?: string;
  }) {
    return apiClient.get('/transactions/', params as Record<string, string>);
  },
  
  async getTransaction(id: string) {
    return apiClient.get(`/transactions/${id}/`);
  },
  
  async createTransaction(data: any) {
    return apiClient.post('/transactions/', data);
  },
  
  async updateTransaction(id: string, data: any) {
    return apiClient.patch(`/transactions/${id}/`, data);
  },
  
  async deleteTransaction(id: string) {
    return apiClient.delete(`/transactions/${id}/`);
  },
  
  async getTransactionSummary(clinicId: string, period: 'day' | 'week' | 'month' | 'year' = 'month') {
    return apiClient.get('/transactions/summary/', { clinicId, period });
  }
};

export const billingApi = {
  async getInvoices(params?: {
    clinicId?: string;
    patientId?: string;
    status?: string;
  }) {
    return apiClient.get('/billing/invoices/', params as Record<string, string>);
  },
  
  async getInvoice(id: string) {
    return apiClient.get(`/billing/invoices/${id}/`);
  },
  
  async createInvoice(data: any) {
    return apiClient.post('/billing/invoices/', data);
  },
  
  async updateInvoice(id: string, data: any) {
    return apiClient.patch(`/billing/invoices/${id}/`, data);
  },
  
  async deleteInvoice(id: string) {
    return apiClient.delete(`/billing/invoices/${id}/`);
  },
  
  async recordPayment(data: any) {
    return apiClient.post('/billing/payment/', data);
  }
};