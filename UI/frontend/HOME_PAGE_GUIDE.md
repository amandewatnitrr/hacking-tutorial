# Home Page Implementation Guide

## Overview

The home page has been implemented to display all available courses in a centralized, organized manner. This allows users to browse and select from multiple courses on a single page.

## Structure

### Files Created/Modified

1. **`src/pages/HomePage.jsx`** - Main home page component
2. **`src/pages/HomePage.css`** - Styling for the home page
3. **`src/config/courses.js`** - Centralized course configuration
4. **`src/App.jsx`** - Updated to include home page route

## Features

### 1. Hero Section
- Eye-catching gradient background
- Platform title and description
- Statistics display (total courses, lessons, categories)

### 2. Courses Section
- Grid layout displaying all available courses
- Each course card shows:
  - Course icon and title
  - Description
  - Topics covered
  - Lesson count
  - Category count
  - "Start Learning" button (or "Coming Soon" for inactive courses)

### 3. Features Section
- Highlights platform benefits:
  - Practical & Hands-On
  - Comprehensive Content
  - Regularly Updated
  - Open Source

### 4. Call-to-Action Section
- Encourages users to start learning
- Links to first lesson and GitHub repository

### 5. Footer
- Educational disclaimer
- Links to License, Contributing, and Code of Conduct

## Adding New Courses

To add a new course to the platform, follow these steps:

### Step 1: Update Course Configuration

Edit `src/config/courses.js` and add a new course object to the `coursesConfig` array:

```javascript
{
  id: 'your-course-id',
  title: 'Your Course Title',
  description: 'Brief description of your course',
  icon: '🎓', // Choose an appropriate emoji
  color: '#your-color', // Hex color code
  topics: [
    'Topic 1',
    'Topic 2',
    'Topic 3',
    // Add more topics
  ],
  folder: 'your-course-folder', // Folder name in the project
  status: 'coming-soon', // or 'active' when ready
  resources: [
    {
      name: 'Resource Name',
      url: 'https://resource-url.com'
    }
  ]
}
```

### Step 2: Create Course Content Folder

1. Create a new folder in the project root: `your-course-folder/`
2. Add markdown files for lessons
3. Organize content similar to the `ethical-hacking` folder structure

### Step 3: Update Markdown Loader (if needed)

If your course uses a different content structure, you may need to update `src/utils/markdownloader.js` to support multiple course folders.

### Step 4: Update HomePage Logic

Modify `src/pages/HomePage.jsx` to handle the new course's lesson data:

```javascript
const courses = allCourses.map(course => {
  if (course.id === 'your-course-id') {
    return {
      ...course,
      lessonCount: yourCourseLessons.length,
      categories: yourCourseCategories,
      link: `/lessons/${yourCourseLessons[0].slug}`
    };
  }
  // ... existing logic
});
```

## Course Status

Courses can have two statuses:

- **`active`**: Course is ready and lessons are available
- **`coming-soon`**: Course is planned but not yet available

## Styling

The home page uses CSS custom properties for dynamic theming:

```css
.course-card {
  border-top: 4px solid var(--course-color);
}
```

Each course card uses its configured color for visual distinction.

## Responsive Design

The home page is fully responsive with breakpoints at:
- **768px**: Tablet layout
- **480px**: Mobile layout

## Navigation

- **Home**: `/` - Displays the home page
- **Lessons**: `/lessons/:slug` - Individual lesson pages
- **404**: Fallback for non-existent routes

## Current Courses

### Active Courses
1. **Ethical Hacking & Penetration Testing**
   - Status: Active
   - Lessons: Dynamic (based on markdown files)
   - Topics: Network security, MITM attacks, Python scripting, etc.

### Coming Soon
1. **CLI Editors Tutorial**
2. **Web Application Security**
3. **Network Security & Defense**
4. **Cryptography & Encryption**

## Best Practices

1. **Keep course configuration centralized** in `courses.js`
2. **Use consistent folder structure** for all courses
3. **Add proper frontmatter** to markdown files (title, order, category, etc.)
4. **Test responsive design** on multiple screen sizes
5. **Update statistics** when adding new content
6. **Maintain consistent color scheme** across courses

## Future Enhancements

Potential improvements for the home page:

1. **Search functionality** - Allow users to search courses and lessons
2. **Filtering** - Filter courses by category or difficulty
3. **Progress tracking** - Show user progress on each course
4. **Course ratings** - Allow users to rate courses
5. **Prerequisites** - Display course prerequisites
6. **Estimated time** - Show estimated completion time
7. **Certificates** - Offer completion certificates
8. **Dark mode** - Add dark theme support

## Troubleshooting

### Course not showing up
- Check that the course is added to `courses.js`
- Verify the status is set correctly
- Ensure the course ID is unique

### Lessons not loading
- Check markdown files have proper frontmatter
- Verify the folder path in `markdownloader.js`
- Check console for errors

### Styling issues
- Clear browser cache
- Check CSS custom properties are set
- Verify responsive breakpoints

## Support

For issues or questions:
1. Check the [Contributing Guide](../../CONTRIBUTING.md)
2. Open an issue on GitHub
3. Review the [Code of Conduct](../../CODE_OF_CONDUCT.md)

---

**Note**: This is an educational platform. All content should be used responsibly and legally.
