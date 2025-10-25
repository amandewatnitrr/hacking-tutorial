import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark'); // default theme

  // Update body attribute for theme
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setIsMenuOpen(false); // close menu on mobile after toggle
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">{'>'}_</span>
          <span className="brand-text">HackLearn</span>
        </Link>

        {/* Navbar links and theme toggle */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <button
            type="button"
            className="nav-link bg-transparent"
            onClick={() => window.dispatchEvent(new CustomEvent('open-sidebar'))}
            aria-label="Open lessons sidebar"
            title="Lessons"
          >
            Lessons
          </button>
          <Link to="/" className="nav-link">Home</Link>
          <a
            href="https://github.com/amandewatnitrr/hacking-tutorial.git"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link github-link"
          >
            GitHub
          </a>
          {/* Move theme toggle inside links */}
          <button
            className="theme-toggle-button"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>

        {/* Hamburger menu button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
