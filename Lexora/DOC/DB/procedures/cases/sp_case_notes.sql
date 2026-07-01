-- ============================================================================
-- Procedures: Case Notes Management (إدارة ملاحظات القضايا)
-- Project: Lexora Case Management System
-- Engine: SQL Server
-- Idempotent Script
-- ============================================================================

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

USE Lexora;
GO

-- ============================================================================
-- 1. sp_CaseNotes_Create
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_CaseNotes_Create
    @CaseId INT,
    @Note NVARCHAR(MAX),
    @CreatedByUserId INT = NULL,
    @NoteId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. التحقق من وجود القضية وصلاحيتها
    IF NOT EXISTS (SELECT 1 FROM Cases WHERE Id = @CaseId AND IsDeleted = 0)
    BEGIN
        DECLARE @ErrMsg NVARCHAR(200) = N'القضية المحددة غير موجودة أو تم حذفها.';
        THROW 50101, @ErrMsg, 1;
    END

    -- 2. إدراج الملاحظة
    INSERT INTO CaseNotes (
        CaseId,
        Note,
        IsDeleted,
        CreatedByUserId,
        CreatedAt
    )
    VALUES (
        @CaseId,
        @Note,
        0, -- IsDeleted
        @CreatedByUserId,
        SYSUTCDATETIME()
    );

    SET @NoteId = SCOPE_IDENTITY();
END;
GO

-- ============================================================================
-- 2. sp_CaseNotes_GetByCaseId
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_CaseNotes_GetByCaseId
    @CaseId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        cn.Id,
        cn.CaseId,
        cn.Note,
        cn.CreatedAt,
        cn.CreatedByUserId,
        p.FullName AS AuthorName,
        cn.UpdatedAt,
        cn.UpdatedByUserId
    FROM CaseNotes cn
    LEFT JOIN Users u ON cn.CreatedByUserId = u.Id AND u.IsActive = 1
    LEFT JOIN Persons p ON u.PersonId = p.Id
    WHERE cn.CaseId = @CaseId AND cn.IsDeleted = 0
    ORDER BY cn.Id DESC;
END;
GO

-- ============================================================================
-- 3. sp_CaseNotes_Delete
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_CaseNotes_Delete
    @NoteId INT,
    @DeletedByUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. التحقق من وجود الملاحظة
    IF NOT EXISTS (SELECT 1 FROM CaseNotes WHERE Id = @NoteId AND IsDeleted = 0)
    BEGIN
        DECLARE @ErrMsg NVARCHAR(200) = N'الملاحظة المطلوبة غير موجودة أو تم حذفها بالفعل.';
        THROW 50102, @ErrMsg, 1;
    END

    -- 2. الحذف المنطقي
    UPDATE CaseNotes
    SET 
        IsDeleted = 1,
        DeletedByUserId = @DeletedByUserId,
        DeletedAt = SYSUTCDATETIME()
    WHERE Id = @NoteId AND IsDeleted = 0;
END;
GO

-- ============================================================================
-- 4. sp_CaseNotes_GetById
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_CaseNotes_GetById
    @NoteId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        cn.Id,
        cn.CaseId,
        cn.Note,
        cn.CreatedAt,
        cn.CreatedByUserId,
        p.FullName AS AuthorName,
        cn.UpdatedAt,
        cn.UpdatedByUserId
    FROM CaseNotes cn
    LEFT JOIN Users u ON cn.CreatedByUserId = u.Id AND u.IsActive = 1
    LEFT JOIN Persons p ON u.PersonId = p.Id
    WHERE cn.Id = @NoteId AND cn.IsDeleted = 0;
END;
GO
