import { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";
import type { Order } from "../Admin/types/database";

interface UserOrdersProps {
  userId: number; // ✅ Use number instead of string
}

const UserOrders = ({ userId }: UserOrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);

        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userId); // ✅ Using number directly

        if (ordersError) {
          setError("Error fetching orders: " + ordersError.message);
          return;
        }

        setOrders(ordersData ?? []);
      } catch (err) {
        setError(
          "An error occurred: " +
            (err instanceof Error ? err.message : String(err))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [userId]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Order History</h4>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border p-4 rounded-md shadow-sm bg-gray-50"
            >
              <div>
                <strong>Order ID:</strong> {order.id}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(order.created_at).toLocaleDateString()}
              </div>
              <div>
                {/* <strong>Status:</strong> {order.status} */}
              </div>
              <div>
                <strong>Total:</strong> ${order.total_price.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrders;
