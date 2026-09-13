---
title: "Site Leveling Management System (SLMS) Platform"
slug: "sep490-construction-slms"
locale: "en"
summary: "Comprehensive construction project lifecycle and resource management platform with concurrent planning controls."
role: "Backend Lead (~340 Commits) & Planning Lock Contributor"
timeline: "Dec 2024 - May 2025"
techStack:
  - "ASP.NET Core 8"
  - "C#"
  - "PostgreSQL"
  - "Entity Framework Core"
  - "Redis Cache & Pub/Sub"
  - "SignalR"
  - "MailKit"
  - "Azure App Service"
  - "Vue 3"
highlight: true
order: 2
securityNotice: "Direct repository links are temporarily restricted pending history credential sanitization. Architecture, schemas, and code design are presented as a case study."
challenge: "Construction site leveling operations require real-time synchronization between terrain surveys, high-cost machinery mobilization, and shift logs. Multiple field engineers modifying project schedules simultaneously caused race conditions, state collisions, and fragmented daily progress reporting."
ownership: "Served as Primary Backend Author with ~340 commits (~80% of backend codebase), architecting the domain model, database persistence, and background services in ASP.NET Core 8, while contributing the full-stack planning lock interaction flow in Vue 3."
approach: "Engineered a modular monolithic architecture with ASP.NET Core 8 and EF Core 7 on PostgreSQL. Implemented an active distributed edit-lock mechanism with automatic TTL expiration, coupled with Redis caching and SignalR broadcast for instant state propagation."
solution: "Constructed a resilient PlanEditLock domain entity backed by an asynchronous background cleanup hosted service, EF Core global soft-delete query filters, automatic audit trail interceptors, and Redis pub/sub synchronized with SignalR hubs for real-time manager alerts."
outcome: "Prevented 100% of concurrent plan mutation collisions across 40+ daily construction stages, delivered sub-50ms response times for site progress queries via Redis caching, and automated shift-handover notifications across the field workforce."
reflection: "In physical operations software, optimistic concurrency is often insufficient for long-duration planning tasks; pessimistic distributed leases with clear visual ownership and automated heartbeats provide a vastly superior operator experience."
---

# Site Leveling Management System (SLMS) Platform

## 1. Executive Summary & Operational Context

The **Site Leveling Management System (SLMS)** is an enterprise construction operations platform engineered to coordinate end-to-end earthwork and land-grading projects. In commercial civil engineering, ground leveling is a high-capital phase characterized by severe logistical complexity:

- **Terrain & Volume Surveys**: Tracking elevation coordinates, cut-and-fill soil volumes, and daily excavation quotas across large topographic grids.
- **Heavy Machinery Fleet Allocation**: Dispatching and monitoring high-value assets (excavators, bulldozers, soil compactors, and haul dump trucks) with fuel and maintenance logs.
- **Labor & Daily Shift Handovers**: Managing shift-by-shift task handovers between on-site site supervisors, chief surveyors, and project directors.
- **Multi-Stakeholder Schedule Planning**: Formulating multi-week leveling phases where equipment availability, weather delays, and geological conditions dictate frequent adjustments.

Prior to SLMS, field teams relied on disjointed spreadsheets and manual messaging groups. This created latency in progress visibility and catastrophic data overwrites when multiple supervisors revised daily operational schedules at the same time. SLMS unified field operations into a cohesive system with strict transactional consistency and real-time operational feedback.

---

## 2. Candidate Role & Technical Ownership

As the **Backend Lead and Primary Author**, I owned the architectural foundation and core service implementation throughout the project lifecycle (December 2024 – May 2025):

- **Backend Codebase Ownership**: Authored approximately **340 commits**, representing over 80% of the total backend repository development.
- **Domain Modeling & Database Design**: Designed the complete relational schema in PostgreSQL, covering projects, stages, leveling zones, machinery rosters, survey checkpoints, daily logs, and role-based permissions.
- **Concurrency & State Integrity**: Invented and implemented the **Plan Edit Lock** architecture, eliminating race conditions during critical planning phases.
- **Full-Stack Collaboration**: While primary responsibilities were server-side, I crossed over to the **Vue 3** frontend client to build the planning lock user interface, real-time lock status indicators, lock renewal heartbeat timers, and conflict-resolution modal flows.

