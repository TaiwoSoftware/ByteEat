/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL_MEALS =
  "https://api.spoonacular.com/recipes/random?number=6&apiKey=307c60a1bbd44fe89dadc40e7f5c9901"; // API for meals
const API_URL_DRINKS =
  "https://api.spoonacular.com/recipes/complexSearch?type=drink&number=6&apiKey=307c60a1bbd44fe89dadc40e7f5c9901"; // API for drinks

export const MealGrid = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category,] = useState<string>("meals"); // Track the selected category

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = category === "meals" ? API_URL_MEALS : API_URL_DRINKS;
        const response = await axios.get(url);
        setMeals(response.data.recipes); // Assuming recipes are in the response
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]); // Re-fetch data whenever category changes

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 py-12">
        {loading ? (
          <div className="flex justify-center items-center">
            <span className="text-2xl text-orange-600">Loading...</span>
          </div>
        ) : (
          meals.map((meal, index) => (
            <div
              key={index}
              className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:scale-105"
            >
              {/* Image Container */}
              <div className="relative h-[250px] md:h-[300px]">
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-full object-cover rounded-3xl transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl"></div>
              </div>

              {/* Text and Button Container */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-3xl">
                <h3 className="text-xl font-semibold text-white mb-1">{meal.title}</h3>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-400">
                    {/* Displaying a simulated price */}
                    ${Math.floor(Math.random() * (20 - 10 + 1)) + 10}
                  </span>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm">
                    Order Now
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
