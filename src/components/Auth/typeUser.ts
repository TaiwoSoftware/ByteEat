import { User } from '@supabase/supabase-js';

export interface FormData {
  name: string;
  email: string;
  password: string;
  location: string;
  phoneNumber: string;
  confirmPassword: string;
}

export interface AuthResponse {
  data: {
    user: User | null;
  };
  error: Error | null;
}