# Sprint 1 AI Deferral Checklist

Status: Draft pending PM approval
Owner: Product Manager

Do not sync this document to GitHub until the Product Manager reviews and
approves it.

## Purpose

Sprint 1 is infrastructure-only. AI is a later product system and must not become
active during Sprint 1.

This checklist defines what AI-related structure may be safely scaffolded or
documented in Sprint 1, what must be deferred, which environment variable
placeholders are allowed, and what guardrails should prevent AI prompts from
becoming callable before Reading Momentum is ready.

## Sprint 1 AI Principle

Sprint 1 may prepare for future AI work, but it must not generate AI content.

Allowed Sprint 1 AI work should be limited to:

- Documentation
- Placeholder configuration names
- Inactive type definitions
- Disabled feature flags
- Empty server-only module boundaries
- Test assertions that AI features are disabled

Sprint 1 should not include any working AI provider integration, prompt
generation, recommendation engine, review drafting, reflection generation, or
user-facing AI output.

## Allowed Sprint 1 Scaffold

The following items may be created in Sprint 1 if they help future work stay
organized and safe.

### Documentation

- Link future AI work to `docs/07_AI_Guidelines.md`.
- Document that AI should support reading, not replace it.
- Document that spoiler safety requires progress metadata before prompt
  generation.
- Document that user notes are required before review assistance can draft
  review copy.
- Document that AI recommendations are future work and should not appear in
  Sprint 1 navigation as an active feature.

### Environment Placeholders

`.env.example` may include commented placeholders only:

```text
# Future AI integration. Do not set in Sprint 1 unless PM approves AI work.
# OPENAI_API_KEY=
# AI_FEATURES_ENABLED=false
# AI_PROVIDER=openai
# AI_MODEL=
```

These placeholders should not be required for local development, CI, preview
deployments, or production Sprint 1 deployments.

### Type And Constant Placeholders

Sprint 1 may define inactive types or constants that make later work easier:

```ts
type AiFeatureName =
  | 'discussion_questions'
  | 'spoiler_safe_reflection'
  | 'review_assistance'
  | 'book_recommendations';

const AI_FEATURES_ENABLED = false;
```

Rules:

- These types must not be connected to active UI controls.
- These constants must default to disabled.
- No provider SDK should be installed only for these placeholders.
- No prompt text should be sent to an external service.

### Server Boundary Placeholder

Sprint 1 may create a server-only folder or module name for future AI work, such
as:

```text
lib/ai/
```

Allowed contents:

- `README.md` explaining that AI is deferred.
- Type-only files.
- A disabled guard function that always returns unavailable.

Not allowed:

- Active API client initialization.
- Model selection logic.
- Prompt execution.
- Streaming responses.
- Provider SDK calls.
- Route handlers that accept user prompt requests.

### Disabled Feature Flag

Sprint 1 may define a disabled flag for future AI features.

Required behavior:

- Default value is disabled.
- Missing value means disabled.
- Client code cannot enable the feature by itself.
- Production cannot accidentally enable AI through a public variable.
- Any future enablement requires PM approval and a new decision log entry.

Recommended naming:

```text
AI_FEATURES_ENABLED=false
```

Do not use `NEXT_PUBLIC_AI_FEATURES_ENABLED` in Sprint 1. AI availability should
not be a public client-controlled switch.

### Tests

Sprint 1 may add tests that prove AI remains inactive:

- App builds without `OPENAI_API_KEY`.
- No Sprint 1 page requires AI configuration.
- No `/api/ai/*` endpoint exists unless it returns a disabled response.
- AI feature flags default to disabled when unset.
- Placeholder pages do not call AI services.

## Must Defer

The following work must be deferred beyond Sprint 1 unless the PM explicitly
changes scope.

### AI Provider Integration

Defer:

- Installing OpenAI or other AI provider SDKs for runtime use.
- Creating live provider clients.
- Calling external AI APIs.
- Selecting production models.
- Setting production AI keys.
- Adding AI usage billing, quotas, or rate limits.

### AI Routes And Server Actions

Defer:

- `POST /api/ai/reflection-prompt`
- `POST /api/ai/discussion-questions`
- `POST /api/ai/review-assistance`
- `POST /api/ai/book-recommendations`
- Server actions that generate prompts
- Streaming AI responses
- Background AI jobs

Route files should not exist in Sprint 1 unless they return a hard disabled
response and are covered by tests.

### Prompt Generation

Defer:

- Reflection prompts after check-ins
- Group discussion questions
- Review drafting
- Book recommendations
- Book of the Month finalist explanations
- Prompt history storage
- Prompt feedback or rating

### AI Database Tables

Defer:

