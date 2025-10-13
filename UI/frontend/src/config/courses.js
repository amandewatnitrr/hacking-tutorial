/**
 * Course Configuration
 * 
 * This file contains the configuration for all courses available on the platform.
 * Add new courses here as they are created.
 * 
 * Each course should have:
 * - id: unique identifier
 * - title: course name
 * - description: brief description
 * - icon: emoji or icon
 * - color: primary color for the course
 * - topics: array of topics covered
 * - folder: folder name in the project (optional)
 * - status: 'active' or 'coming-soon'
 */

export const coursesConfig = [
  {
    id: 'ethical-hacking',
    title: 'Ethical Hacking & Penetration Testing',
    description: 'Comprehensive tutorial series for ethical hacking and penetration testing. Learn network security, MITM attacks, and cybersecurity research.',
    icon: '🔒',
    color: '#667eea',
    topics: [
      'Network Scanning & Information Gathering',
      'Pre-connection & Post-connection Attacks',
      'Man-in-the-Middle (MITM) Attacks',
      'Device Discovery & ARP Spoofing',
      'Tools: Nmap, Netdiscover, ARP Scan',
      'Python Scripting for Security Automation',
      'Binary Exploitation & Reverse Engineering',
      'Password Attacks & Hash Cracking',
      'Phishing Toolkit & Social Engineering',
      'IDS Probing & Evasion Techniques'
    ],
    folder: 'ethical-hacking',
    status: 'active',
    resources: [
      {
        name: 'Kali Linux VM',
        url: 'https://zsecurity.org/download-custom-kali/'
      },
      {
        name: 'VMware Workstation',
        url: 'https://ln5.sync.com/dl/a524d0280/view/default/23995984090004?sync_id=0#fgbzw355-bzuq9n6t-yypf24kv-7rfsi8xu'
      }
    ]
  },
  {
    id: 'cli-editors',
    title: 'CLI Editors Tutorial',
    description: 'Master command-line text editors including Emacs, Vim, and Nano. Essential skills for system administration and development.',
    icon: '⌨️',
    color: '#48bb78',
    topics: [
      'Emacs Fundamentals & Configuration',
      'Vim Basics & Advanced Features',
      'Nano Quick Guide',
      'Editor Customization',
      'Productivity Tips & Shortcuts',
      'Plugin Management',
      'Workflow Optimization'
    ],
    folder: 'cli-editors-tutorials',
    status: 'coming-soon',
    resources: []
  },
  {
    id: 'web-security',
    title: 'Web Application Security',
    description: 'Learn to identify and exploit common web vulnerabilities. Master OWASP Top 10 and secure coding practices.',
    icon: '🌐',
    color: '#ed8936',
    topics: [
      'SQL Injection & Prevention',
      'Cross-Site Scripting (XSS)',
      'Cross-Site Request Forgery (CSRF)',
      'Authentication & Session Management',
      'Security Misconfigurations',
      'Sensitive Data Exposure',
      'API Security Testing'
    ],
    folder: 'web-security',
    status: 'coming-soon',
    resources: []
  },
  {
    id: 'network-security',
    title: 'Network Security & Defense',
    description: 'Deep dive into network protocols, security mechanisms, and defensive strategies against network-based attacks.',
    icon: '🛡️',
    color: '#9f7aea',
    topics: [
      'Network Protocol Analysis',
      'Firewall Configuration',
      'Intrusion Detection Systems',
      'VPN & Secure Tunneling',
      'Network Segmentation',
      'Traffic Analysis & Monitoring',
      'Incident Response'
    ],
    folder: 'network-security',
    status: 'coming-soon',
    resources: []
  },
  {
    id: 'cryptography',
    title: 'Cryptography & Encryption',
    description: 'Understand cryptographic principles, encryption algorithms, and their practical applications in security.',
    icon: '🔐',
    color: '#38b2ac',
    topics: [
      'Symmetric & Asymmetric Encryption',
      'Hash Functions & Digital Signatures',
      'Public Key Infrastructure (PKI)',
      'SSL/TLS Protocols',
      'Cryptographic Attacks',
      'Secure Key Management',
      'Blockchain Basics'
    ],
    folder: 'cryptography',
    status: 'coming-soon',
    resources: []
  }
];

/**
 * Get all courses
 */
export const getAllCourses = () => {
  return coursesConfig;
};

/**
 * Get active courses only
 */
export const getActiveCourses = () => {
  return coursesConfig.filter(course => course.status === 'active');
};

/**
 * Get course by ID
 */
export const getCourseById = (id) => {
  return coursesConfig.find(course => course.id === id);
};

/**
 * Get courses by status
 */
export const getCoursesByStatus = (status) => {
  return coursesConfig.filter(course => course.status === status);
};
