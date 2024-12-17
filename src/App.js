import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LineChart from "./components/LineChart"; // Ensure the path matches your file structure
import SideNav from "./components/SideNav";
import TopBar from "./components/TopBar";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import Page4 from "./pages/Page4";
import Alarm from "./components/Alarm"; // New Alarm Table Component
import "./App.css"; // Ensure you have CSS for layout
import bemllogo from "./assets/CME1.png";

const App = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <TopBar toggleNav={toggleNav} logoSrc={bemllogo} />
      <SideNav isOpen={isOpen} toggleNav={toggleNav} />
      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
        <Routes>
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} />
          <Route path="/page4" element={<Page4 />} />
          <Route exact path="/" element={<Page1 />} />
        </Routes>
        {/* <LineChart fileName="TEST10.csv" />
        <Alarm fileName="TEST10.csv" /> */}
      </div>
    </div>
  );
};

export default App;

