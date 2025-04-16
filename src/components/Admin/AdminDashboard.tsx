import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../Auth/supabaseClient";
import type { User } from "@supabase/supabase-js";
import Users from "./Users";
import UserOrders from "./UserOrder";

export const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalVendors, setTotalVendors] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
      }
    });

    const fetchTotalUsers = async () => {
      try {
        const { count, error } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        if (error) throw error;
        if (isMounted) setTotalUsers(count ?? 0);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchTotalVendors = async () => {
      try {
        const { count, error } = await supabase
          .from("vendors")
          .select("*", { count: "exact", head: true });

        if (error) throw error;
        if (isMounted) setTotalVendors(count ?? 0);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };

    setupAuth();
    fetchTotalUsers();
    fetchTotalVendors();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white shadow-md p-6 lg:h-screen lg:block flex-shrink-0">
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
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Welcome, Admin</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-3xl font-semibold text-gray-800">{totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm">Total Vendors</p>
            <p className="text-3xl font-semibold text-gray-800">
              {totalVendors}
            </p>
          </div>
        </div>

        {/* Users Section */}
        <div id="users" className="mt-10">
          <Users onSelectUser={(id: string) => setSelectedUserId(id)} />
          {selectedUserId && <UserOrders userId={selectedUserId} />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
