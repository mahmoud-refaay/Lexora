# Lexora Database Documentation

## Purpose

This folder contains the database planning and documentation for Lexora, a Law Office Management System.

The goal of this documentation is to make the database design easy to understand, continue, review, and change later without losing context.

## Project Context

Lexora manages the daily operations of a law office, including:

- Users and roles.
- Clients.
- Cases.
- Hearings.
- Legal documents.
- Tasks.
- Payments.
- Notifications.
- Reports.
- Audit logs.
- System settings.

## Database Technology

Planned stack:

- SQL Server.
- Dapper ORM.
- Stored Procedures.
- ASP.NET Core 8 Web API.
- Clean Architecture.

## Folder Structure

```text
DOC/DB/
  README.md
  DATABASE_NOTES.md
  SCHEMA_DRAFT.md
  ERD_NOTES.md
  CHANGELOG.md

  scripts/
  seeds/
  procedures/
    identity/
    clients/
    cases/
    hearings/
    documents/
    tasks/
    payments/
    notifications/
    reports/
  diagrams/
```

## File Responsibilities

`README.md`

Explains the purpose of the DB folder, structure, and how to continue work later.

`DATABASE_NOTES.md`

Stores important database design decisions and the reasons behind them.

`SCHEMA_DRAFT.md`

Contains the first draft of tables, columns, and important constraints.

`ERD_NOTES.md`

Documents entity relationships in text form before or beside visual diagrams.

`CHANGELOG.md`

Tracks changes made to the database design over time.

## Future Script Organization

When SQL scripts are created, use this order:

```text
scripts/
  001_initial_schema.sql
  002_identity_auth.sql
  003_clients.sql
  004_cases.sql
  005_hearings.sql
  006_documents.sql
  007_tasks.sql
  008_payments.sql
  009_notifications.sql
  010_audit_logs.sql
  011_settings.sql
```

Seed data should be separated from schema scripts:

```text
seeds/
  001_roles.sql
  002_permissions.sql
  003_role_permissions.sql
  004_default_admin.sql
```

Stored procedures should be grouped by business module:

```text
procedures/
  clients/
  cases/
  hearings/
  payments/
```

## Recommended Work Order

1. Finalize the initial schema draft.
2. Confirm core relationships between clients, cases, hearings, documents, tasks, and payments.
3. Create identity and authorization tables.
4. Create clients and cases tables.
5. Add hearings, documents, tasks, and payments.
6. Add notifications, audit logs, and settings.
7. Add seed data for roles and permissions.
8. Add stored procedures per module.
9. Create ERD diagram.

## Important Rule

Do not write SQL scripts before the table relationships are clear enough. The schema should be reviewed first because fixing wrong relationships later is more expensive than changing documentation now.
