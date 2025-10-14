# Content Migration Summary

## Changes Made

### 1. Updated `markdownloader.js`
- **Location**: `UI/frontend/src/utils/markdownloader.js`
- **Changes**: Modified to load markdown files from folders outside the UI directory
- **New paths**:
  - `../../../../ethical-hacking/*.md`
  - `../../../../intro-to-binary-exploitation/*.md`
  - `../../../../python-for-eth-hacking/*.md`

### 2. Updated `vite.config.js`
- **Location**: `UI/frontend/vite.config.js`
- **Changes**: Added server configuration to allow file system access to parent directories
- **Added**:
  ```javascript
  server: {
    fs: {
      allow: ['..', '../..'],
    },
  }
  ```

### 3. Added Frontmatter to All Markdown Files

All markdown files in the following directories now have frontmatter with:
- `title`: Display title
- `slug`: URL-friendly identifier
- `order`: Sequence number for sorting
- `category`: Content category
- `prev`: Previous lesson slug
- `next`: Next lesson slug

#### Ethical Hacking (12 lessons)
1. lesson-01.md - Getting Started with Ethical Hacking
2. lesson-02.md - Network Hacking - Pre Connection Attacks
3. lesson-03.md - Network Hacking - Gaining Access WEP Cracking
4. lesson-04.md - Network Hacking - Gaining Access - WPA/WPA2 Cracking
5. lesson-05.md - Network Hacking Post Connection Attacks - Information Gathering
6. lesson-06.md - Network Hacking Post Connection Attacks - MITM Attacks
7. lesson-cyberchef.md - CyberChef – The Cyber Swiss Army Knife
8. lesson-fing.md - Introduction to Network Scanning with Fing
9. lesson-passwordcracking.md - Password Cracking with John the Ripper
10. lesson-password_attack-and_hashcracking.md - Password Attacks & Hash Cracking
11. lesson-phising-toolkit.md - Phishing Toolkits
12. ids-probe-lesson.md - IDS Probe — Lesson & How-To

#### Binary Exploitation (1 lesson)
13. Intro.MD - Introduction to Buffer Overflow

#### Python for Ethical Hacking (2 lessons)
14. lesson-1.md - Writing A MAC Address Changer
15. A-guide-to-post-scanning.md - IP & Port Scanning

### 4. Image Path Handling
- Images are automatically resolved from the `imgs` folder at project root
- The `LessonTemplate.jsx` component handles image paths correctly
- Image paths like `../imgs/image.png` are transformed to work with the new structure

## How to Test

1. Start the dev server:
   ```bash
   cd UI/frontend
   npm run dev
   ```

2. Open the browser and check:
   - All lessons should be loaded
   - Navigation between lessons should work
   - Images should display correctly

## Notes

- The `/UI/frontend/src/content` folder can now be removed as it's no longer used
- All content is now served from the original locations outside the UI directory
- This maintains a single source of truth for the content
