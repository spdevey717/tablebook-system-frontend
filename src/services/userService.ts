import axios from 'axios';
import type { User } from '../types';

const API_URL = import.meta.env.VITE_BACKEND_URL;

interface UserResponse {
  success: boolean;
  data: {
    users: User[];
    count: number;
  };
  error?: string;
}

interface CreateUserRequest {
  email: string;
  name: string;
  role: string;
  restaurant_ids?: number[];
}

interface UpdateUserRequest {
  email?: string;
  name?: string;
  role?: string;
  restaurant_ids?: number[];
}

class UserService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getAllUsers(): Promise<UserResponse> {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        data: { users: [], count: 0 },
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getUserById(id: number): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async createUser(userData: CreateUserRequest): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await axios.post(`${API_URL}/users`, userData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<{ success: boolean; data?: User; error?: string }> {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, userData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async deleteUser(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export default new UserService();
export type { UserResponse, CreateUserRequest, UpdateUserRequest };
