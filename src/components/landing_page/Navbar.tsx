import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../Logo";
import { BiCart } from "react-icons/bi";
import { NavLinks } from "./NavLinks";
import { IoMdLogIn } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa"; // User icon from react-icons
import { supabase } from "../Auth/supabaseClient"; // Assuming you have this file set up for Supabase client

export const Navbar = () => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated on page load
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleUserIconClick = () => {
    if (user) {
      // If user is authenticated, navigate to the profile page
      navigate("/profile");
    } else {
      // If user is not authenticated, navigate to login page
      navigate("/select`");
    }
  };

  return (
    <>
      <nav className="px-4 flex items-center justify-between relative z-50 bg-white">
        <Link to={"/"}>
          <Logo />
        </Link>

        <div className="flex gap-4 items-center">
          <NavLinks to="/" title="Why ByteEat" />

          {/* Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="flex items-center gap-1 text-black"
            >
              Services
              <RiArrowDropDownLine className="text-2xl text-[#cf2c2c]" />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
                <Link to="/delivery" className="block px-4 py-2 hover:bg-gray-100">
                  Delivery
                </Link>
                <Link to="/custom-orders" className="block px-4 py-2 hover:bg-gray-100">
                  Custom Orders
                </Link>
              </div>
            )}
          </div>

          {/* Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1 text-black"
            >
              Menu
              <RiArrowDropDownLine className="text-2xl text-[#cf2c2c]" />
            </button>
            {menuOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
                <Link to="/breakfast" className="block px-4 py-2 hover:bg-gray-100">
                  Breakfast
                </Link>
                <Link to="/lunch" className="block px-4 py-2 hover:bg-gray-100">
                  Lunch
                </Link>
                <Link to="/dinner" className="block px-4 py-2 hover:bg-gray-100">
                  Dinner
                </Link>
              </div>
            )}
          </div>

          <NavLinks to="/profile" title="Profile" />
          <NavLinks to="/newUser" title="Contact" />
          <NavLinks to="/vendor" title="Vendors Corner" />
        </div>

        <div className="flex gap-4 items-center">
          {/* Cart */}
          <div className="flex gap-3">
            <Link to={"/cart"}>
              <div className="bg-[#a82f17] text-center w-11 p-2 rounded-full">
                <BiCart className="text-3xl text-white" />
              </div>
            </Link>
            <div
              onClick={handleUserIconClick}
              className="bg-[#a82f17] text-center w-11 p-2 rounded-full cursor-pointer"
            >
              {user ? (
                <FaUser className="text-3xl text-white" />
              ) : (
                <IoMdLogIn className="text-3xl text-white" />
              )}
            </div>
          </div>
        </div>
      </nav>
      <hr className="mt-4" />
    </>
  );
};
