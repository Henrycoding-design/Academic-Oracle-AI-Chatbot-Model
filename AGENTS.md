# 🤖 Academic Oracle Agent Orchestration & Development Guide

This document defines the architecture, orchestration strategy, security model, and development standards for all AI agents within **Academic Oracle**.

All contributors should follow these guidelines when creating, modifying, or maintaining prompts, orchestration logic, or agent behaviors.

---

# 🧭 Design Philosophy

Academic Oracle is designed around **learning**, not answer generation.

Unlike conventional AI assistants that optimize for immediate responses, Academic Oracle intentionally introduces **pedagogical friction** to improve long-term understanding through active recall, structured reasoning, and exam-oriented thinking.

Agents should prioritize helping users **develop reasoning skills** rather than simply providing final answers.

---

# 🎯 Interaction Principles

## Query-First Priority

Agents must always answer or address the user's immediate learning request before requesting additional profile information such as:

* Academic level
* Learning preferences
* Personal study profile
* Exam goals

Profile collection must never block the primary interaction.

---

## Socratic Guidance

Whenever appropriate, agents should prefer:

* Progressive hinting
* Guided reasoning
* Step-by-step discovery
* Active recall techniques

Instead of:

* Immediate answer dumping
* Full code generation without explanation
* Complete solution disclosure when educational guidance is more appropriate

The objective is to maximize understanding rather than minimize response length.

---

# 🧮 Mathematical Rendering Rules

Academic Oracle renders mathematical expressions using KaTeX within a React 19 frontend.

To ensure consistent rendering across providers, serialization layers, and client-side parsing, **raw `$` and `$$` delimiters are strictly prohibited.**

## Required Delimiters

### Inline Math

Use:

```text
\\\\(
...
\\\\)
```

Never use:

```text
$
```

---

### Block Math

Use:

```text
\\\\[
...
\\\\]
```

Never use:

```text
$$
```

---

## Why Four Backslashes?

Prompt text passes through multiple serialization layers before reaching the language model.

Developer Prompt
→ Provider Serialization
→ Client Parsing
→ Model Input

Using:

```text
\\\\(
```

ensures the model ultimately receives:

```text
\\(
```

which is the required escaped delimiter for reliable KaTeX rendering.

---

# 🏗 Intelligence Infrastructure

Academic Oracle operates using a **Gemini-first orchestration architecture** hosted on **Supabase Edge Functions**. The client application in [src/App.tsx](src/App.tsx) communicates with the secure edge gateways (such as `supabase/functions/call-ai-response`) to execute requests.

Requests are dynamically routed according to:

* User intent
* Required reasoning depth
* Latency constraints
* Token budget
* Output schema requirements

---

# ⚙ Model Capability Tiers

Academic Oracle uses abstract Gemini capability flags rather than hard-coding provider model names throughout the application. This keeps routing logic stable while the backend and shared model map resolve each flag to the current Gemini target.

Default model routing is defined in GEMINI_MODEL_MAP in [src/services/models.ts](src/services/models.ts). Runtime routing may be modified by the client orchestration layer based on validation, telemetry, and failure recovery:

| Capability | Primary Model | Typical Use Cases | Characteristics |
|---|---|---|---|
| **swift** | `Gemini 3.6 Flash` | Primary Standard chat, agentic race, Blind Checklist racing | Fast high-capability default |
| **core** | `Gemini 3 Flash` | General reasoning, balanced race, agentic race | Strong reasoning and reliable race pairing |
| **lite** | `Gemini 3.5 Flash Lite` | Fast and balanced race paths, exam fallbacks | Efficient general-purpose routing |
| **mini** | `Gemini 3.1 Lite` | Lightweight guard, fallback, query, and chat support | Small reliable utility tier |
| **nano** | `Gemini 2.5 Lite` | Intent classification and search-query generation | Lowest-overhead classification tier |
| **pro** | `Gemini 2.5 Flash` | Structured quiz, Core Test extraction, grading, validation-heavy work | Schema-oriented fallback and structured output tier |
| **deep** | `Gemini 3.5 Flash` | Hard proofs, complex derivations, advanced scientific reasoning, advanced algorithms | Dedicated deep-reasoning chat tier |

---

# ⚙ Execution Modes

Academic Oracle performs intent and depth classification on the client before dispatching chat requests. Based on estimated reasoning complexity, latency requirements, rush-hour conditions, tailoring settings, and historical reliability, the client selects between Standard, Race, and Deep execution.

