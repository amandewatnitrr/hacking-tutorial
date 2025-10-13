# HackLearn - Ethical Hacking Tutorial Platform

A modern, dark-themed web platform for learning ethical hacking through interactive tutorials. Built with React, Vite, and dynamic markdown rendering.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 20.19+ or 22.12+ recommended
- **npm**: Version 9.0 or higher
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarzhMehta/hacking-tutorial_fork.git
   cd hacking-tutorial_fork
   ```

2. **Navigate to frontend directory**
   ```bash
   cd UI/frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - The app will run at `http://localhost:5173`
   - Navigate to any lesson using the sidebar

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 📝 Markdown File Format Rules

All tutorial lessons **must** follow this frontmatter format for proper rendering and navigation.

### Required Frontmatter Structure

Every `.md` file in the content folders (`ethical-hacking/`, `python-for-eth-hacking/`, etc.) must include frontmatter at the top:

```markdown
---
title: "Your Lesson Title"
slug: "lesson-slug-name"
order: 1
category: "category-name"
prev: "previous-lesson-slug"
next: "next-lesson-slug"
---

# Your Lesson Content Starts Here

Regular markdown content...
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | ✅ Yes | Display name of the lesson (shown in navigation) |
| `slug` | String | ✅ Yes | URL-friendly identifier (must be unique) |
| `order` | Number | ✅ Yes | Sequential order for sorting (1, 2, 3, ...) |
| `category` | String | ✅ Yes | Group lessons by topic (e.g., "ethical-hacking") |
| `prev` | String | ⚠️ Optional | Slug of the previous lesson (null for first lesson) |
| `next` | String | ⚠️ Optional | Slug of the next lesson (null for last lesson) |

### Example: Complete Lesson File

**File:** `ethical-hacking/lesson-01.md`

```markdown
---
title: "Introduction to Ethical Hacking"
slug: "lesson-01"
order: 1
category: "ethical-hacking"
prev: null
next: "lesson-02"
---

# Introduction to Ethical Hacking

Welcome to the first lesson! In this tutorial, you'll learn:

- What is ethical hacking?
- Legal and ethical considerations
- Essential tools and techniques

## Getting Started

To begin your journey...

### Prerequisites

- Basic understanding of networking
- Linux command line familiarity
- Python programming basics

## Course Structure

This course is divided into multiple modules:

1. **Network Fundamentals**
2. **Reconnaissance Techniques**
3. **Vulnerability Assessment**
4. **Exploitation Methods**

---

**Next Lesson:** [Network Scanning Basics](lesson-02)
```

### Naming Conventions

#### File Names
- Use lowercase with hyphens: `lesson-01.md`, `network-scanning.md`
- Be descriptive: `lesson-password-cracking.md` (not `lesson-7.md`)
- Keep consistent across categories

#### Slugs
- Must match the file name (without `.md`)
- Use lowercase letters, numbers, and hyphens only
- Examples: `lesson-01`, `wifi-hacking`, `python-basics`

#### Categories
Available categories (must match exactly):
- `ethical-hacking` - General cybersecurity topics
- `python-for-ethical-hacking` - Python scripting lessons
- `binary-exploitation` - Low-level exploitation
- `cli-editors` - Command-line tools

### Navigation Chain

Lessons must form a **complete chain** using `prev` and `next` fields:

```
lesson-01 → lesson-02 → lesson-03 → ... → lesson-N
(prev: null)                            (next: null)
```

**Example Navigation Setup:**

```markdown
<!-- lesson-01.md -->
---
prev: null
next: "lesson-02"
---

<!-- lesson-02.md -->
---
prev: "lesson-01"
next: "lesson-03"
---

<!-- lesson-03.md -->
---
prev: "lesson-02"
next: null
---
```

### Supported Markdown Features

The platform supports **GitHub Flavored Markdown** (GFM):

✅ **Supported:**
- Headers (H1-H6)
- Bold, italic, strikethrough
- Code blocks with syntax highlighting
- Inline code
- Lists (ordered and unordered)
- Links and images
- Blockquotes
- Tables
- Task lists
- Raw HTML (limited)

#### Code Blocks with Syntax Highlighting

```python
# Python example
def scan_network(target):
    print(f"Scanning {target}...")
    return results
