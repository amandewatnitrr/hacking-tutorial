# Threat Modeling

![](../imgs/threat-model.gif)

- [Threat Modeling](#threat-modeling)
  - [Introduction to Threat Modeling](#introduction-to-threat-modeling)

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