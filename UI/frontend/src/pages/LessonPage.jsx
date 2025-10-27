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
  const [isSidebarOpen, setIsSidebarOpen] = useState(()=>window.innerWidth < 1024 ? false : true);

  // Listen for navbar "open-sidebar" events
  React.useEffect(() => {
    const handler = () => setIsSidebarOpen(true);
    window.addEventListener('open-sidebar', handler);
    return () => window.removeEventListener('open-sidebar', handler);
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
