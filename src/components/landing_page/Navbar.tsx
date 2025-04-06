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
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated on page load
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
      navigate("/select");
    }
  };

  return (
    <>
      <nav className="px-4 flex items-center justify-between relative z-50 bg-white">
        <Link to={"/"}>
          <Logo />
        </Link>

        {/* Hamburger Icon (Visible on smaller screens) */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setHamburgerMenuOpen(!hamburgerMenuOpen)}
            className="text-black text-5xl"
          >
            &#9776; {/* Hamburger icon */}
          </button>
        </div>

        {/* Main Menu (Visible on larger screens) */}
        <div className="hidden lg:flex gap-4 items-center">
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
                <Link to="/shop" className="block px-4 py-2 hover:bg-gray-100">
                  order
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
                <Link to="/shop" className="block px-4 py-2 hover:bg-gray-100">
                  Breakfast
                </Link>
                <Link to="/shop" className="block px-4 py-2 hover:bg-gray-100">
                  Lunch
                </Link>
                <Link to="/shop" className="block px-4 py-2 hover:bg-gray-100">
                  Dinner
                </Link>
              </div>
            )}
          </div>

          <NavLinks to="/profile" title="Profile" />
          <NavLinks to="/contact" title="Contact" />
          <NavLinks to="/vendor" title="Vendors Corner" />
        </div>

        {/* Cart and User Icons (Visible on Desktop, hidden on Mobile) */}
        <div className="hidden lg:flex gap-4 items-center">
          {/* Cart */}
          <Link to={"/cart"}>
            <div className="bg-[#a82f17] text-center w-11 p-2 rounded-full">
              <BiCart className="text-3xl text-white" />
            </div>
          </Link>
          {/* User Icon */}
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
      </nav>

      {/* Hamburger Menu (Visible on smaller screens) */}
      <div
        className={`lg:hidden bg-white absolute top-0 left-0 w-full h-screen transition-transform duration-300 ${
          hamburgerMenuOpen
            ? "transform translate-x-0"
            : "transform -translate-x-full"
        }`}
        style={{ zIndex: 999 }} // Added z-index here to ensure it's above other content
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setHamburgerMenuOpen(false)}
            className="text-3xl text-black"
          >
            &#10005; {/* Cancel (X) icon */}
          </button>
        </div>

        <div className="flex flex-col items-center mt-28 py-8">
          <Link to="/">
            <div className="flex items-center">
              <p className="font-fredoka text-2xl mt-2 font-semibold  ">Why ByteEat</p>
            </div>
          </Link>
          <Link to="/shop">
            <div className="flex items-center">
              <p className="font-fredoka text-2xl mt-2 font-semibold  ">Order</p>
            </div>
          </Link>
          <Link to="/shop">
            <div className="flex items-center">
              <p className="font-fredoka text-2xl mt-2 font-semibold  ">Menu</p>
            </div>
          </Link>
          <Link to="/profile">
            <div className="flex items-center">
              <p className="font-fredoka text-2xl mt-2 font-semibold  ">Profile</p>
            </div>
          </Link>
          <Link to="/contact">
            <div className="flex items-center">
              <p className="font-fredoka text-2xl mt-2 font-semibold  ">Contact</p>
            </div>
          </Link>
          <Link to="/vendor">
            <div className="flex items-center">
              <p className="font-fredoka text-2xl mt-2 font-semibold  ">Vendor's Corner</p>
            </div>
          </Link>
          <Link to="/cart">
            <div className="flex items-center">
              <p className="font-fredoka text-2xl mt-2 font-semibold  ">Cart</p>
            </div>
          </Link>
          <Link to="/select">
            <div className="flex items-center">
              <p className="font-fredoka text-2xl mt-2 font-semibold  ">Sign in</p>
            </div>
          </Link>
        </div>
      </div>

      <hr className="mt-4" />
    </>
  );
};
