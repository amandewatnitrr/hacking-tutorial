# FMEA Planning Overview

---
- [FMEA Planning Overview](#fmea-planning-overview)
  - [FBD (Functional Block Diagram)](#fbd-functional-block-diagram)
  - [P Diagram (Process Flow Diagram)](#p-diagram-process-flow-diagram)
  - [dFMEA (Design Failure Mode and Effects Analysis)](#dfmea-design-failure-mode-and-effects-analysis)
    - [Gathering Information](#gathering-information)

---

There are 3 main contexts in a FMEA:

- FBD (Functional Block Diagram)
- dFMEA (Design Failure Mode and Effects Analysis)
- P-Diagram (Process Flow Diagram)

## FBD (Functional Block Diagram)

![](../imgs/functional_block_diagram.png)

- Defines what is included in the analysis — essentially drawing a boundary around what you are studying so nothing important is left out or accidentally included.
- Lists out the key functions each part is supposed to perform, how they relate to each other, and what depends on what.
- Looks at the system from a "what is it meant to do?" perspective — to figure out which parts could fail and how that failure would ripple through the rest of the system.
- A flowchart of the product, process, or feature is a critical starting point for this step.
  - Break things down into smaller steps and sub-tasks — the more detail, the better.
  - Speak directly with the people who build, design, or use the system to get a complete picture.
  - Don't just look at the top level — dig into sub-systems and the individual components within them.

## P Diagram (Process Flow Diagram)

![](../imgs/5.jpg)

- Maps out everything that goes into and comes out of a system — including what controls it and what external factors (called "noise") can throw it off.
- Establishes a baseline for what "normal" looks like — that is, what the system is supposed to do under expected conditions — so deviations are easier to spot.
- Highlights the key variables that can be controlled, as well as the uncontrollable factors that may cause the system to behave inconsistently.

>[!NOTE]
> Based on the FBD, the P-Diagram is than created to identify the inputs, outputs, controls, and noise factors that can affect the performance of the system.<br>
> The P-Diagram helps to set the standard for failure effects, while also specifying the expected performance and reliability of the system under normal operating conditions. It also identifies the control parameters that control the performance of the system, and the noise factors that can cause variability in the system's performance.<br>
> The data after the P-Diagram is than gathered and analyzed to identify how the system/process/feature can fail, and what the effects of those failures would be. This information ensures completeness of evaluation, and numbers out the probability of those failures happening.

## dFMEA (Design Failure Mode and Effects Analysis)

![](../imgs/DFMEA-Ballpoint-Pen-Tip-All-No-Numbering.png)

- Looks for things that could go wrong while a product is still being designed — before it's built or shipped.
- Examines what would happen to the rest of the system if each of those failures actually occurred.
- Ranks the failures by risk, using three factors: how serious the impact would be (severity), how likely it is to happen (occurrence), and how easy it would be to catch (detectability).

### Gathering Information

- Failure Modes can be identified, if you collect enough data about the product/process/feature/function, and analyze it to identify potential failure modes.
- This is mainly done by:
  - External Evaluations
  - Technical Reviews
  - Service/Field Engineers
  - Customer Complaints
  - Internal Defect
  - Customer Feedback

- For the learner's reference, we have attached a sample dFMEA template here: [dFMEA Template](./IC-FMEA-Spreadsheet-12192_Template.xlsx)

---