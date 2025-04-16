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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found for this user.</p>
      ) : (
        orders.map((order) => {
          let items: any[] = [];
          try {
            items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
          } catch {
            items = [];
          }

          return (
            <div key={order.id} className="border rounded-lg p-4 bg-white shadow-md">
              <div className="mb-4">
                <p className="font-semibold text-lg">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  Placed on: {new Date(order.created_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">User Name: {order.recipient_name}</p>
                <p className="text-sm text-gray-600">Delivery Address: {order.address}</p>
                <p className="text-sm text-gray-600">Payment Status: {order.payment_status}</p>
                <p className="text-sm text-gray-600">Order Status: {order.order_status}</p>
              </div>

              {items.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {items.map((item, idx) =>
                    item.image ? (
                      <img
                        key={idx}
                        src={item.image}
                        alt={`Ordered item ${idx + 1}`}
                        className="w-full h-28 object-cover rounded-md border"
                      />
                    ) : null
                  )}
                </div>
              )}

              <div className="mt-4 text-right">
                <p className="text-lg font-semibold text-gray-800">
                  Total: ${order.total_price?.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UserOrders;
