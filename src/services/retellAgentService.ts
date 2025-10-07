const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export interface RetellAgent {
  _id: string;
  name: string;
  phoneNumber: string;
  apiKey: string;
  isActive: boolean;
  description: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRetellAgentData {
  name: string;
  phoneNumber: string;
  apiKey: string;
  description?: string;
}

export interface UpdateRetellAgentData {
  name?: string;
  phoneNumber?: string;
  apiKey?: string;
  description?: string;
}

export interface RetellAgentResponse {
  success: boolean;
  data: RetellAgent;
  error?: string;
}

export interface RetellAgentsListResponse {
  success: boolean;
  data: {
    retellAgents: RetellAgent[];
    count: number;
  };
  error?: string;
}

class RetellAgentService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getRetellAgents(): Promise<RetellAgentsListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/retell-agents`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch RetellAgents');
      }

      return data;
    } catch (error) {
      console.error('Error fetching RetellAgents:', error);
      throw error;
    }
  }

  async getRetellAgentById(id: string): Promise<RetellAgentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/retell-agents/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch RetellAgent');
      }

      return data;
    } catch (error) {
      console.error('Error fetching RetellAgent:', error);
      throw error;
    }
  }

  async createRetellAgent(retellAgentData: CreateRetellAgentData): Promise<RetellAgentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/retell-agents`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(retellAgentData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create RetellAgent');
      }

      return data;
    } catch (error) {
      console.error('Error creating RetellAgent:', error);
      throw error;
    }
  }

  async updateRetellAgent(id: string, retellAgentData: UpdateRetellAgentData): Promise<RetellAgentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/retell-agents/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(retellAgentData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update RetellAgent');
      }

      return data;
    } catch (error) {
      console.error('Error updating RetellAgent:', error);
      throw error;
    }
  }

  async deleteRetellAgent(id: string): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/retell-agents/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete RetellAgent');
      }

      return data;
    } catch (error) {
      console.error('Error deleting RetellAgent:', error);
      throw error;
    }
  }

  async toggleRetellAgentStatus(id: string): Promise<RetellAgentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/retell-agents/${id}/toggle`, {
        method: 'PATCH',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle RetellAgent status');
      }

      return data;
    } catch (error) {
      console.error('Error toggling RetellAgent status:', error);
      throw error;
    }
  }
}

export const retellAgentService = new RetellAgentService();
