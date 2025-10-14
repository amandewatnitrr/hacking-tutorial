import matter from 'gray-matter';

// Import all .md files from various folders outside the UI directory
// Using Vite's import.meta.glob for dynamic imports
// Paths are relative to this file: UI/frontend/src/utils/
const ethicalHackingFiles = import.meta.glob('../../../../ethical-hacking/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

const binaryExploitationFiles = import.meta.glob('../../../../intro-to-binary-exploitation/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

const pythonHackingFiles = import.meta.glob('../../../../python-for-eth-hacking/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

// Merge all markdown files into a single object
const mdFiles = {
  ...ethicalHackingFiles,
  ...binaryExploitationFiles,
  ...pythonHackingFiles
};

// Debug: Log what files were found
console.log('📁 Markdown files found:', Object.keys(mdFiles));
console.log('📊 Total files:', Object.keys(mdFiles).length);
console.log('🔍 Ethical Hacking files:', Object.keys(ethicalHackingFiles));
console.log('🔍 Binary Exploitation files:', Object.keys(binaryExploitationFiles));
console.log('🔍 Python Hacking files:', Object.keys(pythonHackingFiles));

/**
 * Get all lessons from markdown files
 * @returns {Array} Array of lesson objects with frontmatter and content
 */
export function getAllLessons() {
  const lessons = [];
  
  console.log('🔍 Starting to process lessons...');

  Object.entries(mdFiles).forEach(([filepath, content]) => {
    try {
      // Parse frontmatter and content from markdown file
      const { data, content: markdownContent } = matter(content);
      
      console.log('✅ Parsed:', filepath, 'with slug:', data.slug);
      
      // Extract slug from frontmatter or filename
      const slug = data.slug || filepath.split('/').pop().replace('.md', '');
      
      lessons.push({
        slug,
        filepath,
        frontmatter: data,
        content: markdownContent
      });
    } catch (error) {
      console.error(`Error parsing ${filepath}:`, error);
    }
  });

  // Sort by order field in frontmatter
  const sorted = lessons.sort((a, b) => {
    const orderA = a.frontmatter.order || 999;
    const orderB = b.frontmatter.order || 999;
    return orderA - orderB;
  });
  
  console.log('📚 Total lessons loaded:', sorted.length);
  console.log('📋 Lesson slugs:', sorted.map(l => l.slug));
  
  return sorted;
}

/**
 * Get a single lesson by its slug
 * @param {string} slug - The lesson slug
 * @returns {Object|null} Lesson object or null if not found
 */
export function getLessonBySlug(slug) {
  const lessons = getAllLessons();
  return lessons.find(lesson => lesson.slug === slug) || null;
}

/**
 * Get navigation (previous and next lessons) for a given lesson
 * @param {string} currentSlug - The current lesson slug
 * @returns {Object} Object with prev and next lesson objects
 */
export function getNavigation(currentSlug) {
  const lessons = getAllLessons();
  const currentIndex = lessons.findIndex(l => l.slug === currentSlug);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? lessons[currentIndex - 1] : null,
    next: currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  };
}

/**
 * Get lessons by category
 * @param {string} category - The category to filter by
 * @returns {Array} Array of lessons in that category
 */
export function getLessonsByCategory(category) {
  const lessons = getAllLessons();
  return lessons.filter(lesson => lesson.frontmatter.category === category);
}

/**
 * Get all unique categories
 * @returns {Array} Array of unique category names
 */
export function getCategories() {
  const lessons = getAllLessons();
  const categories = lessons.map(lesson => lesson.frontmatter.category);
  return [...new Set(categories)].filter(Boolean);
}