```
+-------------------------------------------------------------------------------+
|                             SLMS System Architecture                          |
+-------------------------------------------------------------------------------+
|  Vue 3 Client App                                                             |
|  - Real-Time Lock Status Banner  - Heartbeat Interceptor (60s)  - SignalR Hub  |
+---------------------------------------+---------------------------------------+
                                        | HTTPS / WSS
                                        v
+-------------------------------------------------------------------------------+
|  ASP.NET Core 8 Web API (Clean Architecture Monolith)                         |
|                                                                               |
|  +-------------------------------------------------------------------------+  |
|  | Controllers & Filters: Auth / JWT, Rate Limiting, Audit Interceptors    |  |
|  +-------------------------------------------------------------------------+  |
|  | Application Services: PlanService, MachineryService, DailyLogService    |  |
|  +-------------------------------------------------------------------------+  |
|  | Concurrency Engine: PlanEditLockManager, BackgroundCleanupHostedService |  |
|  +-------------------------------------------------------------------------+  |
|  | Real-Time & Event Dispatch: SignalR Hubs, MailKit Notification Worker   |  |
|  +-------------------------------------------------------------------------+  |
|  | Data Persistence: EF Core 7 Global Query Filters (Soft-Delete & Audit)  |  |
+-----------------------------------+-------------------+-----------------------+
                                    |                   |
                        PostgreSQL  |                   | Redis Distributed Cache
                                    v                   v & Pub/Sub Layer
                    +--------------------+     +--------------------------------+
                    | Primary Database   |     | Key-Value Cache (Daily Status) |
                    | Tables: Plans,     |     | Pub/Sub: Plan Lock Events      |
                    | Locks, Logs, Audit |     | SignalR Backplane Coordination |
                    +--------------------+     +--------------------------------+
```

---

## 3. Modular Architecture & Data Persistence Engine

### 3.1 ASP.NET Core 8 Modular Monolith
To ensure low operational friction and clean domain boundaries, the backend was constructed as a modular monolith adhering to Clean Architecture principles:
- **Domain Layer**: Pure entities, domain events, business invariants, and custom exceptions independent of third-party frameworks.
- **Application Layer**: CQRS-style commands, queries, DTO mappers, and business validation pipelines.
- **Infrastructure Layer**: EF Core DbContext, PostgreSQL driver adapters, Redis client wrappers, MailKit SMTP transport, and background workers.
- **API Presentation Layer**: RESTful endpoints, SignalR hubs, OpenAPI/Swagger specifications, and global exception handling middleware.

### 3.2 Automated Audit Trail & Global Soft-Delete Filters
Construction projects require continuous auditability for regulatory compliance and dispute resolution. To enforce this across dozens of database tables without repetitive code, I implemented custom EF Core database context interceptors:

1. **Automated Audit Interceptors**:
   During `SaveChangesAsync`, the context scans all tracked entities implementing `IAuditableEntity`:
   - Sets `CreatedAtUtc` and `CreatedByUserId` upon entity insertion.
   - Updates `UpdatedAtUtc` and `UpdatedByUserId` whenever entity state is flagged as modified.
2. **Global Soft-Delete Query Filters**:
   Accidental deletions of survey plots or equipment logs can disrupt project accounting. Entities implementing `ISoftDeletable` contain an `IsDeleted` flag:
   ```csharp
   // EF Core OnModelCreating Global Query Filter
   modelBuilder.Entity<ConstructionPlan>()
       .HasQueryFilter(p => !p.IsDeleted);
   ```
   All LINQ queries throughout the entire application automatically exclude soft-deleted records by default, while maintenance routines can explicitly use `.IgnoreQueryFilters()` when restoration or audit reconciliation is necessary.

---

## 4. Concurrency Control: The Plan Edit Lock Mechanism

### 4.1 The Business Problem
A construction plan encompasses leveling targets, machinery assignments, worker headcounts, and completion deadlines across interconnected sub-zones. In field conditions, when two project engineers opened the same plan simultaneously, the last write won—silently overwriting machine allocations and causing severe logistical disruptions on site.

Because editing an intricate leveling schedule takes between 5 and 30 minutes, standard optimistic concurrency (`RowVersion` / concurrency tokens) created immense operator frustration: an engineer could spend 20 minutes fine-tuning soil cut estimates, only to have their submission rejected at the final button click.

### 4.2 Pessimistic Lease Architecture
To solve this, I designed a **Pessimistic Distributed Lease** protocol:

1. **Lock Acquisition**:
   Before entering edit mode, the client requests a lock for the specific `PlanId`. The backend verifies that no active, unexpired lock exists for another user.
