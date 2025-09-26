import { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";

interface UsersProps {
  onSelectUser: (id: string) => void;
}

const Users = ({ onSelectUser }: UsersProps) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        console.log("Profiles data:", data); // ✅ Debug
        setUsers(data ?? []);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">User List</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.user_id} // ✅ fixed: use user_id instead of id
            className="flex items-center justify-between border p-4 rounded-md hover:bg-gray-50 transition"
          >
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-medium text-gray-800">
                  {user.name || "Unnamed User"} {/* ✅ fallback if null */}
                </p>
                <p className="text-sm text-gray-500">
                  {user.email || "No email"} {/* ✅ fallback if null */}
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectUser(user.user_id)} // ✅ consistent
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Orders
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
