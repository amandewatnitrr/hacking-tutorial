# 🔒 Hacking Tutorial - Multi-Course Learning Platform

A comprehensive, interactive learning platform for ethical hacking, penetration testing, and development tools. This platform hosts multiple courses in a centralized, easy-to-navigate interface.

## 🌟 Features

- **Multi-Course Platform**: Browse and learn from multiple courses on a single platform
- **Interactive Home Page**: Beautiful, responsive home page showcasing all available courses
- **Organized Content**: Each course has its own dedicated folder with structured lessons
- **Modern UI**: Built with React and Vite for a fast, smooth learning experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Easy Navigation**: Intuitive navigation between courses and lessons
- **Expandable**: Easy to add new courses and content

## 📚 Available Courses

### Active Courses

#### 1. Ethical Hacking & Penetration Testing 🔒
- Network Scanning & Information Gathering
- Pre-connection & Post-connection Attacks
- Man-in-the-Middle (MITM) Attacks
- Device Discovery & ARP Spoofing
- Python Scripting for Security Automation
- Binary Exploitation & Reverse Engineering
- Password Attacks & Hash Cracking

**Location**: `hacking-tutorial/ethical-hacking/`

### Coming Soon

#### 2. CLI Editors Tutorial ⌨️
- Emacs, Vim, and Nano fundamentals
- Editor configuration and customization
- Productivity tips and shortcuts

**Location**: `hacking-tutorial/cli-editors-tutorials/`

#### 3. Web Application Security 🌐
- SQL Injection & Prevention
- Cross-Site Scripting (XSS)
- OWASP Top 10
- API Security Testing

#### 4. Network Security & Defense 🛡️
- Network Protocol Analysis
- Firewall Configuration
- Intrusion Detection Systems
- VPN & Secure Tunneling

#### 5. Cryptography & Encryption 🔐
- Symmetric & Asymmetric Encryption
- Hash Functions & Digital Signatures
- SSL/TLS Protocols
- Blockchain Basics

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amandewatnitrr/hacking-tutorial.git
   cd hacktober
   ```

2. **Navigate to the frontend directory**
   ```bash
   cd hacking-tutorial/UI/frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - The app will typically run on `http://localhost:5173`
   - The URL will be displayed in your terminal

### Alternative: Static Version

You can also open `index.html` in the root directory for a static landing page with instructions.

## 📁 Project Structure

```
hacktober/
├── index.html                          # Landing page
├── README.md                           # This file
└── hacking-tutorial/
    ├── ethical-hacking/                # Ethical hacking course content
    │   ├── lesson-01.md
    │   ├── lesson-02.md
    │   └── ...
    ├── cli-editors-tutorials/          # CLI editors course
    │   ├── emacs/
    │   └── README.md
    ├── docs/                           # Documentation
    └── UI/
        └── frontend/                   # React application
            ├── src/
            │   ├── components/         # Reusable components
            │   ├── pages/              # Page components
            │   │   ├── HomePage.jsx    # Main home page
            │   │   ├── HomePage.css
            │   │   ├── LessonPage.jsx
            │   │   └── LessonPage.css
            │   ├── config/
            │   │   └── courses.js      # Course configuration
            │   ├── content/            # Markdown content
            │   ├── utils/              # Utility functions
            │   └── App.jsx             # Main app component
            ├── package.json
            └── vite.config.js
```

## 🎯 Adding New Courses

### Step 1: Create Course Folder

Create a new folder in `hacking-tutorial/` for your course:

```bash
mkdir hacking-tutorial/your-course-name
```

### Step 2: Add Course Content

Add markdown files for your lessons with proper frontmatter:

```markdown
---
title: "Lesson Title"
slug: "lesson-slug"
order: 1
category: "Category Name"
---

# Lesson Content
Your lesson content here...
```

### Step 3: Update Course Configuration

Edit `hacking-tutorial/UI/frontend/src/config/courses.js`:

```javascript
{
  id: 'your-course-id',
  title: 'Your Course Title',
  description: 'Course description',
  icon: '🎓',
  color: '#your-color',
  topics: [
    'Topic 1',
    'Topic 2',
    // ...
  ],
  folder: 'your-course-name',
  status: 'active', // or 'coming-soon'
  resources: []
}
```

### Step 4: Update Markdown Loader (if needed)

If your course uses a different structure, update `src/utils/markdownloader.js` to include your course's markdown files.

For detailed instructions, see [HOME_PAGE_GUIDE.md](hacking-tutorial/UI/frontend/HOME_PAGE_GUIDE.md)

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **React Markdown** - Markdown rendering
- **Gray Matter** - Frontmatter parsing
- **Prism.js** - Syntax highlighting

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Add New Courses**: Create new course content
2. **Improve Existing Content**: Fix typos, add examples, clarify explanations
3. **Enhance UI**: Improve design and user experience
4. **Report Bugs**: Open issues for any bugs you find
5. **Suggest Features**: Share ideas for new features

### Contribution Guidelines

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a Pull Request

See [CONTRIBUTING.md](hacking-tutorial/CONTRIBUTING.md) for detailed guidelines.

## 📖 Documentation

- [Home Page Guide](hacking-tutorial/UI/frontend/HOME_PAGE_GUIDE.md) - Detailed guide for the home page
- [Frontend README](hacking-tutorial/README-FRONTEND.md) - Frontend-specific documentation
- [Setup Complete](hacking-tutorial/UI/frontend/SETUP_COMPLETE.md) - Setup documentation

## ⚠️ Disclaimer

**Educational Purpose Only**: This platform is designed for educational purposes only. All activities described should be performed in controlled, legal environments. The authors and contributors are not responsible for any misuse of the information provided.

### Ethical Guidelines

- Always obtain proper authorization before testing
- Never use these techniques on systems you don't own or have permission to test
- Respect privacy and data protection laws
- Use knowledge responsibly and ethically
- Report vulnerabilities through proper channels

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](hacking-tutorial/LICENSE) file for details.

## 🔗 Resources

- [Kali Linux VM](https://zsecurity.org/download-custom-kali/)
- [VMware Workstation](https://ln5.sync.com/dl/a524d0280/view/default/23995984090004?sync_id=0#fgbzw355-bzuq9n6t-yypf24kv-7rfsi8xu)
- [Cybersecurity Resources](https://github.com/DhanushNehru/Ultimate-Cybersecurity-Resources)

## 👥 Community

- [Code of Conduct](hacking-tutorial/CODE_OF_CONDUCT.md)
- [Security Policy](hacking-tutorial/SECURITY.md)
- [GitHub Repository](https://github.com/amandewatnitrr/hacking-tutorial)

## 📧 Support

If you have questions or need help:

1. Check the documentation
2. Search existing issues
3. Open a new issue with details
4. Join community discussions

## 🎓 Learning Path

### Beginner
1. Start with Ethical Hacking basics
2. Learn about network fundamentals
3. Practice with provided scripts

### Intermediate
1. Explore advanced attack techniques
2. Study Python scripting for automation
3. Learn about web application security

### Advanced
1. Master binary exploitation
2. Dive into cryptography
3. Contribute to the platform

## 🌟 Acknowledgments

- All contributors who have helped build this platform
- The open-source community for tools and resources
- Educational institutions promoting ethical hacking

---

**Made with ❤️ for the cybersecurity community**

*Remember: With great power comes great responsibility. Use your knowledge ethically and legally.*
