import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Users, ExternalLink, Eye } from 'lucide-react';
import csvFileService, { type CSVFile } from '../services/csvFileService';

const CSVFilesList = () => {
  const [csvFiles, setCsvFiles] = useState<CSVFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCSVFiles();
  }, []);

  const fetchCSVFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await csvFileService.getCSVFiles();
      
      if (response.success) {
        setCsvFiles(response.data.csv_files);
      } else {
        setError(response.error || 'Failed to fetch CSV files');
      }
    } catch (err) {
      setError('Network error: Failed to fetch CSV files');
      console.error('Error fetching CSV files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBookings = (csvFileId: string) => {
    navigate(`/admin/bookings/${csvFileId}`);
  };

  const handleOpenGoogleDrive = (url: string) => {
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter files based on search term
  const filteredFiles = csvFiles.filter(file => 
    file.original_file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.google_drive_file_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading CSV files...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CSV Files</h1>
          <p className="text-gray-600">
            Manage uploaded CSV files • {csvFiles.length} total files
          </p>
        </div>
        <button
          onClick={fetchCSVFiles}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Uploaded Files ({filteredFiles.length} of {csvFiles.length})
            </h3>
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No CSV files found</h3>
            <p className="text-gray-500">
              {csvFiles.length === 0 
                ? "No CSV files have been uploaded yet. Upload a CSV file to get started."
                : "No files match your current search criteria."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Google Drive
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <tr key={file._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {file.original_file_name || file.google_drive_file_name || 'Unknown File'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {file._id.slice(-8)}
                            {file.google_drive_file_name && file.original_file_name && file.google_drive_file_name !== file.original_file_name && (
                              <span className="ml-2 text-xs text-blue-600">
                                (Stored as: {file.google_drive_file_name})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {formatDate(file.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {file.booking_count || 0} bookings
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {file.google_drive_file_url ? (
                        <button
                          onClick={() => handleOpenGoogleDrive(file.google_drive_file_url!)}
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          <span className="text-sm">Open</span>
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">Not available</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewBookings(file._id)}
                          className="flex items-center text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span>View Bookings</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVFilesList;
