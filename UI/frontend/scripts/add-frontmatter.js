import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, '../src/content');

// Category configurations
const categories = {
  'ethical-hacking': {
    name: 'Ethical Hacking',
    lessons: [
      { file: 'lesson-01.md', title: 'Getting Started with Ethical Hacking', order: 1 },
      { file: 'lesson-02.md', title: 'Network Hacking - Pre Connection Attacks', order: 2 },
      { file: 'lesson-03.md', title: 'Network Hacking - Gaining Access', order: 3 },
      { file: 'lesson-04.md', title: 'Network Hacking - Post Connection Attacks', order: 4 },
      { file: 'lesson-05.md', title: 'Web Application Penetration Testing', order: 5 },
      { file: 'lesson-06.md', title: 'Advanced Topics in Ethical Hacking', order: 6 },
      { file: 'lesson-cyberchef.md', title: 'CyberChef Tutorial', order: 7 },
      { file: 'lesson-fing.md', title: 'Fing Network Scanner', order: 8 },
      { file: 'lesson-passwordcracking.md', title: 'Password Cracking Techniques', order: 9 },
      { file: 'lesson-password_attack-and_hashcracking.md', title: 'Password Attack and Hash Cracking', order: 10 },
      { file: 'lesson-phising-toolkit.md', title: 'Phishing Toolkit', order: 11 },
      { file: 'ids-probe-lesson.md', title: 'IDS Probe and Detection', order: 12 },
    ]
  },
  'intro-to-binary-exploitation': {
    name: 'Binary Exploitation',
    lessons: [
      { file: 'Intro.MD', title: 'Introduction to Binary Exploitation', order: 1 },
    ]
  },
  'python-for-eth-hacking': {
    name: 'Python for Ethical Hacking',
    lessons: [
      { file: 'lesson-1.md', title: 'Writing A MAC Address Changer', order: 1 },
      { file: 'A-guide-to-post-scanning.md', title: 'A Guide to Post Scanning', order: 2 },
    ]
  },
  'python-scripts': {
    name: 'Python Scripts',
    lessons: [
      { file: 'mac-address-change.md', title: 'MAC Address Changer Script', order: 1 },
      { file: 'network_scanner.py', title: 'Network Scanner', order: 2, skip: true },
      { file: 'async_port_scanner.md', title: 'Async Port Scanner', order: 3 },
      { file: 'asyncio_port_scanner_readme.md', title: 'Asyncio Port Scanner Guide', order: 4 },
      { file: 'portscanner_test.md', title: 'Port Scanner Test', order: 5 },
      { file: 'ids_probe.md', title: 'IDS Probe Script', order: 6 },
      { file: 'deauth_attack.md', title: 'Deauthentication Attack', order: 7 },
      { file: 'bettercap_arp_spoofing_script.md', title: 'Bettercap ARP Spoofing Script', order: 8 },
      { file: 'bettercap_arp_spoofing_readme.md', title: 'Bettercap ARP Spoofing Guide', order: 9 },
      { file: 'https_data_fetcher_bettercap.md', title: 'HTTPS Data Fetcher with Bettercap', order: 10 },
      { file: 'mitm_attack_automator.md', title: 'MITM Attack Automator', order: 11 },
      { file: 'mitm_attack_automation_readme.md', title: 'MITM Attack Automation Guide', order: 12 },
      { file: 'remote_collect_via_ssh.md', title: 'Remote Collection via SSH', order: 13 },
      { file: 'wep_wifi_hacking.md', title: 'WEP WiFi Hacking', order: 14 },
      { file: 'wpa_wps_hack.md', title: 'WPA/WPS Hacking', order: 15 },
      { file: 'wpa2_dictionary_attack.md', title: 'WPA2 Dictionary Attack', order: 16 },
      { file: 'wpa2_dictionary_attack_readme.md', title: 'WPA2 Dictionary Attack Guide', order: 17 },
      { file: 'wordlist_generator.md', title: 'Wordlist Generator', order: 18 },
    ]
  },
  'safe-practice-questions': {
    name: 'Safe Practice',
    lessons: [
      { file: 'questions.md', title: 'Practice Questions', order: 1 },
      { file: 'answer-key.md', title: 'Answer Key', order: 2 },
    ]
  }
};

function generateSlug(filename) {
  return filename.replace(/\.md$/i, '').toLowerCase();
}

function addFrontmatter(filePath, frontmatter, content) {
  // Check if file already has frontmatter
  if (content.trim().startsWith('---')) {
    console.log(`⏭️  Skipping ${path.basename(filePath)} (already has frontmatter)`);
    return;
  }

  const yaml = `---
title: "${frontmatter.title}"
slug: "${frontmatter.slug}"
order: ${frontmatter.order}
category: "${frontmatter.category}"
prev: ${frontmatter.prev ? `"${frontmatter.prev}"` : 'null'}
next: ${frontmatter.next ? `"${frontmatter.next}"` : 'null'}
---

`;

  const newContent = yaml + content;
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`✅ Added frontmatter to ${path.basename(filePath)}`);
}

function processCategory(categoryKey, categoryData) {
  const categoryPath = path.join(contentDir, categoryKey);
  
  if (!fs.existsSync(categoryPath)) {
    console.log(`⚠️  Directory not found: ${categoryPath}`);
    return;
  }

  console.log(`\n📁 Processing category: ${categoryData.name}`);
  
  categoryData.lessons.forEach((lesson, index) => {
    if (lesson.skip) return;
    
    const filePath = path.join(categoryPath, lesson.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${lesson.file}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const slug = generateSlug(lesson.file);
    
    // Determine prev and next
    let prev = null;
    let next = null;
    
    if (index > 0) {
      prev = generateSlug(categoryData.lessons[index - 1].file);
    }
    
    if (index < categoryData.lessons.length - 1) {
      next = generateSlug(categoryData.lessons[index + 1].file);
    }

    const frontmatter = {
      title: lesson.title,
      slug: slug,
      order: lesson.order,
      category: categoryKey,
      prev: prev,
      next: next
    };

    addFrontmatter(filePath, frontmatter, content);
  });
}

// Main execution
console.log('🚀 Starting frontmatter generation...\n');

Object.entries(categories).forEach(([key, data]) => {
  processCategory(key, data);
});

console.log('\n✨ Frontmatter generation complete!');
