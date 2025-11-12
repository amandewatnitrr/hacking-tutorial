import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getLessonBySlug } from '../utils/markdownloader';
import Mermaid from './Mermaid';
import './LessonTemplate.css';

const LessonTemplate = ({ lesson }) => {
  const [theme, setTheme] = useState('dark');
  const location = useLocation();

  // Sync with global theme
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.body.getAttribute('data-theme') || 'dark';
      setTheme(currentTheme);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Handle anchor link navigation when URL hash changes
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      // Wait for content to render, then scroll to the element
      setTimeout(() => {
        const id = hash.substring(1); // Remove the # symbol
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash, lesson]);

  // ✅ Only show when the route starts with /lessons/
  const isLessonPage = location.pathname.startsWith('/lessons/');
  if (!isLessonPage) return null;

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
          rehypePlugins={[
            rehypeRaw,
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }]
          ]}
          urlTransform={transformMarkdownUrl}
          components={{
            code({ inline, className, children, ...props }) {
              // Determine if this is inline code or a code block
              // Inline code: single backticks `code`
              // Code blocks: triple backticks ```code``` or indented blocks
              const isInline = inline !== false && (
                !className?.startsWith('language-') && 
                typeof children === 'string' &&
                !children.includes('\n')
              );
              
              // Check if this is a mermaid diagram
              const isMermaid = className === 'language-mermaid';
              
              if (isMermaid) {
                return <Mermaid chart={String(children).trim()} theme={theme} />;
              }
              
              // Inline code should not be wrapped in <pre>
              if (isInline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
              // Block code should be wrapped in <pre>
              return (
                <pre className={className}>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            },
            img({ ...props }) {
              return (
                <img
                  {...props}
                  loading="lazy"
                  style={{ maxWidth: '100%', height: 'auto' }}
                  alt={props.alt || 'Image'}
                />
              );
            },
            a({ children, href, ...props }) {
              // Handle internal anchor links
              if (href?.startsWith('#')) {
                return (
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      const id = href.substring(1);
                      const element = document.getElementById(id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Update URL hash without triggering navigation
                        window.history.pushState(null, '', href);
                      }
                    }}
                    {...props}
                  >
                    {children}
                  </a>
                );
              }
              
              // Handle external links
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
