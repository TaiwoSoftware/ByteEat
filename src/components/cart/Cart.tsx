import { useCart } from "./CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { supabase } from "../Auth/supabaseClient";
import { useState } from "react";

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
}

export const Cart = () => {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState<boolean>(false);
  const [recipientName, setRecipientName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    cardNumber: "",
    cvv: "",
    expiryDate: "",
  });

  const totalPrice = cart.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async (): Promise<void> => {
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
      
      if (authError) {
        throw new Error("Error fetching user data");
      }

      if (!user) {
        throw new Error("You must be logged in to place an order!");
      }

      const orderData: OrderData = {
        items: cart,
        total_price: totalPrice,
        recipient_name: recipientName,
        address: address,
        payment_method: JSON.stringify(paymentMethod),
        user_email: user.email || "",
      };

      const { error } = await supabase.from("orders").insert([orderData]);

      if (error) {
        throw new Error(error.message);
      }

      // Send confirmation email
      await sendConfirmationEmail(user.email || "");

      alert("Order placed successfully!");
      clearCart();
    } catch (error) {
      console.error("Order error:", error);
      alert(error instanceof Error ? error.message : "Error placing order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendConfirmationEmail = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.functions.invoke('send_order_confirmation', {
        body: {
          email: email,
          subject: 'Order Confirmation',
          message: 'Thanks for your order!',
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Confirmation email sent to:", email);
    } catch (error) {
      console.error("Error in sendConfirmationEmail:", error);
      alert("An error occurred while sending the email.");
    }
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
        <div className="flex gap-12">
          {/* Cart Items */}
          <div className="max-w-3xl bg-white p-6 rounded-lg shadow-lg w-3/5">
            <div className="space-y-6">
              {cart.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-orange-600 font-bold">${item.price}</p>
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
          <div className="max-w-lg bg-white p-6 rounded-lg shadow-lg w-2/5">
            <h3 className="text-2xl font-semibold mb-4">Order Details</h3>

            {/* Name Input */}
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

            {/* Address Input */}
            <div className="mb-4">
              <label className="block text-gray-700">Address:</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter shipping address"
              />
            </div>

            {/* Card Number */}
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

            {/* CVV */}
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

            {/* Expiry Date */}
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
            <div className="flex gap-4 mt-6">
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
    </div>
  );
};