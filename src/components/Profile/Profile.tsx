/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { supabase } from "../Auth/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface Order {
  id: number;
  created_at: string;
  total_price: number;
  items: Array<{
    image: string;
    price: number;
    title: string;
    quantity: number;
  }>;
}

interface CartItem {
  title: string;
  price: number;
  quantity: number;
  image: string;
}

const Sidebar: React.FC = () => {
  const [ordersCount, setOrdersCount] = useState<number>(0); // Total count of items in the cart

  useEffect(() => {
    // Fetch cart data from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Set the ordersCount to the length of the cart array
    setOrdersCount(storedCart.length);
  }, []);

  return (
    <div className="sidebar bg-gray-800 text-white w-64 p-5">
      <h2 className="text-xl font-semibold mb-4">User Dashboard</h2>
      <ul>
        <li>
          <a href="#profile" className="block py-2">
            Profile
          </a>
        </li>
        <Link to={'/cart'}>
          <li>
            Cart ({ordersCount})
          </li>
        </Link>
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
    </div>
  );
};

export const Profile: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [, setOrdersCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Typed cartItems as CartItem array
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

      // Fetch orders placed by the user
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", data.user.id);

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        setError("Error fetching orders");
      } else {
        setOrders(ordersData || []);

        // Count the total number of items across all orders
        const totalItems =
          ordersData?.reduce(
            (acc, order) => acc + (order.items?.length || 0),
            0
          ) || 0;

        setOrdersCount(totalItems); // Update the orders count with total item count
      }

      setLoading(false);
    };

    fetchUserData();

    if (modalVisible) {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(storedCart);
    }

    // Animation on page load
    gsap.from(".profile-container", { opacity: 0, duration: 1, y: -50 });
    gsap.from(".sidebar", { opacity: 0, duration: 1, x: -100 });
  }, [navigate, modalVisible]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/user");
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
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
            <div>
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-700">User ID:</h3>
                <p className="text-gray-900">{userData.id}</p>
                <h3 className="text-xl font-medium text-gray-700">Email:</h3>
                <p className="text-gray-900">{userData.email}</p>

                <h3 className="text-xl font-medium text-gray-700">
                  Account Created:
                </h3>
                <p className="text-gray-900">
                  {new Date(userData.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-red-500">User data not found</p>
          )}

          <h3 className="mt-6 text-2xl">Orders</h3>
          {orders.length === 0 ? (
            <p>No orders placed yet.</p>
          ) : (
            <div className="orders-list mt-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="order-item border p-4 mb-4 rounded-lg cursor-pointer"
                  onClick={() => handleOrderClick(order)}
                >
                  <p className="font-semibold">Order ID: {order.id}</p>
                  <p className="text-gray-600">
                    Order Date:{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="font-bold">
                    Total: ${order.total_price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-4 w-full bg-red-500 text-white py-2 rounded-md"
          >
            Logout
          </button>
        </div>

        {/* Order Details Modal */}
        {modalVisible && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-96">
              <h3 className="text-2xl font-semibold mb-4">Cart Details</h3>
              <div className="items">
                <h4 className="font-semibold">Items in Cart:</h4>
                <ul>
                  {cartItems.length === 0 ? (
                    <p>No items in the cart.</p>
                  ) : (
                    cartItems.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.quantity} x {item.title}</span>
                        <span>${item.price.toFixed(2)}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <button
                onClick={closeModal}
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
