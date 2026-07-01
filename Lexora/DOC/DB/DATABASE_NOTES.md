# Database Notes

## Project

Lexora is a Law Office Management System. The database should support real law office operations and remain simple enough for the first version.

## Main Design Direction

The database will be built around the following core modules:

- Identity and authorization.
- Clients.
- Cases.
- Hearings.
- Documents.
- Tasks.
- Payments.
- Notifications.
- Audit logs.
- Settings.

## Database Engine

SQL Server is the planned database engine.

Reasons:

- Good support with ASP.NET Core.
- Strong relational model.
- Good indexing and reporting capabilities.
- Suitable for legal office data and financial records.
- Works well with Dapper and stored procedures.

## Data Access

Dapper will be used instead of Entity Framework Core.

Reasons:

- More direct control over SQL.
- Good performance.
- Clear stored procedure usage.
- Useful for learning and demonstrating SQL skills.
- Suitable for a CV-level backend project.

## Stored Procedures

Stored procedures are planned for business operations and queries.

Use stored procedures for:

- Create operations.
- Update operations.
- Search and filtered lists.
- Reports.
- Sensitive operations that need clear auditing.

Avoid creating too many stored procedures too early. Start with the core operations first.

## Soft Delete and Archive

Important legal and financial records should not be hard-deleted by default.

Preferred approach:

- Use `IsDeleted` for soft delete when a record should disappear from normal lists.
- Use `IsArchived` or status fields for records that should stay visible in archive mode.
- Use `DeletedAt` and `DeletedByUserId` where needed.

Important examples:

- Clients with active cases should not be hard-deleted.
- Cases should be closed or archived, not deleted.
- Payments should be cancelled or corrected, not deleted freely.
- Documents should be archived instead of physically deleted by default.

## Audit Logging

Audit logs are required for sensitive actions.

Examples of actions to audit:

- User login.
- Failed login.
- User creation.
- Role or permission change.
- Client creation or update.
- Case creation, closure, reopening, or archive.
- Hearing creation or result update.
- Document upload, replacement, archive, or delete.
- Payment creation, update, or cancellation.
- Settings change.

Suggested audit fields:

- Id.
- UserId.
- Action.
- EntityName.
- EntityId.
- OldValues.
- NewValues.
- IpAddress.
- UserAgent.
- CreatedAt.

## File Storage

Legal documents should not be stored as raw database binary in the first version unless there is a strong reason.

Preferred approach:

- Store physical files on disk or object storage.
- Store metadata in SQL Server.

Document metadata should include:

- File name.
- Original file name.
- Extension.
- Content type.
- Size.
- Storage path.
- Related client.
- Related case.
- Uploaded by.
- Uploaded date.

## Multi-Tenancy

The first version is planned for one law office.

Do not add full multi-tenant SaaS complexity now.

However, the schema should not block future multi-office support. Future entities may include:

- Tenant.
- OfficeBranch.
- Subscription.

## Roles and Permissions

Initial roles:

- Admin.
- Lawyer.
- Secretary.
- Accountant.

Use role-based authorization first. Permission-based authorization can be added using `Permissions` and `RolePermissions` tables.

## Naming Conventions

Suggested table naming:

- Use plural table names: `Users`, `Clients`, `Cases`.
- Use `Id` as primary key column.
- Use `CreatedAt`, `CreatedByUserId`, `UpdatedAt`, `UpdatedByUserId` where useful.
- Use clear foreign key names like `ClientId`, `CaseId`, `AssignedLawyerId`.

## Date and Time

Use UTC for backend timestamps when possible.

Examples:

- `CreatedAt`.
- `UpdatedAt`.
- `DeletedAt`.
- `LoggedAt`.

Business dates like hearing date can be stored separately from system timestamps.

## Important Design Risks

- Overcomplicating permissions before the core modules work.
- Hard-deleting legal or financial records.
- Mixing clients and opponents in the same unclear model too early.
- Storing files without metadata.
- Building reports before the main tables are stable.
- Writing stored procedures before confirming relationships.
