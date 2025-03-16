import { BiSearch } from "react-icons/bi"
interface InputProp {
    type:string,
    placeholder:string,
}
export const Input = ({type, placeholder}:InputProp) => {
  return (
    <div className="relative">
        <input className="bg-gray-100 py-2 outline-none px-10 text-center rounded-lg" type={type} placeholder={placeholder} />
        <BiSearch className="text-2xl text-green-950 absolute top-2 left-2" />
    </div>
  )
}
