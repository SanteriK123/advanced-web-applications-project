import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Register from "./components/register";
import Login from "./components/login";
import UserBrowser from "./components/userbrowser";
import Chat from "./components/chat";
import Edit from "./components/edit";
import "./style.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    // Check if token exists
    // Small problem here, immediately after login this is not updated so you need to refresh page
    // to access content
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login and logout on main app so components can easily check if authenticated or not
  const handleLogin = (token: string, email: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <div className="content">
      <Router>
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<div>Welcome to the chatting app!</div>}/>
          <Route
            path="/register"
            element={
              <Register token={token} isAuthenticated={isAuthenticated} />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                token={token}
                isAuthenticated={isAuthenticated}
                onLogin={handleLogin}
              />
            }
          />
          <Route
            path="/browser"
            element={
              <UserBrowser token={token} isAuthenticated={isAuthenticated} />
            }
          />
          <Route
            path="/chat"
            element={<Chat token={token} isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/edit"
            element={<Edit token={token} isAuthenticated={isAuthenticated} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
