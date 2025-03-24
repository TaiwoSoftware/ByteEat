import "./App.css";
import { LandingPage } from "./components/landing_page/LandingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Profile } from "./components/Profile/Profile";
import { Navbar } from "./components/landing_page/Navbar";
import { Cart } from "./components/cart/Cart";
import { ErrorPage } from "./components/Error/ErrorPage";
import { About } from "./components/About/About";
import { Contact } from "./components/Contact/Contact";
import { NewUser } from "./components/Auth/NewUser";
export const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/newUser" element={<NewUser />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </>
  );
};
