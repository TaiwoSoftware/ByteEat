interface SiderbarListProps {
  children: ReactNode;
  title: string;
}
import { ReactNode } from "react";
export const SidebarList = ({ children, title }: SiderbarListProps) => {
  return (
    <div className="flex items-center gap-3 mt-4 ">
        {children}
      <div>
        <p className="text-2xl font-bold font-fredoka">{title}</p>
      </div>
    </div>
  );
};
