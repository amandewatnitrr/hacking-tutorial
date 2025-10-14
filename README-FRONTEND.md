# HackLearn - Ethical Hacking Tutorial Platform

A dark-themed web platform for learning ethical hacking. Built with React, Vite, and dynamic markdown rendering.

## Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm 9.0+

### Installation

```bash
git clone https://github.com/HarzhMehta/hacking-tutorial_fork.git
cd hacking-tutorial_fork/UI/frontend
npm install
npm run dev
```

Open browser at `http://localhost:5173`

### Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
hacking-tutorial_fork/
├── ethical-hacking/              # Lesson content
├── python-for-eth-hacking/       # Python tutorials
├── intro-to-binary-exploitation/ # Binary exploitation lessons
├── imgs/                         # All images
└── UI/frontend/
    ├── src/
    │   ├── utils/markdownloader.js  # Loads markdown files
    │   └── components/LessonTemplate.jsx
    └── vite.config.js
```

---

## Markdown File Rules

### Required Frontmatter

Every `.md` file must include:

```markdown
---
title: "Lesson Title"
slug: "lesson-slug"
order: 1
category: "category-name"
prev: "previous-slug"
next: "next-slug"
---

# Lesson Content
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Display name |
| slug | String | Yes | URL identifier (unique) |
| order | Number | Yes | Sort order |
| category | String | Yes | Lesson group |
| prev | String | No | Previous lesson slug or null |
| next | String | No | Next lesson slug or null |

### Naming Conventions

**Files:**
- Lowercase with hyphens: `lesson-01.md`
- Extension: `.md`

**Slugs:**
- Match filename without extension
- Lowercase, numbers, hyphens only
- Must be unique across all categories

**Categories:**
- `ethical-hacking`
- `python-for-ethical-hacking`
- `binary-exploitation`
- `cli-editors`

---

## Images

### Storage

All images go in `/imgs/` at project root.

### Reference in Markdown

```markdown
![Description](../imgs/image-name.png)
```

Supported paths:
- `../imgs/image.png`
- `./imgs/image.png`
- `./../imgs/image.png`

---

## Adding New Lessons

### Step 1: Create File

```bash
cd ethical-hacking
touch lesson-new.md
```

### Step 2: Add Frontmatter

```markdown
---
title: "New Lesson"
slug: "lesson-new"
order: 7
category: "ethical-hacking"
prev: "lesson-06"
next: "lesson-08"
---

# Content here
```

### Step 3: Update Navigation

Update `next` in previous lesson and `prev` in next lesson.

### Step 4: Test

```bash
npm run dev
```

---

## Adding New Category

### Step 1: Create Folder

```bash
mkdir web-security
```

### Step 2: Update markdownloader.js

Edit `UI/frontend/src/utils/markdownloader.js`:

```javascript
const webSecurityFiles = import.meta.glob('../../../../web-security/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

const mdFiles = {
  ...ethicalHackingFiles,
  ...binaryExploitationFiles,
  ...pythonHackingFiles,
  ...webSecurityFiles,
};
```

### Step 3: Test

```bash
npm run dev
```

---

## Troubleshooting

**No lessons found:**
- Check frontmatter syntax
- Verify file paths in `markdownloader.js`

**Navigation broken:**
- Verify `prev`/`next` slugs match exactly

**Images not loading:**
- Verify files are in `/imgs/`
- Check path syntax: `../imgs/`

**Server won't start:**
- Upgrade Node.js to 20.19+

---

## Dependencies

**Core:**
- React 18.3.1
- React Router DOM 7.1.1
- Vite 6.0.5

**Markdown:**
- react-markdown 9.0.1
- gray-matter 4.0.3
- remark-gfm 4.0.0
- rehype-raw 7.0.0

---

## Contributing

1. Fork repository
2. Create feature branch
3. Follow markdown format rules
4. Test locally
5. Submit pull request

---

## License

MIT License - see LICENSE file

---

## Links

- Repository: [HarzhMehta/hacking-tutorial_fork](https://github.com/HarzhMehta/hacking-tutorial_fork)
- Issues: [GitHub Issues](https://github.com/HarzhMehta/hacking-tutorial_fork/issues)
