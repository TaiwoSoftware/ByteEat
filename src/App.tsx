import "./App.css";
import { LandingPage } from "./components/landing_page/LandingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Profile } from "./components/Profile/Profile";
import { Navbar } from "./components/landing_page/Navbar";
export const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
};
