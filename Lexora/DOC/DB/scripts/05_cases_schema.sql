-- ===================================================
-- Schema: Cases & Case Notes Module
-- Engine: SQL Server
-- Project: Lexora Case Management System
-- Idempotent Script (Safe to re-run multiple times)
-- ===================================================

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

USE Lexora;
GO

-- 1. Table: Cases (القضايا)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Cases]') AND type in (N'U'))
BEGIN
    CREATE TABLE Cases (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ClientId INT NOT NULL,                                -- الموكل صاحب القضية
        ParentCaseId INT NULL,                                -- معرف القضية الأب (درجات التقاضي: استئناف، نقض)
        AssignedLawyerId INT NULL,                            -- المحامي المسؤول عن القضية من المكتب
        CaseNumber NVARCHAR(100) NULL,                        -- رقم القضية الرسمي بالمحكمة
        CaseYear INT NULL,                                    -- سنة القضية
        CaseType NVARCHAR(100) NULL,                          -- نوع القضية (مدني، جنائي، تجاري، شرعي...)
        CourtName NVARCHAR(200) NULL,                          -- اسم المحكمة
        CourtCircuit NVARCHAR(100) NULL,                      -- الدائرة
        ClientRole NVARCHAR(50) NOT NULL DEFAULT 'Plaintiff',   -- صفة عميلنا (Plaintiff مدعي / Defendant مدعى عليه)
        OpponentName NVARCHAR(200) NULL,                      -- اسم الخصم
        OpponentLawyer NVARCHAR(200) NULL,                    -- محامي الخصم
        Subject NVARCHAR(MAX) NULL,                           -- موضوع الدعوى بالتفصيل
        Status NVARCHAR(50) NOT NULL DEFAULT 'Open',          -- حالة القضية (Open, Pending, Scheduled, Closed)
        StartDate DATE NULL,                                  -- تاريخ بدء القضية
        EndDate DATE NULL,                                    -- تاريخ إغلاق القضية
        IsArchived BIT NOT NULL DEFAULT 0,                    -- هل مؤرشفة
        IsDeleted BIT NOT NULL DEFAULT 0,                     -- هل محذوفة منطقياً
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CreatedByUserId INT NULL,
        UpdatedAt DATETIME2 NULL,
        UpdatedByUserId INT NULL,
        ArchivedAt DATETIME2 NULL,
        ArchivedByUserId INT NULL,
        DeletedAt DATETIME2 NULL,
        DeletedByUserId INT NULL,
        
        -- العلاقات الخارجية
        CONSTRAINT FK_Cases_Clients FOREIGN KEY (ClientId) REFERENCES Clients(Id),
        CONSTRAINT FK_Cases_Parent FOREIGN KEY (ParentCaseId) REFERENCES Cases(Id),
        CONSTRAINT FK_Cases_Lawyers FOREIGN KEY (AssignedLawyerId) REFERENCES Users(Id),
        CONSTRAINT FK_Cases_CreatedBy FOREIGN KEY (CreatedByUserId) REFERENCES Users(Id),
        CONSTRAINT FK_Cases_UpdatedBy FOREIGN KEY (UpdatedByUserId) REFERENCES Users(Id),
        CONSTRAINT FK_Cases_ArchivedBy FOREIGN KEY (ArchivedByUserId) REFERENCES Users(Id),
        CONSTRAINT FK_Cases_DeletedBy FOREIGN KEY (DeletedByUserId) REFERENCES Users(Id)
    );
    PRINT 'Table "Cases" created successfully.';
END
GO

-- 2. Table: CaseNotes (ملاحظات القضية)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CaseNotes]') AND type in (N'U'))
BEGIN
    CREATE TABLE CaseNotes (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CaseId INT NOT NULL,                                  -- معرف القضية المرتبطة
        Note NVARCHAR(MAX) NOT NULL,                          -- نص الملاحظة
        IsDeleted BIT NOT NULL DEFAULT 0,                     -- هل محذوفة منطقياً
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CreatedByUserId INT NULL,
        UpdatedAt DATETIME2 NULL,
        UpdatedByUserId INT NULL,
        DeletedAt DATETIME2 NULL,
        DeletedByUserId INT NULL,
        
        -- العلاقات الخارجية
        CONSTRAINT FK_CaseNotes_Cases FOREIGN KEY (CaseId) REFERENCES Cases(Id),
        CONSTRAINT FK_CaseNotes_CreatedBy FOREIGN KEY (CreatedByUserId) REFERENCES Users(Id),
        CONSTRAINT FK_CaseNotes_UpdatedBy FOREIGN KEY (UpdatedByUserId) REFERENCES Users(Id),
        CONSTRAINT FK_CaseNotes_DeletedBy FOREIGN KEY (DeletedByUserId) REFERENCES Users(Id)
    );
    PRINT 'Table "CaseNotes" created successfully.';
END
GO

-- ===================================================
-- Performance Indexes (Optimized / Non-Over-Indexing)
-- ===================================================

-- فهرس الموكل: جلب قضايا عميل معين (أمر أساسي ومتكرر)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Cases_ClientId' AND object_id = OBJECT_ID(N'[dbo].[Cases]'))
BEGIN
    CREATE INDEX IX_Cases_ClientId ON Cases(ClientId) WHERE IsDeleted = 0;
END
GO

-- فهرس الاستدعاء الذاتي لدرجات التقاضي (مشروط فقط للقضايا التي لها أب وغير محذوفة)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Cases_ParentCaseId' AND object_id = OBJECT_ID(N'[dbo].[Cases]'))
BEGIN
    CREATE INDEX IX_Cases_ParentCaseId ON Cases(ParentCaseId) WHERE ParentCaseId IS NOT NULL AND IsDeleted = 0;
END
GO

-- فهرس المحامي المسؤول (مشروط بالقضايا المسندة حالياً وغير المحذوفة)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Cases_AssignedLawyerId' AND object_id = OBJECT_ID(N'[dbo].[Cases]'))
BEGIN
    CREATE INDEX IX_Cases_AssignedLawyerId ON Cases(AssignedLawyerId) WHERE AssignedLawyerId IS NOT NULL AND IsDeleted = 0;
END
GO

-- فهرس مركب محسّن: البحث بالرقم والسنة معاً للقضايا غير المحذوفة
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Cases_Number_Year' AND object_id = OBJECT_ID(N'[dbo].[Cases]'))
BEGIN
    CREATE INDEX IX_Cases_Number_Year ON Cases(CaseNumber, CaseYear) WHERE CaseNumber IS NOT NULL AND IsDeleted = 0;
END
GO

-- فهرس الحالة المصفى: جلب القضايا حسب حالتها (مطبق فقط على القضايا النشطة غير مؤرشفة وغير محذوفة لتقليل المساحة)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Cases_Status' AND object_id = OBJECT_ID(N'[dbo].[Cases]'))
BEGIN
    CREATE INDEX IX_Cases_Status ON Cases(Status) WHERE IsArchived = 0 AND IsDeleted = 0;
END
GO

-- فهرس جدول الملاحظات: جلب ملاحظات قضية معينة بسرعة
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_CaseNotes_CaseId' AND object_id = OBJECT_ID(N'[dbo].[CaseNotes]'))
BEGIN
    CREATE INDEX IX_CaseNotes_CaseId ON CaseNotes(CaseId) WHERE IsDeleted = 0;
END
GO
