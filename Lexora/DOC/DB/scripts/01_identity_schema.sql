-- ===================================================
-- Database Creation & Schema: Identity & Security Module
-- Engine: SQL Server
-- Project: Lexora Case Management System
-- Idempotent Script (Safe to re-run multiple times)
-- ===================================================

-- 1. Create Database if it does not exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'Lexora')
BEGIN
    CREATE DATABASE Lexora;
    PRINT 'Database "Lexora" created successfully.';
END
ELSE
BEGIN
    PRINT 'Database "Lexora" already exists.';
END
GO

USE Lexora;
GO

-- 2. Table: Persons
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Persons]') AND type in (N'U'))
BEGIN
    CREATE TABLE Persons (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(200) NOT NULL,
        PhoneNumber NVARCHAR(20) NULL,
        Address NVARCHAR(250) NULL,
        Email NVARCHAR(150) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NULL
    );
    PRINT 'Table "Persons" created.';
END
GO

-- 3. Table: Users
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        PersonId INT NOT NULL UNIQUE,
        Username NVARCHAR(50) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(500) NOT NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CreatedByUserId INT NULL,
        CONSTRAINT FK_Users_Persons FOREIGN KEY (PersonId) REFERENCES Persons(Id),
        CONSTRAINT FK_Users_CreatedBy FOREIGN KEY (CreatedByUserId) REFERENCES Users(Id)
    );
    PRINT 'Table "Users" created.';
END
GO

-- 4. Table: Roles
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Roles]') AND type in (N'U'))
BEGIN
    CREATE TABLE Roles (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        RoleName NVARCHAR(50) NOT NULL UNIQUE,
        Description NVARCHAR(250) NULL,
        IsSystemRole BIT NOT NULL DEFAULT 0
    );
    PRINT 'Table "Roles" created.';
END
GO

-- 5. Table: Permissions
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Permissions]') AND type in (N'U'))
BEGIN
    CREATE TABLE Permissions (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        PermissionCode NVARCHAR(100) NOT NULL UNIQUE,
        PermissionName NVARCHAR(100) NOT NULL,
        Description NVARCHAR(250) NULL,
        ModuleName NVARCHAR(50) NOT NULL
    );
    PRINT 'Table "Permissions" created.';
END
GO

-- 6. Table: RolePermissions
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RolePermissions]') AND type in (N'U'))
BEGIN
    CREATE TABLE RolePermissions (
        RoleId INT NOT NULL,
        PermissionId INT NOT NULL,
        GrantedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        GrantedByUserId INT NULL,
        CONSTRAINT PK_RolePermissions PRIMARY KEY (RoleId, PermissionId),
        CONSTRAINT FK_RolePermissions_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
        CONSTRAINT FK_RolePermissions_Permissions FOREIGN KEY (PermissionId) REFERENCES Permissions(Id) ON DELETE CASCADE,
        CONSTRAINT FK_RolePermissions_Users FOREIGN KEY (GrantedByUserId) REFERENCES Users(Id)
    );
    PRINT 'Table "RolePermissions" created.';
END
GO

-- 7. Table: UserRoles
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserRoles]') AND type in (N'U'))
BEGIN
    CREATE TABLE UserRoles (
        UserId INT NOT NULL,
        RoleId INT NOT NULL,
        AssignedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        AssignedByUserId INT NULL,
        CONSTRAINT PK_UserRoles PRIMARY KEY (UserId, RoleId),
        CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
        CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
        CONSTRAINT FK_UserRoles_AssignedBy FOREIGN KEY (AssignedByUserId) REFERENCES Users(Id)
    );
    PRINT 'Table "UserRoles" created.';
END
GO

