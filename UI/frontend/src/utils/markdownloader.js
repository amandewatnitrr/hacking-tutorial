import matter from 'gray-matter';

// Import all markdown files from content directories
// Using relative paths from this file (src/utils/) to content folders
const ethicalHackingFiles = import.meta.glob('../content/ethical-hacking/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

const binaryExploitationFiles = import.meta.glob('../content/intro-to-binary-exploitation/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

const pythonHackingFiles = import.meta.glob('../content/python-for-eth-hacking/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

const pythonScriptsFiles = import.meta.glob('../content/python-scripts/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

const safePracticeFiles = import.meta.glob('../content/safe-practice-questions/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

// Combine all markdown files
const mdFiles = {
  ...ethicalHackingFiles,
  ...binaryExploitationFiles,
  ...pythonHackingFiles,
  ...pythonScriptsFiles,
  ...safePracticeFiles,
};

// Debug: Log what files were found
console.log('📁 Markdown files found:', Object.keys(mdFiles));
console.log('📊 Total files:', Object.keys(mdFiles).length);
console.log('🔍 Ethical Hacking files:', Object.keys(ethicalHackingFiles));
console.log('🔍 Binary Exploitation files:', Object.keys(binaryExploitationFiles));
console.log('🔍 Python Hacking files:', Object.keys(pythonHackingFiles));
console.log('🔍 Python Scripts files:', Object.keys(pythonScriptsFiles));
console.log('🔍 Safe Practice files:', Object.keys(safePracticeFiles));

/**
 * Parse a single markdown file
 * @param {string} filePath - The file path
 * @param {string} content - The raw markdown content
 * @returns {Object} Parsed lesson data
 */
function parseMarkdownFile(filePath, content) {
  const { data, content: markdownContent } = matter(content);
  
  // Extract category from file path
  const pathParts = filePath.split('/');
  const categoryFolder = pathParts[pathParts.length - 2];
  
  // Generate slug from filename if not provided in frontmatter
  const fileName = pathParts[pathParts.length - 1].replace('.md', '');
  const slug = data.slug || fileName;
  
  // Determine category name
  let category = data.category || categoryFolder;
  if (categoryFolder === 'intro-to-binary-exploitation') {
    category = 'binary-exploitation';
  } else if (categoryFolder === 'python-for-eth-hacking') {
    category = 'python-for-ethical-hacking';
  } else if (categoryFolder === 'python-scripts') {
    category = 'python-scripts';
  } else if (categoryFolder === 'safe-practice-questions') {
    category = 'safe-practice';
  }
  
  return {
    title: data.title || fileName,
    slug,
    category,
    order: data.order || 999,
    prev: data.prev || null,
    next: data.next || null,
    content: markdownContent,
    filePath,
  };
}

/**
 * Get all lessons from markdown files
 * @returns {Array} Array of lesson objects
 */
export function getAllLessons() {
  const lessons = [];
  
  console.log('🔍 Starting to process lessons...');
  console.log('📁 Total markdown files:', Object.keys(mdFiles).length);

  for (const [filePath, content] of Object.entries(mdFiles)) {
    try {
      const lesson = parseMarkdownFile(filePath, content);
      lessons.push(lesson);
      console.log('✅ Parsed:', filePath, '→ slug:', lesson.slug);
    } catch (error) {
      console.error(`❌ Error parsing ${filePath}:`, error);
    }
  }
  
  // Sort lessons by order
  const sorted = lessons.sort((a, b) => a.order - b.order);
  
  console.log('📚 Total lessons loaded:', sorted.length);
  console.log('📋 Lesson slugs:', sorted.map(l => l.slug));
  
  return sorted;
}

/**
 * Get lessons grouped by category
 * @returns {Object} Lessons grouped by category
 */
export function getLessonsByCategory() {
  const lessons = getAllLessons();
  const grouped = {};
  
  lessons.forEach(lesson => {
    if (!grouped[lesson.category]) {
      grouped[lesson.category] = [];
    }
    grouped[lesson.category].push(lesson);
  });
  
  // Sort lessons within each category by order
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.order - b.order);
  });
  
  console.log('📂 Categories:', Object.keys(grouped));
  Object.entries(grouped).forEach(([cat, lessons]) => {
    console.log(`   ${cat}: ${lessons.length} lessons`);
  });
  
  return grouped;
}

/**
 * Get a single lesson by slug
 * @param {string} slug - The lesson slug
 * @returns {Object|null} Lesson object or null if not found
 */
export function getLessonBySlug(slug) {
  const lessons = getAllLessons();
  const found = lessons.find(lesson => lesson.slug === slug);
  console.log(`🔍 Looking for slug "${slug}":`, found ? '✅ Found' : '❌ Not found');
  return found || null;
}

/**
 * Get category display name
 * @param {string} category - The category key
 * @returns {string} Display name for the category
 */
export function getCategoryDisplayName(category) {
  const displayNames = {
    'ethical-hacking': 'Ethical Hacking',
    'binary-exploitation': 'Binary Exploitation',
    'python-for-ethical-hacking': 'Python for Ethical Hacking',
    'python-scripts': 'Python Scripts',
    'safe-practice': 'Safe Practice Questions',
  };
  
  return displayNames[category] || category;
}
