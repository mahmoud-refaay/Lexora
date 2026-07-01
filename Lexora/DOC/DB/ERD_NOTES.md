# ERD Notes

## Purpose

This file describes the planned entity relationships for the Lexora database before creating the visual ERD.

## Main Relationship Map

```text
Role 1 ---- * User
Role * ---- * Permission through RolePermissions

User 1 ---- * RefreshToken
User 1 ---- * AuditLog
User 1 ---- * Notification

Client 1 ---- * Case
Client 1 ---- * ClientNote
Client 1 ---- * Payment
Client 1 ---- * Document

Case 1 ---- * Hearing
Case 1 ---- * CaseNote
Case 1 ---- * Document
Case 1 ---- * Task
Case 1 ---- * Payment
Case 1 ---- * Case as appealed/parent case (litigation degrees)

User 1 ---- * Case as AssignedLawyer
User 1 ---- * Task as Assignee
User 1 ---- * Document as Uploader

Hearing 1 ---- * Task optional
Document 1 ---- * Task optional
```

## Identity Relationships

### Role to User

One role can be assigned to many users.

Each user has one main role in the first version.

Future option: support multiple roles per user using `UserRoles` table.

### Role to Permission

Many-to-many relationship through `RolePermissions`.

This supports policy-based authorization without hard-coding all access rules.

### User to RefreshToken

One user can have many refresh tokens.

This supports multiple sessions and token revocation.

### RefreshToken to RefreshToken (Self-Referencing)

A refresh token can optionally reference the new refresh token that replaced it (`ReplacedByTokenId`).

This supports token rotation and replay attack detection.

## Client Relationships

### Client to Case

One client can have many cases.

Each case must belong to one client.

This is one of the most important relationships in the system.

### Client to ClientNote

One client can have many notes.

Each note belongs to one client.

### Client to Payment

One client can have many payments.

Each payment must belong to one client.

A payment may optionally be linked to a case.

### Client to Document

One client can have many documents.

A document can be linked to a client, a case, or both.

## Case Relationships

### Case to Hearing

One case can have many hearings.

Each hearing must belong to one case.

### Case to CaseNote

One case can have many notes.

Each case note belongs to one case.

### Case to Document

One case can have many documents.

Each document may belong to a case.

### Case to Task

One case can have many tasks.

A task may be linked to a case.

### Case to Payment

One case can have many payments.

A payment may be linked to a case.

### Case to Assigned Lawyer

One user can be assigned to many cases as lawyer.

Each case can have one assigned lawyer in the first version.

Future option: support multiple lawyers per case using a `CaseLawyers` join table.

### Case to Case (Self-Referencing / Litigation Degrees)

A case can optionally reference a parent case (`ParentCaseId`).

This supports tracking the progression of a legal dispute across different court instances (Primary -> Appeal -> Supreme Court).

## Hearing Relationships

### Hearing to Task

A hearing may have related tasks.

Examples:

- Prepare documents before hearing.
- Call client before hearing.
- Submit memo after hearing.

This relationship can be optional through `Tasks.HearingId`.

## Document Relationships

### Document to Client and Case

A document should have at least one owner context:

- Client only.
- Case only.
- Client and case.

In most case-related documents, both `ClientId` and `CaseId` should be available.

### Document to Uploader

Each document should store who uploaded it.

This helps with traceability and audit requirements.

## Task Relationships

### Task to User

Each task should have an assigned user.

The assignee can be a lawyer, secretary, accountant, or admin depending on the task type.

### Task to Business Context

A task can optionally be linked to:

- Client.
- Case.
- Hearing.
- Document.

Not every task needs all links. Example: `Call client` may only need `ClientId`, while `Prepare memo for next hearing` may need `CaseId` and `HearingId`.

## Payment Relationships

### Payment to Client

Each payment must belong to a client.

### Payment to Case

Each payment can optionally belong to a case.

This supports both general client payments and case-specific payments.

## Notification Relationships

### Notification to User

Each notification belongs to one user.

### Notification to Related Entity

Notifications can reference another entity using:

- RelatedEntityName.
- RelatedEntityId.

This keeps notifications flexible without adding many nullable foreign keys.

## Audit Relationships

### AuditLog to User

Each audit log should store the user who performed the action when available.

System actions can have null user if needed.

### AuditLog to Entity

Audit logs can reference any entity using:

- EntityName.
- EntityId.

This supports logging across all modules.

## Future Relationship Options

Possible future tables:

- UserRoles for multiple roles per user.
- CaseLawyers for multiple lawyers per case.
- DocumentVersions for file versioning.
- Invoices for billing and outstanding balances.
- Expenses for office costs.
- Appointments for non-court meetings.
- Tenants for SaaS mode.
- OfficeBranches for multi-office support.

## ERD Drawing Notes

When creating the visual ERD:

- Start with Identity tables on the left.
- Put Clients and Cases in the center.
- Put Hearings, Documents, Tasks, and Payments around Cases.
- Put Notifications and AuditLogs on the side because they are cross-cutting.
- Use clear one-to-many relationships.
- Mark optional relationships clearly.
