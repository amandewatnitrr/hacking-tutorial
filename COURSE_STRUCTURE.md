# Course Structure & Organization

## Platform Overview

This document explains how the multi-course platform is organized and how courses are displayed on the home page.

## Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      HOME PAGE (/)                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Hero Section                             │  │
│  │  • Platform Title                                     │  │
│  │  • Description                                        │  │
│  │  • Statistics (Courses, Lessons, Categories)         │  │
│  └──────���────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Available Courses Section                   │  │
│  │                                                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │  Course 1    │  │  Course 2    │  │  Course 3  │  │  │
│  │  │  🔒 Ethical  │  │  ⌨️ CLI      │  │  🌐 Web    │  │  │
│  │  │  Hacking     │  │  Editors     │  │  Security  │  │  │
│  │  │              │  │              │  │            │  │  │
│  │  │  [Active]    │  │  [Coming]    │  │  [Coming]  │  │  │
│  │  └──────────────┘  └──────────────��  └────────────┘  │  │
│  │                                                       │  │
│  │  ┌──────────────┐  ┌──────────────┐                  │  │
│  │  │  Course 4    │  │  Course 5    │                  │  │
│  │  │  🛡️ Network  │  │  🔐 Crypto   │                  │  │
│  │  │  Security    │  │  graphy      │                  │  │
│  │  │              │  │              │                  │  │
│  │  │  [Coming]    │  │  [Coming]    │                  │  │
│  │  └──────────────┘  └──────────────┘                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Features Section                         │  │
│  │  • Practical & Hands-On                              │  │
│  │  • Comprehensive Content                             │  │
│  │  • Regularly Updated                                 │  │
│  │  • Open Source                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Call-to-Action Section                      │  │
│  │  [Start First Lesson]  [View on GitHub]              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Course Card Structure

Each course card displays:

```
┌─────────────────────────────────────┐
│  🔒  Ethical Hacking & Pen Testing  │  ← Icon & Title
├─────────────────���───────────────────┤
│  Comprehensive tutorial series...   │  ← Description
│                                     │
│  What You'll Learn:                 │
│  ✓ Network Scanning                 │  ← Topics List
│  ✓ MITM Attacks                     │
│  ✓ Python Scripting                 │
│  ✓ ...                              │
│                                     │
│  📚 15 Lessons  🏷️ 5 Categories    │  ← Metadata
│                                     │
│  ┌─────────────────────────────┐   │
│  │    Start Learning    →      │   │  ← Action Button
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## File Organization

### Course Configuration
```
src/config/courses.js
├── coursesConfig[]
│   ├── id: 'ethical-hacking'
│   ├── title: 'Ethical Hacking & Penetration Testing'
│   ├── description: '...'
│   ├── icon: '🔒'
���   ├── color: '#667eea'
│   ├── topics: [...]
│   ├── folder: 'ethical-hacking'
│   ├── status: 'active'
│   └── resources: [...]
```

### Course Content Structure
```
hacking-tutorial/
├── ethical-hacking/              ← Course 1 Folder
│   ├── lesson-01.md
│   ├── lesson-02.md
│   ├── lesson-03.md
│   └── ...
│
├── cli-editors-tutorials/        ← Course 2 Folder
│   ├── emacs/
│   │   └── NOVICE.md
│   └── README.md
│
├── web-security/                 ← Course 3 Folder (Future)
│   └── ...
│
└── UI/frontend/                  ← React Application
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.jsx      ← Main home page
    │   │   └── LessonPage.jsx    ← Individual lessons
    │   ├── config/
    │   │   └── courses.js        ← Course definitions
    │   └── content/
    │       └── MD_Content_ethical-hacking/  ← Lesson content
    └── ...
```

## Data Flow

```
┌──────────────────┐
│  courses.js      │  ← Course definitions
│  (Configuration) │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  HomePage.jsx    │  ← Reads course config
│                  │  ← Gets lesson data
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Course Cards    │  ← Displays each course
│  (UI Components) │
└────────┬─────────┘
         │
         ↓ (User clicks "Start Learning")
         │
┌──────────────────┐
│  LessonPage.jsx  │  ← Shows individual lessons
└──────────────────┘
```

## Course Status Flow

```
┌─────────────────┐
│  New Course     │
│  Idea           │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Add to         │
│  courses.js     │
│  status:        │
│  'coming-soon'  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Create Content │
│  Folder         │
│  Add Lessons    │
└────────┬────────┘
         │
         ↓
┌────────────────��┐
│  Update Status  │
│  to 'active'    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Course Live!   │
│  Users can      │
│  access lessons │
└─────────────────┘
```

## Navigation Flow

```
User Journey:

1. Landing Page (index.html)
   ↓
2. Home Page (/)
   ↓
3. Browse Courses
   ↓
4. Click "Start Learning"
   ↓
5. Lesson Page (/lessons/:slug)
   ↓
6. Navigate between lessons
   ↓
7. Return to Home (via navbar)
```

## Adding a New Course - Checklist

- [ ] Create course folder in `hacking-tutorial/`
- [ ] Add lesson markdown files with frontmatter
- [ ] Add course to `src/config/courses.js`
- [ ] Choose appropriate icon and color
- [ ] List all topics covered
- [ ] Set status ('coming-soon' or 'active')
- [ ] Add resources if available
- [ ] Update `markdownloader.js` if needed
- [ ] Test course card display
- [ ] Test lesson navigation
- [ ] Update documentation

## Course Categories

Courses are organized into these main categories:

1. **Security & Hacking**
   - Ethical Hacking
   - Web Security
   - Network Security
   - Cryptography

2. **Development Tools**
   - CLI Editors
   - Version Control
   - Build Tools

3. **Programming**
   - Python for Security
   - JavaScript Security
   - Secure Coding

4. **Infrastructure**
   - Cloud Security
   - Container Security
   - DevSecOps

## Responsive Behavior

### Desktop (> 768px)
- Courses displayed in grid (2-3 columns)
- Full navigation visible
- All features expanded

### Tablet (768px - 480px)
- Courses in 2 columns
- Condensed navigation
- Optimized spacing

### Mobile (< 480px)
- Single column layout
- Stacked navigation
- Touch-optimized buttons

## Color Scheme

Each course has a unique color for visual distinction:

- **Ethical Hacking**: `#667eea` (Purple-Blue)
- **CLI Editors**: `#48bb78` (Green)
- **Web Security**: `#ed8936` (Orange)
- **Network Security**: `#9f7aea` (Purple)
- **Cryptography**: `#38b2ac` (Teal)

## Future Enhancements

### Planned Features
1. Search functionality across all courses
2. Filter courses by category/difficulty
3. User progress tracking
4. Course completion certificates
5. Interactive code playgrounds
6. Video tutorials integration
7. Community discussion forums
8. Course ratings and reviews

### Technical Improvements
1. Server-side rendering (SSR)
2. Progressive Web App (PWA)
3. Offline support
4. Multi-language support
5. Dark mode
6. Accessibility improvements
7. Performance optimization
8. Analytics integration

## Maintenance

### Regular Tasks
- Update course content
- Add new lessons
- Fix broken links
- Update dependencies
- Review user feedback
- Add new courses
- Improve documentation

### Quality Checks
- Test all navigation links
- Verify markdown rendering
- Check responsive design
- Validate accessibility
- Review code quality
- Update screenshots
- Test on multiple browsers

---

**Last Updated**: 2025
**Version**: 1.0.0
**Maintainers**: Community Contributors
