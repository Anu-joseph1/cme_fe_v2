import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { fetchAuthSession, getCurrentUser } from "@aws-amplify/auth";
import { Authenticator } from "@aws-amplify/ui-react";
import { Hub } from "@aws-amplify/core"; // Import Hub for auth event listening
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";

import SideNav from "./components/SideNav";
import TopBar from "./components/TopBar";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import "./App.css";
import bemllogo from "./assets/logo.png";

Amplify.configure(awsExports);

const App = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks login state
  const [loading, setLoading] = useState(true);

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

  // Fetch user data and update state dynamically
  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true); // User is logged in

      const session = await fetchAuthSession();
      const authToken = session.tokens?.idToken?.toString();
      if (authToken) {
        console.log("Token fetched:", authToken);
        localStorage.setItem("authToken", authToken);
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
      setUser(null);
      setIsAuthenticated(false); // User is logged out
    } finally {
      setLoading(false);
    }
  };

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Listen for authentication events (LOGIN / LOGOUT)
  useEffect(() => {
    const authListener = ({ payload }) => {
      if (payload.event === "signIn") {
        console.log("User signed in");
        fetchUser(); // Update UI immediately after login
        window.location.reload(); // Force reload after sign in to reflect changes
      } else if (payload.event === "signOut") {
        console.log("User signed out");
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    const unsubscribe = Hub.listen("auth", authListener);
    return () => {
      unsubscribe(); // Cleanup listener on unmount
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Authenticator hideSignUp={true}>
      {({ signOut }) => (
        <div>
          <TopBar toggleNav={toggleNav} logoSrc={bemllogo} />
          <SideNav isOpen={isOpen} toggleNav={toggleNav} />
          <div className={`main-content ${isOpen ? "shifted" : ""}`}>
            <Routes>
              <Route path="/page1" element={<Page1 showDropdown={true} />} />
              <Route path="/page2" element={<Page2 showDropdown={false} user={user} signOut={signOut} />} />
              <Route path="/page3" element={<Page3 />} />
            </Routes>
          </div>
        </div>
      )}
    </Authenticator>
  );
};

export default App;
