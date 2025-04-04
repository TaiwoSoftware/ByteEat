/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";
import { useNavigate } from "react-router-dom";

interface Vendor {
  id: string;
  user_id: string;
  name: string;
  category: string;
  phone: string;
  address: string;
  logo_url?: string;
  created_at: string;
}

export const VendorsDashboard = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodDetails, setFoodDetails] = useState("");
  const [foodImage, setFoodImage] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          alert("You must be logged in to view the vendor dashboard.");
          navigate("/login");
          return;
        }

        const { data: vendorData, error: vendorError } = await supabase
          .from("vendors")
          .select("*")
          .eq("user_id", user.id)
          .limit(1);

        if (vendorError) throw vendorError;
        if (!vendorData || vendorData.length === 0) {
          setVendor(null);
        } else {
          setVendor(vendorData[0]);
        }
      } catch (err: any) {
        console.error("Error fetching vendor:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [navigate]);

  const handlePostFood = async () => {
    if (!foodName || !foodPrice || !foodDetails || !vendor) return;

    setPosting(true);
    try {
      let imageUrl = "";

      if (foodImage) {
        const fileExt = foodImage.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `foods/${vendor.id}/${fileName}`;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { error: uploadError } = await supabase.storage
          .from("food-images") // make sure this bucket exists
          .upload(filePath, foodImage);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("food-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("foods").insert([
        {
          name: foodName,
          price: parseFloat(foodPrice),
          details: foodDetails,
          vendor_id: vendor.id,
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;

      alert("Food posted successfully!");
      setFoodName("");
      setFoodPrice("");
      setFoodDetails("");
      setFoodImage(null);
    } catch (err: any) {
      alert("Error posting food: " + err.message);
    } finally {
      setPosting(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-xl">Loading vendor data...</div>
    );
  if (error)
    return <div className="text-red-600 text-center py-10">Error: {error}</div>;
  if (!vendor)
    return (
      <div className="text-center py-10 text-xl">
        No vendor found. Please create one.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 space-y-8">
      {/* Vendor Dashboard Section */}
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Vendor Dashboard
        </h2>

        {vendor.logo_url && (
          <div className="flex justify-center mb-6">
            <img
              src={vendor.logo_url}
              alt="Vendor Logo"
              className="w-40 h-40 rounded-full object-cover border-4 border-gray-300 shadow-md"
            />
          </div>
        )}

        <div className="text-lg text-gray-700 space-y-4">
          <p>
            <strong>Name:</strong> {vendor.name}
          </p>
          <p>
            <strong>Category:</strong> {vendor.category}
          </p>
          <p>
            <strong>Phone:</strong> {vendor.phone}
          </p>
          <p>
            <strong>Address:</strong> {vendor.address}
          </p>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/login");
          }}
          className="mt-8 w-full bg-red-600 text-white py-3 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Post Food Form Section */}
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-lg w-full">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Post a New Food
        </h3>

        <input
          type="text"
          placeholder="Food Name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="w-full mb-4 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
        />

        <input
          type="number"
          placeholder="Price"
          value={foodPrice}
          onChange={(e) => setFoodPrice(e.target.value)}
          className="w-full mb-4 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
        />

        <textarea
          placeholder="Details"
          value={foodDetails}
          onChange={(e) => setFoodDetails(e.target.value)}
          className="w-full mb-4 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFoodImage(e.target.files[0]);
            }
          }}
          className="w-full mb-4 py-3 text-gray-700 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
        />

        <button
          onClick={handlePostFood}
          disabled={posting}
          className="w-full bg-green-600 text-white py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
        >
          {posting ? "Posting..." : "Post Food"}
        </button>
      </div>
    </div>
  );
};
