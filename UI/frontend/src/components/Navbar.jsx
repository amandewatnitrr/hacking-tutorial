import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getLessonsByCategory, getCategoryDisplayName } from '../utils/markdownloader';
import logoOnDark from '../../../../imgs/logo-on-dark.svg?url';
import logoOnLight from '../../../../imgs/logo-on-light.svg?url';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLessonsOpen, setIsLessonsOpen] = useState(false);
  const lessonsMenuRef = useRef(null);
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

  const handleNavClick = () => {
    setIsMenuOpen(false);
    setIsLessonsOpen(false);
  };

  // One entry per lesson section, linking to that section's first lesson.
  const sections = useMemo(
    () =>
      Object.entries(getLessonsByCategory()).map(([key, lessons]) => ({
        key,
        name: getCategoryDisplayName(key),
        count: lessons.length,
        firstSlug: lessons[0].slug,
        slugs: new Set(lessons.map((lesson) => lesson.slug)),
      })),
    []
  );
  const currentSlug = location.pathname.startsWith('/lessons/')
    ? decodeURIComponent(location.pathname.slice('/lessons/'.length))
    : null;

  // Close the Lessons menu on outside click or Escape.
  useEffect(() => {
    if (!isLessonsOpen) return undefined;
    const onPointerDown = (event) => {
      if (!lessonsMenuRef.current?.contains(event.target)) setIsLessonsOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsLessonsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isLessonsOpen]);

  // ✅ Handle Home click
  const handleHomeClick = () => {
    navigate('/');
    window.dispatchEvent(new CustomEvent('close-sidebar'));
    handleNavClick();
  };

  // Keep the sidebar open on desktop, but closed by default on smaller screens.
  useEffect(() => {
    if (location.pathname.startsWith('/lessons') && window.innerWidth >= 1024) {
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
          <img
            src={theme === 'dark' ? logoOnDark : logoOnLight}
            alt=""
            className="brand-logo"
          />
          <span className="brand-text">HackLearn</span>
        </Link>

        {/* Links */}
        <div id="navbar-links" className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-dropdown" ref={lessonsMenuRef}>
            <button
              type="button"
              className="nav-link bg-transparent nav-dropdown__trigger"
              onClick={() => setIsLessonsOpen((open) => !open)}
              aria-expanded={isLessonsOpen}
              aria-controls="navbar-lessons-menu"
            >
              Lessons
              <span className={`nav-dropdown__caret ${isLessonsOpen ? 'is-open' : ''}`} aria-hidden="true" />
            </button>

            {isLessonsOpen && (
              <ul id="navbar-lessons-menu" className="nav-dropdown__menu">
                {sections.map((section) => {
                  const isCurrent = section.slugs.has(currentSlug);
                  return (
                    <li key={section.key}>
                      <Link
                        to={`/lessons/${section.firstSlug}`}
                        className={`nav-dropdown__item ${isCurrent ? 'is-current' : ''}`}
                        aria-current={isCurrent ? 'true' : undefined}
                        onClick={handleNavClick}
                      >
                        <span>{section.name}</span>
                        <span className="nav-dropdown__count">{section.count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

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
          aria-expanded={isMenuOpen}
          aria-controls="navbar-links"
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
