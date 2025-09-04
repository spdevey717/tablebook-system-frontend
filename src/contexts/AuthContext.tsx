// Import Main Libraries
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Import Other Libraries
import { type CredentialResponse } from "@react-oauth/google";

// Import Custom Libraries
import { type User, UserRole } from '../types';
import { verifyGoogleToken, signIn } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credentialResponse: CredentialResponse) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  setError: (error: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // In a real app, this would check localStorage, cookies, or make an API call
        const storedUser = localStorage.getItem('user');
        const storedEmail = localStorage.getItem('email');
        const storedToken = localStorage.getItem('token');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          localStorage.setItem('email', storedEmail!);
          localStorage.setItem('token', storedToken!);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      const response = await signIn(email, password);
      console.log("[DEBUG] Response:", response);

      setUser({
        id: 1,
        email,
        name: response.name,
        role: response.role,
        restaurant_ids: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('email', email);
      localStorage.setItem('token', response.token);
    } catch (error: any) {
      setError(error?.response?.data?.error || 'Login failed. Please try again.');
      console.error('Login failed:', error?.response?.data?.error || error?.message || 'Unknown error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credentialResponse: CredentialResponse) => {
    setLoading(true);
    try {
      const idToken = credentialResponse.credential;
      const response = await verifyGoogleToken(idToken!);
      console.log("[DEBUG] Response:", response);

      setUser({
        id: 1,
        email: response.email,
        name: response.name,
        role: response.role,
        restaurant_ids: [1, 2],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('email', response.email);
      localStorage.setItem('token', response.token);
    } catch (error: any) {
      setError(error?.response?.data?.error || 'Google login failed. Please try again.');
      console.error('Google login failed:', error?.response?.data?.error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === UserRole.ADMIN,
    login,
    loginWithGoogle,
    logout,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
