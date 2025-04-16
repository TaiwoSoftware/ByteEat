export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string
          location: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone: string
          location: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string
          location?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          [x: string]: any
          id: string
          user_id: string
          total_price: number
          order_status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_price: number
          order_status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_price?: number
          order_status?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}