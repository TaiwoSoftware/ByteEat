import { Link } from "react-router-dom"

export const ErrorPage = () => {
  return (
    <div className="text-center mx-auto mt-40">
        <h1 className="text-7xl font-fredoka font-bold">404 🙁🙁🙁</h1>
        <Link to={'/'}>
        <button className="mt-7 bg-[#a82f17] text-white px-10 py-3 rounded-lg text-2xl shadow shadow-slate-400">Go Home</button>
        </Link>
    </div>
  )
}
