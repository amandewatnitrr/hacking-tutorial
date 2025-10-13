import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLessonBySlug, getNavigation } from '../utils/markdownloader';
import LessonTemplate from '../components/LessonTemplate';
import Navbar from '../components/Navbar';
import './LessonPage.css';

export default function LessonPage() {
  const { slug } = useParams();
  const [lesson, setLesson] = useState(null);
  const [navigation, setNavigation] = useState({ prev: null, next: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    try {
      const currentLesson = getLessonBySlug(slug);
      setLesson(currentLesson);
      if (currentLesson) {
        setNavigation(getNavigation(slug));
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      setLesson(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="page-content">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontSize: '1.2rem', color: '#667eea' }}>
          Loading lesson...
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Navbar />
      <LessonTemplate lesson={lesson} navigation={navigation} />
    </div>
  );
}
