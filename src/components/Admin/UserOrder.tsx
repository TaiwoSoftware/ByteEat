import { useEffect, useState } from 'react';
import { supabase } from '../Auth/supabaseClient';
import type { Database } from '../Auth/database';

type Order = Database['public']['Tables']['orders']['Row'];

interface UserOrdersProps {
  userId: string;
}

const UserOrders = ({ userId }: UserOrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId);

        if (ordersError) throw ordersError;
        setOrders(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found for this user.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="px-3 py-1 rounded-full text-sm font-medium" 
                      style={{
                        backgroundColor: order.order_status === 'completed' ? '#DFF7E9' : '#FFF4DE',
                        color: order.order_status === 'completed' ? '#1F7B4D' : '#946B38'
                      }}>
                  {order.order_status}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-lg font-semibold">
                ${order.total_price.toFixed(2)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserOrders;