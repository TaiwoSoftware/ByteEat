import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Auth/supabaseClient";
import { gsap } from "gsap";

interface User {
  id: string;
  email: string;
  created_at: string;
}

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar bg-gray-800 text-white w-64 p-5">
      <h2 className="text-xl font-semibold mb-4">User Dashboard</h2>
      <ul>
        <li><a href="#profile" className="block py-2">Profile</a></li>
        <li><a href="#orders" className="block py-2">Orders</a></li>
        <li><a href="#settings" className="block py-2">Settings</a></li>
        <li><a href="#logout" className="block py-2">Logout</a></li>
      </ul>
    </div>
  );
};

export const Profile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        console.error("User not authenticated", error);
        setError("User not authenticated");
        navigate("/user");
        return;
      }

      setUserData({
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at!,
      });

      setLoading(false);
    };

    fetchUserData();

    // Animation on page load
    gsap.from(".profile-container", { opacity: 0, duration: 1, y: -50 });
    gsap.from(".sidebar", { opacity: 0, duration: 1, x: -100 });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/user");
  };

  const handleUpdateEmail = async () => {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) return alert(error.message);
    alert("Email updated! Check your inbox for confirmation.");
    setUserData((prev) => prev && { ...prev, email: newEmail });
  };

  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return alert(error.message);
    alert("Password updated successfully.");
  };

  const handleDeleteAccount = async () => {
    const { error } = await supabase.auth.admin.deleteUser(userData!.id);
    if (error) return alert(error.message);
    alert("Account deleted.");
    navigate("/user");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex">
      <Sidebar />

      <div className="profile-container flex-1 p-10 bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-3xl font-semibold text-center text-orange-600 mb-6">
            Profile Page
          </h2>

          {userData ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-700">User ID:</h3>
                <p className="text-gray-900">{userData.id}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-700">Email:</h3>
                <p className="text-gray-900">{userData.email}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-700">Account Created:</h3>
                <p className="text-gray-900">
                  {new Date(userData.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Update Email */}
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-gray-700">Update Email:</h3>
                <input
                  type="email"
                  placeholder="Enter new email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  onClick={handleUpdateEmail}
                  className="w-full bg-blue-500 text-white p-2 rounded-md"
                >
                  Update Email
                </button>
              </div>

              {/* Update Password */}
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-gray-700">Update Password:</h3>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  onClick={handleUpdatePassword}
                  className="w-full bg-green-500 text-white p-2 rounded-md"
                >
                  Update Password
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white p-2 rounded-md"
              >
                Logout
              </button>

              {/* Delete Account Button */}
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
              >
                Delete Account
              </button>
            </div>
          ) : (
            <p className="text-red-500">User data not found</p>
          )}
        </div>
      </div>
    </div>
  );
};
