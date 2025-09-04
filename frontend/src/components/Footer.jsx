import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About Section */}
        <div className="footer-section about">
          <h1 className="logo-text">Sentinel</h1>
          <p>
            Empowering communities with real-time safety insights. Join our network to contribute and explore neighborhood safety data.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="/map">Heatmap</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section contact">
          <h2>Contact Us</h2>
          <form action="#">
            <input
              type="email"
              name="email"
              className="text-input contact-input"
              placeholder="Your email..."
            />
            <textarea
              rows="3"
              name="message"
              className="text-input contact-input"
              placeholder="Your message..."
            ></textarea>
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>

        {/* Community / Social Section */}
        <div className="footer-section social">
          <h2>Community</h2>
          <div className="social-icons">
            <a href="#"><span>🌐</span> Website</a>
            <a href="#"><span>💬</span> Forum</a>
            <a href="#"><span>📢</span> Updates</a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Sentinel | Empowering Safer Communities
      </div>
    </footer>
  );
};

export default Footer;
