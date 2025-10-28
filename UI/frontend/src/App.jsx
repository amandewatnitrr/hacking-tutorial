import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LessonPage from './pages/LessonPage';
import ScrollToTop from './components/ScrollToTop';
import { getAllLessons } from './utils/markdownloader';
import './App.css';

const App = () => {
  const lessons = getAllLessons();
  const firstLesson = lessons.length > 0 ? lessons[0] : null;

  useEffect(() => {
    // Function to add copy buttons to all <pre><code> blocks
    const addCopyButtons = (root = document) => {
      const codeBlocks = root.querySelectorAll("pre");

codeBlocks.forEach((block) => {
  const code = block.querySelector(":scope > code"); // only direct child <code>
  if (!code) return; // skip outer <pre> that doesn't directly contain code
  if (block.querySelector(".copy-btn")) return; // avoid duplicates


        block.style.position = "relative";

        const button = document.createElement("button");
        button.className =
          "copy-btn absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded";
        button.innerText = "Copy";

        button.addEventListener("click", async () => {
          const text = code.innerText || "";
          await navigator.clipboard.writeText(text);
          button.innerText = "Copied!";
          setTimeout(() => (button.innerText = "Copy"), 2000);
        });

        block.appendChild(button);
      });
    };

    // Initial run
    addCopyButtons();

    // Watch for dynamically loaded lessons
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) addCopyButtons(node);
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
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
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              {firstLesson && (
                <a href={`/lessons/${firstLesson.slug}`} style={{ color: '#4d869fff' }}>
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
