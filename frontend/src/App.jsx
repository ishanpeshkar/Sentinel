import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import './index.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import ProfilePage from './pages/ProfilePage';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import LocationDashboard from './pages/LocationDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>

        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/location/:locationName" element={<LocationDashboard />} />
          </Routes>
        </main>
      </AuthProvider>
      {/* The Footer can be part of a layout component that excludes it for the map page if desired */}
      {/* For simplicity now, it will appear on all pages. */}
      <Footer /> 
    </Router>
  );
}

export default App;