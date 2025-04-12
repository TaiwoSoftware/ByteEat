import { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";
import type { Order } from "../Admin/types/database";

interface UserOrdersProps {
  userId: string;
}

const UserOrders = ({ userId }: UserOrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (ordersError) {
          setError("Error fetching orders: " + ordersError.message);
          return;
        }

        setOrders(ordersData || []);
      } catch (err) {
        setError("An error occurred: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Orders History</h3>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-900">
                Total: ${order.total_amount.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;