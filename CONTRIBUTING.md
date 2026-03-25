# Contribution Guide

Thank you for contributing to Academic Oracle.

This project is built around a simple goal: help people learn through reasoning, feedback, and progressive guidance instead of answer dumping. Contributions that protect that experience are especially valuable.

## Before You Start

- Read [README.md](README.md) for the product vision and local setup.
- Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before participating.
- Check open issues or discussions before starting large changes.
- If your change affects learning flow, prompting, routing, or security, describe the expected behavior clearly before opening a PR.

## Ways To Contribute

- Fix bugs
- Improve UI or accessibility
- Improve documentation
- Refine learning flow and educational UX
- Improve Supabase Edge Function reliability
- Add tests or verification steps
- Report reproducible issues with clear steps

## Development Setup

### Prerequisites

- Node.js 18 or newer
- A Supabase project for backend functions and auth

### Install

```bash
npm install
```

### Environment Variables

Create a local environment file with the values described in the README:

```bash
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_JIGSAWSTACK_KEY=YOUR_JIGSAWSTACK_API_KEY
```

Important:

- Do not commit secrets.
- Do not reintroduce direct client-side AI provider keys.
- AI provider keys should remain in the Supabase backend flow.

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

## Project Areas

Frontend app:

- `src/` contains the React + TypeScript application
- `src/components/` contains reusable UI pieces
- `src/pages/` contains route-level experiences and docs pages
- `src/services/` contains orchestration, AI, security, and helper logic

Backend and infrastructure:

- `supabase/functions/` contains Edge Functions
- `supabase/config.toml` contains Supabase local configuration

Static assets:

- `public/` contains public assets and metadata files

## Contribution Standards

### Product Principles

Please preserve the core behavior of Academic Oracle:

- Prefer guided learning over instant answers
- Reduce friction without reducing rigor
- Keep the interface calm, readable, and responsive
- Favor secure backend orchestration over exposed client logic

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

For Supabase and AI-related work:

- Never expose secret keys in the client
- Validate and sanitize inputs where appropriate
- Keep rate-limiting and abuse-prevention logic intact
- Document any new environment variables or deployment steps

## Suggested Workflow

1. Fork the repository and create a branch.
2. Make focused changes with clear commit messages.
3. Run the app locally and verify the affected flows.
4. Update documentation when behavior or setup changes.
5. Open a pull request with a clear summary.

## Pull Request Checklist

Before opening a PR, please confirm:

- The change has a clear purpose
- The app runs locally
- `npm run build` completes successfully
- Related docs were updated if needed
- No secrets or local credentials were committed
- UI changes were checked on more than one screen size
- Supabase function changes include any required setup notes

## Testing And Verification

This repository currently exposes basic app scripts and does not yet define a dedicated automated test script in `package.json`.

Until a fuller test suite is added, please include manual verification notes in your PR, such as:

- What you changed
- What pages or flows you tested
- Any environment assumptions
- Screenshots or short recordings for UI changes when useful

If you add automated tests, keep them scoped, maintainable, and documented.

## Commit And PR Guidance

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

## Documentation Contributions

Documentation improvements are welcome, especially when they:

- Clarify setup steps
- Explain architecture decisions
- Improve onboarding for new contributors
- Reduce ambiguity around Edge Functions, routing, or environment configuration

## Recognition

Substantial contributions may be recognized in [AUTHORS.md](AUTHORS.md) with contributor consent.

## Questions Or Concerns

For conduct-related concerns, use the contact listed in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

For project-related changes, open an issue or pull request with enough context for review.
