# Contribution Guide

Thank you for your interest in contributing to **Universal Academic Oracle**.

This project is built around a simple goal: help people learn through reasoning,
feedback, and progressive guidance instead of answer dumping.

Contributions that improve clarity, rigor, usability, and learning quality are
especially valuable.

---

## Before You Start

Before contributing, please review:

- [README.md](README.md) for the product vision and local setup
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before participating
- Open issues or discussions before starting large or structural changes

If your change affects **learning flow, prompting, orchestration, routing, security,
or educational behavior**, please describe the expected impact clearly before opening
a pull request.

---

## Ways To Contribute

Contributions are welcome in areas such as:

- Bug fixes
- UI and accessibility improvements
- Documentation improvements
- Learning flow and educational UX refinement
- Reliability improvements in public-facing integration layers
- Tests, verification steps, and reproducibility improvements
- Clear and reproducible issue reports

---

## Development Setup

### Prerequisites

- Node.js 18 or newer
- A Supabase project for supported public-facing integrations and auth

### Install

```bash
npm install
```

### Environment Variables

Create a local environment file using the public values described in the README:

```bash
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_JIGSAWSTACK_KEY=YOUR_JIGSAWSTACK_API_KEY
```

### Important Notes

- Do not commit secrets
- Do not reintroduce direct client-side AI provider keys
- Do not expose protected backend logic or deployment-sensitive configuration
- Some production backend infrastructure and orchestration components are intentionally
  excluded from this public repository

### Run Locally

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

---

## Repository Structure

### Frontend App

- `src/` contains the React + TypeScript application
- `src/components/` contains reusable UI and view logic
- `src/pages/` contains route-level or document-style experiences where applicable
- `src/services/` contains service integrations, orchestration-related logic, and helpers

### Backend and Infrastructure

Some backend and infrastructure components are intentionally not included in the
public repository.

This includes selected production-sensitive configuration, orchestration internals,
and protected implementation details.

### Static Assets

- `public/` contains public assets and metadata files

---

## Protected and Excluded Files

This repository uses a mixed-license structure.

Some files are intentionally excluded from the Apache-2.0 license and remain
All Rights Reserved.

Please review:

- [LICENSE](LICENSE)
- [NOTICE](NOTICE)
- [LICENSE_SCOPE](./REPOSITORY_LICENSE_SCOPE.md)
- [TRADEMARK_POLICY.md](TRADEMARK_POLICY.md)

### Contributor Expectation

Please do not submit pull requests that:

- copy excluded or protected files into other locations
- repackage proprietary logic for easier extraction
- remove ownership, attribution, or legal notices
- attempt to bypass project licensing or branding boundaries

---

## Contribution Standards

### Product Principles

Please preserve the core behavior of Universal Academic Oracle:

- Prefer guided learning over instant answers
- Reduce friction without reducing rigor
- Keep the interface calm, readable, and responsive
- Favor secure backend orchestration over exposed client logic
- Support reasoning, retention, and educational integrity

### Code Style

- Use TypeScript consistently
- Keep components focused and readable
- Reuse existing patterns before introducing new abstractions
- Avoid unnecessary dependencies
- Prefer small, targeted changes over broad rewrites unless discussed first

### UI Changes

For interface updates:

- Maintain responsiveness across desktop and mobile
- Avoid breaking dark/light mode behavior
- Keep accessibility in mind for contrast, keyboard use, and readable structure
- Make sure educational flow remains clear and non-disruptive

### Backend and Security Changes

For backend-adjacent and security-related work:

- Never expose secret keys in the client
- Validate and sanitize inputs where appropriate
- Preserve abuse-prevention and safety-related behavior
- Document any public-facing setup or environment changes when relevant

---

## Suggested Workflow

1. Fork the repository and create a branch
2. Make focused changes with clear commit messages
3. Run the app locally and verify the affected flows
4. Update documentation when behavior or setup changes
5. Open a pull request with a clear summary

---

## Pull Request Checklist

Before opening a PR, please confirm:

- The change has a clear purpose
- The app runs locally
- `npm run build` completes successfully
- Related documentation was updated if needed
- No secrets or local credentials were committed
- UI changes were checked on more than one screen size
- Any public-facing setup changes were documented

---

## Testing and Verification

This repository may not always include a complete automated test suite for every area.

Until broader automated coverage is added, please include manual verification notes
in your PR where relevant, such as:

- What you changed
- What pages or flows you tested
- Any environment assumptions
- Screenshots or short recordings for UI changes when useful

If you add automated tests, keep them:

- scoped
- maintainable
- documented

---

## Commit and PR Guidance

Good pull requests are:

- Small enough to review
- Clear about user impact
- Honest about tradeoffs and known limitations
- Linked to an issue when applicable

A helpful PR description usually includes:

- Summary of the change
- Why it is needed
- How it was verified
- Any follow-up work

---

## Documentation Contributions

Documentation improvements are welcome, especially when they:

- Clarify setup steps
- Explain architecture decisions
- Improve onboarding for new contributors
- Reduce ambiguity around public integration layers or repository boundaries

---

## Contribution Acceptance

Submitting a pull request does not guarantee that it will be merged.

Changes may be accepted, declined, or requested for revision based on:

- product direction
- educational quality
- maintainability
- security
- licensing boundaries
- architecture consistency

---

## Recognition

Substantial contributions may be recognized in [AUTHORS.md](AUTHORS.md)
with contributor consent.

---

## Questions or Concerns

For conduct-related concerns, use the contact listed in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

For project-related changes, open an issue or pull request with enough context for review.
