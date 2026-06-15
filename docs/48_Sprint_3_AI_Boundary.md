# Sprint 3 AI Boundary

Status: Draft pending PM approval
Owner: Product Manager

Do not sync this document to GitHub until the Product Manager reviews and
approves it.

## Purpose

Sprint 3 focuses on group activity and discussion foundation. AI remains out of
scope during this sprint.

This document confirms the AI boundary for Sprint 3 and provides
placeholder-safe language for future AI prompt areas without making AI appear
active.

## Sprint 3 Boundary Decision

AI must remain inactive in Sprint 3.

Sprint 3 may add:

- Local activity feed model
- Group feed display
- Discussion post creation
- Basic discussion post activity
- Conservative spoiler metadata

Sprint 3 must not add:

- AI-generated discussion questions
- AI-generated reflection prompts
- AI review assistance
- AI book recommendations
- Prompt history
- AI provider routes
- AI provider SDKs
- AI model configuration
- AI database tables
- AI analytics events

## Why AI Remains Out Of Scope

Sprint 3 is creating the human discussion surface. That surface needs to work
before AI can safely support it.

Reasons to defer AI:

- Discussion posts should first prove that users want to talk in the product.
- Spoiler metadata is being introduced, but full reveal workflows are not ready.
- AI prompt generation needs reliable progress boundaries.
- AI should support human discussion, not replace early group participation.
- Cost, rate limit, storage, and privacy rules are not yet approved.

## Allowed Sprint 3 Language

Sprint 3 may use language that points to human-authored discussion and future
prompt support without implying that AI is active.

Safe examples:

```text
Start a discussion
```

```text
Ask your group a question about what you have read so far.
```

```text
Add spoiler details so friends can choose when to reveal your post.
```

```text
Discussion prompts are planned for a later sprint.
```

```text
Future prompt support will respect reading progress and spoiler settings.
```

```text
For now, questions and reflections are written by readers.
```

## Language To Avoid In Sprint 3

Avoid copy that suggests AI is available or nearly active:

```text
Generate discussion questions
```

```text
Ask AI for a prompt
```

```text
Get recommendations
```

```text
Let AI summarize the chapter
```

```text
AI will help you answer this
```

```text
Auto-write your post
```

```text
Create a review from this discussion
```

## Placeholder-Safe UI Guidance

If Sprint 3 includes a placeholder for future prompts, it should be passive and
clearly deferred.

Recommended placeholder:

```text
Prompt support planned

Later, Reading Momentum may suggest spoiler-safe discussion questions based on
book progress. For Sprint 3, discussion posts are written by group members.
```

Recommended empty state:

```text
No discussions yet.

Start with a question, reaction, confusing moment, or favorite detail from what
you have already read.
```

Recommended spoiler helper:

```text
Use spoiler settings when your post discusses a specific page, chapter, or later
plot point.
```

## Future AI Prompt Principles

When AI is approved later, future prompts should:

- Ask questions instead of answering for users.
- Use the viewer's reading progress as a hard spoiler boundary.
- Avoid summaries that replace reading.
- Never write discussion posts on behalf of users.
- Never invent opinions, ratings, quotes, or reactions.
- Fall back to general prompts when progress is unclear.
- Encourage users to return to the book.

## Future AI Feature Candidates

These are candidates for a later sprint, not Sprint 3:

- Generate spoiler-safe discussion questions after a group has discussion
  surfaces.
- Suggest a reflection question after a completed check-in.
- Help a user turn their own notes into a review draft.
- Recommend books based on explicit preferences and reading history.

## Sprint 3 Acceptance Checklist

AI remains safely deferred when:

- No AI provider dependency is added.
- No `OPENAI_API_KEY` is required.
- No `/api/ai/*` route is added.
- No discussion screen has a working generate button.
- No prompt output is stored.
- No discussion post is written by AI.
- Spoiler metadata is treated as a future AI input, not an active prompt trigger.
- UI copy makes clear that discussions are human-authored in Sprint 3.

## Related Documents

- `docs/07_AI_Guidelines.md`
- `docs/33_Sprint_1_AI_Deferral_Checklist.md`
- `docs/36_AI_Boundary_Review.md`
- `docs/44_Sprint_3_Plan.md`
