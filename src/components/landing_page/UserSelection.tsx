import { useNavigate } from "react-router-dom";

const UserSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 opacity-0 animate-fadeInUp">
        Select Your Role
      </h1>
      <div className="flex gap-6">
        <button
          onClick={() => navigate("/vendor")}
          className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600  animate-fadeInUp animation-delay-200"
        >
          Are you a Vendor?
        </button>
        <button
          onClick={() => navigate("/user")}
          className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-600  animate-fadeInUp animation-delay-400"
        >
          Are you a Buyer?
        </button>
      </div>
    </div>
  );
};

export default UserSelection;
