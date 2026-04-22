# FMEA - Failure Modes

---
- [FMEA - Failure Modes](#fmea---failure-modes)
  - [Understading Context of Failure Modes](#understading-context-of-failure-modes)
  - [Questions to ask to help identify design failure modes](#questions-to-ask-to-help-identify-design-failure-modes)

---

![](../imgs/artwork_Failure%2520Mode%2520Effect%2520Analysis_Website-Thumbnail.webp)

## Understading Context of Failure Modes

>[!IMPORTANT]
>Failure Modes are the ways in which a product, process, or system can fail to meet its intended function or performance requirements. 

- A failure mode can show up at any point in a product's life — during design, manufacturing, or even when it's already in use. Common root causes include design oversights, production errors, material weaknesses, mistakes by people, and conditions in the surrounding environment.

- Normally, people think from cause to effect — something goes wrong, and then something bad happens as a result. In FMEA, we flip this around: we start by asking *what could fail*, and then work outward to understand the impact and trace back to why it might happen.

- So, if we start with a cause it leads to failure mode. That results in an effect.

    ```mermaid
    %%{init: {"look": "dark"}}%%
    graph LR
        C("Cause") --- FM("Failure Mode") --- E("Effect")

        style C fill:#3182ce,color:#ffffff,stroke:#2b6cb0,stroke-width:2px
        style FM fill:#e53e3e,color:#ffffff,stroke:#c53030,stroke-width:2px
        style E fill:#38a169,color:#ffffff,stroke:#2f855a,stroke-width:2px
    ```

- In FMEA, we start with the `Failure Mode` and analyze its `Effect` and `Cause`. This helps us understand the potential impact of the failure mode and identify ways to mitigate it.

    ```mermaid
    %%{init: {"look": "dark"}}%%
    graph LR
        FM("Failure Mode") --- E("Effect") --- C("Cause")

        style C fill:#3182ce,color:#ffffff,stroke:#2b6cb0,stroke-width:2px
        style FM fill:#e53e3e,color:#ffffff,stroke:#c53030,stroke-width:2px
        style E fill:#38a169,color:#ffffff,stroke:#2f855a,stroke-width:2px
    ```

- One of the most common mistakes in FMEA is mixing up the `Failure Mode` and the `Cause`. It's easy to accidentally write down a cause where a failure mode should go. Keeping the two clearly separate is essential — if they get muddled, the entire analysis loses its accuracy and usefulness.

- Let's take an example of a car. A failure mode could be "engine failure". The effect of this failure mode could be "car won't start". The cause of this failure mode could be "battery is dead". In this case, the failure mode is the "engine failure", the effect is "car won't start", and the cause is "battery is dead".

    ![](../imgs/mechanic-working-on-engine.jpg)

## Questions to ask to help identify design failure modes

- What happens if a `[process / function / system / component / dependency]` doesn't perform its intended action when it's supposed to?
- What happens if a `[process / function / system / component / dependency]` keeps running or executing when it should have stopped?
- What happens if a `[process / function / system / component / dependency]` behaves incorrectly due to something it depends on not working as expected?
- What happens if a `[process / function / system / component / dependency]` only partially completes its steps — or skips some entirely?
- What happens if a `[process / function / system / component / dependency]` produces an incorrect or unexpected output?
- What happens if the steps within a `[process / function / system / component / dependency]` happen in the wrong order?
- What happens if a `[process / function / system / component / dependency]` performs below the required standard or threshold?
- What happens if a `[process / function / system / component / dependency]` receives data or input that it wasn't designed to handle?