import illustration from "../Images/side-view-pilaf-with-stewed-beef-meat-plate.jpg";
export const MealGrid = () => {
  return (
    <div className="w-full">
      <div
        className="relative w-full bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${illustration})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div>
            <p>RIce and Chicken</p>
            <p>Price</p>
            <p>Order Now</p>
          </div>
        </div>
      </div>
    </div>
  );
};
