import { useState } from "react";
import { supabase } from "../Auth/supabaseClient"; // Make sure to import your supabaseClient
import background from "../Images/tasty-pakistani-dish-top-view.jpg";

export const VendorsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the authenticated user using the new auth method
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to create a vendor page.");
      return;
    }

    try {
      let logoUrl: string | null = null;

      // Upload logo file if available
      if (logoFile) {
        const fileName = `${Date.now()}-${logoFile.name}`;
        const { error: uploadError } = await supabase
          .storage
          .from("vendors-logos")
          .upload(fileName, logoFile);

        if (uploadError) {
          console.error("File upload error:", uploadError);
          alert("File upload failed: " + uploadError.message);
          return;
        }

        // Get the public URL of the uploaded logo.
        // For supabase-js v2, use publicUrl instead of publicURL.
        const { data: publicUrlData } = supabase
          .storage
          .from("vendors-logos")
          .getPublicUrl(fileName);
        logoUrl = publicUrlData.publicUrl;
      }

      // Insert vendor information including the user_id into the 'vendors' table.
      const { error: insertError } = await supabase
        .from("vendors")
        .insert([
          {
            name,
            category,
            email,
            phone,
            address,
            logo_url: logoUrl, // Store the URL of the uploaded logo (should not be null)
            user_id: user.id,  // Link this vendor to the authenticated user
          },
        ]);

      if (insertError) throw insertError;

      alert("Vendor created successfully");
      setShowForm(false); // Close the form after submission
    } catch (error) {
      console.error("Error creating vendor:", error);
      alert("There was an error creating the vendor.");
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: `url(${background})`, // Background Image
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content (Make sure it's above the overlay) */}
      <div className="relative z-10 text-center">
        {/* Create Page Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-14 py-6 text-3xl text-white bg-[#a82f17] rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-orange-700 active:scale-95 animate-bounce"
          >
            Create your page
          </button>
        )}

        {/* Vendor Form (Appears on Button Click) */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full max-w-lg bg-white p-8 rounded-lg shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              Create Your Vendor Page
            </h2>

            {/* Business Name */}
            <div>
              <label className="block font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>

            {/* Business Category */}
            <div className="mt-4">
              <label className="block font-medium text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                required
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
              </select>
            </div>

            {/* Contact Details */}
            <div className="mt-4">
              <label className="block font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>

            {/* Business Address */}
            <div className="mt-4">
              <label className="block font-medium text-gray-700">
                Business Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>

            {/* Upload Logo */}
            <div className="mt-4">
              <label className="block font-medium text-gray-700">
                Business Logo
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 rounded-lg shadow-md hover:bg-orange-700 transition-transform transform hover:scale-105"
              >
                Create Vendor Page
              </button>
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
