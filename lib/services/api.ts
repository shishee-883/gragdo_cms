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