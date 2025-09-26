interface CSVFile {
  _id: string;
  user_id?: string;
  google_drive_file_id?: string;
  google_drive_file_name?: string;
  original_file_name?: string;
  google_drive_file_url?: string;
  createdAt: string;
  updatedAt: string;
  booking_count?: number;
}

interface CSVFileResponse {
  success: boolean;
  data: {
    csv_files: CSVFile[];
    count: number;
  };
  error?: string;
}

interface GoogleDriveFile {
  id: string;
  name: string;
  webViewLink: string;
  size?: string;
  createdTime: string;
  modifiedTime?: string;
}

interface GoogleDriveFilesResponse {
  success: boolean;
  data: {
    files: GoogleDriveFile[];
    count: number;
  };
  error?: string;
}

class CSVFileService {
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

  async getCSVFiles(): Promise<CSVFileResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/phone-upload/csv-files`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching CSV files:', error);
      return {
        success: false,
        data: { csv_files: [], count: 0 },
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getGoogleDriveFiles(): Promise<GoogleDriveFilesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/phone-upload/files`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Google Drive files:', error);
      return {
        success: false,
        data: { files: [], count: 0 },
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export default new CSVFileService();
export type { CSVFile, CSVFileResponse, GoogleDriveFile, GoogleDriveFilesResponse };
