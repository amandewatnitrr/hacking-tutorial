import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Link } from 'react-router-dom';
import './LessonTemplate.css';

/**
 * Reusable template for displaying lesson content
 * @param {Object} lesson - The lesson object with frontmatter and content
 * @param {Object} navigation - Object with prev and next lessons
 */
export default function LessonTemplate({ lesson, navigation }) {
  if (!lesson) {
    return (
      <div className="lesson-container">
        <div className="lesson-not-found">
          <h1>Lesson not found</h1>
          <p>The lesson you're looking for doesn't exist.</p>
          <Link to="/" className="nav-button">Go to First Lesson</Link>
        </div>
      </div>
    );
  }

  const { frontmatter, content } = lesson;
  const { prev, next } = navigation || { prev: null, next: null };

  // Navigation component to be reused at top and bottom
  const NavigationButtons = () => (
    <nav className="lesson-navigation">
      <div className="nav-left">
        {prev ? (
          <Link to={`/lessons/${prev.slug}`} className="nav-button prev">
            <span className="nav-arrow">←</span>
            <div className="nav-content">
              <span className="nav-label">Previous Lesson</span>
              <span className="nav-title">{prev.frontmatter.title}</span>
            </div>
          </Link>
        ) : (
          <div className="nav-button disabled">
            <span className="nav-text">No Previous Lesson</span>
          </div>
        )}
      </div>

      <div className="nav-right">
        {next ? (
          <Link to={`/lessons/${next.slug}`} className="nav-button next">
            <div className="nav-content">
              <span className="nav-label">Next Lesson</span>
              <span className="nav-title">{next.frontmatter.title}</span>
            </div>
            <span className="nav-arrow">→</span>
          </Link>
        ) : (
          <div className="nav-button disabled">
            <span className="nav-text">No Next Lesson</span>
          </div>
        )}
      </div>
    </nav>
  );

  return (
    <div className="lesson-container">
      {/* Header */}
      <header className="lesson-header">
        <h1>{frontmatter.title}</h1>
        <div className="lesson-meta">
          {frontmatter.category && (
            <span className="category-badge">{frontmatter.category}</span>
          )}
          {frontmatter.order && (
            <span className="lesson-number">Lesson {frontmatter.order}</span>
          )}
        </div>
      </header>

      {/* Navigation at Top */}
      <NavigationButtons />

      {/* Markdown Content */}
      <article className="lesson-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // Custom rendering for code blocks
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return inline ? (
                <code className={className} {...props}>
                  {children}
                </code>
              ) : (
                <div className="code-block-wrapper">
                  {match && <div className="code-language">{match[1]}</div>}
                  <pre className={className}>
                    <code {...props}>{children}</code>
                  </pre>
                </div>
              );
            },
            // Custom rendering for images with lazy loading
            img({ src, alt, ...props }) {
              // Transform relative image paths to absolute paths
              let imageSrc = src;
              
              // Handle relative paths like ../imgs/ or ./imgs/
              if (src && (src.startsWith('../imgs/') || src.startsWith('./imgs/'))) {
                // Remove ../ or ./ prefix and get just the filename
                const filename = src.replace(/^\.\.\/imgs\/|^\.\/imgs\//, '');
                imageSrc = `/${filename}`;
              } else if (src && src.startsWith('./../imgs/')) {
                // Handle ./../imgs/ paths
                const filename = src.replace(/^\.\.\/\.\.\/imgs\//, '');
                imageSrc = `/${filename}`;
              }
              
              return (
                <img 
                  src={imageSrc} 
                  alt={alt || 'Lesson image'} 
                  loading="lazy"
                  {...props}
                />
              );
            },
            // Custom rendering for links
            a({ href, children, ...props }) {
              // Check if it's an external link
              const isExternal = href?.startsWith('http');
              return isExternal ? (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                  {children} <span className="external-link-icon">↗</span>
                </a>
              ) : (
                <a href={href} {...props}>{children}</a>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {/* Navigation at Bottom */}
      <NavigationButtons />
    </div>
  );
}
