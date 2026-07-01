# Lexora (ميزان)

## Law Office Management System

Version: 1.0 Draft

Project Status: Planning Phase

Business Requirements Validation: Pending feedback from real lawyers and law office staff.

---

## 1. Project Vision

Lexora is a professional Law Office Management System designed to help law firms and independent lawyers manage daily legal operations from one centralized platform.

Arabic Brand Name: ميزان

English Product Name: Lexora

Project Type: ASP.NET Core Web API

Architecture: Clean Architecture

Primary Users: Law offices, lawyers, secretaries, accountants, and administrators.

The system should reduce manual paperwork, improve case tracking, organize legal documents, manage hearings and appointments, and provide better visibility into payments and office performance.

---

## 2. Business Domain

The business domain is legal practice management.

The system should model the real operational flow of a law office:

1. A client contacts the office.
2. The office creates a client profile.
3. A legal case is opened for the client.
4. Lawyers and staff attach documents, notes, tasks, payments, and hearings to the case.
5. The office tracks hearing dates, court information, case updates, and required actions.
6. Payments and balances are tracked per client and per case.
7. Reports help the office understand workload, revenue, case status, and staff performance.

The system should be designed around stable legal office concepts, not around screens only. This makes the project easier to expand later into notifications, calendar sync, OCR, AI assistance, mobile apps, or multi-tenant SaaS.

---

## 3. Main Goals

- Organize law office operations.
- Reduce paperwork and manual tracking.
- Track clients, cases, hearings, tasks, documents, and payments.
- Store legal documents securely with searchable metadata.
- Improve productivity through reminders and notifications.
- Provide clear reports for cases, hearings, clients, payments, and staff performance.
- Keep all critical office activity traceable through audit logs.
- Build a backend that is modular and ready for future expansion.

---

## 4. Core Business Concepts

### Client

A person, company, or organization receiving legal services from the office.

Client data may include full name, national ID, phone number, email, address, notes, and related cases.

### Case

A legal matter managed by the office for a client. A case can have hearings, documents, notes, tasks, payments, and status changes.

### Hearing

A scheduled court session or legal appointment related to a case. Hearings are time-sensitive and should support reminders.

### Document

A legal file attached to a client or case, such as contracts, power of attorney, court documents, legal memos, judgments, and attachments.

### Task

An internal work item assigned to a user, usually connected to a case, hearing, client, or document.

### Payment

A financial transaction related to a client or case. Payments help track revenue, outstanding balances, and financial history.

### Notification

A reminder or alert for hearings, tasks, new cases, payment follow-ups, or important office actions.

### Audit Log

A record of important system actions such as login, creating cases, updating payments, deleting documents, or changing user permissions.

---

## 5. User Roles

### Admin

System administrator with full access.

Permissions:

- Full system access.
- User management.
- Role management.
- Permission management.
- System settings.
- Reports.
- Audit logs.

### Lawyer

Legal user responsible for case work.

Permissions:

- Manage assigned clients.
- Manage assigned cases.
- Manage hearings.
- Manage legal documents.
- Manage case notes.
- Manage tasks.
- View related reports.

### Secretary

Operational user responsible for scheduling and office coordination.

Permissions:

- Add and update clients.
- Schedule hearings.
- Manage appointments.
- Upload documents.
- Create tasks.
- View upcoming hearings and reminders.

### Accountant

Financial user responsible for payments and financial reports.

Permissions:

- Add payments.
- Edit payment notes.
- View payment history.
- Track outstanding balances.
- View financial reports.
- Track monthly revenue.

---

## 6. Core Modules

### Authentication and Security

Features:

- Login.
- Logout.
- Change password.
- Forgot password.
- JWT authentication.
- Refresh tokens.
- Role-based authorization.
- Policy-based authorization.
- Account locking.
- Audit logs.

Important rules:

- Passwords must be hashed.
- Refresh tokens must be stored securely and revocable.
- Disabled users must not be able to log in.
- Sensitive actions must be logged.

### User Management

Features:

- Create users.
- Edit users.
- Disable users.
- Assign roles.
- Reset passwords.
- Manage user status.

Suggested user fields:

- Full name.
- Email.
- Phone number.
- Role.
- Status.
- Created date.
- Last login date.

### Client Management

Features:

- Add client.
- Edit client.
- Delete or archive client.
- Search clients.
- View client profile.
- Add client notes.
- View client cases.
- View client payment history.

Client information:

- Full name.
- National ID.
- Phone number.
- Email.
- Address.
- Notes.
- Status.

Business rules:

- A client can have many cases.
- A client should not be hard-deleted if they have active cases or payments.
- Client notes should be traceable by author and date.

### Case Management

Features:

- Create case.
- Edit case.
- Close case.
- Reopen case.
- Archive case.
- Search cases.
- Case timeline.
- Case notes.
- Assign lawyer.
- Link documents, hearings, tasks, and payments.

Case information:

