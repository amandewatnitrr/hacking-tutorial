import React from 'react';
import { Link } from 'react-router-dom';
import { getAllLessons, getCategories } from '../utils/markdownloader';
import { getAllCourses } from '../config/courses';
import './HomePage.css';

const HomePage = () => {
  const lessons = getAllLessons();
  const categories = getCategories();
  const allCourses = getAllCourses();

  // Enhance courses with lesson data
  const courses = allCourses.map(course => {
    if (course.id === 'ethical-hacking') {
      return {
        ...course,
        lessonCount: lessons.length,
        categories: categories,
        link: '/getting-started' // Link to Getting Started page
      };
    }
    return {
      ...course,
      lessonCount: course.status === 'coming-soon' ? 'Coming Soon' : 0,
      categories: [],
      link: '#'
    };
  });

  const stats = {
    totalCourses: courses.length,
    totalLessons: lessons.length,
    totalCategories: categories.length
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Hacking Tutorial</span>
          </h1>
          <p className="hero-subtitle">
            Comprehensive Learning Platform for Ethical Hacking, Security, and Development Tools
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.totalCourses}</span>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.totalLessons}+</span>
              <span className="stat-label">Lessons</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.totalCategories}+</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="courses-section">
        <div className="section-header">
          <h2>Available Courses</h2>
          <p>Choose a course to start your learning journey</p>
        </div>

        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card" style={{ '--course-color': course.color }}>
              <div className="course-header">
                <span className="course-icon">{course.icon}</span>
                <h3 className="course-title">{course.title}</h3>
              </div>
              
              <p className="course-description">{course.description}</p>
              
              <div className="course-topics">
                <h4>What You'll Learn:</h4>
                <ul>
                  {course.topics.map((topic, index) => (
                    <li key={index}>
                      <span className="topic-bullet">✓</span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="course-meta">
                <div className="meta-item">
                  <span className="meta-icon">📚</span>
                  <span>{course.lessonCount} Lessons</span>
                </div>
                {course.categories.length > 0 && (
                  <div className="meta-item">
                    <span className="meta-icon">🏷️</span>
                    <span>{course.categories.length} Categories</span>
                  </div>
                )}
              </div>

              {course.link !== '#' ? (
                <Link to={course.link} className="course-button">
                  Start Learning
                  <span className="button-arrow">→</span>
                </Link>
              ) : (
                <button className="course-button disabled" disabled>
                  Coming Soon
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Learn Here?</h2>
          <p>Our platform offers comprehensive, hands-on learning experiences</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Practical & Hands-On</h3>
            <p>Learn by doing with real-world examples and exercises</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Comprehensive Content</h3>
            <p>From basics to advanced topics, everything you need in one place</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Regularly Updated</h3>
            <p>Content is continuously improved and expanded</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Open Source</h3>
            <p>Community-driven content with contributions welcome</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Learning?</h2>
          <p>Choose a course above and begin your journey into ethical hacking and development tools</p>
          <div className="cta-buttons">
            {lessons.length > 0 && (
              <Link to={`/lessons/${lessons[0].slug}`} className="cta-button primary">
                Start First Lesson
              </Link>
            )}
            <a 
              href="https://github.com/amandewatnitrr/hacking-tutorial" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cta-button secondary"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <p>
            <strong>⚠️ Educational Purpose Only:</strong> All activities should be performed in controlled, legal environments.
          </p>
          <p className="footer-links">
            <a href="https://github.com/amandewatnitrr/hacking-tutorial/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
              License
            </a>
            <span>•</span>
            <a href="https://github.com/amandewatnitrr/hacking-tutorial/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">
              Contributing
            </a>
            <span>•</span>
            <a href="https://github.com/amandewatnitrr/hacking-tutorial/blob/main/CODE_OF_CONDUCT.md" target="_blank" rel="noopener noreferrer">
              Code of Conduct
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
