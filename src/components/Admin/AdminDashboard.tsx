/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../Auth/supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import Users from "./Users";
import UserOrders from "./UserOrder";

export const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalVendors, setTotalVendors] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [selectedUserId] = useState<number | null>(null); // State for selected user
  const [, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true; // to avoid state update on unmounted component

    // Set up auth listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      if (isMounted) {
        setUser(session?.user ?? null);
      }
    });

    const fetchTotalUsers = async () => {
      try {
        const { count, error } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        if (error) {
          console.error("Error fetching users:", error.message);
          return;
        }

        setTotalUsers(count ?? 0);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    const fetchTotalVendors = async () => {
      try {
        const { count, error } = await supabase
          .from("vendors")
          .select("*", { count: "exact", head: true });

        if (error) {
          console.error("Error fetching vendors:", error.message);
          return;
        }

        setTotalVendors(count ?? 0);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchTotalUsers();
    fetchTotalVendors();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white shadow-md p-6 lg:h-full lg:block flex-shrink-0">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="space-y-4">
          <Link to="#" className="block text-gray-700 hover:text-orange-600">
            Dashboard
          </Link>
          <Link
            to="#users"
            className="block text-gray-700 hover:text-orange-600"
          >
            Users
          </Link>
          <Link to="#" className="block text-gray-700 hover:text-orange-600">
            Vendors
          </Link>
          <Link to="#" className="block text-gray-700 hover:text-orange-600">
            Content
          </Link>
          <Link to="#" className="block text-gray-700 hover:text-orange-600">
            Security
          </Link>
          <Link to="#" className="block text-gray-700 hover:text-orange-600">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        <h1 className="text-2xl font-bold mb-6">Welcome, Admin</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-3xl font-semibold text-gray-800">{totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Vendors</p>
            <p className="text-3xl font-semibold text-gray-800">
              {totalVendors}
            </p>
          </div>
        </div>

        {/* Users Section */}
        <div id="users" className="mt-10">
          <Users />
          {user && selectedUserId && (
            <UserOrders userId={selectedUserId} /> // Render UserOrders when a user is selected
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
