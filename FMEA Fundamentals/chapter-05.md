# FMEA - Control & Detectibility

![](../imgs/40a944029f0c72fe35a0f096a2482b5d.gif)

---
- [FMEA - Control \& Detectibility](#fmea---control--detectibility)
  - [Preventive \& Detection Controls](#preventive--detection-controls)
  - [Preventive vs Detective Controls](#preventive-vs-detective-controls)
  - [Failure Detection Ranking](#failure-detection-ranking)

---

## Preventive & Detection Controls

![](../imgs/Preventive-Controls.png)

>[!IMPORTANT]
> `Preventive` Controls are put in place to prevent the failure mode from occurring. These controls can include design changes, process improvements, or quality control measures.
> <br>
> `Detective` Controls are put in place to detect the failure mode if it does occur. These controls can include testing, inspections, or monitoring systems.

  ![](../imgs/28d51a42cdac4e196f00a10946ae7197.gif)

## Preventive vs Detective Controls

<table>
    <tr>
        <th>Preventive Controls</th>
        <th>Detective Controls</th>
    </tr>
    <tr>
        <td>Preventive Controls are done before the failure cause occurs.\, to avoid it from happening in the first place.</td>
        <td>Detective Controls are done after the failure cause occurs.\, to identify and mitigate its effects.</td>
    </tr>
    <tr>
        <td>In preventive controls, we look at fixtures or design changes to prevent the failure mode from occurring. Like configuring the software to avoid certain errors.</td>
        <td>In detective controls, we look at testing, inspections, or monitoring systems to detect the failure mode if it does occur. Like logs and alerts analysis using Grafana to identify issues in real-time.</td>
    </tr>
    <tr>
        <td>Preventive controls involve shear human practice to operate the software or device, and have clear understanding of User Manual, and following the instructions to avoid failure modes.</td>
        <td>Detective controls involve monitoring and analyzing data to identify potential issues, with Monitoring methods deployed to detect failure modes and alert users or operators to take corrective actions.</td>
    </tr>
</table>

## Failure Detection Ranking

>[!IMPORTANT]
> `Failure Detection Ranking` is a measure of probabitlity that the detection controls set to monitor the failure mode will either discover the failure mode or the cause of the failure mode.

- This assesses how well the system, product, or component is able to catch and flag a defect while it is still within the production or operational process.

- Each failure mode and its associated cause are given their own separate detection rating — this individual scoring is an important input to the Risk Priority Number (RPN).

- Inspecting every single item does not guarantee that all defects will be found. Human error during inspection, or an inspection method that wasn't designed with a specific failure in mind, can still let defects slip through.

---