---
title: "Enterprise Workflow Automation with AI Agents & Internal ERP"
slug: "nal-ai-automation-erp"
locale: "en"
summary: "Architected an enterprise operational platform combining a Refine/React internal ERP with an autonomous Mattermost AI agent ecosystem to streamline recruitment pipelines, corporate policy retrieval, employee feedback routing, and cross-team meeting scheduling."
role: "Full-Stack & AI Automation Engineer"
timeline: "Jun 2025 - Present"
techStack:
  - "Mattermost API"
  - "AI Agents"
  - "Refine Framework"
  - "React"
  - "Supabase"
  - "Edge Functions"
  - "PostgreSQL"
  - "TypeScript"
highlight: true
securityNotice: "Internal enterprise system under Non-Disclosure Agreement (NDA). Architecture diagrams, system interactions, and workflows are abstracted and generalized to protect proprietary business logic, operational metrics, and confidential company information."
challenge: "Rapid organizational growth introduced operational friction across fragmented tools, burdening HR and management with manual resume screening, repetitive policy queries, untracked employee feedback, and multi-stakeholder meeting scheduling conflicts."
ownership: "Led the full-stack design and implementation of the internal ERP administration client, built serverless webhook processing pipelines on Supabase Edge Functions, and architected the four autonomous Mattermost AI agents from intent routing to final workflow execution."
approach: "Decoupled conversational chat interfaces from data governance using an event-driven architecture, Supabase Row-Level Security (RLS), deterministic state machines, and structured LLM JSON schema validation to guarantee reliable, auditable operations."
solution: "Delivered a centralized Refine/React enterprise management portal integrated with four specialized Mattermost AI agents: a recruitment pipeline assistant, a corporate policy Q&A bot, an automated feedback dispatcher, and a multi-person meeting coordinator."
outcome: "Eliminated repetitive manual triage across HR and administration, cut down cross-departmental scheduling turnaround, unified internal records into a single auditable database, and enabled employees to trigger core workflows directly inside everyday chat channels."
reflection: "Autonomous enterprise agents succeed through strong structural foundations: strict data schemas, idempotent webhook consumers, clear fallback boundaries, and human-in-the-loop confirmation for consequential operational decisions."
order: 1
---

## Executive Overview

As organizations scale, administrative overhead scales super-linearly. Cross-functional teams frequently lose productive hours navigating disconnected SaaS dashboards, manually triaging candidate profiles, fielding repetitive internal policy questions, coordinating calendars across busy stakeholders, and tracking employee sentiment through ad-hoc messages.

At **NAL Vietnam**, I spearheaded the architecture and development of an integrated enterprise automation solution designed to eliminate this operational friction. The solution bridges two core pillars:

1. **A Centralized Internal ERP**: Built on the **Refine Framework**, **React**, and **TypeScript**, backed by **Supabase Edge Functions** and **PostgreSQL** with strict **Row-Level Security (RLS)**.
2. **An Autonomous AI Agent Ecosystem**: Operating natively inside **Mattermost** via interactive webhooks, command integrations, and event listeners, delivering four dedicated conversational bots that execute operations autonomously with human-in-the-loop oversight.

---

## The Operational Challenge

Prior to this initiative, internal workflows relied on disjointed spreadsheets, standalone forms, and fragmented chat conversations:

- **Recruitment Pipeline Bottlenecks**: Talent acquisition teams manually digested hundreds of resumes, copied candidate qualifications across spreadsheets, and chased technical interviewers to draft tailored evaluation criteria.
- **Administrative Support Burden**: People Operations and HR spent significant portions of their day answering recurring queries regarding company policies, medical insurance tiers, remote work guidelines, and annual leave calculations.
- **Lost Employee Signals**: Internal feedback and workplace suggestions submitted via dispersed channels lacked structured ownership, leading to delayed follow-ups and missed insights into team sentiment.
- **Scheduling Gridlock**: Arranging cross-functional interviews or architectural reviews involving 3–5 senior stakeholders required tedious back-and-forth messaging to discover overlapping availability.

The mandate was clear: consolidate business data into a single source of truth while empowering staff to invoke operations directly from their primary daily communication tool—Mattermost.

---

## Architectural Pillars

### 1. The Internal ERP: Refine + React + Supabase

To provide administrators, HR specialists, and managers with full visibility and control, we built a modern administrative web portal using the **Refine** framework with React and TypeScript.

- **Headless Architecture & Rapid CRUD**: Refine's modular data-provider abstraction allowed us to rapidly bind complex relational datasets (candidates, employees, policies, audit logs) to robust, accessible UI components with automated sorting, filtering, and pagination.
- **Serverless Compute with Supabase Edge Functions**: Heavy business logic, webhook verification, and third-party integrations run on distributed Supabase Edge Functions (Deno/TypeScript runtime), keeping the database insulated from external network spikes.
- **Zero-Trust Data Protection with PostgreSQL RLS**: Every database table enforces fine-grained Row-Level Security policies. Administrative access, hiring manager views, and general employee data access are strictly segregated at the database engine level, preventing privilege escalation.
- **Audit Logging**: Every state mutation triggered by either an AI agent or an administrative user generates an immutable audit record containing the actor ID, timestamp, prior state, and revised state.

---

## The 4 Autonomous Mattermost AI Agents

Rather than creating a monolithic chatbot, we engineered four purpose-driven agents, each scoped to a well-defined operational domain with explicit inputs, deterministic state transitions, and structured outputs.

