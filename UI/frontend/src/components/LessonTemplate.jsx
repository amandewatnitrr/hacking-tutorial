import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getLessonBySlug } from '../utils/markdownloader';
import './LessonTemplate.css';

const LessonTemplate = ({ lesson }) => {
  const [theme, setTheme] = useState('dark'); // sync with App theme

  useEffect(() => {
    // Listen for global theme changes
    const observer = new MutationObserver(() => {
      const currentTheme = document.body.getAttribute('data-theme') || 'dark';
      setTheme(currentTheme);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  if (!lesson) {
    return (
      <div className={`lesson-template ${theme}`}>
        <div className="lesson-not-found">
          <h1>Lesson Not Found</h1>
          <p>The requested lesson could not be found.</p>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const transformMarkdownUrl = (url, key, node) => {
    if (typeof url !== 'string') return url;
    const isImageNode = node?.tagName === 'img';
    const isRelativeImage =
      url.startsWith('../imgs/') || url.startsWith('./imgs/') || url.startsWith('./../imgs/');
    if (isImageNode && isRelativeImage) {
      const imageName = url.split('/').pop();
      return `/imgs/${imageName}`;
    }
    return url;
  };

  const prevLesson = lesson.prev ? getLessonBySlug(lesson.prev) : null;
  const nextLesson = lesson.next ? getLessonBySlug(lesson.next) : null;

  const NavigationBar = ({ position }) => (
    <nav className={`lesson-navigation lesson-navigation--${position} ${theme}`}>
      <div className="nav-section nav-section--left">
        {prevLesson ? (
          <Link to={`/lessons/${prevLesson.slug}`} className="nav-button">
            <span className="nav-arrow">←</span>
            <span className="nav-text">
              <span className="nav-label">Previous</span>
              <span className="nav-title">{prevLesson.title}</span>
            </span>
          </Link>
        ) : (
          <span className="nav-button nav-button--disabled">No previous lesson</span>
        )}
      </div>

      <div className="nav-section nav-section--right">
        {nextLesson ? (
          <Link to={`/lessons/${nextLesson.slug}`} className="nav-button nav-button--right">
            <span className="nav-text">
              <span className="nav-label">Next</span>
              <span className="nav-title">{nextLesson.title}</span>
            </span>
            <span className="nav-arrow">→</span>
          </Link>
        ) : (
          <span className="nav-button nav-button--disabled">No next lesson</span>
        )}
      </div>
    </nav>
  );

  return (
    <div className={`lesson-template ${theme}`}>
      <header className="lesson-header">
        <h1>{lesson.title}</h1>
      </header>

      <NavigationBar position="top" />

      <article className="lesson-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          urlTransform={transformMarkdownUrl}
          components={{
            code({ node, inline, className, children, ...props }) {
              return !inline ? (
                <pre className={className}>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            img({ node, ...props }) {
              return (
                <img
                  {...props}
                  loading="lazy"
                  style={{ maxWidth: '100%', height: 'auto' }}
                  alt={props.alt || 'Image'}
                />
              );
            },
            a({ node, children, href, ...props }) {
              const isExternal = href?.startsWith('http');
              return (
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  {...props}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </article>

      <NavigationBar position="bottom" />
    </div>
  );
};

export default LessonTemplate;