- Case number.
- Case title.
- Case type.
- Court name.
- Court circuit or department.
- Opponent name.
- Opponent lawyer.
- Client.
- Assigned lawyer.
- Status.
- Start date.
- End date.
- Description.

Case status:

- Open.
- Pending.
- Scheduled.
- Closed.
- Archived.

Business rules:

- A case must belong to one client.
- A case can have many hearings.
- A case can have many documents.
- A case can have many tasks.
- A case can have many payments.
- Closed cases should not accept new hearings unless reopened.
- Archived cases should be read-only except for admins.

### Hearings Management

Features:

- Schedule hearing.
- Edit hearing.
- Add hearing notes.
- Add hearing result.
- View upcoming hearings.
- View hearing history per case.
- Send hearing reminders.

Hearing information:

- Case.
- Date.
- Time.
- Court.
- Court room or circuit.
- Judge.
- Notes.
- Result.
- Status.

Hearing status:

- Scheduled.
- Completed.
- Postponed.
- Cancelled.

Business rules:

- A hearing must belong to one case.
- Hearing date and time are required.
- Completed hearings should store a result or note.
- Upcoming hearings should appear in dashboard and notifications.

### Documents Management

Features:

- Upload documents.
- Download documents.
- Replace documents.
- Archive documents.
- Search documents.
- Attach documents to clients or cases.
- Store file metadata in database.

Supported documents:

- Contracts.
- Power of attorney.
- Legal memo.
- Court documents.
- Judgments.
- Attachments.

Storage:

- Physical files or object storage.
- Metadata in database.

Suggested metadata:

- File name.
- Original file name.
- File extension.
- Content type.
- File size.
- Storage path.
- Related client.
- Related case.
- Uploaded by.
- Uploaded date.

Business rules:

- Documents should not be deleted physically by default; archive them instead.
- Every document should have an owner context: client, case, or both.
- Replacing a document should preserve previous metadata when versioning is enabled.

### Tasks Management

Features:

- Create task.
- Assign task.
- Update task status.
- Set due dates.
- Task reminders.
- Link task to client, case, hearing, or document.

Task status:

- Pending.
- In Progress.
- Completed.
- Cancelled.

Business rules:

- A task should have an assignee.
- A task can optionally be linked to a case or hearing.
- Overdue tasks should appear in dashboard.
- Completed tasks should store completion date.

### Payment Management

Features:

- Add payment.
- Edit payment note.
- View payment history.
- Track outstanding balance.
- Revenue reports.
- Filter payments by client, case, date, and method.

Payment data:

- Client.
- Case.
- Amount.
- Payment date.
- Payment method.
- Notes.
- Created by.

Payment methods:

- Cash.
- Bank transfer.
- Online payment.

Business rules:

- A payment must belong to a client.
- A payment can optionally belong to a case.
- Payment amount must be greater than zero.
- Payment edits should be logged.
- Deleting payments should be restricted or replaced with cancellation.

### Notifications

Features:

- Upcoming hearing reminder.
- Task reminder.
- New case notification.
- Payment reminder.
- Overdue task notification.

Notification channels:

- In-app notifications.
- Email in future phases.
- SMS or WhatsApp in future phases.

Business rules:

- Notifications should be linked to a user.
- Notifications should support read and unread status.
- Time-sensitive notifications should be generated by background jobs.

### Dashboard

Statistics:

- Total clients.
- Active cases.
- Closed cases.
- Archived cases.
- Upcoming hearings.
- Monthly revenue.
- Pending tasks.
- Overdue tasks.

The dashboard should show information based on user role. Admins can see office-wide statistics, while lawyers may see only assigned work.

### Reports

Reports:

- Clients report.
- Cases report.
- Hearings report.
- Financial report.
- Lawyer performance report.
- Task report.
- Revenue report.

Export formats:

- PDF.
- Excel.

---

## 7. High-Level Business Flows

### New Client and Case Flow

1. Secretary or lawyer creates a client profile.
2. Lawyer creates a case for the client.
3. Lawyer adds case details, court information, opponent data, and assigned lawyer.
4. Documents are uploaded and linked to the case.
5. Hearing dates and tasks are created.
6. Payments are recorded when received.
7. Case progress is tracked through timeline, notes, hearings, and tasks.
8. Case is closed when finished, then archived if needed.

### Hearing Flow

1. User schedules a hearing for an active case.
2. System stores court, date, time, judge, and notes.
3. System creates upcoming hearing reminder.
4. After the hearing, lawyer adds result and next action.
5. If postponed, a new hearing date can be created.

### Payment Flow

1. Accountant selects client and optionally selects case.
2. Accountant records amount, date, method, and notes.
3. System updates payment history and revenue statistics.
4. Payment appears in financial reports.
5. Any edit or cancellation is recorded in audit logs.

---

## 8. Technical Architecture

### Backend

