import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../Auth/supabaseClient";
import type { User } from "@supabase/supabase-js";
import Users from "./Users";
import UserOrders from "./UserOrder";

interface Vendor {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  address: string;
  logo_url: string;
}

interface FoodImage {
  id: string;
  url: string;
  vendor_id: string;
}

export const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalVendors, setTotalVendors] = useState<number>(0);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [foodImages, setFoodImages] = useState<FoodImage[]>([]);
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

    const fetchVendors = async () => {
      try {
        const { data, error } = await supabase
          .from("vendors")
          .select("id, name, category, email, phone, address, logo_url");

        if (error) throw error;
        if (isMounted) {
          setVendors(data);
          setTotalVendors(data.length);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };

    const fetchFoodImages = async () => {
      try {
        const { data, error } = await supabase
          .storage
          .from('food-images')
          .list();

        if (error) throw error;

        if (data && isMounted) {
          const imageUrls = await Promise.all(
            data.map(async (file) => {
              const { data: { publicUrl } } = supabase
                .storage
                .from('food-images')
                .getPublicUrl(file.name);
              
              return {
                id: file.id,
                url: publicUrl,
                vendor_id: file.metadata?.vendor_id || ''
              };
            })
          );
          setFoodImages(imageUrls);
        }
      } catch (err) {
        console.error("Error fetching food images:", err);
      }
    };

    // const deleteUser = async (userId: string) => {
    //   try {
    //     const { error } = await supabase
    //       .from('profiles')
    //       .delete()
    //       .eq('id', userId);

    //     if (error) throw error;
        
    //     // Refresh the users count
    //     fetchTotalUsers();
    //   } catch (err) {
    //     console.error("Error deleting user:", err);
    //   }
    // };

    setupAuth();
    fetchTotalUsers();
    fetchVendors();
    fetchFoodImages();

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

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Refresh the users count and UI
      setTotalUsers((prev) => prev - 1);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white shadow-md p-6 lg:h-screen lg:block flex-shrink-0">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="space-y-4">
          <Link to="#" className="block text-gray-700 hover:text-orange-600">
            Dashboard
          </Link>
          <Link to="#users" className="block text-gray-700 hover:text-orange-600">
            Users
          </Link>
          <Link to="#vendors" className="block text-gray-700 hover:text-orange-600">
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
            <p className="text-3xl font-semibold text-gray-800">{totalVendors}</p>
          </div>
        </div>

        {/* Users Section */}
        <div id="users" className="mt-10">
          <Users onSelectUser={(id: string) => setSelectedUserId(id)} />
          {selectedUserId && (
            <button
              onClick={() => deleteUser(selectedUserId)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete User
            </button>
          )}
          {selectedUserId && <UserOrders userId={selectedUserId} />}
        </div>

        {/* Vendors Section */}
        <div id="vendors" className="mt-10">
          <h2 className="text-xl font-bold mb-4">Vendors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  {vendor.logo_url && (
                    <img
                      src={vendor.logo_url}
                      alt={`${vendor.name} logo`}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.category}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {vendor.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {vendor.phone}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Address:</span> {vendor.address}
                  </p>
                </div>
                
                {/* Food Images */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Food Images</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {foodImages
                      .filter((img) => img.vendor_id === vendor.id)
                      .map((image) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt="Food item"
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;