SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

USE Lexora;
GO

-- ============================================================================
-- 1. sp_ClientNotes_Create
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_ClientNotes_Create
    @ClientId INT,
    @Note NVARCHAR(MAX),
    @CreatedByUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Clients WHERE Id = @ClientId AND IsDeleted = 0)
        BEGIN
            THROW 50006, N'العميل المرتبط بالملاحظة غير موجود في النظام.', 1;
        END

        INSERT INTO ClientNotes (ClientId, Note, CreatedAt, CreatedByUserId)
        VALUES (@ClientId, @Note, SYSUTCDATETIME(), @CreatedByUserId);

        DECLARE @NewNoteId INT = SCOPE_IDENTITY();
        SELECT @NewNoteId AS NoteId;

    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 2. sp_ClientNotes_GetByClientId
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_ClientNotes_GetByClientId
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        cn.Id,
        cn.ClientId,
        cn.Note,
        cn.CreatedAt,
        cn.CreatedByUserId,
        cn.UpdatedAt,
        cn.UpdatedByUserId,
        p.FullName AS AuthorName
    FROM ClientNotes cn
    LEFT JOIN Users u ON cn.CreatedByUserId = u.Id
    LEFT JOIN Persons p ON u.PersonId = p.Id
    WHERE cn.ClientId = @ClientId
    ORDER BY cn.CreatedAt DESC;
END;
GO

-- ============================================================================
-- 3. sp_ClientNotes_Delete
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_ClientNotes_Delete
    @NoteId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM ClientNotes WHERE Id = @NoteId)
        BEGIN
            THROW 50007, N'الملاحظة المطلوبة غير موجودة في النظام.', 1;
        END

        DELETE FROM ClientNotes WHERE Id = @NoteId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 4. sp_ClientNotes_GetById
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_ClientNotes_GetById
    @NoteId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        cn.Id,
        cn.ClientId,
        cn.Note,
        cn.CreatedAt,
        cn.CreatedByUserId,
        cn.UpdatedAt,
        cn.UpdatedByUserId,
        p.FullName AS AuthorName
    FROM ClientNotes cn
    LEFT JOIN Users u ON cn.CreatedByUserId = u.Id
    LEFT JOIN Persons p ON u.PersonId = p.Id
    WHERE cn.Id = @NoteId;
END;
GO
