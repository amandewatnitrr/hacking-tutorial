import matter from 'gray-matter';

// Domain acronyms that should stay fully uppercase instead of Title Case
// when a filename is humanized into a display title (e.g. "arp" -> "ARP",
// not "Arp").
const ACRONYMS = new Set([
  'ids', 'ssh', 'arp', 'mitm', 'wep', 'wpa', 'wpa2', 'wps', 'mac', 'dns', 'sni',
  'tcp', 'udp', 'ip', 'http', 'https', 'ctf', 'fmea', 'cli', 'ssl', 'tls', 'sql',
  'cve', 'os', 'pc',
]);

/**
 * Turns a raw filename slug ("mitm_attack_automator") into a readable
 * fallback title ("MITM Attack Automator") for lessons with no frontmatter
 * title. Preserves any word that already has non-lowercase letters
 * (e.g. "NOVICE", "CrashCourse") instead of reflowing its casing.
 */
function humanizeTitle(fileName) {
  return fileName
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (ACRONYMS.has(lower)) return lower.toUpperCase();
      if (word === lower) return word.charAt(0).toUpperCase() + word.slice(1);
      return word;
    })
    .join(' ');
}

// Import all markdown files directly from the repo-root topic folders.
// Paths are relative to this file (src/utils/); `../../../../` lands on the
// repo root (UI/frontend/src/utils -> src -> frontend -> UI -> repo root).
// NOTE: import.meta.glob is statically analyzed at build time — both the
// pattern and the options object must be literal, not a shared constant.
const ethicalHackingFiles = import.meta.glob('../../../../ethical-hacking/*.{md,MD}', { query: '?raw', import: 'default', eager: true });
const binaryExploitationFiles = import.meta.glob('../../../../intro-to-binary-exploitation/*.{md,MD}', { query: '?raw', import: 'default', eager: true });
const pythonHackingFiles = import.meta.glob('../../../../python-for-eth-hacking/*.{md,MD}', { query: '?raw', import: 'default', eager: true });
const pythonScriptsFiles = import.meta.glob('../../../../python-scripts/*.{md,MD}', { query: '?raw', import: 'default', eager: true });
const safePracticeFiles = import.meta.glob('../../../../safe-practice-questions/*.{md,MD}', { query: '?raw', import: 'default', eager: true });
const cybersecurityArchitectureFiles = import.meta.glob('../../../../cybersecurity-architecture/*.{md,MD}', { query: '?raw', import: 'default', eager: true });
const fmeaFiles = import.meta.glob('../../../../FMEA Fundamentals/*.{md,MD}', { query: '?raw', import: 'default', eager: true });
const cliEditorsFiles = import.meta.glob('../../../../cli-editors-tutorials/emacs/*.{md,MD}', { query: '?raw', import: 'default', eager: true });

const CATEGORY_FILE_GROUPS = {
  'ethical-hacking': ethicalHackingFiles,
  'intro-to-binary-exploitation': binaryExploitationFiles,
  'python-for-eth-hacking': pythonHackingFiles,
  'python-scripts': pythonScriptsFiles,
  'safe-practice-questions': safePracticeFiles,
  'cybersecurity-architecture': cybersecurityArchitectureFiles,
  'FMEA Fundamentals': fmeaFiles,
  'cli-editors-tutorials': cliEditorsFiles,
};

// Warn (don't crash) if an allowlisted category folder produced zero files —
// a reorganized folder shouldn't take down the whole app.
for (const [category, files] of Object.entries(CATEGORY_FILE_GROUPS)) {
  if (Object.keys(files).length === 0) {
    console.warn(`⚠️ No markdown files found for category "${category}" — check the folder still exists.`);
  }
}

// Combine all markdown files
const mdFiles = Object.assign({}, ...Object.values(CATEGORY_FILE_GROUPS));

// Image globs, one per category, so images resolve against their own
// lesson's folder instead of a single shared/flat directory.
const categoryImageGlobs = {
  'ethical-hacking': import.meta.glob('../../../../ethical-hacking/**/*.{png,jpg,jpeg,gif,webp}', { query: '?url', import: 'default', eager: true }),
  'intro-to-binary-exploitation': import.meta.glob('../../../../intro-to-binary-exploitation/**/*.{png,jpg,jpeg,gif,webp}', { query: '?url', import: 'default', eager: true }),
  'python-for-eth-hacking': import.meta.glob('../../../../python-for-eth-hacking/**/*.{png,jpg,jpeg,gif,webp}', { query: '?url', import: 'default', eager: true }),
  'python-scripts': import.meta.glob('../../../../python-scripts/**/*.{png,jpg,jpeg,gif,webp}', { query: '?url', import: 'default', eager: true }),
  'safe-practice-questions': import.meta.glob('../../../../safe-practice-questions/**/*.{png,jpg,jpeg,gif,webp}', { query: '?url', import: 'default', eager: true }),
  'cybersecurity-architecture': import.meta.glob('../../../../cybersecurity-architecture/**/*.{png,jpg,jpeg,gif,webp}', { query: '?url', import: 'default', eager: true }),
  'FMEA Fundamentals': import.meta.glob('../../../../FMEA Fundamentals/**/*.{png,jpg,jpeg,gif,webp}', { query: '?url', import: 'default', eager: true }),
  'cli-editors-tutorials': import.meta.glob('../../../../cli-editors-tutorials/**/*.{png,jpg,jpeg,gif,webp}', { query: '?url', import: 'default', eager: true }),
};

