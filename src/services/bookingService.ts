interface Booking {
  _id: string;
  phone_number: string;
  guest_firstname: string;
  guest_surname: string;
  booking_date: string;
  booking_time: string;
  party_size: number;
  notes: string;
  outcome: string;
  new_time: string;
  new_date: string;
  new_party_size: number | null;
  confirmation_call_notes: string;
  recording_url: string;
  call_duration_sec: number | null;
  booking_ref: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingResponse {
  success: boolean;
  data: {
    bookings: Booking[];
    count: number;
  };
  error?: string;
}

interface CSVFileBookingResponse {
  success: boolean;
  data: {
    bookings: Booking[];
    count: number;
    csv_file: {
      id: string;
      google_drive_file_name: string;
      google_drive_file_url: string;
      created_at: string;
    };
  };
  error?: string;
}

class BookingService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getAllBookings(): Promise<BookingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/booking`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return {
        success: false,
        data: { bookings: [], count: 0 },
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getBookingsByCSVFile(csvFileId: string): Promise<CSVFileBookingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/booking/csv-file/${csvFileId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching bookings by CSV file:', error);
      return {
        success: false,
        data: { 
          bookings: [], 
          count: 0,
          csv_file: {
            id: '',
            google_drive_file_name: '',
            google_drive_file_url: '',
            created_at: ''
          }
        },
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async clearAllData(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/booking/clear`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error clearing data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async checkBookings(selectedBookings: string[]): Promise<{ 
    success: boolean; 
    data?: {
      results: Array<{
        bookingId: string;
        bookingRef: string;
        phoneNumber: string;
        status: string;
        callId: string | null;
        error: string | null;
      }>;
      errors?: string[];
      summary: {
        total: number;
        successful: number;
        failed: number;
      };
    }; 
    error?: string 
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/booking/check-booking`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ selectedBookings }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking bookings:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export default new BookingService();
export type { Booking, BookingResponse, CSVFileBookingResponse };
