import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LessonPage from './pages/LessonPage';
import { getAllLessons } from './utils/markdownloader';
import './App.css';

const App = () => {
  // Get all lessons to find the first one for the default redirect
  const lessons = getAllLessons();
  const firstLesson = lessons.length > 0 ? lessons[0] : null;

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to first lesson */}
        <Route 
          path="/" 
          element={
            firstLesson ? (
              <Navigate to={`/lessons/${firstLesson.slug}`} replace />
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>No lessons found</h1>
                <p>Please add markdown files to the content folder.</p>
              </div>
            )
          } 
        />
        
        {/* Dynamic lesson route */}
        <Route path="/lessons/:slug" element={<LessonPage />} />
        
        {/* 404 fallback */}
        <Route 
          path="*" 
          element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              {firstLesson && (
                <a href={`/lessons/${firstLesson.slug}`} style={{ color: '#667eea' }}>
                  Go to First Lesson
                </a>
              )}
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;