* **Standard Mode**: Sequential Gemini fallback chain using `swift -> core -> lite -> mini -> pro`.
* **Race Mode**: Parallel validated racing selected for short prompts, rush hours, tailoring, or failure-telemetry escalation.
* **Deep Mode**: Advanced-depth chat path using `deep` (`Gemini 3.5 Flash`) for hard, complex reasoning. If Deep fails, the request falls back to Standard Mode.
* **OpenRouter emergency route**: Last-resort fallback after Gemini routes fail or time out.

---

# 🔄 Client Orchestration & Resiliency

Academic Oracle follows a **Client-Orchestrated Validation Pipeline** implemented across [src/App.tsx](src/App.tsx) and [src/services/geminiService.ts](src/services/geminiService.ts).

The frontend is responsible for:
* Request classification via [classifyIntent](src/services/chatIntentClassifier.ts)
* Selection of routing strategy (Standard, Race, or Deep Mode)
* Session telemetry tracking of model health via [src/services/modelRoutingMemory.ts](src/services/modelRoutingMemory.ts), including chat and selected non-chat callers where possible
* Parsing, validation, and normalization of model outputs
* Executing provider-level and model-level fallbacks

```text
                     User Request
                          │
                          ▼
             Client Prompt Classification
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
     Standard Mode    Race Mode       Deep Mode
    (Fallback Chain) (Parallel Race)  (Advanced Reasoning)
          │               │               │
          ▼               ▼               ▼
    Iterate Chain    First valid      Try deep, 
   (swift->core       response         fallback
   ->lite->mini         wins           Standard
   ->pro)                                 
          │              │               |
          │              │               │
          └──────────────┴───────────────┘
                          │
                          ▼
              Supabase Edge Function(s)
                          │
                          ▼
                  Model Response(s)
                          │
                          ▼
             Client Response Validation
                          │
              ┌───────────┴───────────┐
              │                       │
          Valid Response        Invalid Response
              │                       │
              ▼                       ▼
       Return to User        Record Failure Telemetry
                             Skip Model if Threshold met
                                      │
                                      ▼
                            Escalate Routing Strategy
                            (Next Model / Race / Deep / OpenRouter)
```

*Note*: Client orchestration determines *how* requests are executed (routing, racing, validation, failover). *Supabase Edge Functions are intentionally stateless* and serve as secure gateways between the client and upstream AI providers.

## 🏎️ Race Mode Strategy

Race Mode evaluates multiple models concurrently using the [raceModels](src/services/raceModels.ts) orchestrator in [src/services/geminiService.ts](src/services/geminiService.ts). The first model to resolve with valid structural content wins, reducing latency during network variance and provider load.

### Race Mode Triggers
Race mode is forced if any of the following conditions are met:
1. **Short Prompt Heuristics**: Very short prompts (< 3 words) bypass intent classification and directly race with `fast` intent. Short prompts (< 8 words) bypass to race with `balance` intent.
2. **Failure Telemetry Escalation**: When sessionStorage telemetry indicates at least two standard models have exceeded failure thresholds (`shouldForceRaceFromRoutingMemory()`).
3. **UTC Rush Hours**: During periods of high traffic defined in [src/services/rushHours.ts](src/services/rushHours.ts) (between 12:30 UTC and 16:30 UTC).
4. **User Profile Tailoring**: Configured in local settings via `academic-oracle-tailoring = "always"`.

### Intent Racing Matrix
When Race Mode is executed, models are raced according to the classified intent:

* **agentic**: Races `swift` (`Gemini 3.6 Flash`) and `core` (`Gemini 3 Flash`).
* **fast**: Races `lite` (`Gemini 3.5 Flash Lite`) and `mini` (`Gemini 3.1 Lite`).
* **balance**: Races `lite` (`Gemini 3.5 Flash Lite`) and `core` (`Gemini 3 Flash`).

If all raced models fail or a race timeout occurs, the orchestrator triggers a fallback to OpenRouter free (`openrouter/free`) via [runOpenRouterFallback](src/services/geminiService.ts).

---

## 🧠 Deep Mode Strategy

Deep Mode is selected when [classifyDeepIntent](src/services/deepIntentClassification.ts) detects hard academic reasoning, such as formal proofs, advanced derivations, complex scientific theory, or advanced algorithms. Deep Mode uses `deep` (`Gemini 3.5 Flash`) with lower temperature for rigorous reasoning. If the deep call fails, [sendMessageToBotDeep](src/services/geminiService.ts) records the failure telemetry and falls back to Standard Mode.

---

## 📈 Standard Mode Routing & Telemetry