-- 8. Table: RefreshTokens
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RefreshTokens]') AND type in (N'U'))
BEGIN
    CREATE TABLE RefreshTokens (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        FamilyId NVARCHAR(100) NOT NULL,
        TokenHash NVARCHAR(500) NOT NULL UNIQUE,
        ExpiresAt DATETIME2 NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CreatedByIp NVARCHAR(45) NULL,
        RevokedAt DATETIME2 NULL,
        RevokedByIp NVARCHAR(45) NULL,
        ReplacedByTokenId INT NULL,
        RevokeReason NVARCHAR(255) NULL,
        CONSTRAINT FK_RefreshTokens_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
        CONSTRAINT FK_RefreshTokens_ReplacedBy FOREIGN KEY (ReplacedByTokenId) REFERENCES RefreshTokens(Id)
    );
    PRINT 'Table "RefreshTokens" created.';
END
GO

-- 9. Table: AuditLogs
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AuditLogs]') AND type in (N'U'))
BEGIN
    CREATE TABLE AuditLogs (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NULL,
        Action NVARCHAR(100) NOT NULL,
        EntityName NVARCHAR(100) NULL,
        EntityId NVARCHAR(100) NULL,
        OldValues NVARCHAR(MAX) NULL,
        NewValues NVARCHAR(MAX) NULL,
        IpAddress NVARCHAR(45) NULL,
        UserAgent NVARCHAR(500) NULL,
        TraceId NVARCHAR(100) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_AuditLogs_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
    );
    PRINT 'Table "AuditLogs" created.';
END
GO

-- 10. Table: Settings
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Settings]') AND type in (N'U'))
BEGIN
    CREATE TABLE Settings (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        SettingKey NVARCHAR(100) NOT NULL UNIQUE,
        SettingValue NVARCHAR(MAX) NULL,
        Description NVARCHAR(255) NULL,
        UpdatedAt DATETIME2 NULL,
        UpdatedByUserId INT NULL,
        CONSTRAINT FK_Settings_Users FOREIGN KEY (UpdatedByUserId) REFERENCES Users(Id)
    );
    PRINT 'Table "Settings" created.';
END
GO

-- 11. Table: Notifications
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND type in (N'U'))
BEGIN
    CREATE TABLE Notifications (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        Message NVARCHAR(255) NOT NULL,
        IsRead BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        ReadAt DATETIME2 NULL,
        CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
    );
    PRINT 'Table "Notifications" created.';
END
GO

-- ===================================================
-- Performance Indexes (Safe Creation)
-- ===================================================

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Users_PersonId' AND object_id = OBJECT_ID(N'[dbo].[Users]'))
BEGIN
    CREATE INDEX IX_Users_PersonId ON Users(PersonId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_UserRoles_UserId' AND object_id = OBJECT_ID(N'[dbo].[UserRoles]'))
BEGIN
    CREATE INDEX IX_UserRoles_UserId ON UserRoles(UserId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_RolePermissions_RoleId' AND object_id = OBJECT_ID(N'[dbo].[RolePermissions]'))
BEGIN
    CREATE INDEX IX_RolePermissions_RoleId ON RolePermissions(RoleId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_RefreshTokens_UserId' AND object_id = OBJECT_ID(N'[dbo].[RefreshTokens]'))
BEGIN
    CREATE INDEX IX_RefreshTokens_UserId ON RefreshTokens(UserId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_RefreshTokens_FamilyId' AND object_id = OBJECT_ID(N'[dbo].[RefreshTokens]'))
BEGIN
    CREATE INDEX IX_RefreshTokens_FamilyId ON RefreshTokens(FamilyId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_AuditLogs_UserId' AND object_id = OBJECT_ID(N'[dbo].[AuditLogs]'))
BEGIN
    CREATE INDEX IX_AuditLogs_UserId ON AuditLogs(UserId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_AuditLogs_CreatedAt' AND object_id = OBJECT_ID(N'[dbo].[AuditLogs]'))
BEGIN
    CREATE INDEX IX_AuditLogs_CreatedAt ON AuditLogs(CreatedAt);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Notifications_UserId' AND object_id = OBJECT_ID(N'[dbo].[Notifications]'))
BEGIN
    CREATE INDEX IX_Notifications_UserId ON Notifications(UserId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Notifications_IsRead' AND object_id = OBJECT_ID(N'[dbo].[Notifications]'))
BEGIN
    CREATE INDEX IX_Notifications_IsRead ON Notifications(IsRead);
END
GO
