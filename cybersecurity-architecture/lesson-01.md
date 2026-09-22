# Introduction to Cybersecurity Architecture

![](../imgs/original-54080c1d010ef0bc22fb66b815e6e848.gif)

## Table of Contents

- [Introduction to Cybersecurity Architecture](#introduction-to-cybersecurity-architecture)
  - [Table of Contents](#table-of-contents)
  - [What is Triangle of CIA??](#what-is-triangle-of-cia)
  - [What is Anti CIA Triad?](#what-is-anti-cia-triad)
  - [The Problem with Cybersecurity today](#the-problem-with-cybersecurity-today)
    - [Why so??](#why-so)
  - [Who is a Security Architect?](#who-is-a-security-architect)
  - [Security Principles \& Approaches](#security-principles--approaches)
    - [OWASP](#owasp)
    - [Open Group (Jericho Forum)](#open-group-jericho-forum)
    - [NIST (National Institute of Standards and Technology)](#nist-national-institute-of-standards-and-technology)
    - [The Ten Guiding Principles for Security Architecture](#the-ten-guiding-principles-for-security-architecture)
    - [NCSC (National Cyber Security Centre)](#ncsc-national-cyber-security-centre)
    - [High Assurance Design](#high-assurance-design)
  - [Principles of Secure Design](#principles-of-secure-design)


---

- In this course, we will explore the fundamentals of cybersecurity architecture, its importance in protecting digital assets, and the key components that make up a robust security framework. We will also be doing a case study of a real-world cybersecurity architecture to understand how these concepts are applied in practice.

## What is Triangle of CIA??

![CIA Triad Diagramatic Representation](../imgs/The_CIA_Triad_npewyc.avif)

- CIA in this context stands for Confidentiality, Integrity, and Availability. These three principles form the foundation of cybersecurity and are often referred to as the "CIA Triad." 

  - **Confidentiality**: Ensures that sensitive information is accessed only by authorized individuals and is protected from unauthorized access. Examples include encryption, biometrics, 2FA, access controls, and authentication mechanisms.
  
  - **Integrity**: Ensures that data remains accurate and unaltered during storage, transmission, and processing. It protects against unauthorized modifications. Example: Hashing and Checksums
  
  - **Availability**: Ensures that information and resources are accessible to authorized users when needed, preventing disruptions in service. Example: Network/Data/Service Accessibility, Redundancy, and Failover Mechanisms

## What is Anti CIA Triad?

<p align="center">
  <img src="../imgs/1779208981975.jpg" alt="" />
</p>

- The Anti-CIA Triad is also known as `DAD` or `DAD Triad`, which stands for Disclosure, Alteration, and Denial. It represents the opposite of the CIA Triad and highlights the potential threats to cybersecurity.

  - **Disclosure**: Refers to unauthorized access or exposure of sensitive information, leading to breaches of confidentiality. Example: Data Breaches, Phishing Attacks. Example: Trojans, Brute Force Attacks, Social Engineering
  
  - **Alteration**: Involves unauthorized changes or modifications to data, compromising its integrity. Example: Data Tampering, Malware Infections. Example: Malware, Viruses, Worms, Logic Bombs, Backdoors, Rootkits, SQL Injection, Cross-Site Scripting (XSS), Man-in-the-Middle (MITM) Attacks
  
  - **Denial**: Refers to the disruption of access to information or services, affecting availability. Example: Denial-of-Service (DoS) Attacks, Ransomware. Example: Denial-of-Service (DoS) Attacks, Distributed Denial-of-Service (DDoS) Attacks, Ransomware, Botnets

## The Problem with Cybersecurity today

- Security can be deployed both tactically and strategically. Now, you understand what that means is basically where you apply security with a strategy in your mind. But, when we talk about deploying security tactically, we talk about applying very specific security solutions and tools to solve a very specific security issue.

- Strategically, is more like a laid back approach, where you see the bigger picture and you come up with a plan to counter these security issues.

- Tactically is when we are laser focused on one specific issue. But, it is important to note that the tactical deployments are way inferior compared to strategic deployments. Because, when you deploy security tactically, you are only solving one specific issue, but when you deploy security strategically, you are solving multiple issues at once.

- Now, the problem here is many organisations will deploy solutions tactically without the consideration for compatibility and interoperability with other security solutions. This can lead to a fragmented security architecture, where different tools and systems may not work well together, creating gaps in security coverage.

- For classic example, a company buys one firewall to protect the data or network for one particular department and, than another firewall from another vendor to protect the data and network of another department. Now, when they want to exchange data between these two departments, they will have to go through two different firewalls, which may not be compatible with each other. This can lead to delays, errors, and even security vulnerabilities.

- Cost Effectiveness is another issue. When organisations deploy security solutions tactically, they may end up spending more money on multiple tools and systems that do not work well together. This can lead to increased costs for maintenance, training, and support.

- User Experience is also affected.  Sometimes, companies deploy these security solutions without the User review from the employees by doing testings with certain employees. This can lead to frustration and decreased productivity, as employees may have to navigate multiple security systems and tools that are not user-friendly or intuitive. Or, the IT staff has even been trained to use one security solution, but the other security solution is completely different and they have to learn how to use it. This can lead to confusion and errors, as employees may not know how to properly use the security tools and systems.

- Support for other non-security business requirements is also a problem. When organisations deploy security solutions tactically, they may not consider how these solutions will impact other business requirements, such as compliance, regulatory requirements, or business processes. This can lead to conflicts and challenges in meeting these requirements.

### Why so??

- If they might be aware of these things why they would opt for tactical deployments instead of strategic deployments? The answer is simple:
  
  - Company Culture: Some organisations may have a culture that prioritizes short-term gains over long-term planning. They may focus on immediate security issues without considering the broader implications of their decisions.

  - Security Objectives are not aligned with business objectives: In some cases, security objectives may not be aligned with the overall business objectives of the organisation. This can lead to a lack of coordination and communication between security teams and other departments, resulting in tactical deployments that do not support the broader goals of the organisation.

  - Security is not a priority: In some organisations, security may not be a top priority, and resources may be allocated to other areas of the business. This can lead to a reactive approach to security, where solutions are deployed in response to specific incidents rather than as part of a comprehensive strategy.

  - Neglecting Security requirments to deliver business requirements: In some cases, organisations may neglect security requirements in order to deliver business requirements quickly. This can lead to a lack of consideration for security implications and the deployment of solutions that do not adequately address security risks.

>[!IMPORTANT]
>- Securrity requirements are not defined by Business Requirements. Security is a business enabler, not a business requirement. Security requirements should be defined by business requirements, not the other way around. Security should be a part of the business strategy, not a separate entity that is only considered when there is a security incident.
><br/><br/>Understand what the business is develop the security requirements based on the business requirements. Security should be a part of the business strategy, not a separate entity that is only considered when there is a security incident.<br/><br/>
>- Not all data is equal. Some data is more sensitive than others, and security measures should be tailored accordingly. For example, financial data may require more stringent security controls than marketing data. By understanding the sensitivity of different types of data, organisations can deploy security solutions that are appropriate for each type of data. For example, you might want to secure data of the HR Department more than the data of the Marketing Department. Because, HR data is more sensitive than Marketing data. So, you might want to deploy more security solutions for HR data than Marketing data. This is where the concept of Data Classification comes into play. <br/><br/>Data Classification is the process of categorizing data based on its sensitivity and importance to the organisation. By classifying data, organisations can apply appropriate security controls and measures to protect it.

>[!NOTE]
> <b>Cybersecurity Terminologies:</b>
> **Threat:** Any circumstance or event with the potential to adversely impact/affect organizational operations, assets, individuals, or the organization through an information system via disclosure, modification, or denial of service.
> **Attack:** Any attempt to gain unauthorized access to an information system, disrupt its normal operation, or compromise its confidentiality, integrity, or availability.
> **Vulnerability:** A weakness or flaw in an information system, application, or network that can be exploited by a threat actor to confidentiality, integrity, or availability.
> **Authentication:** The process of verifying the identity of a user, device, or system, typically through the use of credentials such as passwords, biometrics, or security tokens.
> **Authorization:** The process of determining whether a user, device, or system has the necessary permissions to access a resource or perform an action.

- Security Architectures are driven by business requirements as we have seen and discussed earlier.

  - Cost vs Security Benifit
  - Usability and Operability
  - Integration with another business process

## Who is a Security Architect?

- A Security Architect is a professional responsible for designing, implementing, and managing an organization's/team's security architecture. They ensure that security measures align with business objectives, regulatory requirements, and industry best practices.

>[!IMPORTANT]
>- The most important thing is that you might have to be jack of all trades, master of none, but still better than master of one.
>- Also, architects are not pen testers.

## Security Principles & Approaches

- A Fundamental statement that serves as the foundation for security in order to enable the achievement of business objectives and goals. For example:

  - OWASP Top Ten: A list of the most critical web application security risks, maintained by the Open Web Application Security Project (OWASP).
  - Open Group (Jericho Forum): A global community focused on developing open standards and best practices for secure information sharing and management.
  - NIST 800-160: A publication by the National Institute of Standards and Technology (NIST) providing guidance on systems security engineering for developing secure and resilient systems.
  - "The Ten Guiding Principles for Security Architecture - John Viega and Gary McGraw": A set of principles aimed at guiding the design and implementation of secure and resilient information systems.
  - "High Assurance Design" - Clifford J. Berg

### OWASP

  ![OWASP Top Ten](../imgs/1gW2PlibhbLXOj9s5_iTfbg.gif)

- Minimize the attack surface: Limit the number of entry points and exposed functionalities to reduce potential attack vectors.
- Apply defense in depth: Implement multiple layers of security controls to protect against different types of threats.
- Avoid security by Obscurity: Do not rely on secrecy of design or implementation as the primary security measure.
- Enforce least privilege: Grant users and systems the minimum level of access necessary to perform their tasks.
- Secure defaults: Configure systems and applications with secure settings by default, minimizing the need for additional security configuration.

### Open Group (Jericho Forum)

![](../imgs/ogforum_security_0.jpg)

- Fundamentals: Here, it means level of protection should be appropriate to the sensitivity and criticality of the information and systems being protected.
- Surviving in a hostile world: Meaning the devices must communicate among them using only secure protocols.
- Need for trust: Meaning transparency at all levels
- Identity Management and Federation: Ensuring that identities are properly managed and that trust relationships are established for secure information sharing across different domains. (AAA - Authentication, Authorization, and Accountability)
- Access to Data: Ensuring that access to sensitive data is properly controlled and monitored to prevent unauthorized access and data breaches. (Controlled, Private, and Secured)

### NIST (National Institute of Standards and Technology)

![](../imgs/nist-protect-function.gif)

- Least Privilege: Ensure that users and systems have the minimum level of access necessary to perform their tasks, reducing the potential impact of security breaches.
- Hierarchical Trust: Establish trust relationships in a hierarchical manner, ensuring that higher levels of trust are based on the verification and validation of lower levels.
- Hierarchical Protection: Implement security controls in a hierarchical manner, ensuring that higher levels of protection are built upon the foundation of lower levels.
- Minimize Sharing: Limit the sharing of sensitive information to only those who need it, reducing the risk of unauthorized access and data leaks. And, sharing based on sensitivity of the information.
- Reduce Complexity: Simplify system designs and security controls to minimize potential vulnerabilities and make it easier to manage and maintain security measures effectively.

### The Ten Guiding Principles for Security Architecture

![](../imgs/51Xhk9Z1SfL._UF1000,1000_QL80_.jpg)

- Secure the weakest link: Focus on strengthening the most vulnerable components of the system, as attackers often target the weakest points to gain access or cause damage.
- Defense in depth: Implement multiple layers of security controls to protect against different types of threats, ensuring that if one layer is compromised, others still provide protection.
- Fail securely: Design systems to fail in a secure manner, minimizing the potential impact of failures or errors on the overall security posture.
- Minimize attack surface: Reduce the number of entry points and exposed functionalities to limit potential attack vectors.
- Enforce least privilege: Grant users and systems the minimum level of access necessary to perform their tasks, reducing the risk of unauthorized access and misuse of privileges.
- Keep it simple: Design systems and security controls to be as simple as possible, reducing the likelihood of errors and making it easier to understand, manage, and maintain security measures effectively.
- Promote Privacy: Ensure that systems and processes are designed to protect the privacy of individuals, minimizing the collection and exposure of personal information and adhering to relevant privacy regulations and best practices.
- Be reluctant to trust: Avoid placing trust in components, systems, or individuals without proper verification and validation, reducing the risk of security breaches due to misplaced trust.

### NCSC (National Cyber Security Centre)

![](../imgs/SuuKgeddIADLBSOh8EQkCXD8TVLKjJHbcgdSmtgUdQI.jpg.webp)

- Establish the context before the design: Understand the environment, requirements, and constraints before starting the design process to ensure that security measures are appropriately aligned with the overall objectives and risks.
- Make compromise difficult: Design systems and security measures in a way that makes it challenging for attackers to exploit vulnerabilities or bypass security controls, reducing the likelihood of successful attacks.
- Make disruption difficult: Design systems and security measures to be resilient against disruptions, ensuring that attacks or failures have minimal impact on the overall functionality and security of the system.
- Make compromise detection easier: Implement mechanisms and monitoring systems that facilitate the timely detection of security breaches or compromises, enabling rapid response and mitigation to minimize potential damage.
- Reduce the impact of compromises: Implement measures that limit the potential damage caused by security breaches, ensuring that even if a compromise occurs, its effects are contained and manageable.

### High Assurance Design

- Security design patterns must be verifiable
- Deploy and run securely
- Embed intrusion detection at multiple points
- Logs are secured and reliable
- Segement data and resources according to risk

## Principles of Secure Design

![](../imgs/238353480-219bcc70-f5dc-466b-9a60-29653d8e8433.gif)
