# Reading Momentum Style Guide

Status: Draft for PM review. This document is not approved until the Product Manager accepts it. Do not sync this draft to GitHub without PM approval.

## Purpose

This guide defines the first practical brand and interface direction for Reading Momentum. It should help Sprint 1 create a coherent application shell, onboarding experience, profile foundation, group foundation, empty states, and reusable components without locking the product into a finished visual identity too early.

The style should support the core product promise: help people keep reading with friends in a low-pressure, spoiler-safe way.

## Brand Direction

Reading Momentum should feel like:

- A calm reading space, not a productivity dashboard.
- A supportive friend group, not a public social network.
- A gentle habit companion, not a streak-pressure app.
- A personal bookshelf, not a formal classroom.
- A focused tool that sends users back to reading, not an app designed for endless scrolling.

Brand attributes:

- Warm
- Clear
- Encouraging
- Trustworthy
- Lightweight
- Reflective
- Private

Avoid:

- Competitive sports-style energy
- Loud gamification
- Corporate productivity styling
- Shame-based habit language
- Dense analytics dashboards
- Overly literary or academic visual cues that make casual readers feel out of place

## Product Tone

The voice should be plain, warm, and low-pressure. It should help users feel that any honest reading action counts.

### Tone Principles

- Encourage consistency over intensity.
- Treat skipping or missing a day as normal.
- Prefer short, clear sentences.
- Use human language before scoring language.
- Make group participation feel optional and comfortable.
- Be explicit about spoiler safety.
- Do not over-celebrate small actions in a way that feels fake.

### Preferred Copy Patterns

Use:

- `Check in`
- `Add a book`
- `You checked in today.`
- `A small check-in keeps your week visible.`
- `Hidden until chapter 8.`
- `Reveal spoiler`
- `No current book yet. Add what you are already reading.`
- `Create a private group`
- `Join with invite code`

Avoid:

- `You failed your streak.`
- `You are behind.`
- `Do not lose your momentum!`
- `Crush your reading goal.`
- `Beat your friends.`
- `No activity.`
- `Nothing here yet.`

### Notification Tone

Notifications should feel like useful cues, not demands.

Good:

- `Ready for a quick reading check-in?`
- `Your group discussion prompt is ready.`
- `Sam replied to your post.`
- `Weekly recap is ready when you are.`

Avoid:

- Multiple reminders in the same day by default.
- Warnings about broken streaks.
- Copy that implies guilt or obligation.
- Alerts that overstate urgency.

## Visual Brand Principles

The visual system should be quiet, readable, and slightly warm. The product can have personality through tone, spacing, icons, and small moments of encouragement, but the interface must stay practical on mobile.

### Overall Feel

- Mobile-first
- Soft but not childish
- Structured but not rigid
- Bookish without imitating paper notebooks too literally
- Social without feeling performative

### Layout Principles

- Prioritize one primary action per screen.
- Keep the Today dashboard scannable in under 10 seconds.
- Keep check-in screens focused on a single input.
- Use clear sectioning instead of heavy card stacking.
- Avoid dense nested panels on mobile.
- Keep important actions near the lower half of the screen where practical.

## Color Palette Principles

Sprint 1 should define color tokens before final brand colors are approved. The palette should have enough contrast and functional range for app states, not just a pleasing mood board.

### Direction

Use a balanced palette with:

- Warm neutral backgrounds
- Deep readable text
- One calm primary action color
- One supportive accent color
- Distinct semantic colors for success, warning, danger, and spoiler states

Avoid:

- A one-note palette dominated by a single hue.
- Heavy purple or blue-purple gradients.
- Overuse of beige, cream, tan, brown, or espresso tones.
- Dark slate dashboards as the default app feel.
- Color-only communication for progress, warnings, or spoiler states.

### Required Token Categories

Sprint 1 should create named tokens for:

- Background: app, surface, subtle surface
- Text: primary, secondary, muted, inverse
- Border: default, strong, focus
- Primary action: default, hover, active, disabled
- Secondary action: default, hover, active, disabled
- Status: success, warning, danger, info
- Spoiler: locked background, locked border, reveal action
- Progress: track, fill
- Group activity: neutral activity, milestone activity

### Accessibility Constraints

- Body text and meaningful UI text must meet WCAG AA contrast.
- Interactive states must remain visible for users with low vision.
- Focus rings must be obvious and not rely on subtle color shifts alone.
- Spoiler-hidden content must remain visually distinct in high contrast mode.

## Typography Principles

Typography should make the app easy to use in quick moments, especially on mobile.

### Direction

- Use a clean sans-serif for the main interface.
- Use one type family for Sprint 1 unless there is a strong reason to add another.
- Prioritize legibility over personality.
- Keep headings calm and restrained.
- Do not use oversized hero-style type inside app screens.
- Avoid negative letter spacing.

### Suggested Scale

Sprint 1 should define a small type scale:

- Page title
- Section title
- Card title
- Body
- Small body
- Metadata
- Button label
- Form label
- Error text

Acceptance notes:

- Text must fit inside mobile buttons and controls without clipping.
- Metadata such as timestamps and progress labels must remain readable.
- Long book titles should wrap gracefully and not push primary actions off screen.
- Form labels should remain visible; placeholders should not be the only label.

## Iconography And Imagery

Icons should clarify actions, not decorate the interface.

Use icons for:

- Navigation
- Check-in
- Add book
- Group
- Profile
- Settings
- Notifications
- Spoiler lock
- Reveal
- Reactions

