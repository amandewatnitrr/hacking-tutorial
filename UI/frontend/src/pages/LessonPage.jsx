import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LessonTemplate from '../components/LessonTemplate';
import { getLessonBySlug } from '../utils/markdownloader';
import './LessonPage.css';

const LessonPage = () => {
  const { slug } = useParams();
  const lesson = getLessonBySlug(slug);

  return (
    <>
      <Navbar />
      <div className="lesson-page">
        <main className="main-content">
          <LessonTemplate lesson={lesson} />
        </main>
      </div>
    </>
  );
};

export default LessonPage;
