<div align="center">

  <img src="bg_img.png" alt="Academic Oracle Logo" width="100%" style="max-width: 1000px;" /> 

  <p><strong>Clarity for Every Concept. Where Knowledge Becomes Insight.</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#licensing-and-project-identity">Licensing</a> •
    <a href="#support">Support</a>
  </p>

  <p>
    <a href="#licensing-and-project-identity">
      <img src="https://img.shields.io/badge/license-Mixed%20License-orange.svg" alt="License: Mixed License" />
    </a>
    <a href="#licensing-and-project-identity">
      <img src="https://img.shields.io/badge/code-Apache--2.0%20with%20exceptions-blue.svg" alt="Code: Apache-2.0 with exceptions" />
    </a>
    <img src="https://img.shields.io/badge/status-deployed-brightgreen.svg" />
    <img src="https://img.shields.io/github/stars/Henrycoding-design/Academic-Oracle-AI-Chatbot-Model" />
    <img src="https://img.shields.io/github/last-commit/Henrycoding-design/Academic-Oracle-AI-Chatbot-Model" />
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000000" />
    <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" />
    <img src="https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white" />
    <img src="https://img.shields.io/badge/Google-GenAI-4285F4?logo=google&logoColor=white" />
  </p>

</div>

# Universal Academic Oracle

**Academic Oracle** is a learning-focused AI platform designed to maximize understanding, not passive consumption.

Instead of immediately giving answers, Academic Oracle follows a scientifically grounded flow:

> **Ask → Think → Hint → Attempt → Feedback → Pattern → Insight → Mastery**

The goal is not memorization — it’s *deep, durable learning*.

---

## Why Academic Oracle?

Most AI tools optimize for speed.  
Academic Oracle optimizes for **retention, intuition, and reasoning**.

### Core Learning Principles
- Active recall before answers
- Progressive hinting instead of instant solutions
- Error-correction loops
- Pattern discovery over rote explanation
- Minimal UI disruption to maintain cognitive flow

You don’t just learn faster — you learn *properly*.

---

## Features

### 🧠 Learning Engine

- Hint-based reasoning flow (Ask first, reveal progressively)
- Structured thinking prompts
- Pattern extraction instead of answer dumping
- **Follow-up suggestion system (NEW v2.3.0)**
  - Context-aware follow-up buttons appear on text selection
  - Enables deeper exploration without breaking learning flow
  - Reduces friction between curiosity → action


### 📝 Integrated Quiz Platform

- Auto-generated concept-specific quizzes
- Multi-question adaptive testing
- Mastery popups & performance feedback
- Reinforcement-based correction
- Mid-session language switching
- Unified Chat + Quiz UI system


### ⚙️ Intelligent Request Routing (UPDATED v2.3.0)

- Multi-mode execution pipeline:
  - **Standard**
  - **Fast**
  - **Balanced**
  - **Agentic**
  - **Web Search**
- Real-time system state visibility via **Loading Status Text Bar**
  - Displays current processing stage
  - Improves transparency of AI behavior
- Dynamic routing based on:
  - Query complexity
  - Latency conditions
  - System load

Academic Oracle doesn’t just respond — it **decides how to think first**.


### 🌐 Web Search Integration (NEW v2.3.0)

- JigsawStack-powered search pipeline
- Designed for:
  - Real-time knowledge retrieval
  - SPA / dynamic site parsing
- Activated only when needed (cost-efficient routing)
- Hybrid reasoning:
  - AI + live data synthesis


### 🔐 Security & Architecture (MAJOR UPDATE v2.3.0)

- **All AI API calls moved to Supabase backend**
  - No direct client exposure of sensitive keys
  - Production-grade architecture
- Secure Edge Function orchestration
- Encrypted handling of sensitive internal data
- Supabase-backed session continuity


#### 🛡️ Prompt Security Layer
- Jailbreak detection & filtering system
- Prompt sanitation before model execution
- Controlled response shaping to prevent misuse

Academic Oracle is no longer just a frontend AI tool —  
it is a **secured distributed AI system**.


### 🎨 UX & Rendering

- Robust Markdown rendering
- Math (KaTeX)
- Tables
- Code blocks
- Dark / Light mode
- Responsive design (desktop & mobile)
- **Non-blocking UI architecture**
  - Failures never crash the interface
  - Graceful degradation on errors

---

## Running Locally

### Prerequisites
- **Node.js** (v18+ recommended)


### Setup

1. Install dependencies:
```bash
npm install
```
2. Setup your Supabase project
* Create database
* Configure auth
* Deploy Edge Functions

3. Configure public environment variables:
```bash
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_JIGSAWSTACK_KEY=YOUR_JIGSAWSTACK_API_KEY
```

4. Start development server:
```bash
npm run dev
```

**Important Note**

This public repository intentionally excludes certain backend infrastructure,
deployment configuration, and protected service implementation details.

As a result, some advanced production features may not be fully reproducible
from the public repository alone.

---

## Tech Stack
* Frontend: React 19 + TypeScript
* Backend (AI Orchestration): Supabase Edge Functions
* Models:
  * Google GenAI (Gemini-3, Gemini-2.5)
  * Stepfun-3.5 (fallback / high-load routing)
* Web Search: JigsawStack API
* Auth & Database: Supabase (Postgres + OAuth)
* Build Tool: Vite 6
* Styling: Tailwind CSS
* Math Rendering: KaTeX

---

## Project Vision

Academic Oracle aims to *redefine how AI integrates into education*:
- Not as a solver.
- Not as a shortcut.

**But as a structured reasoning partner.**

The long-term goal is to build *a universal academic cognition system* that scales from secondary education to research-level inquiry.

---

## Official Repository

This is the **official upstream source repository** for **Universal Academic Oracle**.

**Canonical source:**  
https://github.com/Henrycoding-design/Academic-Oracle-AI-Chatbot-Model

**Live product:**  
https://academicoracle.onrender.com

---

## Licensing and Project Identity

This repository uses a **mixed-license structure**.

### Code License
Unless otherwise stated, the public code in this repository is licensed under the
**Apache License 2.0**.

However, selected files containing core product logic, orchestration behavior,
service intelligence, and project-defining implementation details are **excluded**
from Apache-2.0 and remain **All Rights Reserved**.

Public visibility of excluded files does **not** grant permission to copy,
redistribute, or reuse them outside the official upstream repository.

See:
- [`LICENSE`](./LICENSE)
- [`NOTICE`](./NOTICE)

### Branding and Identity
The project name, branding, visual identity, screenshots, release identity, and
related non-code brand elements are **not** granted under Apache-2.0 unless
explicitly stated otherwise.

Forks, mirrors, and derivative versions may not present themselves as the
official version of this project or imply endorsement by the original author.

See:
- [`TRADEMARK_POLICY.md`](./TRADEMARK_POLICY.md)

---

## Credits

**Universal Academic Oracle** was designed and built by **Vo Tan Binh (Henrycoding-design)**.

This project represents original work in:
- Learning-science–driven AI interaction design
- Progressive reasoning and hint-based pedagogy
- Closed-feedback AI tutoring systems
- Secure, minimal, and distraction-free educational UX

If you build on Apache-licensed portions of this project, please preserve
attribution and clearly reference the original source.

For protected files, branding, and excluded components, refer to the repository's
licensing and policy documents.

## Support

If Academic Oracle helps your learning:

* ⭐ Star the repository

* ☕ Support via [Buy Me a Coffee](https://buymeacoffee.com/votanbinh)
