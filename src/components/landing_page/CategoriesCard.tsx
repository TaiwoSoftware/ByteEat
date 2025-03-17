import { ReactNode } from "react"

interface CategoriesCardProp {
    children:ReactNode
    title:string
}
export const CategoriesCard = ({children, title}:CategoriesCardProp) => {
  return (
    <div className="bg-[#FAF9F6] drop-shadow-lg w-48 flex flex-col items-center p-5 rounded-md">
         {children}
         <p className="mt-4 text-3xl font-fredoka">{title}</p>
    </div>
  )
}
