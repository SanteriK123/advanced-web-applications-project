import { Link } from "react-router-dom";
import React from "react";
import "./navbar.css"
interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <div className="navbar">
      <Link className="link" to="/">{"Home"}</Link>
      <Link className="link" to="/browser">{"Browse users"}</Link>
      <Link className="link" to="/chat">Chat</Link>
      {isAuthenticated ? (
        <div className="navbar-auth">
          <Link className="link" to="/edit">Edit Profile</Link>
          <Link to="/" onClick={onLogout} className="link">
            Logout
          </Link>
        </div>
      ) : (
        <>
          <Link className="link" to="/login">{"Login"}</Link>
          <Link className="link" to="/register">{"Register"}</Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
