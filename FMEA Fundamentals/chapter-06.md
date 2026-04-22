# FMEA - Action & Acceptable Criteria

---
- [FMEA - Action \& Acceptable Criteria](#fmea---action--acceptable-criteria)
  - [RPN (Risk Priority Number)](#rpn-risk-priority-number)
  - [Defining Acceptable Criteria](#defining-acceptable-criteria)
  - [Priortizing Actions](#priortizing-actions)
  - [Action Purpose](#action-purpose)

---

## RPN (Risk Priority Number)

![](../imgs/Step-1.png)

>[!IMPORTANT]
> FMEA uses a 3 parameter calculation to determine the risk priority number (RPN) for each failure mode, which is a measure of the overall risk associated with that failure mode. The three parameters are:
> 1. `Severity` (S): A measure of the impact of the failure mode on the system, product, or process, and its user. It is typically rated on a scale from 1 to 10, with 10 being the most severe.
> 2. `Occurrence` (O): A measure of the likelihood that the failure mode will occur. It is typically rated on a scale from 1 to 10, with 10 being the most likely to occur.
> 3. `Detection` (D): A measure of the likelihood that the failure mode will be detected before it causes harm. It is typically rated on a scale from 1 to 10, with 10 being the least likely to be detected.
> The RPN is calculated by multiplying these three parameters together: RPN = S x O x D
> The RPN is used to prioritize failure modes for corrective action, with higher RPNs indicating higher risk and a greater need for mitigation.

- The RPN is a critical factor in determining the action plan for each failure mode, as it helps organizations prioritize their efforts and resources to address the most critical issues first. By focusing on failure modes with high RPNs, organizations can effectively reduce the overall risk associated with their products, processes, or systems, and improve safety, reliability, and customer satisfaction.

- Example of a Risk Matrix:

    ![](../imgs/Risk-Matrix.png)

>[!WARNING]
> DONOT RELY SOLELY ON RPN FOR PRIORITIZATION.
> RPN is a good indicator of risk, but it needs to be based on Severity, and Probability of Occurrance of Failure Mode & Failure Mode Cause.

## Defining Acceptable Criteria

- There are various methods of defining acceptable criteria:

  - Risk Matrices
  - RPN Thresholds

>[!NOTE]
>Donot rely on RPN Thresolds for Acceptable Criteria, as let's say certain things below a certain line is acceptable but we as humans try to push these limits, and that can lead to a lot of issues.

>[!IMPORTANT]
> Failure modes involving safety or security must be trated seprately as you might be dealing with some sensitive information or potentially life threatening situations, and that is a whole different ball game. In such cases, such failure modes need seprate handling, and they should be treated with the highest priority, and should have a higher priority to whatever is on the Risk Matrix, and RPN Thresholds. Because, safety and security should always be the top priority, and should not be compromised for any reason. It's important to have a clear understanding of the potential risks associated with safety and security failure modes, and to implement appropriate measures to mitigate those risks effectively.

## Priortizing Actions

- Never, ever prioritize actions based on RPN alone. Always look at `S * O`.
- Look for easy ways to fix the design, process, or system to reduce the severity of the failure mode, and that will have a huge impact on the RPN.
- Find causes that can be easily mitigated, with pre-exisitng easy to follow methods.
- Understand the Failure Modes effect on the Business Model and the User Experience, and prioritize actions based on that.

## Action Purpose

- The purpose of the action plan is to mitigate the identified failure modes by implementing corrective actions to reduce the risk of failure. This should result in a lower RPN for the Failure Mode Cause of the one we are dealing with.

- They must be properly audited and maintained with follow up from the team to ensure that the corrective actions are effective and that the risks have been mitigated.

- FMEA is used to analyze, identify and mark issues not correct them. The Actions are outside the scope of the FMEA, and need to be done separately. These actions performed must be validated and verified with legit evidence to ensure that they are effective in mitigating the identified failure modes and reducing the associated risks.

- Changes to action plan in the future should be done with proper change providing a logical rationale for the change, and should be properly documented and communicated to all relevant stakeholders to ensure that everyone is aware of the changes and their implications. This helps maintain the integrity of the FMEA process and ensures that the action plan remains effective in mitigating risks and improving safety, reliability, and customer satisfaction.

- Actions must be prioritized based on feasible timeline because not everything can be atmost priority, and we need to be realistic about the resources and time available to implement corrective actions.