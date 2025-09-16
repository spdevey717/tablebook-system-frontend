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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Selection state
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

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
        setCurrentPage(1); // Reset to first page when new data is loaded
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

  const downloadSelectedResults = () => {
    const selectedData = phoneData.filter((_, index) => selectedRows.has(index));
    const csvContent = [
      ['Original Phone', 'Normalized Phone', 'Valid', 'Error', 'Guest Firstname', 'Guest Surname', 'Booking Date', 'Booking Time', 'Party Size', 'Notes', 'Outcome', 'New Time', 'New Date', 'New Party Size', 'Confirmation Call Notes', 'Recording URL', 'Call Duration Sec', 'Booking Ref'],
      ...selectedData.map(row => [
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
    a.download = `selected_phone_numbers_${selectedRows.size}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearData = () => {
    setPhoneData([]);
    setUploadedFile(null);
    setErrors([]);
    setCurrentPage(1); // Reset to first page when clearing data
    setSelectedRows(new Set()); // Clear selections
  };

  // Selection handlers
  const toggleRowSelection = (index: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedRows(newSelection);
  };

  const selectAllRows = () => {
    const allIndices = phoneData.map((_, index) => index);
    setSelectedRows(new Set(allIndices));
  };

  const clearAllSelections = () => {
    setSelectedRows(new Set());
  };

  const selectCurrentPageRows = () => {
    const currentPageIndices = currentData.map((_, index) => startIndex + index);
    const newSelection = new Set(selectedRows);
    currentPageIndices.forEach(index => newSelection.add(index));
    setSelectedRows(newSelection);
  };

  const clearCurrentPageSelections = () => {
    const currentPageIndices = currentData.map((_, index) => startIndex + index);
    const newSelection = new Set(selectedRows);
    currentPageIndices.forEach(index => newSelection.delete(index));
    setSelectedRows(newSelection);
  };

  // Pagination calculations
  const totalItems = phoneData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = phoneData.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
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
                  {totalPages > 1 && (
                    <span className="ml-2 text-primary-600">
                      • Page {currentPage} of {totalPages}
                    </span>
                  )}
                  {selectedRows.size > 0 && (
                    <span className="ml-2 text-blue-600">
                      • {selectedRows.size} selected
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Items per page selector */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                    Show:
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={phoneData.length}>Show All</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={downloadResults}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All</span>
                  </button>
                  {selectedRows.size > 0 && (
                    <button
                      onClick={downloadSelectedResults}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Selected ({selectedRows.size})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Selection Controls */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={selectAllRows}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Select All ({phoneData.length})
                </button>
                <button
                  onClick={selectCurrentPageRows}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Select Current Page ({currentData.length})
                </button>
                <button
                  onClick={clearAllSelections}
                  disabled={selectedRows.size === 0}
                  className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {selectedRows.size > 0 && (
                  <span className="text-blue-600 font-medium">
                    {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex flex-col space-y-1">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === phoneData.length && phoneData.length > 0}
                        onChange={() => {
                          if (selectedRows.size === phoneData.length) {
                            clearAllSelections();
                          } else {
                            selectAllRows();
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        title="Select All"
                      />
                      {totalPages > 1 && (
                        <input
                          type="checkbox"
                          checked={currentData.every((_, index) => selectedRows.has(startIndex + index)) && currentData.length > 0}
                          onChange={() => {
                            const allCurrentPageSelected = currentData.every((_, index) => selectedRows.has(startIndex + index));
                            if (allCurrentPageSelected) {
                              clearCurrentPageSelections();
                            } else {
                              selectCurrentPageRows();
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          title="Select Current Page"
                        />
                      )}
                    </div>
                  </th>
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
                {currentData.map((row, index) => {
                  const actualIndex = startIndex + index; // Calculate the actual index in the full dataset
                  return (
                  <tr key={actualIndex} className={`${row.isValid ? 'bg-green-50' : 'bg-red-50'} ${selectedRows.has(actualIndex) ? 'ring-2 ring-blue-500' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(actualIndex)}
                        onChange={() => toggleRowSelection(actualIndex)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
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
                      {row.booking_ref}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                </div>
                <div className="flex items-center space-x-2">
                  {/* Previous button */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {/* Show first page */}
                    {currentPage > 3 && (
                      <>
                        <button
                          onClick={() => goToPage(1)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        >
                          1
                        </button>
                        {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                      </>
                    )}

                    {/* Show pages around current page */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      if (pageNum < 1 || pageNum > totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-1 text-sm border rounded ${
                            currentPage === pageNum
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Show last page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                        <button
                          onClick={() => goToPage(totalPages)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhoneUploadPage;
