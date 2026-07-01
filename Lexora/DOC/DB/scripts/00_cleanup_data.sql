-- ===================================================
-- Cleanup Script: Delete all data from Lexora database
-- Engine: SQL Server
-- Project: Lexora Case Management System
-- WARNING: This script deletes ALL data but keeps schema.
-- ===================================================

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

USE Lexora;
GO

PRINT '==========================================';
PRINT 'Starting data cleanup...';
PRINT '==========================================';
GO

-- Disable all foreign key constraints to allow deletion in any order
DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql = @sql + 'ALTER TABLE [' + OBJECT_SCHEMA_NAME(parent_object_id) + '].[' + OBJECT_NAME(parent_object_id) + '] NOCHECK CONSTRAINT [' + name + '];' + CHAR(13)
FROM sys.foreign_keys;
EXEC sp_executesql @sql;
GO

-- Delete data in dependency order (child tables first)
DELETE FROM CaseNotes;
PRINT 'CaseNotes cleaned.';

DELETE FROM Cases;
PRINT 'Cases cleaned.';

DELETE FROM ClientNotes;
PRINT 'ClientNotes cleaned.';

DELETE FROM Clients;
PRINT 'Clients cleaned.';

DELETE FROM UserRoles;
PRINT 'UserRoles cleaned.';

DELETE FROM RolePermissions;
PRINT 'RolePermissions cleaned.';

DELETE FROM RefreshTokens;
PRINT 'RefreshTokens cleaned.';

DELETE FROM AuditLogs;
PRINT 'AuditLogs cleaned.';

DELETE FROM Notifications;
PRINT 'Notifications cleaned.';

DELETE FROM Settings;
PRINT 'Settings cleaned.';

DELETE FROM Users;
PRINT 'Users cleaned.';

DELETE FROM Roles;
PRINT 'Roles cleaned.';

DELETE FROM Permissions;
PRINT 'Permissions cleaned.';

DELETE FROM Persons;
PRINT 'Persons cleaned.';
GO

-- Re-enable all foreign key constraints
DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql = @sql + 'ALTER TABLE [' + OBJECT_SCHEMA_NAME(parent_object_id) + '].[' + OBJECT_NAME(parent_object_id) + '] CHECK CONSTRAINT [' + name + '];' + CHAR(13)
FROM sys.foreign_keys;
EXEC sp_executesql @sql;
GO

PRINT '==========================================';
PRINT 'Data cleanup completed successfully!';
PRINT '==========================================';
GO
