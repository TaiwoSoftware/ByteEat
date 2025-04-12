import { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";
import UserOrders from "./UserOrder";

// Define types for User and Orders
interface Order {
  id: string;
  created_at: string;
  total_price: number;
  order_status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  location: string | null;
  phone_number: string | null;
  orders: Order[];
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]); // Type the state as User[]
  const [error, setError] = useState<string>(""); // Error message is a string
  const [loading, setLoading] = useState<boolean>(true); // Loading is a boolean
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // User ID can be string or null

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

        const usersWithOrders = await Promise.all(
          usersData.map(async (user) => {
            const { data: ordersData, error: ordersError } = await supabase
              .from("orders")
              .select("id, created_at, total_price, order_status")
              .eq("user_id", user.id);

            if (ordersError) {
              console.error("Error fetching orders for user:", ordersError);
              return {
                ...user,
                orders: [], // Ensure we return an empty array in case of an error
              };
            }

            return {
              ...user,
              orders: ordersData ?? [], // Ensure empty array if no orders
            };
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
                {user.name || "No Name"}
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>{user.email}</p>
                <p>{user.location || "No Location"}</p>
                <p>{user.phone_number || "No Phone"}</p>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Orders</h4>
                <button
                  onClick={() => setSelectedUserId(user.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Orders
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedUserId && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">User Orders</h3>
              <button
                onClick={() => setSelectedUserId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <UserOrders userId={selectedUserId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
