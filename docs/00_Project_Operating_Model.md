# Project Operating Model

Reading Momentum uses a PM-led, specialist-supported operating model.

The Product Manager is the owner of product coherence, sprint approval, documentation approval, and GitHub synchronization. Specialist agents may work independently and in parallel, but their work is considered draft until the PM reviews, consolidates, and approves it.

## Source Of Truth

GitHub is the permanent source of truth for the project.

Rules:

- Official documentation must live in the GitHub repository.
- Local or specialist-created documents are drafts until PM approval.
- Specialist outputs must not be treated as official just because they exist in the workspace.
- Only the PM can approve documents for the next official version.
- Only the PM can push or sync official updates to GitHub.
- Every official update should preserve project consistency across vision, roadmap, backlog, decisions, and sprint plans.

## Roles

### Product Manager

The PM owns:

- Product vision
- MVP definition
- Sprint planning
- Mini-sprint planning
- Specialist coordination
- Documentation approval
- GitHub synchronization
- Decision logging
- Backlog prioritization
- Sprint transition approval
- Final readiness calls before engineering begins

The PM can:

- Approve documents for the next official version.
- Plan and start new milestone-based sprints.
- Plan and start mini-sprints.
- Coordinate specialist agents continuously.
- Keep agents working in parallel when useful.
- Monitor agent progress.
- Redirect agents when work drifts, stalls, or conflicts.
- Consolidate specialist outputs into official docs.
- Reject, revise, or defer specialist recommendations.

### Specialist Agents

Specialist agents support the PM by producing focused draft work.

Specialists may include:

- Research
- UX/UI Design
- Technical Architecture
- Database Architecture
- Backend Architecture
- AI Systems
- Scoring And Gamification
- Quality Assurance
- Security
- Marketing And Growth

Specialists can:

- Research assigned areas.
- Create draft documentation.
- Identify risks, open questions, and recommendations.
- Suggest tickets and acceptance criteria.
- Review other docs from their area of expertise.

Specialists cannot:

- Approve official documentation.
- Start an official sprint.
- Change sprint status.
- Push or sync updates to GitHub.
- Override PM decisions.
- Turn their own output into the source of truth.

## Parallel Specialist Workflow

Specialists may run in parallel when their workstreams are independent or loosely coupled.

Good parallel work examples:

- Research and UX discovery
- Database architecture and API planning
- QA risk review and scoring requirements
- Security review and deployment planning

PM responsibilities during parallel work:

- Assign each specialist a clear deliverable.
- Define the expected output file or summary format.
- Monitor progress.
- Redirect specialists when needed.
- Detect conflicts between outputs.
- Consolidate overlapping recommendations.
- Decide what becomes official.

Specialist output remains draft until PM review.

## Documentation Versions

Project documentation should use versioned official releases.

Recommended version pattern:

- `v0.1`: Initial project foundation
- `v0.2`: Sprint 0 planning package
- `v0.3`: Engineering-ready Sprint 1 package
- `v1.0`: MVP-ready product and technical specification

Version rules:

- Draft docs may change frequently.
- Official versions should be approved by the PM.
- Major decisions should be logged before an official version is published.
- Sprint transitions should create or reference an official doc version.
- GitHub should reflect the latest approved official version.

## Decision Logging

Every major product, technical, or process decision must be recorded in the decision log.

Each decision should include:

- Date
- Decision
- Reason
- Alternatives considered
- Research support or evidence status
- Future review date

Decision log requirements:

- Decisions should be logged as soon as they become official.
- Specialist recommendations should not be logged as decisions until PM approved.
- Reversed decisions should be appended as new decisions, not silently removed.
- Sprint gate decisions must be recorded.

## Milestone-Based Sprints

Reading Momentum uses milestone-based sprints instead of calendar-only sprints.

A sprint is complete when its exit criteria are satisfied, not merely when time passes.

Sprint rules:

- Each sprint must have an objective.
- Each sprint must have entry criteria.
- Each sprint must have exit criteria.
- Each sprint must have clear deliverables.
- Sprint approval is PM-owned.
- No sprint may begin officially until the PM approves the transition.

## Mini-Sprints

Mini-sprints are short, focused planning or execution cycles inside a larger sprint.

Use mini-sprints when:

- A single unresolved topic blocks progress.
- Multiple specialists need to investigate a focused question.
- A doc needs targeted revision before approval.
- A risk needs quick validation.
- A sprint transition needs final cleanup.

Mini-sprint rules:

- The PM defines the mini-sprint objective.
- The PM defines the output and owner.
- Specialists may work in parallel.
- The PM reviews and consolidates the output.
- Mini-sprint results remain draft until approved.
- Mini-sprints do not override the parent sprint's exit criteria.

Example mini-sprints:

- Spoiler protection rules
- Progress normalization rules
- Sprint 1 technical architecture
- Competitive analysis
- Security and RLS review
- MVP scope lock

## Specialist Handoffs

Every specialist handoff should be clear enough for the PM to review without reopening the entire workstream.

Handoff format:

- Deliverable created or updated
- Summary of recommendations
- Open questions
- Risks
- Decisions needed from PM
- Suggested backlog tickets, if applicable
- Source docs consulted

Handoff rules:

- Specialists should label uncertain work clearly.
- Specialists should separate facts, assumptions, and recommendations.
- Specialists should not mark work approved.
- Specialists should not sync work to GitHub.
- PM decides whether to accept, revise, reject, or defer the handoff.

## Sprint 0 Approval

Sprint 0 is the planning, research, architecture, and documentation sprint.

Sprint 0 cannot close until the PM confirms:

- Product vision is finalized.
- MVP is fully defined.
- Database architecture is approved.
- Technical architecture is approved.
- Security model is documented.
- API boundaries are documented.
- Testing strategy is documented.
- Analytics strategy is documented.
- Roadmap is created.
- Backlog is implementation-ready.
- Decision log is current.
- GitHub contains the approved official documentation.

Sprint 0 output should become the approved planning package for Sprint 1.

## Sprint 1 Transition Approval

Sprint 1 may begin only after PM approval.

Before approving Sprint 1, the PM must verify:

- Sprint 0 exit criteria are complete.
- Sprint 1 plan is documented.
- Sprint 1 tickets are implementation-ready.
- Out-of-scope systems are clearly excluded.
- GitHub is synchronized with approved docs.
- Engineering can start without unresolved product ambiguity.

Sprint 1 should focus on infrastructure, application skeleton, authentication, profiles, private group foundation, database connectivity, deployment, and development workflow.

Sprint 1 should not implement major product systems such as Reading Momentum scoring, XP, achievements, leaderboards, AI prompts, reviews, notifications, or Book of the Month.

## Official Approval States

Use these approval states in sprint and document tracking:

- Draft: Created by PM or specialist, not yet approved.
- PM Review: Ready for PM review.
- Approved For Version: Accepted into the next official documentation version.
- Official: Synced to GitHub as part of the current source of truth.
- Deferred: Useful but not part of the current version.
- Rejected: Not aligned with project direction.

## Operating Principle

Specialists create leverage. The PM creates coherence.

The project should move quickly by using agents in parallel, but it should stay consistent by requiring PM review before anything becomes official. No specialist output becomes official or gets synced to GitHub until the PM has reviewed and approved it.

