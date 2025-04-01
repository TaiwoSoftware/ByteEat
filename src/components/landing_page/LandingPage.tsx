import illustration from "../Images/traditional-tajine-dishes-couscous-fresh-salad-rustic-wooden-table-tagine-lamb-meat-pumpkin-top-view-flat-lay.jpg";
import { MealGrid } from "./MealGrid";
import { SidebarList } from "./SidebarList";
import { GiHotMeal, GiCheeseWedge, GiWineBottle } from "react-icons/gi";
import TestimonialSection from "./TestimonialSection";
import { Link } from "react-router-dom";

export const LandingPage = () => {
  const handleCategoryClick = () => {
    // category(category); // Update the category when sidebar item is clicked
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative w-full h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${illustration})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b font-fredoka from-black/70 to-black/50 backdrop-blur-[2px]"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl text-white font-bold tracking-tight">
              Fast, Hot &amp;
              <br />
              <span className="text-orange-400">Right To Your Doorstep</span>
            </h1>
            <p className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto">
              Experience the finest cuisine delivered right to your doorstep.
              Fresh, hot, and made with love.
            </p>
            <button className="mt-8 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-xl font-semibold rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
              Place your order
            </button>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-2xl text-[#a82f17] font-medium">What we serve</p>
          <h2 className="mt-2 text-4xl font-bold">
            Menu that always
            <br />
            Makes you fall in love
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Section */}
          <div className="space-y-8 p-6 bg-white rounded-2xl shadow-lg">
            <SidebarList
              onClick={handleCategoryClick}
              children={
                <div className="flex items-center justify-center p-6 rounded-full bg-gradient-to-r from-orange-400 to-red-500 shadow-xl transform hover:scale-105 transition duration-300">
                  <GiHotMeal className="text-white text-[2rem] drop-shadow-xl animate-pulse" />
                </div>
              }
              title="Meal"
            />
            <SidebarList
              title="Drinks"
              onClick={handleCategoryClick}
              children={
                <div className="flex items-center justify-center p-6 rounded-full bg-gradient-to-b from-red-700 to-red-500 shadow-xl transform hover:scale-105 transition duration-300">
                  <GiWineBottle className="text-white text-[2rem] drop-shadow-xl filter brightness-110 animate-bounce" />
                </div>
              }
            />
            <SidebarList
              title="Snacks"
              onClick={handleCategoryClick} // Renamed to "Snacks"
              children={
                <div className="flex items-center justify-center p-6 rounded-full bg-gradient-to-r from-orange-400 to-red-500 shadow-xl transform hover:scale-105 transition duration-300">
                  <GiCheeseWedge className="text-white text-[2rem] drop-shadow-xl animate-pulse" />
                </div>
              }
            />
          </div>

          {/* Meal Grid Section */}
          <div className="lg:col-span-3">
            <MealGrid />
          </div>
        </div>
       
        <div className="text-center">
          <Link to={"/shop"}>
            <button className="py-3 px-8 bg-orange-600 text-white rounded-full font-semibold text-lg hover:bg-orange-700 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 shadow-md">
              Shop
            </button>
          </Link>
        </div>

        {/* Testimonial Section */}
        <TestimonialSection />
      </div>
    </div>
  );
};
