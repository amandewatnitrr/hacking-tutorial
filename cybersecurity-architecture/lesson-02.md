# Threat Modeling

![](../imgs/threat-model.gif)

- [Threat Modeling](#threat-modeling)
  - [Introduction to Threat Modeling](#introduction-to-threat-modeling)
  - [Threat Modeling vs Risk Assessment](#threat-modeling-vs-risk-assessment)
  - [Types of Threat Models](#types-of-threat-models)
    - [Application Threat Model](#application-threat-model)
    - [Operational Threat Model](#operational-threat-model)
    - [Data Flow Threat Model](#data-flow-threat-model)

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