interface NavLinkProps {
  to: string;
  title: string;
  children?: ReactNode;
}
import { ReactNode } from "react";
import { Link } from "react-router-dom";
export const NavLinks = ({ to, title, children }: NavLinkProps) => {
  return (
    <Link to={to}>
      <div className="flex items-center">
        <p className="font-fredoka text-base ">{title}</p>
        {children}
      </div>
    </Link>
  );
};
