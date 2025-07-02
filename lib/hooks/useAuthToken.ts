import { useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthContext';
import { refreshToken } from '@/lib/actions/auth';

// Custom hook to handle token refresh
export function useAuthToken() {
  const { token, setToken, clearToken } = useAuth();

  useEffect(() => {
    // Function to refresh the token
    const refreshAuthToken = async () => {
      if (!token) return;

      try {
        const result = await refreshToken(token);
        if (result.success && result.token) {
          setToken(result.token);
        } else {
          // If refresh fails, clear the token
          clearToken();
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        clearToken();
      }
    };

    // Set up token refresh interval (e.g., every 15 minutes)
    const refreshInterval = setInterval(refreshAuthToken, 15 * 60 * 1000);

    // Clean up interval on unmount
    return () => clearInterval(refreshInterval);
  }, [token, setToken, clearToken]);

  return { token };
}