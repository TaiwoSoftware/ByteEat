import { useCart } from "./CartContext";

export const Cart = () => {
  const { cart, removeFromCart } = useCart();

  if (!cart) return <p>Loading cart...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-12">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cart.map((item) => (
            <div key={item.id} className="p-4 bg-white shadow-lg rounded-md">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-orange-600 font-bold">${item.price}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Remove
                </button>
                <button
                  // Call the function to add to cart
                  className="px-4 py-2 bg-orange-600 text-white rounded-md font-medium text-base hover:bg-orange-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                >
                  Order Now!!
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
