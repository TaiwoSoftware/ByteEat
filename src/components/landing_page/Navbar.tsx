import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { Input } from "./Input";
import { BiCart } from "react-icons/bi";
import { NavLinks } from "./NavLinks";
import { IoMdLogIn } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
export const Navbar = () => {
  return (
    <>
      <nav className="px-4 flex items-center justify-between">
        <Link to={"/"}>
          <Logo />
        </Link>
        <div>
          <div className="flex gap-4 items-center">
            <NavLinks to="/" title="Why byteEat" />
            <NavLinks
              to="/about"
              children={
                <RiArrowDropDownLine className="text-2xl text-[#cf2c2c]" />
              }
              title="Services"
            />
            <NavLinks
              children={
                <RiArrowDropDownLine className="text-2xl text-[#cf2c2c]" />
              }
              to="/contact"
              title="Menu"
            />
            <NavLinks to="/profile" title="Profile" />
            <NavLinks to="/newUser" title="Contact" />
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Input type="search" placeholder="Search ByteEats" />
          <div className="flex gap-3">
            <Link to={"/cart"}>
              <div className="bg-[#a82f17] text-center w-11 p-2 rounded-full">
                <BiCart className="text-3xl  text-white" />
              </div>
            </Link>
            <Link to={"/user"}>
              <div className="bg-[#a82f17] text-center w-11 p-2 rounded-full">
                <IoMdLogIn className="text-3xl  text-white" />
              </div>
            </Link>
          </div>
        </div>
      </nav>
      <hr className="mt-4" />
    </>
  );
};