Guidelines:

- Use a consistent icon library in implementation.
- Pair unfamiliar icons with text labels.
- Do not make icon-only critical actions unless accessible labels and tooltips are present.
- Avoid decorative illustration as a substitute for usable empty states.

Imagery:

- Book covers may become part of the interface when available.
- Sprint 1 should support placeholder book-cover treatment without relying on real covers.
- Profile photos are optional; initials fallback must look intentional.

## Component Strategy

Sprint 1 should create reusable interface foundations, not a large finished component library. Components should reflect the UX docs and leave room for later check-ins, discussions, scoring, and spoiler controls.

### Foundation Components

Build or plan these first:

- App shell
- Mobile bottom navigation
- Page header
- Primary button
- Secondary button
- Icon button
- Text input
- Textarea
- Select or segmented control
- Toggle
- Form field wrapper
- Empty state
- Loading state
- Error state
- Toast or inline confirmation
- Modal or bottom sheet
- Basic card or surface
- Avatar
- Badge or status pill

### Reading-Specific Components

Plan these as product primitives even if Sprint 1 only stubs them:

- Current book summary
- Progress label
- Check-in action placeholder
- Group activity preview
- Spoiler lock label
- Reaction row
- Prompt preview
- Notification preference row

### Component Rules

- Components should be mobile-first by default.
- Components should accept loading, empty, error, and disabled states where relevant.
- Reusable components should not encode feature-specific business logic.
- Product-specific components should use domain language from the UX docs.
- Avoid nested cards inside cards.
- Use stable dimensions for nav items, buttons, badges, and repeated list rows to prevent layout shift.

## Empty State Standards

Empty states should always give one useful next action.

Required pattern:

- Short heading
- One sentence of context
- Primary action
- Optional secondary action

Tone:

- Helpful
- Calm
- Specific
- Never apologetic or dead-ended

Examples:

- No book: `Add what you are already reading.`
- No group: `Private groups help friends keep reading at their own pace.`
- No feed: `Start with a quick check-in or invite a friend.`
- No notifications: `Important group updates will appear here.`

## Spoiler Safety UI

Spoiler safety is a brand trust feature, not just a functional control.

Visual requirements:

- Spoiler-locked content must be clearly different from normal content.
- Lock labels should state why content is hidden.
- Reveal actions must be intentional.
- Explicit spoilers should be hidden by default even if progress is unknown.
- Progress-locked content should default to hidden when the viewer has not added the same book.

Copy examples:

- `Hidden until chapter 8`
- `Possible spoiler`
- `Reveal spoiler`
- `You can reveal this now.`

Do not use:

- Vague warnings like `Careful!`
- Frightening or punitive language
- Automatic reveal on scroll or hover

## Accessibility Constraints

Sprint 1 should treat accessibility as part of the design system, not a later polish task.

Required:

- WCAG AA contrast for text and meaningful controls.
- Visible keyboard focus states.
- Labels for all form fields.
- Accessible names for icon buttons.
- Non-color indicators for errors, warnings, progress, and spoiler states.
- Touch targets large enough for mobile use.
- Error messages that explain what happened and how to recover.
- Loading states that do not trap the user.

Mobile usability:

- Avoid tiny inline links as primary actions.
- Keep forms short and progressive where practical.
- Preserve entered form values when users move back.
- Make destructive actions require confirmation.

## Design System Planning For Sprint 1

Sprint 1 should establish the design foundation required for authentication, onboarding, profile setup, navigation, dashboard shell, group placeholders, and settings.

### Sprint 1 Design Deliverables

Create or define:

- Design tokens for color, spacing, radius, typography, shadow, and focus.
- A mobile-first app shell pattern.
- Auth screen pattern.
- Profile setup form pattern.
- Private group create/join form pattern.
- Today dashboard shell.
- Empty state component.
- Loading and error state patterns.
- Notification/settings row pattern.
- Basic responsive layout rules.

### Sprint 1 Out Of Scope

Do not finalize:

- Full brand identity
- Logo system
- Marketing website art direction
- Advanced gamification visuals
- Leaderboard visual design
- AI prompt interface details beyond placeholders
- Full notification delivery UI
- Book of the Month visual system
- Review timeline visual system

### Design Review Checklist

Before Sprint 1 UI is considered ready for PM review:

- The app shell works on mobile first.
- Primary actions are obvious.
- Auth and profile setup copy matches the product tone.
- Empty states use the standard pattern.
- Form labels and errors are accessible.
- Focus states are visible.
- Colors meet contrast requirements.
- Placeholder pages do not look broken or abandoned.
- No screen pressures users with streak guilt or page-count comparison.
- Spoiler-related placeholders use the same language planned for later flows.

## Open Questions For PM Approval

- Should Reading Momentum use a literal book-related brand mark, or a more abstract momentum/progress mark?
- Should the first approved palette lean warmer, cooler, or neutral-balanced?
- Should Sprint 1 include a named typeface decision or use system fonts until visual identity is approved?
- Should notification settings appear under Profile, Settings, or both in the first navigation structure?
- How much personality should empty states have before user testing confirms the tone?

## Draft Status Notes

This guide is intended to help Sprint 1 move consistently while preserving PM control over official product direction. It should be reviewed alongside:

- `02_Product_Principles.md`
- `08_UI_UX.md`
- `13_UX_Flows.md`
- `18_Sprint_1_Plan.md`

Until approved, this document is a specialist draft and should not be treated as the official source of truth.
