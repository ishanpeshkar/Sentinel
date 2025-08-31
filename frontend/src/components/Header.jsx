import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';



const Header = () => {
  // This will be replaced by context later
  const { currentUser, signOut } = useAuth();
  const isLoggedIn = false; 

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>Sentinel</h1>
        </Link>
      </div>
      <nav className="navigation">
        <ul>
          <li><Link to="/map">Heatmap</Link></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>
      <div className="user-actions">
        {currentUser ? (
          <button onClick={signOut} className="signup-btn">Log Out</button>
        ) : (
          <>
            <Link to="/login" className="login-btn">Log In</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

