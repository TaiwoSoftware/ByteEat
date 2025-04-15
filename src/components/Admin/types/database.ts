export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string;
          location: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          phone: string;
          location: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          location?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          total_price: number;
          order_status: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          total_price: number;
          order_status: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          total_price?: number;
          order_status?: string;
        };
      };
    };
  };
};