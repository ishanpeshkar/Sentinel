import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
//import { FaUserCircle } from "react-icons/fa";
import ShieldHeatmapLogo from './ShieldHeatmapLogo';
// <-- add this

const Header = () => {
  const { currentUser, signOut } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1>
            <ShieldHeatmapLogo /> Sentinel <span className="logo-icon">S</span>
          </h1>
        </Link>
      </div>

      <nav className="navigation">
        <ul>
          <li>
            <Link to="/map">Heatmap</Link>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
        </ul>
      </nav>
      <div className="user-actions">
        {currentUser ? (
          <div className="user-nav">
            <Link to="/profile" className="profile-link">
              {/* <FaUserCircle className="profile-icon" /> */}{" "}
              {/* Avatar Icon */}
              My Profile
            </Link>
            <button onClick={signOut} className="signup-btn">
              Log Out
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Log In
            </Link>
            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
