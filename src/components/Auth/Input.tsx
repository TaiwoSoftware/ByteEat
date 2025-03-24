interface InputProp {
  type: string;
  placeholder: string;
  labelName:string;
  htmlFor:string;
  id:string;
}
export const Input = ({ type, placeholder,labelName,htmlFor,id }: InputProp) => {
  return (
    <>
      <div className="mt-4">
        <label htmlFor={htmlFor}>
          <span className="py-[1.2rem] cursor-pointer  text-black px-3">
            {labelName}
          </span>
        </label>
        <input
          type={type}
          className="ml-4 py-4 border border-black outline-none px-14 text-center  border-t-0 border-l-0 border-r-0 "
          placeholder={placeholder}
          id={id}
        />
      </div>
    </>
  );
};
