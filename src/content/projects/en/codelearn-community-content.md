---
title: "Developer Community & Content Infrastructure (CodeLearn)"
slug: "codelearn-community-content"
locale: "en"
summary: "Full-stack microservice feature delivery for a major coding education platform, handling high-traffic discussion threads, editorial blog publishing, and recruitment profile management."
role: "Full-Stack Software Engineer Intern"
timeline: "Mar 2024 - Jan 2025"
techStack:
  - "ASP.NET Core"
  - "C#"
  - "Next.js"
  - "PostgreSQL"
  - "Redis Cache"
  - "Redis Pub/Sub"
  - "Clean Architecture"
  - "Microservices"
highlight: false
order: 3
liveUrl: "https://codelearn.io"
securityNotice: "Proprietary enterprise implementation details sanitized in compliance with organizational confidentiality guidelines."
challenge: "Scaling interactive user engagement and technical article publishing on an educational platform with hundreds of thousands of registered developers, preventing database bottlenecks on high-volume discussion feeds and keeping cache consistent across replicated API instances."
ownership: "Owned end-to-end full-stack feature delivery for 3 platform modules—Discussion Forum, Editorial Blog, and Company Recruitment CRUD—designing RESTful APIs in C# ASP.NET Core, implementing Clean Architecture domain layers, crafting Next.js user interfaces, and configuring Redis distributed caching and pub/sub cache invalidation."
approach: "Applied Clean Architecture principles to separate core domain logic from data persistence and transport concerns. Employed CQRS-style separation for read-heavy queries versus write commands, backed by Redis distributed caching for hot list queries and Redis Pub/Sub channels to synchronize multi-instance cache eviction upon content updates."
solution: "Delivered responsive nested comment discussions, markdown-rich blog authoring with SEO-friendly slug generation, and company hiring showcase modules. Integrated Redis caching with TTL fallback and pub/sub messaging across service replicas to eliminate stale data while achieving sub-millisecond query responses for trending topics."
outcome: "Accelerated discussion thread load times by over 70% under simulated traffic spikes, decoupled content publishing workflows for community managers, and established a reusable Clean Architecture template adopted across subsequent internal feature modules."
reflection: "Realized the critical importance of cache invalidation strategy in microservices. Even when business requirements pivot—such as the company recruitment feature being shelved due to shifting organizational strategy—writing maintainable, modular Clean Architecture code ensures business logic remains clean, testable, and reusable."
---

# Developer Community & Content Infrastructure (CodeLearn)

## Overview & Context

CodeLearn (developed under FPT Information System - FIS) is one of Vietnam's leading programming education and developer competition platforms, serving a community of several hundred thousand registered engineers, university students, and coding enthusiasts. 

During my 10-month software engineering internship at FIS (10 Phạm Văn Bạch, Cầu Giấy, Hanoi), I was embedded within the platform engineering squad responsible for community engagement, educational content distribution, and recruitment channels. My mandate was to architect and implement three end-to-end core modules bridging modern Next.js frontend interfaces with resilient ASP.NET Core microservices.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js Frontend Client                         │
│       (SSR / ISR Pages, Interactive Forums, Editorial Blog)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   ASP.NET Core Web API Gateway                         │
│               Clean Architecture Core Application Engine               │
├───────────────────────┬────────────────────────┬───────────────────────┤
│   Discussion Module   │   Blog / Post Module   │  Recruitment Module   │
│ (Threads, Nesting, Q&A)│ (Editorial, Publishing)│(Profiles, Showcase)*  │
└──────────┬────────────┴───────────┬────────────┴───────────┬───────────┘
           │                        │                        │
           ▼                        ▼                        ▼
