export interface Profile {
  id: string;
  name: string;
  email: string;
  location: string;
  phone_number: string;
}

export interface Order {
  id: string;
  user_id: string;
  created_at: string;
  total_amount: number;
  status: string;
}

export interface UserWithOrders extends Profile {
  orders: Order[];
}