```typescript
// Mattermost Inbound Webhook Payload & Agent Intent Routing Contract
export interface MattermostWebhookEvent {
  event_id: string;
  timestamp: number;
  channel_id: string;
  user_id: string;
  trigger_type: 'slash_command' | 'interactive_action' | 'dialog_submission';
  agent_target: 'recruitment' | 'policy' | 'feedback' | 'scheduler';
  payload: {
    command?: string;
    text?: string;
    action_id?: string;
    selected_option?: string;
    context?: Record<string, unknown>;
  };
}
```

### 1. Recruitment Assistant Bot

Designed to assist technical recruiters and hiring leads throughout the sourcing and screening lifecycle:

- **Structured Profile Extraction**: When a recruiter uploads a candidate resume to the designated hiring channel, the agent parses the unstructured text into standardized JSON records containing technical competencies, years of relevant experience, educational credentials, and key project highlights.
- **Automated Interview Rubric Generation**: Based on the specific job specification stored in the ERP, the bot generates tailored technical questions and domain evaluation rubrics, categorized by seniority level.
- **Candidate Pipeline Sync**: Recruiters can move candidates between stages (`Screening`, `Technical Interview`, `Offer`) via interactive dropdown buttons in Mattermost, instantly updating the underlying ERP records without context-switching.

### 2. Corporate Policy & Regulations Q&A Bot

A 24/7 internal concierge enabling team members to instantly locate accurate, authoritative workplace information:

- **Contextual Knowledge Retrieval**: Indexes company regulations, employee handbooks, travel expense policies, and benefits guidelines using vector embeddings and semantic search.
- **Verifiable Citations**: Every response quotes the exact section, clause, and document title from the internal policy library, eliminating ambiguity and hallucinations.
- **Graceful Escalation**: When a question involves personal exceptions, sensitive medical leaves, or ambiguous edge cases, the bot flags the limitation and offers a single-click button to route the ticket directly to an HR specialist.

### 3. Employee Feedback Dispatcher

A dedicated pipeline for collecting workplace suggestions, equipment requests, and operational feedback:

- **Structured Ingestion**: Employees invoke the bot via slash commands or direct messages, selecting categories (e.g., IT Infrastructure, Office Facilities, Work Culture, Process Improvement).
- **Sentiment & Priority Classification**: Analyzes message intent and urgency, standardizing the submission into a clean actionable ticket.
- **Automated Department Routing**: Dispatches the formatted ticket directly into the appropriate department lead channel with interactive status controls (`Acknowledge`, `In Progress`, `Resolved`), ensuring complete accountability and closing the feedback loop.

### 4. Multi-Person Automated Meeting Scheduler

Solves the "calendar Tetris" dilemma for multi-stakeholder internal and client meetings:

- **Natural Language Parsing**: Accepts conversational scheduling requests such as *"Schedule a 45-minute technical review with @lead.architect and @project.pm next Wednesday afternoon"*.
- **Availability Matrix Intersection**: Integrates with calendar APIs to evaluate availability blocks across all specified attendees, filtering out focus hours and recurring commitments.
- **Optimized Slot Proposal**: Posts interactive suggestion cards containing top candidate slots ranked by minimal disruption.
- **One-Click Dispatch**: Once the organizer confirms an option, the bot issues formal calendar invitations, creates a meeting room reservation, and announces the scheduled session in the channel.

---

## AI-Assisted Engineering & Internal Best Practices

To maintain code velocity and exceptional system reliability, our development workflow incorporated modern AI-assisted engineering practices:

- **Schema-First Prompt Engineering**: All LLM calls enforce strict JSON schema constraints. The agents reject non-conforming responses and automatically trigger self-correcting validation cycles, preventing malformed data from reaching internal APIs.
- **Idempotency & Event Deduplication**: Mattermost webhook events are validated using cryptographic signatures and checked against a Redis/PostgreSQL deduplication cache to guarantee zero double-executions on network retries.
- **Enterprise Data Governance**: Prompts and user queries are completely stripped of personally identifiable information (PII) before external inference. Enterprise systems operate under strict no-training agreements, ensuring proprietary company code and employee queries remain strictly confidential.

---

## Measurable Operational Impact

While strict confidentiality precludes publishing internal headcounts or proprietary throughput figures, the system achieved substantial qualitative improvements across the organization:

- **Streamlined Candidate Sourcing**: Technical leads receive standardized, structured candidate summaries and pre-formulated interview scorecards within minutes of resume receipt.
- **Zero-Latency HR Inquiries**: Over 75% of routine policy inquiries are resolved instantly through conversational citations, freeing People Operations to focus on talent development and employee care.
- **Elimination of Scheduling Friction**: Coordinating multi-stakeholder discussions transitioned from hours of back-and-forth manual chat alignment into a streamlined 30-second automated approval flow.
- **Unified Operational Single Source of Truth**: Data generated across distributed chat discussions now seamlessly synchronizes with the Refine ERP, providing management with clean, auditable operational records.

---

## Technical Retrospective & Lessons Learned

1. **State Machines Over Open-Ended Chat**: Early prototypes allowed open-ended conversation, but enterprise workflows demand predictability. Constraining agents to deterministic finite state machines with explicit action buttons dramatically improved user trust and error resilience.
2. **Database Constraints as Final Safeguard**: While AI filters and schema validators handle front-line checks, true stability comes from the database layer. Foreign keys, check constraints, and PostgreSQL RLS policies ensured that even anomalous agent outputs could never corrupt core records.
3. **Keep Humans in the Loop**: Autonomous agents should act as high-efficiency copilots, not unchecked decision-makers. High-impact operations—such as candidate status changes, policy exceptions, or room bookings—always require explicit human confirmation via interactive UI cards.
