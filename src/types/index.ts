export interface Restaurant {
  id: number;
  name: string;
  address: string;
  contact_info: string;
  country_code: string;
  dial_prefix: string;
  retell_agent_id: string;
  retell_number: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  restaurant_id: number;
  booking_ref: string;
  guest_name: string;
  phone_raw: string;
  phone_e164: string;
  booking_datetime: string;
  party_size: number;
  notes: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface Call {
  id: number;
  booking_id: number;
  started_at: string;
  ended_at: string | null;
  duration_sec: number | null;
  recording_url: string | null;
  status: CallStatus;
  created_at: string;
}

export interface CallOutcome {
  id: number;
  call_id: number;
  outcome: CallOutcomeType;
  reason: string;
  new_time: string | null;
  new_party_size: number | null;
  notes_delta: string;
  created_at: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NEEDS_SYNC = 'needs_sync'
}

export enum CallStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum CallOutcomeType {
  CONFIRMED = 'confirmed',
  RESCHEDULED = 'rescheduled',
  CANCELLED = 'cancelled',
  NO_ANSWER = 'no_answer',
  WRONG_NUMBER = 'wrong_number',
  VOICEMAIL = 'voicemail'
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  restaurant_ids: number[];
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface CSVUploadData {
  guest_name: string;
  phone_raw: string;
  booking_date: string;
  party_size: number;
  notes: string;
  booking_ref: string;
}

export interface PhoneValidationResult {
  isValid: boolean;
  phone_e164: string | null;
  error?: string;
}