┌───────────────────────────────────────┐ ┌──────────────────────────────┐
│        PostgreSQL Database            │ │  Redis Cache & Pub/Sub Mesh  │
│  (Relational persistence, ACID data)  │ │ (Query cache, sync channels) │
└───────────────────────────────────────┘ └──────────────────────────────┘
* Note: Recruitment module delivered and later shelved due to product direction.
```

---

## Core Modules Built End-to-End

### 1. Discussion Forum Module (Community Q&A & Threads)

The Discussion Forum is the primary communication hub for learners solving algorithmic challenges, debugging programming exercises, and debating software design:

- **Hierarchical Reply Threads**: Implemented recursive comment trees supporting multi-tier nested responses, allowing mentors and peers to resolve programming queries with direct code snippet references.
- **Vote & Resolution State Machine**: Built atomic upvoting/downvoting mechanisms and thread status toggles (`Open`, `Answered`, `Closed`, `Pinned`) to prioritize verified solutions for top coding problems.
- **Next.js Reactive Experience**: Integrated optimistic UI updates on the frontend to deliver instant feedback when users post replies or cast votes, backed by server synchronization.
- **Rich Content & Code Snippet Rendering**: Formatted discussion posts with syntax-highlighted code blocks, LaTeX mathematical notation, and sanitization pipelines preventing cross-site scripting (XSS).

### 2. Blog & Sharing Module (Editorial Publishing System)

The Blog module serves both internal developer advocates and community writers publishing technical tutorials, engineering retrospectives, and event announcements:

- **Editorial Workflow & Lifecycle**: Designed draft-to-publish workflows including revision states (`Draft`, `Under Review`, `Published`, `Archived`) with scheduling capabilities.
- **Slug Generation & SEO Optimization**: Implemented localized URL slug generators with collision resolution, OpenGraph metadata hooks, and canonical tagging to maximize organic search visibility.
- **Category & Tagging Taxonomies**: Enabled multi-tag taxonomy indexing and full-text search filtering across author profiles, programming languages, and topic clusters.
- **SSR/ISR Next.js Delivery**: Leveraged Next.js Incremental Static Regeneration (ISR) to render blog articles statically for blazing-fast initial load times while invalidating stale articles upon editorial updates.

### 3. Company Recruitment CRUD Module (Enterprise Showcase)

As part of the platform's vision to connect skilled coders directly with technology employers, I built the initial Company Recruitment profile system:

- **Company Profile Management**: Developed comprehensive CRUD interfaces and API endpoints allowing corporate partners to create branded profiles, showcase office culture, and highlight technology stacks.
- **Role Listing & Candidate Intent**: Structured job opportunity listings tied directly to relevant coding skills on the platform, allowing developers to demonstrate verified problem-solving track records.
- **Product Strategy Outcome**: Although the feature was fully designed, coded, and validated in staging environments, business leadership subsequently decided to shelve on-platform recruitment in favor of doubling down on enterprise coding contests and core curriculum expansion.
- **Engineering Takeaway**: This experience provided an invaluable industry lesson in agile engineering: writing modular, decoupled code ensures that when product requirements pivot, features can be safely isolated or deprecated without destabilizing the broader application.

---

## Architecture & Engineering Patterns

### Clean Architecture Backend (ASP.NET Core)

To ensure enterprise maintainability and high testability, the backend microservice was organized strictly around Clean Architecture boundaries:

1. **Domain Layer**: Contained core entity models (`DiscussionThread`, `DiscussionComment`, `BlogPost`, `CompanyProfile`), domain events, value objects, and repository interfaces without external dependencies.
2. **Application Layer**: Structured using Command Query Responsibility Segregation (CQRS) patterns with MediatR. Write commands encapsulated domain validation, while read queries bypassed heavy domain logic for optimal projection.
3. **Infrastructure Layer**: Implemented Entity Framework Core repositories against PostgreSQL, external file storage adapters, and Redis client implementations.
4. **API Presentation Layer**: Thin ASP.NET Core controllers exposing RESTful endpoints with OpenAPI/Swagger specifications, RFC 7807 problem details, and JWT-based authentication guards.

### Distributed Caching with Redis & Pub/Sub Synchronization

Because discussion feeds and popular technical blogs experience high read-to-write ratios (roughly 95% reads), database query performance was optimized using Redis:

```
[User Action: Edit Blog/Comment]
               │
               ▼
      [API Instance #1] ─── Writes DB ───► [PostgreSQL]
               │
               ├───── Invalidate Local / Redis Key
               │
               ▼
     [Redis Pub/Sub Channel] (Message: "invalidate:post:123")
        ├── Broadcast ──► [API Instance #2] (Evict in-memory / L1 cache)
        └── Broadcast ──► [API Instance #3] (Evict in-memory / L1 cache)
```

- **Query Result Caching**: Hot listing endpoints (such as `/api/v1/blogs?page=1&tag=csharp` and `/api/v1/discussions/trending`) were cached in Redis with sliding time-to-live (TTL) windows.
- **Cache Invalidation via Redis Pub/Sub**: In a multi-replica deployment, invalidating cache on one instance could leave sibling instances serving stale data. I configured Redis Pub/Sub messaging channels that broadcast entity invalidation signals across all active API instances whenever an entity was updated or deleted.
- **Cache-Aside Pattern with Stampede Protection**: Employed distributed locks (mutexes) for expensive query aggregation to prevent cache stampedes (thundering herd problem) when high-traffic cache keys expired.

---

## Key Challenges & Solutions

| Technical Challenge | Root Cause | Engineering Solution |
| :--- | :--- | :--- |
| **Deeply Nested Discussion Trees** | Recursive SQL queries causing high database CPU utilization and N+1 query patterns. | Designed path-enumeration / materialized hierarchy in PostgreSQL coupled with client-side tree reconstruction, reducing query execution time by 85%. |
| **Cache Inconsistency across Service Pods** | Independent API instances maintaining out-of-sync cached lists during concurrent user edits. | Implemented Redis Pub/Sub invalidation channels broadcasting entity mutation events across all service replicas instantly. |
| **Markdown Parsing Security** | User-generated blog articles and comments containing unsafe HTML elements or malicious scripts. | Built an automated sanitization middleware pipeline enforcing strict DOMPurify whitelist policies before saving or rendering markdown. |

---

## Outcomes & Technical Impact

- **70%+ Reduction in Discussion Latency**: Response times for trending discussion threads dropped from ~380ms under database load to under 45ms when served from Redis.
- **Independent Module Extensibility**: The Clean Architecture scaffold established for the Blog and Discussion modules was adopted as the reference implementation for subsequent team features.
- **Production Delivery**: Successfully completed full internship cycle at FIS (Mar 2024 - Jan 2025), earning recognition from senior mentors for code discipline, architectural rigor, and reliable cross-stack execution.
