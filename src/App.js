import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "@aws-amplify/auth";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";

import SideNav from "./components/SideNav";
import TopBar from "./components/TopBar";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import "./App.css";
import bemllogo from "./assets/logo.png";

Amplify.configure(awsExports);

const App = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

  // Function to toggle the side navigation
  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  // Adjust side navigation based on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch the token using fetchAuthSession and store it in localStorage
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const session = await fetchAuthSession();
        const authToken = session.tokens?.idToken?.toString();

        if (authToken) {
          console.log("Token fetched: ", authToken);
          localStorage.setItem("authToken", authToken); // Save token to localStorage
        } else {
          console.error("Token not found in session.");
        }
      } catch (error) {
        console.error("Error fetching auth session: ", error);
      }
    };

    fetchToken();
  }, []);

  return (
    <Authenticator hideSignUp={true}>
      {({ signOut, user }) => (
        <div>
          <TopBar toggleNav={toggleNav} logoSrc={bemllogo} />
          <SideNav isOpen={isOpen} toggleNav={toggleNav} />
          <div className={`main-content ${isOpen ? "shifted" : ""}`}>
            <Routes>
              <Route path="/page1" element={<Page1 showDropdown={true} />} />
              <Route path="/page2" element={<Page2 showDropdown={false} user={user} signOut={signOut} />} />
            </Routes>
          </div>
        </div>
      )}
    </Authenticator>
  );
};

export default App;
