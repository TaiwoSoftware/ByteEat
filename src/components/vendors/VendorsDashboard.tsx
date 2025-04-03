import { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";
import { useNavigate } from "react-router-dom";

export const VendorsDashboard = () => {
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          alert("You must be logged in to view the vendor dashboard.");
          navigate("/login");
          return;
        }

        // Fetch vendor data where user_id matches the authenticated user
        const { data, error } = await supabase
          .from("vendors")
          .select("name, category, phone, address, logo_url")
          .eq("user_id", user.id)
          .maybeSingle(); // ✅ Avoids JSON error

        if (error) throw error;

        setVendor(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [navigate]);

  if (loading) return <div className="text-center py-10 text-xl">Loading vendor data...</div>;
  if (error) return <div className="text-red-600 text-center py-10">{error}</div>;
  if (!vendor) return <div className="text-center py-10 text-xl">No vendor found. Please create one.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Vendor Dashboard</h2>

        {/* Vendor Logo */}
        {vendor.logo_url && (
          <div className="flex justify-center mb-4">
            <img src={vendor.logo_url} alt="Vendor Logo" className="w-32 h-32 rounded-full object-cover" />
          </div>
        )}

        {/* Vendor Details */}
        <div className="text-lg space-y-3">
          <p><strong>Name:</strong> {vendor.name}</p>
          <p><strong>Category:</strong> {vendor.category}</p>
          <p><strong>Phone:</strong> {vendor.phone}</p>
          <p><strong>Address:</strong> {vendor.address}</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/login");
          }}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg shadow-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
