import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { Input } from "./Input";
import { BiUser } from "react-icons/bi";
import { BiCart } from "react-icons/bi";
export const Navbar = () => {
  return (
    <>
      <nav className="px-2 flex items-center justify-between">
        <Link to={"/"}>
          <Logo />
        </Link>

        <div className="flex gap-4 items-center">
          <Input type="search" placeholder="Search ByteEats" />
          <div className="flex gap-3">
            <div className="bg-[#a82f17] text-center w-11 p-2 rounded-full">
              <BiCart className="text-3xl  text-white" />
            </div>
            <Link to={"/profile"}>
              <div className="bg-[#a82f17] text-center w-11 p-2 rounded-full">
                <BiUser className="text-3xl  text-white" />
              </div>
            </Link>
          </div>
        </div>
      </nav>
      <hr className="mt-4" />
    </>
  );
};
