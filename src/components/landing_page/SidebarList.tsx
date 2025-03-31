import { ReactNode } from "react";

interface SidebarListProps {
  children: ReactNode;
  title: string;
}

export const SidebarList = ({ children, title }: SidebarListProps) => {
  return (
    <div className="flex items-center gap-5 mt-6 transition-transform transform hover:scale-105 cursor-pointer">
      {/* Icon with Gradient Background */}
      <div className="p-4 rounded-full shadow-lg">{children}</div>

      {/* Sidebar Title */}
      <p className="text-xl font-semibold text-gray-800 font-fredoka">
        {title}
      </p>
    </div>
  );
};