/**
 * Build index[categoryFolderName][relativePathWithinCategory] = assetUrl
 * Keyed per category so two lessons in different categories can share an
 * image filename (e.g. "image.png") without colliding.
 */
function buildImageIndex(globsByCategory) {
  const index = {};
  for (const [category, files] of Object.entries(globsByCategory)) {
    const categoryIndex = {};
    const prefix = `../../../../${category}/`;
    for (const [filePath, url] of Object.entries(files)) {
      const relativePath = filePath.startsWith(prefix) ? filePath.slice(prefix.length) : filePath;
      categoryIndex[relativePath] = url;
    }
    index[category] = categoryIndex;
  }
  return index;
}

const imageIndex = buildImageIndex(categoryImageGlobs);

// Many lessons reference `../imgs/<file>` — a shared, root-level image pool
// (not inside any one category's own folder). Index it separately, keyed
// by filename under an `imgs/` prefix so it merges into getLessonImages
// without colliding with a category's own local images.
const rootImageFiles = import.meta.glob('../../../../imgs/*.{png,jpg,jpeg,gif,webp}', { query: '?url', import: 'default', eager: true });
const rootImageIndex = {};
for (const [filePath, url] of Object.entries(rootImageFiles)) {
  rootImageIndex[`imgs/${filePath.split('/').pop()}`] = url;
}

// Maps a file's glob path to the category folder it came from, so
// getLessonImages can find the right image index for a lesson.
const CATEGORY_FOLDER_BY_PATH_SEGMENT = Object.keys(CATEGORY_FILE_GROUPS);

function categoryFolderFromFilePath(filePath) {
  return CATEGORY_FOLDER_BY_PATH_SEGMENT.find((folder) => filePath.includes(`/${folder}/`));
}

/**
 * Get the image map for a single lesson: { relativePath: assetUrl }
 * @param {Object} lesson - A lesson object (from getAllLessons/getLessonBySlug)
 * @returns {Object} Map of image relative paths (as written in markdown) to asset URLs
 */
export function getLessonImages(lesson) {
  if (!lesson?.filePath) return rootImageIndex;
  const folder = categoryFolderFromFilePath(lesson.filePath);
  const categoryMap = folder ? imageIndex[folder] || {} : {};
  return { ...rootImageIndex, ...categoryMap };
}

// Debug: Log what files were found
console.log('📁 Markdown files found:', Object.keys(mdFiles));
console.log('📊 Total files:', Object.keys(mdFiles).length);
console.log('📂 Categories:', Object.keys(CATEGORY_FILE_GROUPS));

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
  const fileName = pathParts[pathParts.length - 1].replace(/\.md$/i, '');
  const immediateParent = pathParts[pathParts.length - 2];

  // cli-editors-tutorials' lesson lives one level down (emacs/NOVICE.md), so
  // its category comes from the known glob path, not the immediate parent.
  const categoryFolder = filePath.includes('/cli-editors-tutorials/')
    ? 'cli-editors-tutorials'
    : immediateParent;

  // Generate slug from filename if not provided in frontmatter. The 3 newly
  // wired categories reuse generic filenames ("lesson-01", "chapter-01")
  // that collide with existing ethical-hacking slugs, so they're namespaced
  // by category; existing categories keep their original (bare) slugs so
  // current /lessons/<slug> links don't break.
  const NEW_CATEGORIES_NEED_NAMESPACED_SLUG = new Set([
    'cybersecurity-architecture', 'FMEA Fundamentals', 'cli-editors-tutorials',
  ]);
  const slug = data.slug || (
    NEW_CATEGORIES_NEED_NAMESPACED_SLUG.has(categoryFolder)
      ? `${categoryFolder.toLowerCase().replace(/\s+/g, '-')}-${fileName}`
      : fileName
  );

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
  } else if (categoryFolder === 'FMEA Fundamentals') {
    category = 'fmea-fundamentals';
  } else if (categoryFolder === 'cli-editors-tutorials') {
    category = 'cli-editors-tutorials';
  }
  // 'ethical-hacking' and 'cybersecurity-architecture' pass through as-is.

  return {
    title: data.title || humanizeTitle(fileName),
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

  for (const [filePath, content] of Object.entries(mdFiles)) {
    try {
      const lesson = parseMarkdownFile(filePath, content);
      lessons.push(lesson);
    } catch (error) {
      console.error(`❌ Error parsing ${filePath}:`, error);
    }
  }

  // Sort lessons by order
  const sorted = lessons.sort((a, b) => a.order - b.order);

  // Fill in prev/next within each category for lessons that don't set them
  // explicitly in frontmatter — without this, every lesson shows "No
  // previous/next lesson" since none of the markdown files set prev/next.
  const byCategory = {};
  sorted.forEach((lesson) => {
    (byCategory[lesson.category] ||= []).push(lesson);
  });
  Object.values(byCategory).forEach((group) => {
    group.forEach((lesson, i) => {
      if (!lesson.prev && i > 0) lesson.prev = group[i - 1].slug;
      if (!lesson.next && i < group.length - 1) lesson.next = group[i + 1].slug;
    });
  });

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

  return grouped;
}

/**
 * Get a single lesson by slug
 * @param {string} slug - The lesson slug
 * @returns {Object|null} Lesson object or null if not found
 */
export function getLessonBySlug(slug) {
  const lessons = getAllLessons();
  return lessons.find(lesson => lesson.slug === slug) || null;
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
    'cybersecurity-architecture': 'Cybersecurity Architecture',
    'fmea-fundamentals': 'FMEA Fundamentals',
    'cli-editors-tutorials': 'CLI Editors Tutorials',
  };

  return displayNames[category] || category;
}
