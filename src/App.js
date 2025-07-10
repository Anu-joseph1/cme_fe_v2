import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { fetchAuthSession, getCurrentUser } from "@aws-amplify/auth";
import { Authenticator } from "@aws-amplify/ui-react";
import { Hub } from "@aws-amplify/core";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authChanged, setAuthChanged] = useState(false);

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

  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);

      const session = await fetchAuthSession();
      const authToken = session.tokens?.idToken?.toString();
      if (authToken) {
        console.log("Token fetched:", authToken);
        localStorage.setItem("authToken", authToken);
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const authListener = ({ payload }) => {
      if (payload.event === "signIn") {
        console.log("User signed in");
        fetchUser();
        // window.location.reload();
        setAuthChanged((prev) => !prev); // Toggle state to trigger refresh
      } else if (payload.event === "signOut") {
        console.log("User signed out");
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("authToken"); // Clear the auth token
        setAuthChanged((prev) => !prev); // Toggle state to trigger refresh
      }
    };

    const unsubscribe = Hub.listen("auth", authListener);
    return () => {
      unsubscribe();
    };
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

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
              <Route path="/page3" element={<Page3 resetEquipmentList={signOut} />} />
              <Route exact path="/" element={<Page3 resetEquipmentList={signOut} />} />
            </Routes>
          </div>
        </div>
      )}
    </Authenticator>
  );
};

export default App;