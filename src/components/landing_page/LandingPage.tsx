import illustration from "../Images/traditional-tajine-dishes-couscous-fresh-salad-rustic-wooden-table-tagine-lamb-meat-pumpkin-top-view-flat-lay.jpg";
import { MealGrid } from "./MealGrid";
import { SidebarList } from "./SidebarList";
import { GiHotMeal } from "react-icons/gi";
import { GiCheeseWedge } from "react-icons/gi";
import { GiWineBottle } from "react-icons/gi";
export const LandingPage = () => {
  return (
    <div>
      <div
        className="relative w-full h-screen  bg-cover bg-center"
        style={{
          backgroundImage: `url(${illustration})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 flex items-center justify-center h-full ">
          <div className="text-center">
            <h1 className="text-7xl text-white   font-bold font-fredoka">
              Fast, Hot &amp;
              <br /> Right To Your Doorstep
            </h1>
            <button className="font-fredoka  px-4 py-2 mt-10 rounded-lg animate-bounce  text-white text-3xl bg-[#a82f17]">
              Place your order
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 p-10">
        <p className="text-left text-2xl text-[#a82f17]">What we serve</p>
        <h1 className="text-left text-3xl font-semibold mt-2">
          Menu that always <br />
          Makes you fall in love
        </h1>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="p-7">
            <SidebarList
              children={
                <div className="flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                  <GiHotMeal className="text-white text-8xl drop-shadow-lg animate-pulse" />
                </div>
              }
              title="Meal"
            />
            <SidebarList
              children={
                <div className="flex items-center justify-center p-6 rounded-full bg-gradient-to-b from-red-700 to-red-500 shadow-xl">
                  <GiWineBottle className="text-white text-8xl drop-shadow-lg filter brightness-110 animate-bounce" />
                </div>
              }
              title="Beverages"
            />
            <SidebarList
              children={
                <div className="flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                  <GiCheeseWedge className="text-white text-8xl drop-shadow-lg animate-pulse" />
                </div>
              }
              title="Appetizers"
            />
          </div>
          <div className="p-7">
            <MealGrid />
          </div>
        </div>
      </div>
    </div>
  );
};
