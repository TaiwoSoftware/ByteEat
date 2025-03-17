import { PiPizzaFill } from "react-icons/pi";
import { CategoriesCard } from "./CategoriesCard";
import { GiHotMeal, GiWineBottle } from "react-icons/gi";
// MdOutlineEmojiFoodBeverage
export const LandingPage = () => {
  return (
    <div className="p-7 mt-10">
      <h1 className="text-4xl font-fredoka ">Explore Categories</h1>
      <div className="px-20">
        <div className="flex justify-between items-center mt-10 text-center">
          <CategoriesCard
            children={
              <div className="flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                <GiHotMeal className="text-white text-8xl drop-shadow-lg animate-pulse" />
              </div>
            }
            title="Food"
          />
          <CategoriesCard
            children={
              <div className="flex items-center justify-center p-6 rounded-full bg-gradient-to-b from-red-700 to-red-500 shadow-xl">
                <GiWineBottle className="text-white text-8xl drop-shadow-lg filter brightness-110 animate-bounce" />
              </div>
            }
            title="Drinks"
          />
          <CategoriesCard
            children={
              <div className="flex items-center justify-center p-4 rounded-full bg-gradient-to-b from-yellow-400 to-orange-500 shadow-lg">
                <PiPizzaFill className="text-white text-8xl drop-shadow-lg filter brightness-110 animate-spin" />
              </div>
            }
            title="Beverages"
          />
        </div>
      </div>
    </div>
  );
};
