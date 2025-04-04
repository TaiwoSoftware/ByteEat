import React, { useEffect, useState } from "react";
import { Profile } from "./Profile";

const Sidebar: React.FC = () => {
  const [ordersCount, setOrdersCount] = useState<number>(0); // Total count of items in the cart
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    // Fetch cart data from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Set the ordersCount to the length of the cart array
    setOrdersCount(storedCart.length);
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible); // Toggle modal visibility
  };

  return (
    <div className="sidebar bg-gray-800 text-white w-64 p-5">
      <h2 className="text-xl font-semibold mb-4">User Dashboard</h2>
      <ul>
        <li>
          <a href="#profile" className="block py-2">
            Profile
          </a>
        </li>
        <li>
          <button
            onClick={toggleModal}
            className="block py-2"
          >
            Cart ({ordersCount})
          </button>
        </li>
        <li>
          <a href="#settings" className="block py-2">
            Settings
          </a>
        </li>
        <li>
          <a href="#logout" className="block py-2">
            Logout
          </a>
        </li>
      </ul>

      {/* Modal for Cart Details */}
      {modalVisible && <Profile />}
    </div>
  );
};

export default Sidebar;
