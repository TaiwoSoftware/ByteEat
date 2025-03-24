import { Input } from "./Input"

export const NewUser = () => {
  return (
    <div>
        <form className="text-center  max-w-[1000px] mx-auto mt-10">
          <Input htmlFor="name" id="name" labelName="Name" type="text" placeholder="Your name"  />
          <Input htmlFor="email" id="email" labelName="Email" type="email" placeholder="Email Address"  />
          <Input htmlFor="number" id="number" labelName="Telephone" type="email" placeholder="Email Address"  />
        </form>
    </div>
  )
}
