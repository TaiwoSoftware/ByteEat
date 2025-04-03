import { useState } from "react";
import { supabase } from "../Auth/supabaseClient"; // Make sure to import your supabaseClient
import background from "../Images/tasty-pakistani-dish-top-view.jpg";
import { useNavigate } from "react-router-dom";

export const VendorsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to create a vendor page.");
      setLoading(false);
      return;
    }

    try {
      let logoUrl: string | null = null;
      if (logoFile) {
        const fileName = `${Date.now()}-${logoFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("vendors-logos")
          .upload(fileName, logoFile);

        if (uploadError) {
          console.error("File upload error:", uploadError);
          alert("File upload failed: " + uploadError.message);
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("vendors-logos")
          .getPublicUrl(fileName);
        logoUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("vendors").insert([
        {
          name,
          category,
          email,
          phone,
          address,
          logo_url: logoUrl,
          user_id: user.id,
        },
      ]);

      if (insertError) throw insertError;

      alert("Vendor created successfully");
      navigate("/vendors-dashboard");
      setShowForm(false);
    } catch (error) {
      console.error("Error creating vendor:", error);
      alert("There was an error creating the vendor.");
    }
    setLoading(false);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-center">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-14 py-6 text-3xl text-white bg-[#a82f17] rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-orange-700 active:scale-95 animate-bounce"
          >
            Create your page
          </button>
        )}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full max-w-lg bg-white p-8 rounded-lg shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              Create Your Vendor Page
            </h2>
            <div>
              <label className="block font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block font-medium text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block font-medium text-gray-700">
                Business Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block font-medium text-gray-700">
                Business Logo
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="w-full    text-white py-3 rounded-lg shadow-md hover:bg-orange-700 transition-transform transform hover:scale-105"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Vendor Page"}
              </button>
              ;
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg shadow-md hover:bg-gray-400 transition-transform transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