- `ai_prompts`
- `ai_prompt_runs`
- `ai_feedback`
- `recommendations`
- `recommendation_explanations`
- AI usage logs
- Token accounting tables

Sprint 1 migrations should focus on `profiles`, `groups`, and `group_members`.

### User Interface

Defer:

- AI prompt cards
- Generate buttons
- AI recommendation shelves
- Review assistant panels
- AI loading states
- AI settings controls
- Any UI copy that implies AI is currently available

Placeholder pages may mention future discussion, review, or recommendation areas,
but should not advertise AI as active.

### Product Logic Dependencies

Defer AI until the product has the required non-AI data:

- Current books
- Reading progress
- Reading logs or check-ins
- Spoiler boundary metadata
- User notes for review assistance
- Group discussion surfaces
- Visibility and spoiler controls

Without these foundations, AI prompts are likely to be generic, unsafe, or too
easy to use as reading replacements.

## Required Environment Variable Policy

Sprint 1 required environment variables should remain limited to core
infrastructure, such as:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`, server-only when needed
- `NEXT_PUBLIC_APP_URL`

Future AI placeholders may be documented but must not be required:

- `OPENAI_API_KEY`
- `AI_FEATURES_ENABLED`
- `AI_PROVIDER`
- `AI_MODEL`

Rules:

- Do not commit real AI keys.
- Do not configure production AI secrets in Sprint 1.
- Do not expose AI provider keys through `NEXT_PUBLIC_*`.
- Do not fail local builds when AI variables are missing.
- Do not add AI variables to deployment requirements until the AI sprint is
  approved.

## Guardrails Against Accidental Activation

Sprint 1 should include explicit guardrails so AI cannot become active by
mistake.

### Runtime Guard

Any future AI entrypoint should call a server-only guard before doing work.

Required disabled behavior:

```text
AI features are not available yet. Reading Momentum will add spoiler-safe AI
support in a later sprint after product and safety foundations are ready.
```

The guard should deny access when:

- `AI_FEATURES_ENABLED` is unset.
- `AI_FEATURES_ENABLED` is `false`.
- The current deployment has no PM-approved AI release flag.
- Required product data for spoiler safety is missing.

### Build Guard

The app should build successfully without AI keys.

If AI code is scaffolded later, build-time validation must treat AI variables as
optional until the PM approves active AI features.

### Route Guard

No active AI route should be registered in Sprint 1.

If a placeholder route is created for planning, it must:

- Return `404`, `403`, or a disabled response.
- Avoid reading request prompt text.
- Avoid calling any provider.
- Avoid writing prompt history.
- Have a test proving it is disabled.

### UI Guard

No Sprint 1 screen should expose a working AI control.

If future UI placeholders exist, they should:

- Avoid "Generate" buttons.
- Avoid active-looking AI controls.
- Avoid copy that suggests AI can answer questions now.
- Keep users directed toward profile, group, and reading setup foundations.

### Dependency Guard

Do not install AI runtime dependencies in Sprint 1 unless the PM approves a
specific infrastructure reason.

If installed later, provider SDKs must only be imported from server-only modules.

### Logging Guard

Do not log user reading notes, review drafts, or prompt inputs for AI in Sprint 1.

Future AI logs should be designed with privacy, spoiler safety, and retention
rules before implementation.

## Sprint 1 Acceptance Checklist

AI is correctly deferred in Sprint 1 when:

- No AI provider SDK is required at runtime.
- No active AI route, action, or job exists.
- No user-facing AI generation UI exists.
- `.env.example` includes only commented AI placeholders, if any.
- The app runs without `OPENAI_API_KEY`.
- Production deployment does not require AI secrets.
- Tests or review notes confirm AI is disabled.
- Documentation points future AI work to `docs/07_AI_Guidelines.md`.
- Sprint 1 implementation remains focused on auth, profiles, groups,
  navigation, Supabase, deployment, and testing.

## PM Approval Required Before Activation

Before any AI feature becomes active, the PM must approve:

- Feature scope and user story.
- Prompt template and refusal behavior.
- Spoiler boundary requirements.
- Required user data and fallback behavior.
- Storage policy for prompts and outputs.
- Rate limits and cost controls.
- Abuse and trust-risk review.
- Test plan.
- Environment variable rollout.
- Decision log entry.

Until approval is recorded, AI must remain documented, disabled, and non-user
facing.

## Related Documents

- `docs/07_AI_Guidelines.md`
- `docs/09_Roadmap.md`
- `docs/10_Backlog.md`
- `docs/18_Sprint_1_Plan.md`
- `docs/23_API_Backend_Boundaries.md`
- `docs/25_Technical_Architecture.md`
- `docs/26_Security_Model.md`
