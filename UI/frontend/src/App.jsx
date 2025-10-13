import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GettingStartedPage from './pages/GettingStartedPage';
import LessonPage from './pages/LessonPage';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<HomePage />} />
        
        {/* Getting Started page route */}
        <Route path="/getting-started" element={<GettingStartedPage />} />
        
        {/* Dynamic lesson route */}
        <Route path="/lessons/:slug" element={<LessonPage />} />
        
        {/* 404 fallback */}
        <Route 
          path="*" 
          element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              <a href="/" style={{ color: '#667eea' }}>
                Go to Home
              </a>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;