```

```bash
# Bash example
nmap -sV -O 192.168.1.1
```

#### Tables

```markdown
| Tool | Purpose | Difficulty |
|------|---------|------------|
| Nmap | Port Scanning | Beginner |
| Metasploit | Exploitation | Advanced |
```

#### Images

```markdown
![Network Diagram](../imgs/network-topology.png)
```

---

## 📁 Project Structure

```
hacking-tutorial_fork/
├── UI/
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── LessonTemplate.jsx    # Renders markdown content
│       │   │   ├── LessonTemplate.css    # Lesson styling
│       │   │   └── Navbar.jsx            # Top navigation
│       │   ├── pages/
│       │   │   └── LessonPage.jsx        # Dynamic lesson route
│       │   ├── utils/
│       │   │   └── markdownloader.js     # Loads & parses MD files
│       │   ├── App.jsx                   # Main app & routing
│       │   ├── App.css                   # Global styles
│       │   └── index.css                 # CSS variables
│       ├── package.json
│       └── vite.config.js
├── ethical-hacking/                       # Lesson content
│   ├── lesson-01.md
│   ├── lesson-02.md
│   └── ...
├── python-for-eth-hacking/               # Python tutorials
│   └── ...
└── imgs/                                  # Shared images
```

---

## 🎨 Theme & Styling

The platform uses a **dark hacker theme** with bright green accents:

### CSS Variables

```css
--bg-primary: #0a0e1a        /* Dark navy background */
--bg-secondary: #121829      /* Slightly lighter panels */
--bg-tertiary: #1a1f3a       /* Elevated elements */
--accent-green: #00ff88      /* Bright neon green */
--accent-green-light: #33ffaa /* Lighter green hover */
--text-primary: #e5e7eb      /* Light gray text */
--text-secondary: #9ca3af    /* Muted gray */
```

### Customization

Edit `src/index.css` to change theme colors globally.

---

## 🔧 Adding New Lessons

### Step 1: Create Markdown File

Create a new `.md` file in the appropriate category folder:

```bash
# Example: Adding a new lesson
cd ethical-hacking
touch lesson-network-security.md
```

### Step 2: Add Frontmatter

```markdown
---
title: "Network Security Fundamentals"
slug: "lesson-network-security"
order: 7
category: "ethical-hacking"
prev: "lesson-06"
next: "lesson-08"
---

# Your content here...
```

### Step 3: Update Navigation Chain

Update the `next` field of the previous lesson and `prev` field of the next lesson:

```markdown
<!-- lesson-06.md -->
---
next: "lesson-network-security"  # Changed from "lesson-08"
---

<!-- lesson-08.md -->
---
prev: "lesson-network-security"  # Changed from "lesson-06"
---
```

### Step 4: Test Locally

```bash
npm run dev
# Navigate to http://localhost:5173/lessons/lesson-network-security
```

---

## 🐛 Troubleshooting

### "No lessons found" Error
- **Cause:** Frontmatter parsing failed or missing `query: '?raw'` in Vite config
- **Fix:** Ensure all `.md` files have valid frontmatter and check `vite.config.js`

### Navigation buttons not working
- **Cause:** Incorrect `prev`/`next` slug values
- **Fix:** Verify slugs match exactly (case-sensitive)

### Styles not applying
- **Cause:** CSS variable not defined or typo
- **Fix:** Check `index.css` for all `--variable-name` definitions

### Dev server won't start
- **Cause:** Node.js version incompatibility
- **Fix:** Upgrade to Node.js 20.19+ or 22.12+

---

## 📦 Dependencies

### Core
- **React** (^18.3.1) - UI framework
- **React Router DOM** (^7.1.1) - Client-side routing
- **Vite** (^6.0.5) - Build tool

### Markdown Processing
- **react-markdown** (^9.0.1) - Markdown renderer
- **gray-matter** (^4.0.3) - Frontmatter parser
- **remark-gfm** (^4.0.0) - GitHub Flavored Markdown
- **rehype-raw** (^7.0.0) - Raw HTML support

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/new-lesson`)
3. **Follow the markdown format rules** (see above)
4. **Test locally** with `npm run dev`
5. **Commit changes** (`git commit -m 'Add new lesson on XYZ'`)
6. **Push to branch** (`git push origin feature/new-lesson`)
7. **Open a Pull Request**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Features

✅ Dynamic markdown rendering  
✅ Automatic lesson navigation (prev/next)  
✅ Dark hacker-themed UI with neon green accents  
✅ Syntax highlighting for code blocks  
✅ Responsive design (mobile-optimized)  
✅ Sidebar lesson browser with categories  
✅ Full-width content area  
✅ GitHub Flavored Markdown support  

---

## 🔗 Links

- **GitHub Repository:** [HarzhMehta/hacking-tutorial_fork](https://github.com/HarzhMehta/hacking-tutorial_fork)
- **Live Demo:** (Add deployment URL here)
- **Report Issues:** [GitHub Issues](https://github.com/HarzhMehta/hacking-tutorial_fork/issues)

---

**Happy Hacking! 🔐**
