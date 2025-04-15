import { useCart } from "./CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { supabase } from "../Auth/supabaseClient";
import { useState, useEffect } from "react";
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

const orderStatuses = [
  "Order Placed",
  "Order Confirmed",
  "Preparing Food",
  "Food Ready",
  "Out for Delivery",
  "Delivered"
];

export const Cart = () => {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [foodImages, setFoodImages] = useState<Record<string, string>>({});
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    cardNumber: "",
    cvv: "",
    expiryDate: "",
  });

  useEffect(() => {
    const fetchFoodImages = async () => {
      try {
        const { data, error } = await supabase
          .from('foods')
          .select('id, image_url')
          .in('id', cart.map(item => item.id));

        if (error) {
          console.error('Error fetching food images:', error);
          return;
        }

        if (data) {
          const imageMap = data.reduce((acc: Record<string, string>, food: FoodImage) => {
            acc[food.id] = food.image_url;
            return acc;
          }, {});
          setFoodImages(imageMap);
        }
      } catch (error) {
        console.error('Error in fetchFoodImages:', error);
      }
    };

    if (cart.length > 0) {
      fetchFoodImages();
    }
  }, [cart]);

  useEffect(() => {
    let subscription: any;

    if (currentOrderId) {
      subscription = supabase
        .channel(`order-${currentOrderId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${currentOrderId}`,
          },
          (payload: any) => {
            setOrderStatus(payload.new.order_status);
          }
        )
        .subscribe();
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [currentOrderId]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");

    if (
      !recipientName ||
      !address ||
      !paymentMethod.cardNumber ||
      !paymentMethod.cvv ||
      !paymentMethod.expiryDate
    ) {
      return alert("Please provide all required details.");
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("You must be logged in to place an order.");
      }

      const orderData: OrderData & { user_id: string } = {
        items: cart.map(item => ({
          ...item,
          image: foodImages[item.id] || item.image
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

      if (data && data[0]) {
        setCurrentOrderId(data[0].id);
        setOrderStatus("Order Placed");
        setShowTrackingModal(true);
      }

      await sendConfirmationEmail(user.email || "", orderData);
      clearCart();
    } catch (error) {
      console.error("Order error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Error placing order. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const sendConfirmationEmail = async (email: string, orderData: OrderData) => {
    const itemsList = orderData.items
      .map(
        (item) =>
          `${item.quantity} x ${item.title} - $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("<br/>");

    const emailTemplateParams = {
      to_email: email,
      order_number: `#${Math.floor(Math.random() * 1000000)}`,
      items_ordered: itemsList,
      total_price: `$${orderData.total_price.toFixed(2)}`,
      delivery_date: new Date().toLocaleDateString(),
      company_name: "Your Company Name",
      customer_service_email: "support@yourcompany.com",
      customer_name: orderData.recipient_name,
    };

    try {
      const response = await emailjs.send(
        "service_byte",
        "template_ycuyjpi",
        emailTemplateParams,
        "KZ5IuiyfkxTw53AN8"
      );

      if (response.status === 200) {
        console.log("Email sent successfully", response);
      } else {
        throw new Error(`Email sending failed. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      alert("An error occurred while sending the confirmation email.");
    }
  };

  const getStatusPercentage = () => {
    const currentIndex = orderStatuses.indexOf(orderStatus);
    return ((currentIndex + 1) / orderStatuses.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-12">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          Your cart is empty.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Cart Items */}
          <div className="w-full md:w-3/5 max-w-3xl bg-white p-6 rounded-lg shadow-lg">
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
                >
                  <img
                    src={foodImages[item.id] || item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = item.image;
                    }}
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-orange-600 font-bold">${item.price}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-300 pt-4">
              <h2 className="text-xl font-semibold text-gray-800 flex justify-between">
                <span>Total:</span>
                <span className="text-orange-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </h2>
            </div>
          </div>

          {/* Order Form */}
          <div className="w-full md:w-2/5 max-w-lg bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Order Details</h3>

            <div className="mb-4">
              <label className="block text-gray-700">Recipient Name:</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter recipient's name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Address:</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter shipping address"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Card Number:</label>
              <input
                type="text"
                value={paymentMethod.cardNumber}
                onChange={(e) =>
                  setPaymentMethod({
                    ...paymentMethod,
                    cardNumber: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter card number"
                maxLength={19}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">CVV:</label>
              <input
                type="text"
                value={paymentMethod.cvv}
                onChange={(e) =>
                  setPaymentMethod({ ...paymentMethod, cvv: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter CVV"
                maxLength={4}
                inputMode="numeric"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Expiry Date:</label>
              <input
                type="text"
                value={paymentMethod.expiryDate}
                onChange={(e) =>
                  setPaymentMethod({
                    ...paymentMethod,
                    expiryDate: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={placeOrder}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
              >
                <FaShoppingCart size={18} />
                {loading ? "Placing Order..." : "Place Order"}
              </button>
              <button
                onClick={clearCart}
                className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Order Status</h2>
            <div className="mb-6">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${getStatusPercentage()}%` }}
                ></div>
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-800">{orderStatus}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {orderStatus === "Delivered"
                    ? "Your order has been delivered!"
                    : "Your order is being processed"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTrackingModal(false)}
              className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};