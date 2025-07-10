import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Amplify } from "aws-amplify";
import {
  fetchAuthSession,
  getCurrentUser,
  signOut as amplifySignOut,
} from "@aws-amplify/auth";
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
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleNav = () => setIsOpen(!isOpen);

  // Resize listener for sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔁 Fetch current user and token
  const fetchUser = async () => {
    try {
      console.log("📣 Fetching session...");
      const session = await fetchAuthSession({ forceRefresh: true });
      const currentUser = await getCurrentUser();
      const token = session.tokens?.idToken?.toString();

      if (token) {
        console.log("✅ User loaded:", currentUser);
        setAuthToken(token);
        setUser(currentUser);
      } else {
        throw new Error("No token found");
      }
    } catch (error) {
      console.warn("⚠️ No user session found (probably logged out):", error.message);
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run once on initial load
  useEffect(() => {
    fetchUser();
  }, []);

  // 🔄 Listen to Amplify Auth events
  useEffect(() => {
    const listener = async ({ payload }) => {
      if (payload.event === "signOut") {
        console.log("🚪 User signed out");

        try {
          await amplifySignOut({ global: true });
          console.log("✅ Signed out globally");
        } catch (err) {
          console.error("❌ Error during sign out:", err);
        }

        localStorage.clear(); // Clears token, flags
        sessionStorage.clear();
        setAuthToken(null);
        setUser(null);
        window.location.reload(); // ⬅️ Full clean reload
      }

      if (payload.event === "signIn") {
        console.log("🔑 User signed in");

        // ✅ Trigger reload ONCE to refresh user/token session
        if (!localStorage.getItem("refreshedAfterLogin")) {
          localStorage.setItem("refreshedAfterLogin", "true");
          window.location.reload();
        }
      }
    };

    const unsubscribe = Hub.listen("auth", listener);
    return () => unsubscribe();
  }, []);

  return (
    <Authenticator hideSignUp={true}>
      {({ signOut }) => (
        <div>
          <TopBar toggleNav={toggleNav} logoSrc={bemllogo} />
          <SideNav isOpen={isOpen} toggleNav={toggleNav} />
          <div className={`main-content ${isOpen ? "shifted" : ""}`}>
            {loading ? (
              <div className="loading-screen">Loading...</div>
            ) : (
              <Routes>
                <Route path="/page1" element={<Page1 showDropdown={true} />} />
                <Route
                  path="/page2"
                  element={<Page2 showDropdown={false} user={user} signOut={signOut} />}
                />
                <Route
                  path="/page3"
                  element={
                    authToken && user ? (
                      <Page3
                        key={user.username || authToken}
                        token={authToken}
                      />
                    ) : (
                      <div>Loading user token...</div>
                    )
                  }
                />
                <Route path="/" element={<Navigate to="/page2" />} />
              </Routes>
            )}
          </div>
        </div>
      )}
    </Authenticator>
  );
};

export default App;
