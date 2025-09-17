import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Trash2, CheckCircle } from 'lucide-react';


const PhoneUploadPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();

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
        setUploadSuccess(true);
        if (result.data.errors && result.data.errors.length > 0) {
          setErrors(result.data.errors);
        }
        // Redirect to bookings page after successful upload
        setTimeout(() => {
          navigate('/admin/bookings');
        }, 2000);
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

  const clearData = () => {
    setUploadedFile(null);
    setErrors([]);
    setUploadSuccess(false);
  };

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

      {/* Success Message */}
      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Upload Successful!</h3>
              <p className="text-green-700">
                Your CSV file has been processed and the data has been saved to the database.
                You will be redirected to the Bookings page in a moment...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneUploadPage;
