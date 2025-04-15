import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../cart/CartContext";
import { supabase } from "../Auth/supabaseClient";

const API_URL =
  "https://api.spoonacular.com/recipes/random?number=32&apiKey=307c60a1bbd44fe89dadc40e7f5c9901";

export const Shop = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const [vendorMeals, setVendorMeals] = useState<any[]>([]);
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(API_URL);
        setMeals(response.data.recipes);
      } catch (error) {
        console.error("Error fetching food data", error);
      }
    };

    const fetchVendorMeals = async () => {
      const { data, error } = await supabase.from("vendors").select("*");
      if (error) {
        console.error("Error fetching vendor meals:", error.message);
      } else {
        setVendorMeals(data || []);
      }
    };

    const fetchFoods = async () => {
      const { data, error } = await supabase.from("foods").select("*");
      if (error) {
        console.error("Error fetching foods:", error.message);
      } else {
        setFoods(data || []);
      }
    };

    Promise.all([fetchMeals(), fetchVendorMeals(), fetchFoods()])
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (meal: any) => {
    const cartItem = {
      id: meal.id,
      title: meal.title || meal.name, // Handle both API meals and foods
      image: meal.image,
      price: meal.price || Math.floor(Math.random() * (20 - 10 + 1)) + 100,
      quantity: 1,
    };
    addToCart(cartItem);
    alert("Added to cart");
  };

  const filteredMeals = meals.filter((meal) =>
    meal?.title?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) ?? false
  );

  const filteredVendorMeals = vendorMeals.filter((meal) =>
    meal?.title?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) ?? false
  );

  const filteredFoods = foods.filter((food) =>
    food?.name?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) ?? false
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-12">
      <h1 className="text-4xl font-fredoka font-extrabold text-center text-gray-800 mb-12">
        Our Delicious Meals
      </h1>

      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="text-2xl text-orange-600">Loading...</span>
        </div>
      ) : (
        <>
          {/* Foods from Supabase Section */}
          {filteredFoods.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
                Featured Foods
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    className="relative rounded-2xl overflow-hidden shadow-lg bg-white transition-transform duration-300 hover:scale-105"
                  >
                    <div className="relative h-[250px]">
                      <img
                        src={food.image_url}
                        alt={food.name || 'Food image'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>

                    <div className="p-6 bg-white">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                        {food.name || 'Untitled Food'}
                      </h3>
                      <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {food.details || "No description available"}
                      </div>

                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-xl font-bold text-orange-600">
                          ${food.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(food)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-full font-medium text-sm hover:bg-orange-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Meals Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
            {filteredMeals.map((meal) => (
              <div
                key={meal.id}
                className="relative rounded-2xl overflow-hidden shadow-lg bg-white transition-transform duration-300 hover:scale-105"
              >
                <div className="relative h-[250px]">
                  <img
                    src={meal.image}
                    alt={meal.title || 'Meal image'}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">{meal.title || 'Untitled Meal'}</h3>
                  <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {meal.summary
                      ? meal.summary.replace(/<[^>]+>/g, "")
                      : "No description available"}
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xl font-bold text-orange-600">
                      ${Math.floor(Math.random() * (20 - 10 + 1)) + 100}
                    </span>
                    <button
                      onClick={() => handleAddToCart(meal)}
                      className="px-4 py-2 bg-orange-600 text-white rounded-full font-medium text-sm hover:bg-orange-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vendor Meals from Supabase Section */}
          {filteredVendorMeals.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
                Meals from Local Vendors
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredVendorMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="relative rounded-2xl overflow-hidden shadow-lg bg-white transition-transform duration-300 hover:scale-105"
                  >
                    <div className="relative h-[250px]">
                      <img
                        src={meal.image}
                        alt={meal.title || 'Vendor meal image'}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>

                    <div className="p-6 bg-white">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-3">{meal.title || 'Untitled Vendor Meal'}</h3>
                      <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {meal.description || "No description available"}
                      </div>

                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-xl font-bold text-orange-600">
                          ${meal.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(meal)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-full font-medium text-sm hover:bg-orange-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};