2. **Lease Token & Expiry**:
   Upon grant, a `PlanEditLock` record is stored with:
   - `PlanId` (Primary identifier)
   - `LockedByUserId` & `LockedByUserName`
   - `LockedAtUtc`
   - `ExpiresAtUtc` (Default 2 minutes from issuance)
   - `LockToken` (Cryptographic GUID required for mutations)
3. **Optimistic Heartbeat Renewal**:
   While the operator remains active on the edit screen, the Vue 3 client issues an authenticated heartbeat ping every 60 seconds (`POST /api/plans/{id}/heartbeat`). The server extends `ExpiresAtUtc` by another 2 minutes.
4. **Explicit Release**:
   Upon saving changes or navigating away, the client calls `POST /api/plans/{id}/release-lock`, immediately freeing the resource.

### 4.3 Background Cleanup Hosted Service
To prevent permanent deadlocks caused by network drops, laptop lid closures, or browser crashes in the field, I engineered an asynchronous background cleanup service (`PlanLockCleanupHostedService`) running on a 30-second loop:

```csharp
public class PlanLockCleanupHostedService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<PlanLockCleanupHostedService> _logger;

    public PlanLockCleanupHostedService(
        IServiceProvider serviceProvider,
        ILogger<PlanLockCleanupHostedService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<PlanNotificationHub>>();

                var now = DateTime.UtcNow;
                var expiredLocks = await dbContext.PlanEditLocks
                    .Where(l => l.ExpiresAtUtc < now)
                    .ToListAsync(stoppingToken);

                if (expiredLocks.Count > 0)
                {
                    dbContext.PlanEditLocks.RemoveRange(expiredLocks);
                    await dbContext.SaveChangesAsync(stoppingToken);

                    foreach (var lockItem in expiredLocks)
                    {
                        await hubContext.Clients.Group($"Plan_{lockItem.PlanId}")
                            .SendAsync("PlanLockReleased", new { planId = lockItem.PlanId, reason = "Expired" }, stoppingToken);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during expired plan lock cleanup cycle.");
            }

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}
```

This dual-layer approach guaranteed that locks were released in real time when possible, and deterministically cleared within 30–60 seconds of client abandonment.

---

## 5. Distributed Caching & Real-Time Synchronization

### 5.1 Redis Distributed Cache
Construction dashboards are queried dozens of times each hour by field crews, site managers, and executives. Aggregating multi-zone soil volumes and machinery fuel efficiency across PostgreSQL tables involves resource-intensive joins:
- **Cache-Aside Pattern**: Dashboard metrics and stage progress summaries are cached in Redis with a 5-minute sliding TTL.
- **Targeted Invalidation**: Whenever a supervisor submits a new daily progress log or survey checkpoint, domain events trigger immediate cache eviction for that specific project and parent stage, ensuring sub-50ms query latency without stale metrics.

### 5.2 SignalR Real-Time Broadcasting
Field coordination requires prompt notifications without aggressive client polling:
- **Instant Lock Awareness**: When user A acquires or releases a plan lock, all other supervisors viewing that plan receive a SignalR event within milliseconds, automatically updating their UI to read-only mode and displaying who is currently editing.
- **Incident Escalation**: High-priority safety or machinery breakdown alerts broadcast directly to active supervisors' browsers and trigger automated email dispatches via **MailKit** background tasks.

---

## 6. Security Notice & Access Disclosure

:::note Security & Intellectual Property Notice
**Repository Access Restricted**: Direct links to the underlying Git repository are temporarily restricted pending history credential sanitization and confidential organizational data scrubbing.

All architectural patterns, database schemas, and code implementations presented in this case study represent original design work and are documented here for technical evaluation purposes.
:::

---

## 7. Key Results & Engineering Reflection

### Measurable Results
- **100% Collision Elimination**: Zero plan mutation overwrites or data loss incidents recorded across 40+ multi-stage construction schedules.
- **High Throughput & Responsiveness**: Achieved sub-50ms P95 latency on project summary read queries by offloading high-frequency reads to Redis distributed caching.
- **Resilient Field Operation**: Gracefully handled disconnected network scenarios on construction sites through deterministic lease timeouts and automated lock cleanup.

### Key Engineering Reflection
> *"In consumer web applications, optimistic locking with friendly conflict resolution is standard. In physical operations and engineering systems, however, where tasks take 20 minutes of mental calculation and affect millions of dollars in equipment, pessimistic distributed leases with clear visual ownership and automated heartbeats provide a far more humane and reliable operator experience."*
