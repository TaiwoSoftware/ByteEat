import { ReactNode } from "react";

interface SidebarListProps {
  children: ReactNode;
  title: string;
  onClick: (category: string) => void; // Accept a function to handle click
}

export const SidebarList = ({ children, title, onClick }: SidebarListProps) => {
  return (
    <div
      onClick={() => onClick(title)} // Pass the category (title) on click
      className="flex flex-col items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
    >
      <div className="transform transition-transform duration-300 hover:scale-110">
        {children}
      </div>
      <p className="text-xl font-semibold text-gray-800">{title}</p>
    </div>
  );
};