When Race Mode is not triggered, the client uses a sequential failover strategy with session-level failure tracking:

1. **Sequential Chain**: Requests attempt models in order: `swift` -> `core` -> `lite` -> `mini` -> `pro` as defined in `MODEL_FALLBACK_CHAIN`.
2. **Telemetry Filter**: Before invoking any model, the system queries [shouldSkipStandardModel](src/services/modelRoutingMemory.ts). If the model has exceeded session failure limits, it is skipped.
3. **Failover Execution**: If a model fails (rate limited, server unavailable, bad formatting, or network error), the system records the failure type via `recordStandardModelFailure`, triggers a randomized back-off delay (200ms - 500ms) to avoid thundering herds, and immediately proceeds to the next model in the fallback chain.
4. **Emergency Provider Fallback**: If the fallback chain is exhausted, the orchestrator directs the request to OpenRouter free (`openrouter/free`).

### Telemetry Skip Thresholds
The client tracks model errors in sessionStorage. The thresholds for skipping a model are defined in [src/services/modelRoutingMemory.ts](src/services/modelRoutingMemory.ts):

| Failure Type | Threshold | Description |
|---|---|---|
| `unretriable` | 1 | Critical configuration errors or hard api rejections |
| `rate_limited` | 2 | API HTTP 429 response |
| `unavailable` | 2 | API HTTP 503 response or network timeout |
| `wrong_format` | 2 | JSON validation or KaTeX syntax schema failures |
| `retriable` | 3 | Soft temporary network or connection issues |

---

# 🛡 Prompt Security & Search Isolation

All prompts are filtered through a client-side validation pipeline to prevent jailbreaks, injection attacks, and abuse before querying external providers:

1. **Client-Side Guard (Static Heuristics)**:
   - Uses [analyzePrompt](src/services/promptGuard.ts) to run regex scans on the prompt in the user's localized language.
   - Evaluates a `jailbreakScore`. If the score is 4 or higher, the request is immediately blocked, and a localized jailbreak message is returned.
2. **Remote Guard (LLM Intent Analysis)**:
   - Queries [runCronPromptGuard](src/services/geminiService.ts) running on the `mini` model using `CRON_GUARD_PROMPT` to analyze prompt safety and web search intent.
3. **Jailbreak Execution Branching**:
   - If either the client-side or remote guard flags a jailbreak, the query is blocked, the conversation is isolated, and web search is disabled.
4. **Web Search Routing**:
   - Approved queries requiring real-time context verify session quota restrictions using `isWebSearchLimitReached()`.
   - If quota is available, the search query is generated using [generateSearchQueries](src/services/geminiService.ts) (prioritizing the `nano` model and falling back to `mini` or raw text) and sent to Supabase Edge Function (`supabase/functions/tavily-search`).
   - Search outages or rate limits are captured gracefully by setting `webSearchFailed = true` without disrupting user conversation.

---

# 🧪 Local TypeScript Verification

For temporary `.ts` files, use the project ESM loader explicitly:

```bash
node --loader ts-node/esm filepath
```

Replace `filepath` with the temporary file path. This avoids the common terminal failure where Node tries to execute TypeScript directly without the ESM loader.

---

# ✅ Developer Checklist

Before merging any prompt, orchestration change, or new domain agent, verify the following:

* [ ] Inline mathematics use `\\\\(` and `\\\\)`.
* [ ] Display mathematics use `\\\\[` and `\\\\]`.
* [ ] Raw `$` and `$$` delimiters are never used.
* [ ] The agent answers the user's immediate request before requesting profile information.
* [ ] The orchestration targets the appropriate execution mode.
* [ ] New Gemini usage resolves through valid capability flags (`swift`, `core`, `lite`, `mini`, `nano`, `pro`, `deep`) rather than ad hoc model strings.
* [ ] Telemetry tracking updates are registered in [src/services/modelRoutingMemory.ts](src/services/modelRoutingMemory.ts) if new model profiles are added.
* [ ] Provider fallbacks support Standard, Race, and Deep modes, terminating at the OpenRouter emergency route when required.
* [ ] Structured outputs conform to the expected Markdown or JSON schemas.
* [ ] UI components receive only validated structured data.
* [ ] Prompt changes preserve Academic Oracle's pedagogical-first philosophy.

---

# 📌 Guiding Principle

Every agent should help users become **better learners**, not merely produce answers.

When multiple valid approaches exist, prefer the one that encourages understanding, reasoning, and long-term knowledge retention over the one that simply minimizes effort.
