# 🚀 Quick Start Guide

Get the Hacking Tutorial platform up and running in minutes!

## Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- ✅ **npm** (comes with Node.js) or **yarn**
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ A modern web browser (Chrome, Firefox, Edge, Safari)
- ✅ A code editor (VS Code recommended)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/amandewatnitrr/hacking-tutorial.git
cd hacktober
```

### 2. Navigate to Frontend

```bash
cd hacking-tutorial/UI/frontend
```

### 3. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React
- React Router
- Vite
- Markdown processors
- And more...

### 4. Start Development Server

```bash
npm run dev
```

### 5. Open in Browser

The terminal will show you the local URL (usually `http://localhost:5173`)

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open this URL in your browser!

## 🎉 You're Done!

You should now see the home page with all available courses.

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure Quick Reference

```
hacktober/
├── index.html                    # Landing page
├── README.md                     # Main documentation
├── QUICK_START.md               # This file
└── hacking-tutorial/
    ├── ethical-hacking/         # Course content
    └── UI/frontend/             # React app
        ├── src/
        │   ├── pages/
        │   │   ├── HomePage.jsx     # 🏠 Main home page
        │   │   └── LessonPage.jsx   # 📖 Lesson viewer
        │   ├── config/
        │   │   └── courses.js       # ⚙️ Course config
        │   └── components/
        └── package.json
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
# Kill the process using the port (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Module Not Found Errors

Make sure you're in the correct directory:

```bash
cd hacking-tutorial/UI/frontend
npm install
```

### Page Not Loading

1. Check if the dev server is running
2. Verify the URL in your browser
3. Check browser console for errors
4. Try clearing browser cache

## Next Steps

### For Learners

1. 📚 Browse available courses on the home page
2. 🎯 Click "Start Learning" on a course
3. 📖 Follow lessons step by step
4. 💻 Practice with provided examples
5. 🔄 Navigate between lessons using the sidebar

### For Contributors

1. 📖 Read [CONTRIBUTING.md](hacking-tutorial/CONTRIBUTING.md)
2. 🔍 Check [COURSE_STRUCTURE.md](COURSE_STRUCTURE.md)
3. 💡 Pick an issue or suggest a feature
4. 🔧 Make your changes
5. 🚀 Submit a pull request

### For Course Creators

1. 📁 Create a new course folder
2. ✍️ Write lessons in Markdown
3. ⚙️ Add course to `courses.js`
4. 🎨 Choose icon and color
5. 📋 List topics covered
6. ✅ Test and submit

## Development Workflow

```bash
# 1. Create a new branch
git checkout -b feature/your-feature

# 2. Make your changes
# Edit files in src/

# 3. Test your changes
npm run dev

# 4. Build to check for errors
npm run build

# 5. Commit your changes
git add .
git commit -m "Add: your feature description"

# 6. Push to your fork
git push origin feature/your-feature

# 7. Create a Pull Request on GitHub
```

## File Editing Quick Tips

### Adding a New Course

Edit `src/config/courses.js`:

```javascript
{
  id: 'my-new-course',
  title: 'My New Course',
  description: 'Course description',
  icon: '🎓',
  color: '#your-color',
  topics: ['Topic 1', 'Topic 2'],
  folder: 'my-course-folder',
  status: 'active',
  resources: []
}
```

### Creating a Lesson

Create `lesson-name.md` with frontmatter:

```markdown
---
title: "Lesson Title"
slug: "lesson-slug"
order: 1
category: "Category"
---

# Lesson Content

Your content here...
```

### Styling Changes

- Global styles: `src/index.css`
- Home page: `src/pages/HomePage.css`
- Lesson page: `src/pages/LessonPage.css`
- Components: `src/components/*.css`

## Keyboard Shortcuts (in Dev Mode)

- `Ctrl + C` - Stop dev server
- `Ctrl + R` - Reload browser
- `F12` - Open browser DevTools
- `Ctrl + Shift + I` - Open DevTools (alternative)

## Useful Resources

### Documentation
- [Main README](README.md)
- [Home Page Guide](hacking-tutorial/UI/frontend/HOME_PAGE_GUIDE.md)
- [Course Structure](COURSE_STRUCTURE.md)
- [Contributing Guide](hacking-tutorial/CONTRIBUTING.md)

### External Links
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Markdown Guide](https://www.markdownguide.org/)

## Getting Help

### Issues?

1. Check the [Troubleshooting](#troubleshooting) section
2. Search [existing issues](https://github.com/amandewatnitrr/hacking-tutorial/issues)
3. Ask in discussions
4. Create a new issue with details

### Questions?

- 💬 GitHub Discussions
- 📧 Open an issue
- 📖 Check documentation
- 🔍 Search the codebase

## Tips for Success

### For Learning
- ✅ Start with basics
- ✅ Practice regularly
- ✅ Take notes
- ✅ Try examples yourself
- ✅ Join the community

### For Contributing
- ✅ Read guidelines first
- ✅ Start with small changes
- ✅ Test thoroughly
- ✅ Write clear commit messages
- ✅ Be patient and respectful

### For Development
- ✅ Use meaningful variable names
- ✅ Comment complex code
- ✅ Follow existing patterns
- ✅ Keep components small
- ✅ Test on multiple devices

## Performance Tips

### Development
- Use React DevTools for debugging
- Check console for warnings
- Monitor network requests
- Profile component renders

### Production
- Run `npm run build` to check bundle size
- Optimize images before adding
- Lazy load heavy components
- Use code splitting when needed

## Security Reminders

⚠️ **Important**: This is an educational platform

- Only practice in legal environments
- Get proper authorization
- Respect privacy laws
- Use knowledge ethically
- Report vulnerabilities responsibly

## What's Next?

After getting started:

1. **Explore the Platform**
   - Browse all courses
   - Try different lessons
   - Check out the features

2. **Learn Something New**
   - Pick a course that interests you
   - Follow along with examples
   - Practice the techniques

3. **Contribute Back**
   - Fix typos or bugs
   - Add new content
   - Improve documentation
   - Share feedback

4. **Join the Community**
   - Star the repository
   - Share with others
   - Participate in discussions
   - Help other learners

## Support the Project

- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests
- 📢 Share with others

---

## Quick Command Reference

```bash
# Setup
git clone <repo-url>
cd hacktober/hacking-tutorial/UI/frontend
npm install

# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter

# Git
git status           # Check status
git add .            # Stage changes
git commit -m "msg"  # Commit changes
git push             # Push to remote

# Troubleshooting
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

**Happy Learning! 🎓**

Remember: The best way to learn is by doing. Start with a course, practice the examples, and don't be afraid to experiment!

*Questions? Check the [README](README.md) or open an issue!*
