import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  // ✅ Apply and save theme
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ✅ Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setIsMenuOpen(false);
  };

  const handleNavClick = () => setIsMenuOpen(false);

  // ✅ Handle Lessons click
  const handleLessonsClick = () => {
    if (!location.pathname.startsWith('/lessons')) {
      // Navigate to lessons page (you can change this to your first lesson)
      navigate('/lessons/introduction');
    } else {
      // Already on a lesson page — just ensure sidebar is visible
      window.dispatchEvent(new CustomEvent('open-sidebar'));
    }
    handleNavClick();
  };

  // ✅ Handle Home click
  const handleHomeClick = () => {
    navigate('/');
    window.dispatchEvent(new CustomEvent('close-sidebar'));
    handleNavClick();
  };

  // ✅ When the user refreshes on lessons, keep sidebar open
  useEffect(() => {
    if (location.pathname.startsWith('/lessons')) {
      window.dispatchEvent(new CustomEvent('open-sidebar'));
    } else {
      window.dispatchEvent(new CustomEvent('close-sidebar'));
    }
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={handleHomeClick}>
          <span className="brand-icon">{'>'}_</span>
          <span className="brand-text">HackLearn</span>
        </Link>

        {/* Links */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <button
            type="button"
            className="nav-link bg-transparent"
            onClick={handleLessonsClick}
          >
            Lessons
          </button>

          <Link to="/" className="nav-link" onClick={handleHomeClick}>
            Home
          </Link>

          <a
            href="https://github.com/amandewatnitrr/hacking-tutorial.git"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link github-link"
            onClick={handleNavClick}
          >
            GitHub
          </a>

          {/* Theme Toggle */}
          <button
            className="theme-toggle-button"
            onClick={toggleTheme}
            aria-label="Toggle light/dark theme"
          >
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-menu-button ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMenuOpen ? (
            // Close icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
