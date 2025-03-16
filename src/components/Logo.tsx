import autoEatLogo from './Images/logo.png';
export const Logo:React.FC = () => {
  return (
    <div className='w-[6rem]  rounded-full'>
        <img src={autoEatLogo} alt="Logo" />
        <h1 className='font-fredoka new font-extrabold text-2xl text-center text-[#a82f17]'>ByteEats</h1>
    </div>
  )
}
