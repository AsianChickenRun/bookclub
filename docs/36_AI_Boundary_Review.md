# AI Boundary Review

Status: Draft pending PM approval
Owner: Product Manager

Do not sync this document to GitHub until the Product Manager reviews and
approves it.

## Purpose

This review checks the current Reading Momentum implementation for AI boundary
safety. The goal is to confirm that AI features remain inactive, identify
environment or configuration risks, and list what must remain deferred until the
product is ready.

## Review Summary

AI is not active in the current app implementation.

Reviewed evidence:

- No AI provider SDK is listed in `package.json`.
- No AI route handlers were found under `src/app`.
- No `src/app/api/ai` route exists.
- No runtime references to OpenAI, AI SDKs, chat completions, responses, or
  prompt execution were found in `src`.
- App shell pages use local mock state for profiles, groups, books, and
  check-ins.
- AI references in the repository are documentation and planning references.

Current boundary status: acceptable with one environment/configuration cleanup
recommended.

## Implementation Areas Reviewed

### App Shell

Reviewed app areas:

- Home page
- Today page
- Groups page
- Books page
- Reviews placeholder page
- Settings page
- Shared placeholder component
- Local mock app state

Findings:

- The app shell does not expose AI generation controls.
- The Today page supports local check-ins and optional notes, but does not
  generate reflection prompts.
- The Groups page supports local group create/join flows, but does not generate
  discussion prompts.
- The Books page supports local current-book tracking, but does not generate
  recommendations.
- The Reviews page is explicitly marked as planned and inactive.
- No page copy promises active AI behavior.

### Runtime And Routes

Findings:

- No active AI API route exists.
- No active AI server action exists.
- No background AI job exists.
- No prompt history write path exists.
- No AI provider client is initialized.

This is the desired Sprint 1 boundary.

### Dependencies

Findings:

- `package.json` includes Next.js, React, Supabase, TypeScript, Tailwind, ESLint,
  and related tooling.
- No OpenAI, AI SDK, LangChain, Anthropic, or other model-provider package is
  installed as an application dependency.

This is safe for the current scope.

### Documentation

Findings:

- `docs/07_AI_Guidelines.md` defines approved future AI behavior and safety
  rules.
- `docs/33_Sprint_1_AI_Deferral_Checklist.md` documents that Sprint 1 AI work
  should remain inactive.
- Sprint plans and reviews consistently list AI prompts as out of scope.

This is directionally safe.

## Environment And Configuration Risks

### Risk: Active-Looking AI Placeholder

`.env.example` currently includes:

```text
OPENAI_API_KEY=
```

Risk:

- This can make AI appear closer to activation than intended.
- A future implementer could treat the key as a required Sprint 1 or Sprint 2
  variable.
- Deployment setup could accidentally include an AI secret before the PM has
  approved active AI work.

Recommended cleanup:

```text
# Future AI integration. Do not set until PM approves active AI work.
# OPENAI_API_KEY=
# AI_FEATURES_ENABLED=false
# AI_PROVIDER=openai
# AI_MODEL=
```

Acceptance expectation:

- The app must continue to build and run without `OPENAI_API_KEY`.
- AI variables must not be required in local, preview, or production
  environments until a PM-approved AI sprint.

### Risk: Future Route Placeholder Drift

No AI route exists today. That is safe.

If a placeholder route is added later, it must return a disabled response and
must not read prompt text, call a provider, or write prompt history.

Recommended disabled response:

```text
AI features are not available yet. Reading Momentum will add spoiler-safe AI
support in a later sprint after product and safety foundations are ready.
```

## Confirmed Inactive AI Features

The following features are not active:

- AI discussion question generation
- AI reflection prompt generation after check-ins
- AI review assistance
- AI book recommendations
- AI Book of the Month finalist explanations
- AI prompt history storage
- AI prompt feedback
- AI provider calls
- AI usage tracking
- Token accounting
- Streaming AI responses

## What Should Remain Deferred

Defer the following until the PM approves an AI-specific scope:

- OpenAI or other AI provider SDK installation for runtime use
- `OPENAI_API_KEY` configuration in production
- `AI_FEATURES_ENABLED=true`
- `/api/ai/*` routes
- Server actions that generate prompts
- Prompt templates wired to user data
- Reflection prompt cards
- Discussion prompt generation buttons
- Review assistant panels
- Recommendation shelves
- AI database tables
- Prompt history and output storage
- AI analytics events
- AI rate limits and cost controls
- AI abuse monitoring

## Required Preconditions Before AI Activation

AI should not become active until these non-AI foundations exist:

- Current books are persisted beyond local mock state.
- Reading progress has reliable page, chapter, percentage, or timestamp
  boundaries.
- Check-ins are stable.
- Discussion posts exist.
- Spoiler metadata exists and has display rules.
- User notes are available for review assistance.
- Privacy and retention rules are defined for prompt inputs and outputs.
- PM approves prompt templates and refusal behavior.
- Tests cover disabled, missing-progress, and spoiler-boundary cases.

## Boundary Verdict

Current verdict: AI boundary is safe enough to proceed with non-AI product work,
with one recommended environment cleanup.

Required follow-up:

- Comment or remove the active-looking `OPENAI_API_KEY=` line from
  `.env.example` until PM approval.

No GitHub sync should occur for this draft until PM approval.
