import React from 'react';
import './LessonStyles.css';

const Lesson02 = () => {
  return (
    <div className="lesson-page">
      <h1>Network Reconnaissance and Information Gathering</h1>
      <div className="lesson-content">
        <section>
          <h2>Introduction to Reconnaissance</h2>
          <p>Reconnaissance is the first phase of penetration testing where we gather information about the target.</p>
          
          <h3>Types of Reconnaissance</h3>
          <ul>
            <li><strong>Passive Reconnaissance:</strong> Gathering information without directly interacting with the target</li>
            <li><strong>Active Reconnaissance:</strong> Directly probing the target system</li>
          </ul>
        </section>

        <section>
          <h2>Information Gathering Techniques</h2>
          <h3>OSINT (Open Source Intelligence)</h3>
          <p>Collecting publicly available information about the target.</p>
          
          <h3>Tools for Information Gathering</h3>
          <ul>
            <li>Google Dorking</li>
            <li>Shodan</li>
            <li>TheHarvester</li>
            <li>Maltego</li>
          </ul>
        </section>

        <section>
          <h2>DNS Enumeration</h2>
          <p>Domain Name System enumeration to gather information about domain names and IP addresses.</p>
          
          <h3>Common DNS Tools</h3>
          <ul>
            <li>nslookup</li>
            <li>dig</li>
            <li>fierce</li>
            <li>dnsrecon</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Lesson02;