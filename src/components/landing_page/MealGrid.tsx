import illustration from "../Images/side-view-pilaf-with-stewed-beef-meat-plate.jpg";

const meals = [
  { name: "Rice and Chicken", price: "$12.99", img: illustration },
  { name: "Jollof Rice", price: "$10.99", img: illustration },
];

export const MealGrid = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {meals.map((meal, index) => (
        <div
          key={index}
          className="relative w-full rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
        >
          <div
            className="relative w-full h-72 bg-cover bg-center"
            style={{ backgroundImage: `url(${meal.img})` }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-4 text-white">
              <h2 className="text-lg font-semibold">{meal.name}</h2>
              <p className="text-xl font-bold text-yellow-400">{meal.price}</p>

              {/* Order Now Button */}
              <button className="mt-2 text-sm font-medium flex items-center transition-all hover:scale-105">
                Order Now <span className="ml-1">➜</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
