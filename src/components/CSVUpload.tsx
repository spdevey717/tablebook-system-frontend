import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload, FileText, AlertCircle, CheckCircle, Phone, Edit3 } from 'lucide-react';
import { CSVUploadData, PhoneValidationResult } from '../types';
import { validateCSVPhoneNumbers, normalizePhoneNumber } from '../utils/phoneUtils';

interface CSVUploadProps {
  restaurantId: number;
  dialPrefix: string;
  countryCode: string;
  onUploadComplete: (data: Array<{ data: CSVUploadData; validation: PhoneValidationResult }>) => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ 
  restaurantId, 
  dialPrefix, 
  countryCode, 
  onUploadComplete 
}) => {
  const [csvData, setCsvData] = useState<Array<{ data: CSVUploadData; validation: PhoneValidationResult }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setErrors([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData = results.data as CSVUploadData[];
          
          // Validate required fields
          const requiredFields = ['guest_name', 'phone_raw', 'booking_date', 'party_size', 'notes', 'booking_ref'];
          const missingFields = requiredFields.filter(field => 
            !parsedData[0] || !(field in parsedData[0])
          );

          if (missingFields.length > 0) {
            setErrors([`Missing required fields: ${missingFields.join(', ')}`]);
            setIsProcessing(false);
            return;
          }

          // Validate phone numbers
          const validatedData = validateCSVPhoneNumbers(parsedData, dialPrefix, countryCode);
          setCsvData(validatedData);
          onUploadComplete(validatedData);
        } catch (error) {
          setErrors(['Failed to parse CSV file']);
        } finally {
          setIsProcessing(false);
        }
      },
      error: (error) => {
        setErrors([`CSV parsing error: ${error.message}`]);
        setIsProcessing(false);
      }
    });
  }, [dialPrefix, countryCode, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false
  });

  const handlePhoneCorrection = (index: number, correctedPhone: string) => {
    const validation = normalizePhoneNumber(correctedPhone, dialPrefix, countryCode);
    const updatedData = [...csvData];
    updatedData[index] = {
      ...updatedData[index],
      validation,
      data: {
        ...updatedData[index].data,
        phone_raw: correctedPhone
      }
    };
    setCsvData(updatedData);
    onUploadComplete(updatedData);
  };

  const getStatusIcon = (validation: PhoneValidationResult) => {
    if (validation.isValid) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (validation: PhoneValidationResult) => {
    return validation.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
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
              Required fields: guest_name, phone_raw, booking_date, party_size, notes, booking_ref
            </p>
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          {errors.map((error, index) => (
            <p key={index} className="text-red-700 text-sm">{error}</p>
          ))}
        </div>
      )}

      {/* Results Table */}
      {csvData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              CSV Upload Results ({csvData.length} records)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Phone numbers are automatically normalized using dial prefix: {dialPrefix}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Party Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {csvData.map((row, index) => (
                  <tr key={index} className={getStatusColor(row.validation)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusIcon(row.validation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.data.guest_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {row.data.phone_raw}
                        </span>
                        {!row.validation.isValid && (
                          <button
                            onClick={() => {
                              const corrected = prompt('Enter corrected phone number:', row.data.phone_raw);
                              if (corrected) {
                                handlePhoneCorrection(index, corrected);
                              }
                            }}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {row.validation.isValid && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {row.validation.phone_e164}
                        </p>
                      )}
                      {!row.validation.isValid && (
                        <p className="text-xs text-red-600 mt-1">
                          ✗ {row.validation.error}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.data.booking_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.data.party_size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.data.notes}
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

export default CSVUpload;
