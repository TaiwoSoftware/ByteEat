import { useNavigate } from "react-router-dom";
import background from "../Images/tasty-pakistani-dish-top-view.jpg";
const UserSelection = () => {
  const navigate = useNavigate();

  return (
    <div
  className="relative flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `url(${background})`, // Ensure `background` is defined
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
  }}
>
  {/* Dark Overlay for Readability */}
  <div className="absolute inset-0 bg-black opacity-50"></div>

  {/* Content */}
  <div className="relative z-10 text-white text-center">
    <h1 className="text-3xl font-bold mb-6 opacity-0 animate-fadeInUp">
      Select Your Role
    </h1>
    <div className="flex gap-6">
      <button
        onClick={() => navigate("/vendor")}
        className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md 
          hover:bg-blue-600 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 
          transition-all duration-300 ease-in-out animate-bounce custom-delay-1"
      >
        Are you a Vendor?
      </button>
      <button
        onClick={() => navigate("/user")}
        className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md 
          hover:bg-green-600 hover:scale-110 hover:shadow-lg hover:shadow-green-500/50 
          transition-all duration-300 ease-in-out animate-bounce custom-delay-2"
      >
        Are you a Buyer?
      </button>
    </div>
  </div>
</div>

  
  );
};

export default UserSelection;
