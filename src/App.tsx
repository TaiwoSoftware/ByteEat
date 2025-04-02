import "./App.css";
import { LandingPage } from "./components/landing_page/LandingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/landing_page/Navbar";
import { Cart } from "./components/cart/Cart";
import { ErrorPage } from "./components/Error/ErrorPage";
import { About } from "./components/About/About";
import { Contact } from "./components/Contact/Contact";
import { NewUser } from "./components/Auth/NewUser";
import Footer from "./components/landing_page/Footer";
import { Login } from "./components/Auth/Login";
import { Shop } from "./components/Shop/Shop";
export const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user" element={<NewUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
};
