import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import type { PhoneValidationResult } from '../types';

export const normalizePhoneNumber = (
  phoneRaw: string, 
  dialPrefix: string, 
  countryCode: string = 'GB'
): PhoneValidationResult => {
  try {
    // Clean the raw phone number
    let cleanedPhone = phoneRaw.replace(/[^\d+\-\(\)\s]/g, '').trim();
    
    // If the phone number doesn't start with +, add the dial prefix
    if (!cleanedPhone.startsWith('+')) {
      // Remove any leading 0 if present
      if (cleanedPhone.startsWith('0')) {
        cleanedPhone = cleanedPhone.substring(1);
      }
      cleanedPhone = dialPrefix + cleanedPhone;
    }
    
    // Validate the phone number
    if (!isValidPhoneNumber(cleanedPhone)) {
      return {
        isValid: false,
        phone_e164: null,
        error: 'Invalid phone number format'
      };
    }
    
    // Parse and format to E.164
    const phoneNumber = parsePhoneNumber(cleanedPhone);
    const e164 = phoneNumber.format('E.164');
    
    return {
      isValid: true,
      phone_e164: e164
    };
  } catch (error) {
    return {
      isValid: false,
      phone_e164: null,
      error: 'Failed to parse phone number'
    };
  }
};

export const formatPhoneForDisplay = (phoneE164: string): string => {
  try {
    const phoneNumber = parsePhoneNumber(phoneE164);
    return phoneNumber.formatNational();
  } catch {
    return phoneE164;
  }
};

export const validateCSVPhoneNumbers = (
  csvData: Array<{ phone_raw: string; [key: string]: any }>,
  dialPrefix: string,
  countryCode: string = 'GB'
): Array<{ data: any; validation: PhoneValidationResult }> => {
  return csvData.map(row => ({
    data: row,
    validation: normalizePhoneNumber(row.phone_raw, dialPrefix, countryCode)
  }));
};