- ASP.NET Core 8 Web API.
- C#.
- SQL Server.
- Dapper ORM.
- Stored procedures.
- Swagger OpenAPI.
- FluentValidation.
- Serilog.

### Clean Architecture Layers

- Presentation Layer: Controllers, API endpoints, request/response models, authentication middleware.
- Application Layer: Use cases, services, DTOs, validation, authorization policies, interfaces.
- Domain Layer: Core entities, enums, domain rules, domain errors.
- Infrastructure Layer: Database access, Dapper repositories, stored procedure calls, file storage, email/SMS providers, logging integrations.

### Design Patterns

- Repository Pattern.
- Unit of Work.
- Dependency Injection.
- CQRS optional for complex query/write separation.
- Options Pattern for settings.

---

## 9. Suggested Domain Entities

- User.
- Role.
- Permission.
- RolePermission.
- RefreshToken.
- Client.
- ClientNote.
- Case.
- CaseNote.
- Hearing.
- Document.
- TaskItem.
- Payment.
- Notification.
- AuditLog.
- Setting.

Optional later entities:

- CaseTimelineEvent.
- DocumentVersion.
- Appointment.
- Expense.
- Invoice.
- OfficeBranch.
- Tenant.

---

## 10. Database Initial Design

Initial tables:

- Users.
- Roles.
- Permissions.
- RolePermissions.
- RefreshTokens.
- Clients.
- ClientNotes.
- Cases.
- CaseNotes.
- Hearings.
- Documents.
- Tasks.
- Payments.
- Notifications.
- AuditLogs.
- Settings.

Estimated tables: 15 to 20 tables in the first version.

Important database principles:

- Use soft delete or archive for important business records.
- Use created/updated metadata on main tables.
- Use indexes on searchable fields such as case number, client name, national ID, phone number, and hearing date.
- Store file metadata in SQL Server, not the full file binary unless there is a clear reason.
- Keep audit logs append-only.

---

## 11. Security Requirements

- JWT authentication.
- Refresh tokens.
- Password hashing.
- Role-based authorization.
- Policy-based authorization.
- Account locking.
- Audit logging.
- Input validation.
- Secure file upload validation.
- Protection against unauthorized access to case and client data.

Security rules:

- Admin can manage all users and settings.
- Lawyers should only access assigned cases unless policy allows broader access.
- Accountants should access financial modules, not sensitive legal notes unless allowed.
- Secretaries can manage scheduling and documents but should not manage roles or system settings.
- Every sensitive action should be logged with user ID, action, entity, entity ID, date, and IP address if available.

---

## 12. Logging and Error Handling

Logging: Serilog.

Log types:

- Information.
- Warning.
- Error.
- Critical.

Error handling:

- Global Exception Middleware.
- Standard API responses.
- Validation error response format.
- Correlation ID for tracing requests.

Suggested standard response shape:

- Success.
- Message.
- Data.
- Errors.
- TraceId.

---

## 13. Validation

Validation library: FluentValidation.

Validation examples:

- Client full name is required.
- National ID should be unique when provided.
- Case number should be unique when provided.
- Hearing date is required.
- Payment amount must be greater than zero.
- Uploaded file type must be allowed.
- Task due date should be valid.

---

## 14. Future Features

### Phase 2: Communication and Calendar

- Email notifications.
- SMS notifications.
- WhatsApp notifications.
- Calendar integration.
- Google Calendar sync.
- Appointment management.

### Phase 3: Smart Legal Assistance

- OCR document scanning.
- AI document classification.
- AI case assistant.
- AI search.
- Legal document summarization.

### Phase 4: Product Expansion

- Mobile application.
- Multi-office support.
- Multi-tenant SaaS version.
- Subscription billing.
- Advanced permissions.

---

## 15. GitHub Repository Structure

Suggested structure:

```text
/src
/src/Lexora.API
/src/Lexora.Application
/src/Lexora.Domain
/src/Lexora.Infrastructure
/tests
/docs
```

---

## 16. Recommended First Development Path

The first version should focus on a working legal office backend before adding advanced automation.

Recommended order:

1. Create solution structure using Clean Architecture.
2. Implement authentication, users, roles, permissions, and refresh tokens.
3. Implement clients module.
4. Implement cases module linked to clients.
5. Implement hearings module linked to cases.
6. Implement documents module with secure upload and metadata.
7. Implement tasks module with assignment and due dates.
8. Implement payments module linked to clients and cases.
9. Implement notifications for upcoming hearings and overdue tasks.
10. Implement dashboard and basic reports.
11. Add audit logging across sensitive actions.

---

## 17. CV Project Description

Lexora — Law Office Management System

ASP.NET Core 8, SQL Server, Dapper, JWT Authentication, Clean Architecture, Role-Based Authorization.

Designed and developed a legal practice management system for handling clients, cases, hearings, legal documents, tasks, and payments. Implemented JWT authentication, role-based authorization, audit logging, reporting, and Clean Architecture principles using ASP.NET Core Web API and SQL Server.
