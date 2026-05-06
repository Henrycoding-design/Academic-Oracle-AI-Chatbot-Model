# GEMINI.md

## 🧠 Project Overview

This is an **AI-orchestrated system** built around modular components and agent-like behavior.

* Core philosophy: **structured reasoning → controlled execution → reliable output**
* System style: **multi-component / agent-assisted workflows**, not monolithic logic
* Priorities: **clarity, determinism, scalability, performance**

---

## 🧩 Architecture Principles

* Treat complex features as **separable agents/modules** (e.g. parsing, structuring, grading)

* Each module should have:

  * a **clear responsibility**
  * **well-defined inputs/outputs**
  * no hidden side effects

* Prefer **pipeline-style flow** over tangled logic
  (input → process → validate → output)

* Avoid “god functions” — break logic into **composable units**

---

## ⚙️ Agent-Oriented Development

When implementing AI-related features:

1. **Decompose the task**

   * What are the distinct reasoning steps?
   * Can this be split into smaller “agents”?

2. **Assign responsibilities**

   * Each agent/module should do ONE thing well
     (e.g. extraction, formatting, evaluation)

3. **Control execution**

   * Avoid uncontrolled chaining
   * Use **explicit triggers / conditions** (e.g. mode = Always / Standard / Never)

4. **Optimize with orchestration**

   * Use **parallelism or racing** where beneficial
   * Prioritize **latency + reliability**, not just raw output

---

## 🏗️ Code Style & Standards

* Use clear, descriptive names (reflect intent, not implementation)
* Keep functions **small and single-purpose**
* Prefer **explicit logic over clever shortcuts**
* Maintain consistent formatting
* Comment only when logic is **non-obvious or critical**

---

## 📁 Project Structure Rules

* Do NOT create unnecessary files or abstractions
* Respect existing structure and naming conventions
* Group logic by **responsibility**, not by randomness
* Reuse existing modules before adding new ones

---

## 🔄 Development Workflow

When making changes:

1. **Analyze** existing implementation and flow
2. **Plan** changes (especially for multi-step/agent logic)
3. **Implement incrementally**

Always:

* Avoid breaking existing behavior
* Keep changes **minimal but impactful**
* Ensure new logic integrates cleanly with existing modules

---

## 🧪 Reliability & Validation

* Validate outputs at **critical boundaries**
* Handle edge cases (empty input, malformed data, race conditions)
* Prefer **deterministic behavior** over unpredictable AI responses
* Add safeguards when using parallel or racing logic

---

## 🧠 Explanation Requirement (CRITICAL)

For every non-trivial implementation, you MUST explain:

1. **What was implemented**

   * High-level description of the change

2. **Why it is designed this way**

   * Architectural reasoning (e.g. modularity, control, performance)

3. **What risks or issues it prevents**

   * Examples: race conditions, inconsistent state, hidden side effects, unstable AI outputs

4. **How it fits into the overall system**

   * Which module/agent it belongs to and how it interacts with others

Guidelines:

* Explanations should be **concise but meaningful**
* Do NOT just describe code — explain **decisions**
* Focus on **system impact**, not line-by-line narration

Purpose:

* Prevent black-box logic
* Ensure long-term maintainability
* Make reasoning auditable and debuggable

---

## 🔒 Safety Rules

* NEVER expose or hardcode secrets (API keys, tokens, passwords)
* Do NOT modify environment/config files unless explicitly required
* Do NOT introduce dependencies without justification

---

## 🚫 What to Avoid

* Over-engineering or premature abstraction
* Mixing multiple responsibilities in one module
* Uncontrolled AI calls or redundant model usage
* Silent failures or unvalidated outputs
* Generating unused or dead code

---

## 🎯 Output Expectations

* Clean, modular, production-ready code
* Structured logic aligned with agent-based design
* Clear explanation of **what + why + risk prevention**
* Predictable, maintainable system behavior
