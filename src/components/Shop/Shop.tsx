import { useState, useEffect } from "react";
import axios from "axios";

// Example API for fetching meals
const API_URL =
  "https://api.spoonacular.com/recipes/random?number=32&apiKey=307c60a1bbd44fe89dadc40e7f5c9901"; // Replace with your API URL and key

export const Shop = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(API_URL);
        setMeals(response.data.recipes);
      } catch (error) {
        console.error("Error fetching food data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-12">
      <h1 className="text-4xl font-fredoka font-extrabold text-center text-gray-800 mb-12">Our Delicious Meals</h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="text-2xl text-orange-600">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {meals.map((meal, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden shadow-lg bg-white transition-transform duration-300 hover:scale-105"
            >
              <div className="relative h-[250px]">
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              <div className="p-6 bg-white">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">{meal.title}</h3>
                <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {meal.summary ? meal.summary.replace(/<[^>]+>/g, "") : "No description available"}
                </div>

                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xl font-bold text-orange-600">
                    {/* Displaying a simulated price */}
                    ${Math.floor(Math.random() * (20 - 10 + 1)) + 100}
                  </span>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-full font-medium text-sm hover:bg-orange-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
