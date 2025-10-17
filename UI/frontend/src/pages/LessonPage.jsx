import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LessonTemplate from '../components/LessonTemplate';
import Sidebar from '../components/Sidebar';
import { getLessonBySlug } from '../utils/markdownloader';
import './LessonPage.css';

const LessonPage = () => {
  const { slug } = useParams();
  const lesson = getLessonBySlug(slug);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Listen for navbar "open-sidebar" events
  React.useEffect(() => {
    const handler = () => setIsSidebarOpen(true);
    window.addEventListener('open-sidebar', handler);
    return () => window.removeEventListener('open-sidebar', handler);
  }, []);

  return (
    <>
      <Navbar />
      <div className={`lesson-page ${!isSidebarOpen ? 'sidebar-hidden' : ''}`}>
        {/* <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
          ☰ Lessons
        </button> */}
        <div className={`lesson-layout ${!isSidebarOpen ? 'lesson-layout--sidebar-hidden' : ''}`}>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentSlug={slug} />
          <main className="main-content">
            <LessonTemplate lesson={lesson} />
          </main>
        </div>
      </div>
    </>
  );
};

export default LessonPage;
