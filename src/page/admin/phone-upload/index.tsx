import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle, Phone, Download, Trash2 } from 'lucide-react';

interface NormalizedPhoneData {
  original: string;
  normalized: string;
  isValid: boolean;
  error?: string;
  guest_firstname?: string;
  guest_surname?: string;
  booking_date?: string;
  booking_time?: string;
  party_size?: string;
  notes?: string;
  outcome?: string;
  new_time?: string;
  new_date?: string;
  new_party_size?: string;
  confirmation_call_notes?: string;
  recording_url?: string;
  call_duration_sec?: string;
  booking_ref?: string;
}

const PhoneUploadPage: React.FC = () => {
  const [phoneData, setPhoneData] = useState<NormalizedPhoneData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);
    setErrors([]);

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/phone-upload/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setPhoneData(result.data.results);
        if (result.data.errors && result.data.errors.length > 0) {
          setErrors(result.data.errors);
        }
      } else {
        setErrors([result.error || 'Failed to process CSV file']);
      }
    } catch (error) {
      setErrors(['Network error: Failed to upload file']);
      console.error('Upload error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false
  });

  const downloadResults = () => {
    const csvContent = [
      ['Original Phone', 'Normalized Phone', 'Valid', 'Error', 'Guest Firstname', 'Guest Surname', 'Booking Date', 'Booking Time', 'Party Size', 'Notes', 'Outcome', 'New Time', 'New Date', 'New Party Size', 'Confirmation Call Notes', 'Recording URL', 'Call Duration Sec', 'Booking Ref'],
      ...phoneData.map(row => [
        row.original,
        row.normalized,
        row.isValid ? 'Yes' : 'No',
        row.error || '',
        row.guest_firstname || '',
        row.guest_surname || '',
        row.booking_date || '',
        row.booking_time || '',
        row.party_size || '',
        row.notes || '',
        row.outcome || '',
        row.new_time || '',
        row.new_date || '',
        row.new_party_size || '',
        row.confirmation_call_notes || '',
        row.recording_url || '',
        row.call_duration_sec || '',
        row.booking_ref || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'normalized_phone_numbers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearData = () => {
    setPhoneData([]);
    setUploadedFile(null);
    setErrors([]);
  };

  const validCount = phoneData.filter(row => row.isValid).length;
  const invalidCount = phoneData.length - validCount;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Phone Number Upload</h1>
        <p className="text-gray-600">
          Upload a CSV file containing phone numbers to normalize and validate them.
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-primary-600 font-medium">Drop the CSV file here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop a CSV file here, or <span className="text-primary-600 font-medium">click to browse</span>
              </p>
              <p className="text-sm text-gray-500">
                Required column: phone_number. Optional columns: name, email, notes
              </p>
            </div>
          )}
        </div>

        {uploadedFile && (
          <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{uploadedFile.name}</span>
              <span className="text-sm text-gray-500">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
            <button
              onClick={clearData}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing CSV file...</p>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          {errors.map((error, index) => (
            <p key={index} className="text-red-700 text-sm">{error}</p>
          ))}
        </div>
      )}

      {/* Results */}
      {phoneData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Phone Number Analysis Results
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {phoneData.length} total numbers • {validCount} valid • {invalidCount} invalid
                </p>
              </div>
              <button
                onClick={downloadResults}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Results</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Normalized Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest Firstname
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest Surname
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Party Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Outcome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Party Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confirmation Call Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recording URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Call Duration Sec
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Ref
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {phoneData.map((row, index) => (
                  <tr key={index} className={row.isValid ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {row.original}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${row.isValid ? 'text-green-700 font-medium' : 'text-red-700'}`}>
                        {row.normalized}
                      </span>
                      {!row.isValid && row.error && (
                        <p className="text-xs text-red-600 mt-1">
                          {row.error}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.guest_firstname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.guest_surname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.booking_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.booking_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.party_size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.outcome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.new_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.new_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.new_party_size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.confirmation_call_notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.recording_url}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.call_duration_sec}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneUploadPage;
