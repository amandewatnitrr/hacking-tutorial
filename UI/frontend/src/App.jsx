import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Import lesson components
import Lesson01 from './Pages/Ethical_Hacking/Lesson01'
import Lesson02 from './Pages/Ethical_Hacking/Lesson02'
import BinaryIntro from './Pages/Binary_Exploitation/BinaryIntro'
import MacChanger from './Pages/Python_for_Hacking/MacChanger'

// Home component
const Home = () => (
  <div className='main-content'>
    <div>
      <h2>Welcome to Hacking Tutorial</h2>
      <p>Select a lesson from the sidebar to get started</p>
      <div className='welcome-info'>
        <h3>Available Courses:</h3>
        <ul>
          <li>Ethical Hacking - Learn penetration testing and security fundamentals</li>
          <li>Binary Exploitation - Understand buffer overflows and memory corruption</li>
          <li>Python for Ethical Hacking - Master Python tools for security testing</li>
          <li>Python Scripts - Collection of useful security scripts</li>
        </ul>
      </div>
    </div>
  </div>
)

// Sidebar component
const Sidebar = () => {
  const [isEthicalHackingOpen, setIsEthicalHackingOpen] = useState(false);
  const [isBinaryExploitOpen, setIsBinaryExploitOpen] = useState(false);
  const [isPythonHackingOpen, setIsPythonHackingOpen] = useState(false);
  const [isPythonScriptsOpen, setIsPythonScriptsOpen] = useState(false);

  const lessons = [
    { 
      id: 'lesson-01', 
      title: 'Getting Started with Ethical Hacking', 
      path: '/ethical-hacking/lesson-01'
    },
    { 
      id: 'lesson-02', 
      title: 'Network Reconnaissance', 
      path: '/ethical-hacking/lesson-02'
    },
    { 
      id: 'lesson-03', 
      title: 'Network Discovery', 
      path: '/ethical-hacking/lesson-03'
    },
    { 
      id: 'lesson-04', 
      title: 'Vulnerability Assessment', 
      path: '/ethical-hacking/lesson-04'
    },
    { 
      id: 'lesson-05', 
      title: 'Web Application Security', 
      path: '/ethical-hacking/lesson-05'
    },
    { 
      id: 'lesson-06', 
      title: 'Advanced Exploitation', 
      path: '/ethical-hacking/lesson-06'
    },
    { 
      id: 'lesson-cyberchef', 
      title: 'CyberChef', 
      path: '/ethical-hacking/cyberchef'
    },
    { 
      id: 'lesson-fing', 
      title: 'Fing', 
      path: '/ethical-hacking/fing'
    },
    { 
      id: 'lesson-password-attack', 
      title: 'Password Attack & Hash Cracking', 
      path: '/ethical-hacking/password-attack'
    },
    { 
      id: 'lesson-phishing', 
      title: 'Phishing Toolkit', 
      path: '/ethical-hacking/phishing'
    }
  ]

  const binaryExploit = [
    { 
      id: 'intro', 
      title: 'Introduction to Buffer Overflow', 
      path: '/binary-exploitation/intro'
    }
  ]

  const pythonHacking = [
    { 
      id: 'mac-changer', 
      title: 'Writing A MAC Address Changer', 
      path: '/python-hacking/mac-changer'
    }
  ]

  const pythonScripts = [
    // Add Python scripts here when available
  ]

  const toggleEthicalHacking = () => {
    setIsEthicalHackingOpen(!isEthicalHackingOpen);
  }

  const toggleBinaryExploit = () => {
    setIsBinaryExploitOpen(!isBinaryExploitOpen);
  }

  const togglePythonHacking = () => {
    setIsPythonHackingOpen(!isPythonHackingOpen);
  }

  const togglePythonScripts = () => {
    setIsPythonScriptsOpen(!isPythonScriptsOpen);
  }

  return (
    <div className='sidebar'>
      <div className='dropdown-container'>
        <div className='dropdown-header' onClick={toggleEthicalHacking}>
          <span>Ethical Hacking</span>
          <span className={`arrow ${isEthicalHackingOpen ? 'open' : ''}`}>▼</span>
        </div>
        {isEthicalHackingOpen && (
          <div className='dropdown-content'>
            {lessons.map((lesson) => (
              <Link 
                key={lesson.id} 
                to={lesson.path}
                className='lesson-item'
              >
                {lesson.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className='dropdown-container'>
        <div className='dropdown-header' onClick={toggleBinaryExploit}>
          <span>Binary Exploitation</span>
          <span className={`arrow ${isBinaryExploitOpen ? 'open' : ''}`}>▼</span>
        </div>
        {isBinaryExploitOpen && (
          <div className='dropdown-content'>
            {binaryExploit.map((lesson) => (
              <Link 
                key={lesson.id} 
                to={lesson.path}
                className='lesson-item'
              >
                {lesson.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className='dropdown-container'>
        <div className='dropdown-header' onClick={togglePythonHacking}>
          <span>Python for Ethical Hacking</span>
          <span className={`arrow ${isPythonHackingOpen ? 'open' : ''}`}>▼</span>
        </div>
        {isPythonHackingOpen && (
          <div className='dropdown-content'>
            {pythonHacking.map((lesson) => (
              <Link 
                key={lesson.id} 
                to={lesson.path}
                className='lesson-item'
              >
                {lesson.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className='dropdown-container'>
        <div className='dropdown-header' onClick={togglePythonScripts}>
          <span>Python Scripts</span>
          <span className={`arrow ${isPythonScriptsOpen ? 'open' : ''}`}>▼</span>
        </div>
        {isPythonScriptsOpen && (
          <div className='dropdown-content'>
            {pythonScripts.length > 0 ? pythonScripts.map((lesson) => (
              <Link 
                key={lesson.id} 
                to={lesson.path}
                className='lesson-item'
              >
                {lesson.title}
              </Link>
            )) : (
              <div className='lesson-item'>No scripts available</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div>
        <nav className='home-button'>
          <Link to="/" className='home-title-link'>
            <h1 className='home-title'>hacking-tutorial</h1>
          </Link>
          <a href='https://github.com/amandewatnitrr/hacking-tutorial'>Github</a>
        </nav>

        <Sidebar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ethical-hacking/lesson-01" element={<Lesson01 />} />
          <Route path="/ethical-hacking/lesson-02" element={<Lesson02 />} />
          <Route path="/binary-exploitation/intro" element={<BinaryIntro />} />
          <Route path="/python-hacking/mac-changer" element={<MacChanger />} />
          {/* Add more routes as you create more lesson components */}
        </Routes>
      </div>
    </Router>
  )
}

export default App