# Threat Modeling

![](../imgs/threat-model.gif)

- [Threat Modeling](#threat-modeling)
  - [Introduction to Threat Modeling](#introduction-to-threat-modeling)
  - [Threat Modeling vs Risk Assessment](#threat-modeling-vs-risk-assessment)
  - [Types of Threat Models](#types-of-threat-models)
    - [Application Threat Model](#application-threat-model)
    - [Operational Threat Model](#operational-threat-model)
    - [Data Flow Threat Model](#data-flow-threat-model)
  - [STRIDE Threat Model](#stride-threat-model)
  - [DREAD Threat Model](#dread-threat-model)
  - [PASTA Threat Model](#pasta-threat-model)
  - [OCTAVE Threat Model](#octave-threat-model)
  - [TRIKE Threat Model](#trike-threat-model)
  - [Attack Trees](#attack-trees)
    - [Attack Tree: Steal or Ransom the Product Software](#attack-tree-steal-or-ransom-the-product-software)
      - [Level 0: Overview](#level-0-overview)
      - [Branch A: Supply Chain Engineering](#branch-a-supply-chain-engineering)
      - [Branch B: Social Engineering](#branch-b-social-engineering)
      - [Branch C: Insider Attack](#branch-c-insider-attack)
      - [Reading the tree](#reading-the-tree)

## Introduction to Threat Modeling

>[!IMPORTANT]
>
>- Threat Modeling is a structured approach to identifying and addressing potential security threats to a system. It helps organizations understand the security risks associated with their applications, infrastructure, and processes, and allows them to design appropriate mitigations to protect against these threats.
><br/>
>- Using a model as an approach for analyzing the security of an application and allows the identification and quantification of the security risks associated with the application.

- There are several methodologies for threat modeling:

  - STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)
  - DREAD (Damage, Reproducibility, Exploitability, Affected Users, Discoverability)
  - PASTA (Process for Attack Simulation and Threat Analysis)
  - TRIKE (Threat Modeling Framework)
  - VAST (Visual, Agile, and Simple Threat)
  - OCTAVE (Operationally Critical Threat, Asset, and Vulnerability Evaluation)
  - PnG (Process and Governance)

- And, there are perspectives to these methodologies as well:

  - Functional
  - Process
  - Deployment
  - Data Flows
  - Social
  - Environmental

- For, example let's understand this with a simple case of Social Perspective, where sensitive company data must not be copied to personal USB drives(threat).

  A proper mitigation to this would sound something on the lines of "Use of Security Policy banning the use of USB Drives".
  
  <br/>

  ![](../imgs/usb-policy.gif)

- But, what if there's an insider, and if someone really decides to use one anyways. To mitigate this we will do data audits. Now, if the insider knows audits are performed regularly, logs are taken regularly, which increases the likelihood of detection and acts as a deterrent. But what if auditing or logging fails.

  ![](../imgs/insider-audit.gif)

- Another mitigation could be blocking the outgoing USB ports to prevent data from being copied to personal USB drives, and only allow incoming/outgoingUSB devices that are approved and monitored by the IT department. This would be the perfect final resolution to the threat.

  ![](../imgs/port-control.gif)

- FMEA (Failure Modes and Effects Analysis) helps a lot with identifying potential failure points in a system and assessing their impact, which in turn aids in designing effective mitigations for security threats. Feel free to take a tour through the FMEA process to understand how it can be applied in threat modeling in <a href="../FMEA Fundamentals/chapter-01.md">this link</a>.

## Threat Modeling vs Risk Assessment

![](../imgs/versus-hq.gif)

>[!NOTE]
> Threats can exist without a risk, but a risk needs a associated threat to exist. Risks are event focused while threats are intent focused.

- Risks are measured based on <b>probability</b> that an event might occur and have certain impact on the functioning of the system.

- Threat assesment is combination of a threat actor's intention to harm combined with capability of the actor to carry out these intentions.

## Types of Threat Models

![](../imgs/trust-board-4k.gif)

- There are mainly 3 types of threat models:

  - Application Threat Model
  - Operational Threat Model
  - Data Flow Threat Model

### Application Threat Model

- Focuses exclusively on the application the model has been designed for and is used to identify potential threats and vulnerabilities specific to that application.

- The general idea here is:

  - We first create an Architecture Design Diagram
  - Identify the assets in use
  - Identify the threats to those assets
  - Team participation
  - Idetify Threat Actors
  - Controls to mitigate identified threats

### Operational Threat Model

- Provides organizations with general overview of it's infrastructure risk profile in order to better understand the attack surface and develop effective mitigation policies and strategies.

- Operational Threat Model is more about entire business as a whole.

- The general idea here is:

  - We first identify the operational environment. This can include shared resources like database or encryption servers.

  - Every resource attributes are identified, for example a server with unrestricted admin access can have more threats

  - Potential threats are identified.

  - Effective security controls are developed.

### Data Flow Threat Model

- Used to accurately model the application through visual representation.

- Diagram should identify the affected components through critical points and also highlight the flow of control through these components.

## STRIDE Threat Model

  ![](../imgs/stride-hq.gif)

- STRIDE stands for Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege. It is a widely used threat modeling framework that helps identify and categorize potential security threats to a system.
- STRIDE was developed by Microsoft
- Developers can use this model during design phase to spot potential threats in the system.
- So, when using STRIDE, developers ask themselves 2 questions:

  1. What can go wrong in the system?
  2. Are mitigation controls put in place effective?

- To counter this the Threat Model aims for:

  - Authentication
  - Integrity
  - Identification
  - Confidentiality
  - Availability
  - Authorization

- These threats are addressed by:

  - Mitigation
  - Elimination (component is removed)
  - Transfered
  - Accepted

## DREAD Threat Model

![](../imgs/dread-hq.gif)

- DREAD stands for Damage, Reproducibility, Exploitability, Affected Users, and Discoverability. It is a risk assessment model used to quantify and prioritize potential security threats.
- DREAD is used to assess and prioritize threats based on their potential impact and probability, helping organizations make informed decisions about risk management.
- Each factor is awarded a score but this process can be very subjective and unreliable.

## PASTA Threat Model

![](../imgs/pasta-hq.gif)

- PASTA stands for Process for Attack Simulation and Threat Analysis. It is a risk-centric threat modeling methodology that aims to identify and mitigate potential security threats throughout the software development lifecycle.

- It's a 7 step methodology to create a process for simulating attacks to application, analyzing the threats, their origin, the risk they post to an organization, and how to mitigate them.

- The 7 steps of PASTA are:
  1. Definition of the Objectives
  2. Definition of the Technical Scope
  3. Application Decomposition and Analysis
  4. Threat Analysis
  5. Vulnerability and Weakness Analysis
  6. Attack Simulation
  7. Risk and Impact Analysis

## OCTAVE Threat Model

![](../imgs/octave-hq.gif)

- OCTAVE stands for Operationally Critical Threat, Asset, and Vulnerability Evaluation. It is a risk-based strategic assessment and planning technique for security.
- Due to its flexibility, it can be made to fit the needs of practically any organization while only requiring a small team of cyber security professionals to collaborate on the endeavor.
- There are 3 variants of the OCTAVE methodology: 
  - OCTAVE Allegro: best for small teams
  - OCTAVE-S: suitable for larger organizations
  - OCTAVE FORTE: Most Adaptable Variation
- It is fast at discovering, prioritizing, and mitigating risks.

## TRIKE Threat Model

![](../imgs/trike-hq.gif)

- TRIKE stands for Threat modeling, Risk assessment, and Information security Knowledge Engineering. It is a risk management and threat modeling framework that focuses on defining and enforcing security requirements for a system.
- It is a Open Source Developed Framework released in 2006 and, is used by Security Professionals who run security audits.
- It is a risk driven approach to threat modeling, where the focus is on identifying and mitigating risks based on their potential impact on the system.
- It focuses on defence rather than offense, aiming to strengthen the system's security posture by proactively addressing potential threats.
- TRIKE involves 4 stages:

  - Determine risk level for each asset
  - Document what's been done
  - Communicate what was done and the impact to stake holders
  - Work with stake holders to reduce risk
  
- <strong>TRIKE Process</strong>

  - TRIKE uses something called a `requirement model`.
    - Actors interacting with the system
    - Assets or data elements to be used
    - Intended actions performed by the system (CRUD)
    - Rules that define when the actions can be performed.

  - The next thing that comes in the TRIKE process is the `implementation model`.
    - Identify the set of supporting operations
    - Develop Data flow diagrams
    - Identify Use flows

  - The next step is to build the `threat model`.
    - Identify all possible threats
    - Identify weaknesses and vulnerabilities
    - Identify mitigations that can reduce the risks

  - The last step is building the `Risk Model`.
    - Experimental and still under development
    - Recommended to use other methodologies like NIST

## Attack Trees

>[!IMPORTANT]
> Attack trees are graphical representation of attack against a system or a network using a hierarichal tree structure.
> The Root node represents the main goal of the attacker, and the branches represent different ways to achieve that goal. 
> This graphical representation have 2 types of nodes: AND nodes and OR nodes.
> `AND` nodes indicate that all child nodes must be achieved to reach the parent node, while `OR` nodes indicate that achieving any one of the child nodes is sufficient to reach the parent node.

Example of an attack tree:

```mermaid
graph TD
    A[Root Goal] --> B[AND Node]
    A --> C[OR Node]
    B --> D[Child Node 1]
    B --> E[Child Node 2]
    C --> F[Child Node 3]
    C --> G[Child Node 4]
```

Here's an example for instagram.

```mermaid
graph TD
    A[Instagram Session Hijack] --> B[Steal Session Cookie]
    A --> C[Obtain Access Token]
    B --> D[Use XSS Attack]
    B --> E[Use Network Sniffing]
    C --> F[Phishing Attack]
    C --> G[Social Engineering]
```

- The attack tree process has following steps:

  - Identify the main goal of the attacker (root node)
  - Identify the ways to achieve the main goal (branches)
  - Determine the logical relationship between the child nodes (AND/OR)
  - Delete unrealistic leaf nodes
  - Check for completeness

- Let's take a real life scenario for analysis wherein your company is on the verge of releasing a revolutionary product and are concerned that the software used to create it will either be stolen and sold to rival companies or could be used to hold the company to ransom.

  A 3rd party Software Development company is also involved in the project.

### Attack Tree: Steal or Ransom the Product Software

> Legend: hexagon = `AND` node (all children needed), rounded box = `OR` node (any child enough), plain box = leaf attack step.

#### Level 0: Overview

The attacker needs to *gain access* **AND** *monetise* it, so the root is an `AND` node. Access can come via any of 3 vectors (`OR`), and monetisation via any of 3 routes (`OR`).

```mermaid
graph TD


    A[Stealing sensitive Data] --> SC("A. Supply chain engineering")
    A --> SE("B. Social engineering")
    A --> IN("C. Insider attack")


    classDef and fill:#fde2e2,stroke:#c0392b,color:#000;
    classDef or fill:#e8f1fb,stroke:#2e6da4,color:#000;
    class R and;
    class ACC,MON,SC,SE,IN or;
```

#### Branch A: Supply Chain Engineering

Attacker goes after the weakest link: the 3rd party development company, its tools, or the trust the company places in them.

```mermaid
graph LR
    A("A. Supply chain engineering<br/>(OR)")
    A --> A1("A1. Breach the 3rd party dev<br/>company (OR)")
    A --> A2("A2. Poison tools and<br/>dependencies (OR)")
    A --> A3("A3. Abuse vendor-to-company<br/>trust links (OR)")

    A1 --> A11{{"A1.1 Vendor network breach<br/>(AND)"}}
    A11 --> A111["Phish a vendor developer"]
    A11 --> A112["Privilege escalation and<br/>lateral movement"]
    A11 --> A113["Reach shared repo or build<br/>server"]
    A1 --> A12["Steal vendor VPN creds, SSH<br/>keys, API tokens"]
    A1 --> A13["Compromise vendor CI/CD<br/>pipeline"]
    A1 --> A14["Malware on vendor laptop, or<br/>stolen device"]
    A1 --> A15["Exploit weak vendor hygiene:<br/>unpatched VPN, no MFA"]

    A2 --> A21["Dependency confusion or<br/>typosquatted package"]
    A2 --> A22["Hijack upstream open-source<br/>maintainer account"]
    A2 --> A23["Trojanised IDE plugin,<br/>compiler or build tool"]
    A2 --> A24["Poisoned container base<br/>image"]

    A3 --> A31["Hard-coded secrets found in<br/>vendor repo"]
    A3 --> A32["Over-privileged vendor<br/>accounts on company GitHub,<br/>cloud, Jira"]
    A3 --> A33{{"A3.3 Tamper with delivered<br/>code (AND)"}}
    A33 --> A331["Compromise artifact registry<br/>or code-signing key"]
    A33 --> A332["Company accepts vendor drop<br/>with no review or SBOM check"]

    classDef and fill:#fde2e2,stroke:#c0392b,color:#000;
    classDef or fill:#e8f1fb,stroke:#2e6da4,color:#000;
    class A11,A33 and;
    class A,A1,A2,A3 or;
```

#### Branch B: Social Engineering

Attacker targets people at the company or the vendor, not the technology.

```mermaid
graph LR
    B("B. Social engineering (OR)")
    B --> B1("B1. Phishing (OR)")
    B --> B2("B2. Pretexting and vishing<br/>(OR)")
    B --> B3("B3. Fake recruiter or job<br/>test (OR)")
    B --> B4("B4. Physical social<br/>engineering (OR)")
    B --> B5("B5. Business email<br/>compromise (OR)")

    B1 --> B11{{"B1.1 Spear-phish with MFA<br/>bypass (AND)"}}
    B11 --> B111["OSINT on LinkedIn and GitHub<br/>to find developers"]
    B11 --> B112["Craft lure: fake code review<br/>or Jira link"]
    B11 --> B113["Adversary-in-the-middle<br/>proxy captures password and<br/>session cookie"]
    B1 --> B12["MFA fatigue: spam push<br/>prompts until user approves"]
    B1 --> B13["Malicious attachment or<br/>macro to dev workstation"]

    B2 --> B21{{"B2.1 Helpdesk reset (AND)"}}
    B21 --> B211["Collect employee name, ID<br/>and manager from OSINT"]
    B21 --> B212["Call IT helpdesk<br/>impersonating the developer"]
    B21 --> B213["Get password reset and enrol<br/>attacker MFA device"]
    B2 --> B22["Impersonate vendor project<br/>manager to request repo<br/>access"]

    B3 --> B31["Fake recruiter sends coding<br/>test with malware to<br/>developer"]
    B3 --> B32["Fake open-source contributor<br/>submits malicious pull<br/>request"]

    B4 --> B41["Tailgate into office or<br/>vendor site"]
    B4 --> B42["Drop infected USB near<br/>developers"]
    B4 --> B43["Evil maid: plug implant into<br/>unattended workstation"]

    B5 --> B51["Spoof or take over executive<br/>mailbox"]
    B5 --> B52["Pressure vendor to share<br/>source archive urgently"]

    classDef and fill:#fde2e2,stroke:#c0392b,color:#000;
    classDef or fill:#e8f1fb,stroke:#2e6da4,color:#000;
    class B11,B21 and;
    class B,B1,B2,B3,B4,B5 or;
```

#### Branch C: Insider Attack

Attacker is already inside, or turns someone who is. Includes the vendor's staff, who are insiders to the project too.

```mermaid
graph LR
    C("C. Insider attack (OR)")
    C --> C1("C1. Malicious employee (OR)")
    C --> C2("C2. Malicious vendor staff<br/>(OR)")
    C --> C3("C3. Coerced or recruited<br/>insider (OR)")
    C --> C4("C4. Negligent insider (OR)")
    C --> C5("C5. Privileged or ex-insider<br/>(OR)")

    C1 --> C11["Copy source to USB, personal<br/>cloud or private git remote"]
    C1 --> C12["Email code to personal<br/>address"]
    C1 --> C13["Plant logic bomb or kill<br/>switch to enable ransom"]

    C2 --> C21["Vendor developer sells copy<br/>to rival"]
    C2 --> C22["Vendor has weaker DLP and<br/>monitoring than company"]

    C3 --> C31["Rival bribes existing<br/>employee"]
    C3 --> C32["Blackmail employee using<br/>personal leverage"]
    C3 --> C33{{"C3.3 Planted employee (AND)"}}
    C33 --> C331["Rival places agent via job<br/>application or vendor<br/>contract"]
    C33 --> C332["Agent passes vetting and<br/>gains repo access"]

    C4 --> C41["Repo or storage bucket<br/>accidentally made public"]
    C4 --> C42["Credentials committed to<br/>repo or pasted in public<br/>chat"]
    C4 --> C43["Source pasted into<br/>unapproved AI or online tool"]
    C4 --> C44["Lost or unencrypted laptop"]

    C5 --> C51["Admin disables logging then<br/>dumps repo"]
    C5 --> C52["Ex-employee or ex-vendor<br/>access never revoked"]
    C5 --> C53["Shared or service account<br/>abused with no attribution"]

    classDef and fill:#fde2e2,stroke:#c0392b,color:#000;
    classDef or fill:#e8f1fb,stroke:#2e6da4,color:#000;
    class C33 and;
    class C,C1,C2,C3,C4,C5 or;
```

#### Reading the tree

- Weak points are leaves with no `AND` partner. One step, attacker wins. Examples: stolen vendor creds (`A12`), unrevoked access (`C52`), MFA fatigue (`B12`).
- `AND` nodes are where defenders get leverage. Break any one child and whole path fails. Example: `A3.3` fails if company reviews vendor code or verifies signatures.
- Vendor appears in all 3 branches (`A1`, `B22`, `C2`). Third party is the common thread, so contract security requirements, least-privilege access and monitoring for vendor accounts matter as much as internal controls.

### Mitigations for the Attack Tree

The same attack trees are redrawn below with a rating on each attack node and the mitigation attached as a child. Solid line = attack step, dotted line = countermeasure (rounded pill). Hexagon = `AND` node. Rating:

| Colour | Status | Meaning |
| --- | --- | --- |
| 🟢 Green | Resolved | A control exists that closes the path or reduces it to negligible risk. |
| 🟡 Yellow | Possible | A mitigation exists but is partial: it needs vendor cooperation, process discipline or extra budget, or leaves residual risk. |
| 🔴 Red | Unavoidable | Cannot be prevented (attacker-side activity, or a trusted person acting maliciously). Only limit the blast radius, detect and respond. |

Grey nodes are not rated. An `AND` node such as `A1.1` is rated as a whole, so its mitigation hangs off the hexagon. An `OR` node stays open until every child under it is closed, so one unrated or red sibling keeps the whole branch exposed.

#### Mitigations: Branch A (Supply Chain)

```mermaid
graph LR
    A("A. Supply chain engineering<br/>(OR)")
    A --> A1("A1. Breach the 3rd party dev<br/>company (OR)")
    A --> A2("A2. Poison tools and<br/>dependencies (OR)")
    A --> A3("A3. Abuse vendor-to-company<br/>trust links (OR)")

    A1 --> A11{{"🟡 A1.1 Vendor network breach<br/>(AND)"}}
    A11 --> A111["A111 Phish a vendor<br/>developer"]
    A11 --> A112["A112 Privilege escalation<br/>and lateral movement"]
    A11 --> A113["A113 Reach shared repo or<br/>build server"]
    A11 -.-> MA11(["Contract security clauses,<br/>right to audit, vendor works<br/>only inside company-hosted<br/>VDI, segmented network"])
    A1 --> A12["🟢 A12 Steal vendor VPN<br/>creds, SSH keys, API tokens"]
    A12 -.-> MA12(["Short-lived tokens,<br/>hardware-key MFA, IP<br/>allowlist for vendor access"])
    A1 --> A13["🟡 A13 Compromise vendor<br/>CI/CD pipeline"]
    A13 -.-> MA13(["Build on company-owned<br/>ephemeral runners, vendor<br/>only pushes reviewed code"])
    A1 --> A14["🟡 A14 Malware on vendor<br/>laptop, or stolen device"]
    A14 -.-> MA14(["Company-managed devices or<br/>VDI, EDR required, no local<br/>source copies"])
    A1 --> A15["A15 Exploit weak vendor<br/>hygiene: unpatched VPN, no<br/>MFA"]

    A2 --> A21["🟢 A21 Dependency confusion<br/>or typosquatted package"]
    A21 -.-> MA21(["Private registry with pinned<br/>namespaces, lockfiles with<br/>hashes"])
    A2 --> A22["🔴 A22 Hijack upstream <br/>open-source maintainer account"]
    A22 -.-> MA22(["Cannot prevent. Pin<br/>versions, delay upgrades,<br/>monitor advisories, keep<br/>SBOM to find affected builds<br/>fast"])
    A2 --> A23["🟡 A23 Trojanised IDE plugin,<br/>compiler or build tool"]
    A23 -.-> MA23(["Plugin allowlist, pinned<br/>versions, checksum<br/>verification, still trusts<br/>upstream publisher"])
    A2 --> A24["A24 Poisoned container base<br/>image"]

    A3 --> A31["🟢 A31 Hard-coded secrets<br/>found in vendor repo"]
    A31 -.-> MA31(["Secret scanning in <br/>pre-commit and CI, central<br/>vault, rotate on detection"])
    A3 --> A32["🟢 A32 Over-privileged vendor<br/>accounts on company GitHub,<br/>cloud, Jira"]
    A32 -.-> MA32(["Least privilege, SSO with<br/>MFA, just-in-time access<br/>that expires"])
    A3 --> A33{{"🟢 A3.3 Tamper with delivered<br/>code (AND)"}}
    A33 --> A331["A331 Compromise artifact<br/>registry or code-signing key"]
    A33 --> A332["A332 Company accepts vendor<br/>drop with no review or SBOM<br/>check"]
    A33 -.-> MA33(["Signed artifacts, build<br/>provenance (SLSA), mandatory<br/>code review, SBOM check on<br/>every vendor drop"])

    classDef plain fill:#f2f2f2,stroke:#888,color:#000;
    classDef green fill:#c8e6c9,stroke:#2e7d32,color:#000;
    classDef yellow fill:#fff3b0,stroke:#b8860b,color:#000;
    classDef red fill:#f5b7b1,stroke:#c0392b,color:#000;
    class A,A1,A2,A3,A111,A112,A113,A15,A24,A331,A332 plain;
    class A12,MA12,A21,MA21,A31,MA31,A32,MA32,A33,MA33 green;
    class A11,MA11,A13,MA13,A14,MA14,A23,MA23 yellow;
    class A22,MA22 red;
```

#### Mitigations: Branch B (Social Engineering)

```mermaid
graph LR
    B("B. Social engineering (OR)")
    B --> B1("B1. Phishing (OR)")
    B --> B2("B2. Pretexting and vishing<br/>(OR)")
    B --> B3("B3. Fake recruiter or job<br/>test (OR)")
    B --> B4("B4. Physical social<br/>engineering (OR)")
    B --> B5("B5. Business email<br/>compromise (OR)")

    B1 --> B11{{"B1.1 Spear-phish with MFA<br/>bypass (AND)"}}
    B11 --> B111["🔴 B111 OSINT on LinkedIn and<br/>GitHub to find developers"]
    B111 -.-> MB111(["Cannot remove public<br/>profiles. Limit what staff<br/>publish, assume attacker<br/>knows names and roles"])
    B11 --> B112["🔴 B112 Craft lure: fake code<br/>review or Jira link"]
    B112 -.-> MB112(["Attacker-side work, cannot<br/>be stopped. Rely on<br/>downstream controls and fast<br/>reporting"])
    B11 --> B113["🟢 B113 Adversary-in-the-middle<br/>proxy captures password<br/>and session cookie"]
    B113 -.-> MB113(["Phishing-resistant MFA<br/>(FIDO2 or passkeys), <br/>device-bound sessions"])
    B1 --> B12["🟢 B12 MFA fatigue: spam push<br/>prompts until user approves"]
    B12 -.-> MB12(["Number-matching or FIDO2<br/>keys, no plain push<br/>approvals"])
    B1 --> B13["🟢 B13 Malicious attachment<br/>or macro to dev workstation"]
    B13 -.-> MB13(["Mail sandboxing, block<br/>macros from internet,<br/>attachment detonation"])

    B2 --> B21{{"🟡 B2.1 Helpdesk reset (AND)"}}
    B21 --> B211["B211 Collect employee name,<br/>ID and manager from OSINT"]
    B21 --> B212["B212 Call IT helpdesk<br/>impersonating the developer"]
    B21 --> B213["B213 Get password reset and<br/>enrol attacker MFA device"]
    B21 -.-> MB21(["Call-back to number on file,<br/>manager approval, no MFA<br/>reset by phone alone, relies<br/>on staff following process"])
    B2 --> B22["🟡 B22 Impersonate vendor<br/>project manager to request<br/>repo access"]
    B22 -.-> MB22(["Out-of-band verification for<br/>any access request, access<br/>only via ticket"])

    B3 --> B31["🟡 B31 Fake recruiter sends<br/>coding test with malware to<br/>developer"]
    B31 -.-> MB31(["Policy to run external tests<br/>only in disposable VM,<br/>awareness training"])
    B3 --> B32["B32 Fake open-source<br/>contributor submits<br/>malicious pull request"]

    B4 --> B41["🟡 B41 Tailgate into office<br/>or vendor site"]
    B41 -.-> MB41(["Badge turnstiles, guards,<br/>visitor escorts, vendor site<br/>not under company control"])
    B4 --> B42["🟢 B42 Drop infected USB near<br/>developers"]
    B42 -.-> MB42(["Disable USB mass storage by<br/>endpoint policy"])
    B4 --> B43["B43 Evil maid: plug implant<br/>into unattended workstation"]

    B5 --> B51["🟢 B51 Spoof or take over<br/>executive mailbox"]
    B51 -.-> MB51(["SPF, DKIM, DMARC reject<br/>policy, external sender<br/>banner"])
    B5 --> B52["B52 Pressure vendor to share<br/>source archive urgently"]

    classDef plain fill:#f2f2f2,stroke:#888,color:#000;
    classDef green fill:#c8e6c9,stroke:#2e7d32,color:#000;
    classDef yellow fill:#fff3b0,stroke:#b8860b,color:#000;
    classDef red fill:#f5b7b1,stroke:#c0392b,color:#000;
    class B,B1,B2,B3,B4,B5,B11,B211,B212,B213,B32,B43,B52 plain;
    class B113,MB113,B12,MB12,B13,MB13,B42,MB42,B51,MB51 green;
    class B21,MB21,B22,MB22,B31,MB31,B41,MB41 yellow;
    class B111,MB111,B112,MB112 red;
```

#### Mitigations: Branch C (Insider)

```mermaid
graph LR
    C("C. Insider attack (OR)")
    C --> C1("C1. Malicious employee (OR)")
    C --> C2("C2. Malicious vendor staff<br/>(OR)")
    C --> C3("C3. Coerced or recruited<br/>insider (OR)")
    C --> C4("C4. Negligent insider (OR)")
    C --> C5("C5. Privileged or ex-insider<br/>(OR)")

    C1 --> C11["🟢 C11 Copy source to USB,<br/>personal cloud or private<br/>git remote"]
    C11 -.-> MC11(["DLP, USB block, CASB blocks<br/>personal cloud uploads, git<br/>push allowed only to company<br/>remotes"])
    C1 --> C12["🟢 C12 Email code to personal<br/>address"]
    C12 -.-> MC12(["Email DLP rules on source<br/>code patterns and archives"])
    C1 --> C13["🟡 C13 Plant logic bomb or<br/>kill switch to enable ransom"]
    C13 -.-> MC13(["Mandatory peer review,<br/>separation of duties,<br/>reproducible builds, only as<br/>good as the reviewers"])

    C2 --> C21["🔴 C21 Vendor developer sells<br/>copy to rival"]
    C21 -.-> MC21(["Authorised user can always<br/>read the code. Watermark<br/>builds to trace leaks, legal<br/>deterrent"])
    C2 --> C22["🟡 C22 Vendor has weaker DLP<br/>and monitoring than company"]
    C22 -.-> MC22(["Right-to-audit clause, work<br/>inside company VDI so<br/>company DLP applies"])

    C3 --> C31["🔴 C31 Rival bribes existing<br/>employee"]
    C31 -.-> MC31(["Cannot prevent. Limit<br/>access, monitor with UEBA,<br/>rotate sensitive roles"])
    C3 --> C32["🔴 C32 Blackmail employee<br/>using personal leverage"]
    C32 -.-> MC32(["Cannot prevent. Same<br/>controls, plus support<br/>channel so staff report<br/>pressure early"])
    C3 --> C33{{"🟡 C3.3 Planted employee<br/>(AND)"}}
    C33 --> C331["C331 Rival places agent via<br/>job application or vendor<br/>contract"]
    C33 --> C332["C332 Agent passes vetting<br/>and gains repo access"]
    C33 -.-> MC33(["Background checks, staged<br/>access, need-to-know on<br/>crown-jewel repos"])

    C4 --> C41["🟢 C41 Repo or storage bucket<br/>accidentally made public"]
    C41 -.-> MC41(["Org policy forbids public<br/>repos, continuous exposure<br/>scanning"])
    C4 --> C42["🟢 C42 Credentials committed<br/>to repo or pasted in public<br/>chat"]
    C42 -.-> MC42(["Secret scanning, revoke and<br/>rotate automatically"])
    C4 --> C43["🟡 C43 Source pasted into<br/>unapproved AI or online tool"]
    C43 -.-> MC43(["Approved enterprise AI with<br/>no training on data, browser<br/>DLP, policy and training"])
    C4 --> C44["🟢 C44 Lost or unencrypted<br/>laptop"]
    C44 -.-> MC44(["Full-disk encryption, remote<br/>wipe"])

    C5 --> C51["🟡 C51 Admin disables logging<br/>then dumps repo"]
    C51 -.-> MC51(["Off-box tamper-proof logs,<br/>two-person approval,<br/>privileged session recording"])
    C5 --> C52["🟢 C52 Ex-employee or <br/>ex-vendor access never revoked"]
    C52 -.-> MC52(["Automated offboarding tied<br/>to HR and contract end date,<br/>quarterly access review"])
    C5 --> C53["🟢 C53 Shared or service<br/>account abused with no<br/>attribution"]
    C53 -.-> MC53(["Named accounts only, vaulted<br/>service credentials, session<br/>recording"])

    classDef plain fill:#f2f2f2,stroke:#888,color:#000;
    classDef green fill:#c8e6c9,stroke:#2e7d32,color:#000;
    classDef yellow fill:#fff3b0,stroke:#b8860b,color:#000;
    classDef red fill:#f5b7b1,stroke:#c0392b,color:#000;
    class C,C1,C2,C3,C4,C5,C331,C332 plain;
    class C11,MC11,C12,MC12,C41,MC41,C42,MC42,C44,MC44,C52,MC52,C53,MC53 green;
    class C13,MC13,C43,MC43,C51,MC51,C22,MC22,C33,MC33 yellow;
    class C31,MC31,C32,MC32,C21,MC21 red;
```

#### Summary

| Branch | 🟢 Resolved | 🟡 Possible | 🔴 Unavoidable |
| --- | --- | --- | --- |
| A. Supply chain | 5 | 4 | 1 |
| B. Social engineering | 5 | 4 | 2 |
| C. Insider | 7 | 5 | 3 |

- Green items are mostly technical controls the company owns outright, so fix them first. They are cheap relative to the risk removed.
- Yellow items nearly all depend on the vendor or on people following process. Contracts, audits and moving vendor work into company-hosted VDI convert many of them to green.
- Red items cannot be engineered away. Plan for them with least privilege, detection (logging, UEBA), leak tracing (build watermarking) and an incident response plan that includes legal action and ransom-handling decisions.
- Even a fully green branch leaves the red ones, so the residual risk of the project is set by the red leaves.

