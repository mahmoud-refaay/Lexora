-- ===================================================
-- Schema: Clients & Client Notes Module
-- Engine: SQL Server
-- Project: Lexora Case Management System
-- Idempotent Script (Safe to re-run multiple times)
-- ===================================================

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;

USE Lexora;
GO

-- 1. Table: Clients
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Clients]') AND type in (N'U'))
BEGIN
    CREATE TABLE Clients (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ClientType NVARCHAR(50) NOT NULL DEFAULT 'Individual', -- 'Individual', 'Company', 'Organization'
        FullName NVARCHAR(200) NOT NULL,
        NationalId NVARCHAR(50) NULL,
        PhoneNumber NVARCHAR(20) NULL,
        Email NVARCHAR(150) NULL,
        Address NVARCHAR(250) NULL,
        Notes NVARCHAR(MAX) NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT 'Active', -- 'Active', 'Inactive', 'Archived'
        IsDeleted BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CreatedByUserId INT NULL,
        UpdatedAt DATETIME2 NULL,
        UpdatedByUserId INT NULL,
        DeletedAt DATETIME2 NULL,
        DeletedByUserId INT NULL,
        CONSTRAINT FK_Clients_CreatedBy FOREIGN KEY (CreatedByUserId) REFERENCES Users(Id),
        CONSTRAINT FK_Clients_UpdatedBy FOREIGN KEY (UpdatedByUserId) REFERENCES Users(Id),
        CONSTRAINT FK_Clients_DeletedBy FOREIGN KEY (DeletedByUserId) REFERENCES Users(Id)
    );
    PRINT 'Table "Clients" created successfully.';
END
GO

-- 2. Table: ClientNotes
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ClientNotes]') AND type in (N'U'))
BEGIN
    CREATE TABLE ClientNotes (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ClientId INT NOT NULL,
        Note NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CreatedByUserId INT NULL,
        UpdatedAt DATETIME2 NULL,
        UpdatedByUserId INT NULL,
        CONSTRAINT FK_ClientNotes_Clients FOREIGN KEY (ClientId) REFERENCES Clients(Id) ON DELETE CASCADE,
        CONSTRAINT FK_ClientNotes_CreatedBy FOREIGN KEY (CreatedByUserId) REFERENCES Users(Id),
        CONSTRAINT FK_ClientNotes_UpdatedBy FOREIGN KEY (UpdatedByUserId) REFERENCES Users(Id)
    );
    PRINT 'Table "ClientNotes" created successfully.';
END
GO

-- ===================================================
-- Performance Indexes & Uniqueness (Safe Creation)
-- ===================================================

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Clients_FullName' AND object_id = OBJECT_ID(N'[dbo].[Clients]'))
BEGIN
    CREATE INDEX IX_Clients_FullName ON Clients(FullName);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Clients_PhoneNumber' AND object_id = OBJECT_ID(N'[dbo].[Clients]'))
BEGIN
    CREATE INDEX IX_Clients_PhoneNumber ON Clients(PhoneNumber);
END
GO

-- Unique Index on NationalId for active clients only (Filtered Unique Index)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'UQ_Clients_NationalId' AND object_id = OBJECT_ID(N'[dbo].[Clients]'))
BEGIN
    CREATE UNIQUE INDEX UQ_Clients_NationalId 
    ON Clients(NationalId) 
    WHERE IsDeleted = 0 AND NationalId IS NOT NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_ClientNotes_ClientId' AND object_id = OBJECT_ID(N'[dbo].[ClientNotes]'))
BEGIN
    CREATE INDEX IX_ClientNotes_ClientId ON ClientNotes(ClientId);
END
GO
