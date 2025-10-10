import React from 'react';
import './LessonStyles.css';

const Lesson01 = () => {
  return (
    <div className="lesson-page">
      <h1>Getting Started with Ethical Hacking</h1>
      <div className="lesson-content">
        <section>
          <h2>Introduction</h2>
          <p>Hacking is getting unauthorized access to a system.</p>
          <p>Hackers generally are of three types:</p>
          <ul>
            <li><strong>Black Hat:</strong> Such hackers generally tend to cause some damage, steal information</li>
            <li><strong>White Hat:</strong> These hakers utilise the hacking knowledge for security/educational purposes</li>
            <li><strong>Grey Hat:</strong> These hackers intrude into systems but don't cause any damage to the sytem, nor steal information.</li>
          </ul>
          <p>Hacking actually do have a really big industry, due to large need of organizations to secure there data, and systems.</p>
        </section>

        <section>
          <h2>Setup for learning</h2>
          <p>For, this purpose we will utilise the concept of Virtual Machines, to replicate various systems.</p>
          <p>Let's discuss each component for this course:</p>
          <ul>
            <li><strong>Host Machine:</strong> This is your main PC or Laptop with it's current OS</li>
            <li><strong>Hacking Machine:</strong> [Kali Linux VM] This is the VM from where attack will be executed.</li>
          </ul>

          <h3>Virtualization</h3>
          <p>Virtualization is the process of creating a virtual version of something, including virtual computer hardware platforms, storage devices, and computer network resources.</p>
        </section>

        <section>
          <h2>Introduction to Penetration Testing</h2>
          <p>Penetration testing is a simulated cyber attack against your computer system to check for exploitable vulnerabilities.</p>
          
          <h3>Connecting Wireless adapter to Kali</h3>
          <p>To perform wireless attacks, you need to connect a compatible wireless adapter to your Kali Linux VM.</p>
          
          <h3>Wireless Modes</h3>
          <p>Wireless interfaces can operate in different modes:</p>
          <ul>
            <li><strong>Managed Mode:</strong> Normal client mode</li>
            <li><strong>Monitor Mode:</strong> Allows capturing of all wireless traffic</li>
          </ul>

          <h4>Enabling Monitor Mode on Wireless Adapter</h4>
          <p>Monitor mode is essential for wireless penetration testing as it allows you to capture all wireless traffic in the area.</p>
        </section>

        <section>
          <h2>Extras - Learning Section - 🔐 RSA Encryption</h2>
          <h3>📌 What is RSA?</h3>
          <p>RSA is a public-key cryptosystem that is widely used for secure data transmission.</p>
          
          <h3>🧮 The Math Behind RSA (Step by Step)</h3>
          <h4>Step 1: Pick Two Large Primes ✨</h4>
          <p>Choose two large prime numbers p and q.</p>
          
          <h4>Step 2: Build the Modulus 🔲</h4>
          <p>Calculate n = p × q</p>
          
          <h4>Step 3: Euler Joins the Party 🧑‍🏫</h4>
          <p>Calculate φ(n) = (p-1)(q-1)</p>
          
          <h4>Step 4: Pick the Public Exponent 🔑</h4>
          <p>Choose e such that 1 &lt; e &lt; φ(n) and gcd(e, φ(n)) = 1</p>
          
          <h4>Step 5: Find the Secret Ingredient 🧙</h4>
          <p>Calculate d such that d × e ≡ 1 (mod φ(n))</p>
          
          <h4>Step 6: Keys Ready 🎉</h4>
          <p>Public key: (n, e), Private key: (n, d)</p>
          
          <h4>Step 7: Encryption & Decryption 🔐</h4>
          <p>Encryption: c = m^e mod n</p>
          <p>Decryption: m = c^d mod n</p>
        </section>
      </div>
    </div>
  );
};

export default Lesson01;