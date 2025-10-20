import React, { useState } from 'react'; // 1. Import useState
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  // 2. Add state for the menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">{'>'}_</span>
          <span className="brand-text">HackLearn</span>
        </Link>

        {/* 3. Add the 'active' class conditionally */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <button
            type="button"
            className="nav-link bg-transparent"
            onClick={() => {
              try {
                window.dispatchEvent(new CustomEvent('open-sidebar'));
              } catch { }
            }}
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
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
        </div>

        {/* 4. Add the hamburger menu button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)} // This toggles the state
          aria-label="Toggle navigation menu"
        >
          {/* You can swap this SVG for a 'close' icon when open */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

      </div>
    </nav>
  );
}

export default Navbar;