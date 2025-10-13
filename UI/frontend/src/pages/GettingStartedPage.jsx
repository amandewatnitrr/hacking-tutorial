import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './GettingStartedPage.css';

const GettingStartedPage = () => {
  const sections = [
    {
      id: 'introduction',
      title: '🎯 Introduction',
      icon: '🔒',
      description: 'Understanding ethical hacking and its importance',
      topics: [
        'What is Ethical Hacking?',
        'Types of Hackers',
        'Career Opportunities',
        'Legal & Ethical Considerations'
      ],
      link: '/lessons/introduction-to-ethical-hacking'
    },
    {
      id: 'setup',
      title: '⚙️ Environment Setup',
      icon: '🖥️',
      description: 'Setting up your hacking lab with virtual machines',
      topics: [
        'Understanding Virtualization',
        'Installing Kali Linux VM',
        'Setting up Target Machines',
        'Network Configuration'
      ],
      link: '/lessons/environment-setup'
    },
    {
      id: 'wireless',
      title: '📡 Wireless Setup',
      icon: '📶',
      description: 'Configuring wireless adapters and monitor mode',
      topics: [
        'Choosing a Wireless Adapter',
        'Connecting to Kali Linux',
        'Enabling Monitor Mode',
        'Testing Your Setup'
      ],
      link: '/lessons/wireless-setup'
    },
    {
      id: 'basics',
      title: '🌐 Network Basics',
      icon: '🔗',
      description: 'Understanding networks and how they work',
      topics: [
        'Client-Server Architecture',
        'Routers and Access Points',
        'MAC Addresses',
        'Network Packets'
      ],
      link: '/lessons/network-basics'
    },
    {
      id: 'tools',
      title: '🛠️ Essential Tools',
      icon: '⚡',
      description: 'Getting familiar with hacking tools',
      topics: [
        'Command Line Basics',
        'Network Scanning Tools',
        'Packet Capture Tools',
        'Exploitation Frameworks'
      ],
      link: '/lessons/essential-tools'
    },
    {
      id: 'first-steps',
      title: '🚀 Your First Steps',
      icon: '👣',
      description: 'Practical exercises to get started',
      topics: [
        'Scanning Your Network',
        'Capturing Packets',
        'Analyzing Traffic',
        'Safe Practice Guidelines'
      ],
      link: '/lessons/first-steps'
    }
  ];

  const prerequisites = [
    {
      title: 'Basic Computer Skills',
      description: 'Comfortable using a computer and navigating file systems',
      icon: '💻'
    },
    {
      title: 'Networking Fundamentals',
      description: 'Basic understanding of how networks work (helpful but not required)',
      icon: '🌐'
    },
    {
      title: 'Command Line Familiarity',
      description: 'Some experience with terminal/command prompt (we\'ll teach you)',
      icon: '⌨️'
    },
    {
      title: 'Ethical Mindset',
      description: 'Commitment to using knowledge responsibly and legally',
      icon: '⚖️'
    }
  ];

  const learningPath = [
    { step: 1, title: 'Understand the Basics', duration: '1-2 weeks' },
    { step: 2, title: 'Set Up Your Lab', duration: '1 week' },
    { step: 3, title: 'Learn the Tools', duration: '2-3 weeks' },
    { step: 4, title: 'Practice Techniques', duration: 'Ongoing' },
    { step: 5, title: 'Master Advanced Topics', duration: '3-6 months' }
  ];

  return (
    <div className="getting-started-page">
      <Navbar />
      
      <div className="getting-started-container">
        {/* Hero Section */}
        <section className="gs-hero">
          <div className="gs-hero-content">
            <h1 className="gs-title">
              <span className="gs-icon">🚀</span>
              Getting Started with Ethical Hacking
            </h1>
            <p className="gs-subtitle">
              Your comprehensive guide to beginning your journey in ethical hacking and penetration testing
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="gs-section">
          <div className="gs-intro">
            <h2>Welcome to Ethical Hacking! 👋</h2>
            <p>
              Ethical hacking is the practice of testing computer systems, networks, and applications 
              to find security vulnerabilities before malicious hackers do. This guide will help you 
              set up your learning environment and understand the fundamentals.
            </p>
            <div className="gs-warning">
              <span className="warning-icon">⚠️</span>
              <div>
                <strong>Important:</strong> Always practice ethical hacking in controlled environments. 
                Only test systems you own or have explicit permission to test. Unauthorized access is illegal.
              </div>
            </div>
          </div>
        </section>

        {/* Prerequisites */}
        <section className="gs-section">
          <h2 className="section-title">📋 Prerequisites</h2>
          <div className="prerequisites-grid">
            {prerequisites.map((prereq, index) => (
              <div key={index} className="prereq-card">
                <div className="prereq-icon">{prereq.icon}</div>
                <h3>{prereq.title}</h3>
                <p>{prereq.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Path */}
        <section className="gs-section">
          <h2 className="section-title">🗺️ Your Learning Path</h2>
          <div className="learning-path">
            {learningPath.map((item, index) => (
              <div key={index} className="path-item">
                <div className="path-number">{item.step}</div>
                <div className="path-content">
                  <h3>{item.title}</h3>
                  <span className="path-duration">{item.duration}</span>
                </div>
                {index < learningPath.length - 1 && (
                  <div className="path-connector">↓</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Main Sections */}
        <section className="gs-section">
          <h2 className="section-title">📚 Getting Started Sections</h2>
          <p className="section-description">
            Follow these sections in order to build a strong foundation in ethical hacking
          </p>
          
          <div className="sections-grid">
            {sections.map((section) => (
              <div key={section.id} className="section-card">
                <div className="section-header">
                  <span className="section-icon">{section.icon}</span>
                  <h3>{section.title}</h3>
                </div>
                
                <p className="section-description">{section.description}</p>
                
                <div className="section-topics">
                  <h4>What you'll learn:</h4>
                  <ul>
                    {section.topics.map((topic, index) => (
                      <li key={index}>
                        <span className="topic-check">✓</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to={section.link} className="section-button">
                  Start Section
                  <span className="button-arrow">→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Tips */}
        <section className="gs-section">
          <h2 className="section-title">💡 Quick Tips for Success</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">📖</span>
              <h3>Learn Consistently</h3>
              <p>Practice a little every day rather than cramming. Consistency builds skills.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🔬</span>
              <h3>Experiment Safely</h3>
              <p>Use virtual machines and isolated networks. Never test on production systems.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">📝</span>
              <h3>Take Notes</h3>
              <p>Document commands, techniques, and findings. Build your own reference library.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🤝</span>
              <h3>Join Communities</h3>
              <p>Connect with other learners. Share knowledge and learn from others.</p>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="gs-section">
          <h2 className="section-title">🔗 Essential Resources</h2>
          <div className="resources-list">
            <div className="resource-item">
              <span className="resource-icon">💿</span>
              <div className="resource-content">
                <h3>Kali Linux VM</h3>
                <p>Download the pre-configured Kali Linux virtual machine</p>
                <a href="https://zsecurity.org/download-custom-kali/" target="_blank" rel="noopener noreferrer">
                  Download →
                </a>
              </div>
            </div>
            <div className="resource-item">
              <span className="resource-icon">🖥️</span>
              <div className="resource-content">
                <h3>VMware Workstation</h3>
                <p>Virtualization software to run your hacking lab</p>
                <a href="https://ln5.sync.com/dl/a524d0280/view/default/23995984090004?sync_id=0#fgbzw355-bzuq9n6t-yypf24kv-7rfsi8xu" target="_blank" rel="noopener noreferrer">
                  Download →
                </a>
              </div>
            </div>
            <div className="resource-item">
              <span className="resource-icon">🪟</span>
              <div className="resource-content">
                <h3>Windows 10 VM</h3>
                <p>Target machine for practicing Windows-based attacks</p>
                <a href="https://drive.google.com/file/d/1-TIp1Jnj5avio3v_hpLiWrZgKXIDAZIU/view" target="_blank" rel="noopener noreferrer">
                  Download →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="gs-cta">
          <h2>Ready to Begin? 🎯</h2>
          <p>Start with the Introduction section to understand the fundamentals of ethical hacking</p>
          <div className="cta-buttons">
            <Link to="/lessons/introduction-to-ethical-hacking" className="cta-btn primary">
              Start Learning
            </Link>
            <Link to="/" className="cta-btn secondary">
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GettingStartedPage;
