import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export interface Booking {
  _id: string;
  guest_firstname: string;
  guest_surname?: string;
  phone_number: string;
  party_size: number;
  booking_date: string;
  booking_time: string;
}

export interface Call {
  _id: string;
  booking_id: Booking | string;
  retell_call_id: string;
  started_at: string;
  ended_at: string;
  duration_sec: number;
  recording_url: string;
  outcome: string;
  new_time: string;
  new_date: string;
  new_party_size: number | null;
  confirmation_call_notes: string;
  status: 'idle' | 'pending' | 'calling' | 'call_start' | 'call_end' | 'success' | 'failed';
  createdAt: string;
  updatedAt: string;
}

interface CallStats {
  total: number;
  success: number;
  failed: number;
  today: number;
}

interface CallResponse {
  success: boolean;
  data: {
    calls: Call[];
    count: number;
  };
  error?: string;
}

interface CallStatsResponse {
  success: boolean;
  data: CallStats;
  error?: string;
}

class CallService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getAllCalls(): Promise<CallResponse> {
    try {
      const response = await axios.get(`${API_URL}/calls`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching calls:', error);
      return {
        success: false,
        data: { calls: [], count: 0 },
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getRecentCalls(limit: number = 5): Promise<CallResponse> {
    try {
      const response = await axios.get(`${API_URL}/calls/recent?limit=${limit}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent calls:', error);
      return {
        success: false,
        data: { calls: [], count: 0 },
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getCallStats(): Promise<CallStatsResponse> {
    try {
      const response = await axios.get(`${API_URL}/calls/stats`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching call stats:', error);
      return {
        success: false,
        data: { total: 0, success: 0, failed: 0, today: 0 },
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getCallById(id: string): Promise<{ success: boolean; data?: Call; error?: string }> {
    try {
      const response = await axios.get(`${API_URL}/calls/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching call:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export default new CallService();
