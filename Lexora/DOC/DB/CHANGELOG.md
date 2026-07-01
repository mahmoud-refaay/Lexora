# Database Changelog

This file tracks database documentation and schema design changes.

## 2026-06-27

### Added
- Implemented and executed SQL scripts for `Clients` and `ClientNotes` tables and stored procedures.
- Implemented C# Domain Entities, Repositories, Services, and REST Controller for the `Clients` module.
- Added `sp_Clients_CheckConflict` stored procedure and API endpoint to check for conflict of interest.

### Updated
- Updated `SCHEMA_DRAFT.md` and `ERD_NOTES.md` Case table schema to reflect real-world litigation degree tracking (`ParentCaseId`), client legal roles (`ClientRole`), case official year (`CaseYear`), and subject detail (`Subject`).

## 2026-06-23

### Added

- Created initial DB documentation folder structure.
- Added `README.md` for database documentation overview.
- Added `DATABASE_NOTES.md` for design decisions.
- Added `SCHEMA_DRAFT.md` for first schema draft.
- Added `ERD_NOTES.md` for entity relationship notes.
- Added `CHANGELOG.md` for tracking database design changes.

### Initial Design Scope

The first database scope includes:

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

### Notes

- SQL scripts are not created yet.
- Stored procedures are not created yet.
- ERD diagram is not created yet.
- Schema is still a draft and needs review before implementation.
