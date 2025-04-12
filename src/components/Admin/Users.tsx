import { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";
import type { UserWithOrders } from "../Admin/types/database";

const Users = () => {
  const [users, setUsers] = useState<UserWithOrders[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsersAndOrders = async () => {
      try {
        setLoading(true);
        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("id, name, email, location, phone_number");

        if (usersError) {
          setError("Error fetching users: " + usersError.message);
          return;
        }

        if (!usersData || usersData.length === 0) {
          setError("No users found.");
          return;
        }

        const usersWithOrders: UserWithOrders[] = await Promise.all(
          usersData.map(async (user) => {
            const { data: ordersData, error: ordersError } = await supabase
              .from("orders")
              .select("id, created_at, total_amount, status")
              .eq("user_id", user.id);

            if (ordersError) {
              console.error("Error fetching orders for user:", ordersError);
              return {
                ...user,
                orders: [],
              } as UserWithOrders;
            }

            return {
              ...user,
              orders: ordersData ?? [],
            } as UserWithOrders;
          })
        );

        setUsers(usersWithOrders);
      } catch (err) {
        setError(
          "An error occurred: " +
            (err instanceof Error ? err.message : String(err))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div id="users" className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Users</h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {user.name}
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>{user.email}</p>
                <p>{user.location}</p>
                <p>{user.phone_number}</p>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Orders</h4>
                {user.orders.length > 0 ? (
                  <div className="space-y-3">
                    {user.orders.map((order) => (
                      <div key={order.id} className="bg-gray-50 p-3 rounded">
                        <p className="text-sm font-medium text-gray-900">
                          Order ID: {order.id}
                        </p>
                        <p className="text-sm text-gray-600">
                          Date:{" "}
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Amount: ${order.total_amount.toFixed(2)}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No orders placed yet.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
