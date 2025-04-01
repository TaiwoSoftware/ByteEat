import illustration from "../Images/side-view-pilaf-with-stewed-beef-meat-plate.jpg";

const meals = [
  {
    name: "Rice and Chicken",
    price: "$12.99",
    description: "Tender chicken served with aromatic rice",
    img: illustration
  },
  {
    name: "Jollof Rice",
    price: "$10.99",
    description: "Traditional West African spiced rice",
    img: illustration
  },
  {
    name: "Pasta Alfredo",
    price: "$14.99",
    description: "Creamy pasta with a rich Alfredo sauce",
    img: illustration
  },
  {
    name: "Grilled Fish",
    price: "$15.99",
    description: "Grilled fish served with a side of vegetables",
    img: illustration
  },
  {
    name: "Vegetable Stir Fry",
    price: "$11.99",
    description: "A healthy mix of fresh vegetables stir-fried to perfection",
    img: illustration
  },
  {
    name: "Beef Stew",
    price: "$16.99",
    description: "Tender beef in a rich and flavorful stew",
    img: illustration
  }
];

export const MealGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 py-12">
      {meals.map((meal, index) => (
        <div
          key={index}
          className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:scale-105"
        >
          {/* Image Container */}
          <div className="relative h-[250px] md:h-[300px]">
            <img
              src={meal.img}
              alt={meal.name}
              className="w-full h-full object-cover rounded-3xl transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl"></div>
          </div>

          {/* Text and Button Container */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-3xl">
            <h3 className="text-xl font-semibold text-white mb-1">{meal.name}</h3>
            <p className="text-gray-300 text-sm mb-3">{meal.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-orange-400">{meal.price}</span>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm">
                Order Now
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
