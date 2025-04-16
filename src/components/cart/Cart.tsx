import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext";
import { supabase } from "../Auth/supabaseClient";
import emailjs from "@emailjs/browser";
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface PaymentMethod {
  cardNumber: string;
  cvv: string;
  expiryDate: string;
}

interface OrderData {
  items: CartItem[];
  total_price: number;
  recipient_name: string;
  address: string;
  payment_method: string;
  user_email: string;
  order_status: string;
}

interface FoodImage {
  id: string;
  image_url: string;
}

const ORDER_STATUSES = [
  "Order Placed",
  "Order Confirmed",
  "Preparing Food",
  "Food Ready",
  "Out for Delivery",
  "Delivered",
];

export const Cart = () => {
  const { cart, clearCart } = useCart();
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    cardNumber: "",
    cvv: "",
    expiryDate: "",
  });
  const [foodImages, setFoodImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState("");

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) return;

    const fetchFoodImages = async () => {
      try {
        const { data, error } = await supabase
          .from("foods")
          .select("id, image_url")
          .in("id", cart.map((item) => item.id));

        if (error) throw error;

        const map = data?.reduce((acc: Record<string, string>, item: FoodImage) => {
          acc[item.id] = item.image_url;
          return acc;
        }, {});
        setFoodImages(map || {});
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    fetchFoodImages();
  }, [cart]);

  useEffect(() => {
    if (!currentOrderId) return;

    const channel = supabase
      .channel(`order-${currentOrderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${currentOrderId}`,
        },
        (payload) => {
          setOrderStatus(payload.new.order_status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentOrderId]);

  const sendConfirmationEmail = async (email: string, orderData: OrderData) => {
    const itemLines = orderData.items
      .map(
        (item) =>
          `${item.quantity} x ${item.title} - $${(item.price * item.quantity).toFixed(2)}`
      )
      .join("<br/>");

    const emailParams = {
      to_email: email,
      order_number: `#${Math.floor(Math.random() * 1000000)}`,
      items_ordered: itemLines,
      total_price: `$${orderData.total_price.toFixed(2)}`,
      delivery_date: new Date().toLocaleDateString(),
      company_name: "Your Company Name",
      customer_service_email: "support@yourcompany.com",
      customer_name: orderData.recipient_name,
    };

    try {
      const res = await emailjs.send(
        "service_byte",
        "template_ycuyjpi",
        emailParams,
        "KZ5IuiyfkxTw53AN8"
      );
      if (res.status === 200) console.log("Email sent", res);
    } catch (err) {
      console.error("Email error:", err);
      alert("Failed to send confirmation email.");
    }
  };

  const placeOrder = async () => {
    if (!recipientName || !address || !paymentMethod.cardNumber || !paymentMethod.cvv || !paymentMethod.expiryDate) {
      return alert("All fields are required.");
    }
    if (cart.length === 0) return alert("Your cart is empty.");

    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user || authError) throw new Error("Login required to place order.");

      const orderData: OrderData & { user_id: string } = {
        items: cart.map((item) => ({
          ...item,
          image: foodImages[item.id] || item.image,
        })),
        total_price: totalPrice,
        recipient_name: recipientName,
        address,
        payment_method: JSON.stringify(paymentMethod),
        user_email: user.email || "",
        order_status: "Order Placed",
        user_id: user.id,
      };

      const { data, error } = await supabase.from("orders").insert([orderData]).select();
      if (error) throw new Error(error.message);

      if (data?.[0]?.id) {
        setCurrentOrderId(data[0].id);
        setOrderStatus("Order Placed");
        setShowTrackingModal(true);
        await sendConfirmationEmail(user.email || "", orderData);
        clearCart();
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusPercentage = () => {
    const index = ORDER_STATUSES.indexOf(orderStatus);
    return ((index + 1) / ORDER_STATUSES.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full md:w-3/5 bg-white p-6 rounded-lg shadow-md space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg"
              >
                <img
                  src={foodImages[item.id] || item.image}
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = item.image)
                  }
                  alt={item.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                  <p className="text-orange-600 font-bold">${item.price}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-300">
              <h2 className="text-xl font-semibold flex justify-between">
                <span>Total:</span>
                <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
              </h2>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="w-full md:w-2/5 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Info</h2>

            {[
              {
                label: "Recipient Name",
                value: recipientName,
                setter: setRecipientName,
                type: "text",
                placeholder: "Enter recipient's name",
              },
              {
                label: "Address",
                value: address,
                setter: setAddress,
                type: "textarea",
                placeholder: "Enter delivery address",
              },
              {
                label: "Card Number",
                value: paymentMethod.cardNumber,
                setter: (v: string) =>
                  setPaymentMethod({ ...paymentMethod, cardNumber: v }),
                type: "text",
                placeholder: "xxxx xxxx xxxx xxxx",
              },
              {
                label: "CVV",
                value: paymentMethod.cvv,
                setter: (v: string) =>
                  setPaymentMethod({ ...paymentMethod, cvv: v }),
                type: "text",
                placeholder: "CVV",
              },
              {
                label: "Expiry Date",
                value: paymentMethod.expiryDate,
                setter: (v: string) =>
                  setPaymentMethod({ ...paymentMethod, expiryDate: v }),
                type: "text",
                placeholder: "MM/YY",
              },
            ].map(({ label, value, setter, type, placeholder }, idx) => (
              <div className="mb-4" key={idx}>
                <label className="block text-gray-700">{label}:</label>
                {type === "textarea" ? (
                  <textarea
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                )}
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={placeOrder}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <FaShoppingCart />
                {loading ? "Placing..." : "Place Order"}
              </button>
              <button
                onClick={clearCart}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Order Status</h2>
            <div className="mb-6">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${getStatusPercentage()}%` }}
                />
              </div>
              <p className="mt-4 text-lg font-semibold">{orderStatus}</p>
              <p className="text-sm text-gray-600">
                {orderStatus === "Delivered"
                  ? "Your order has been delivered!"
                  : "We’re working on it."}
              </p>
            </div>
            <button
              onClick={() => setShowTrackingModal(false)}
              className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
