import { User } from '@supabase/supabase-js';

export interface FormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    user: User | null;
  };
  error: Error | null;
}