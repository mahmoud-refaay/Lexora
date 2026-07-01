-- ============================================================================
-- Procedures: Cases Management (إدارة القضايا)
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
-- 1. sp_Cases_Create
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Cases_Create
    @ClientId INT,
    @ParentCaseId INT = NULL,
    @AssignedLawyerId INT = NULL,
    @CaseNumber NVARCHAR(100) = NULL,
    @CaseYear INT = NULL,
    @CaseType NVARCHAR(100) = NULL,
    @CourtName NVARCHAR(200) = NULL,
    @CourtCircuit NVARCHAR(100) = NULL,
    @ClientRole NVARCHAR(50) = 'Plaintiff',
    @OpponentName NVARCHAR(200) = NULL,
    @OpponentLawyer NVARCHAR(200) = NULL,
    @Subject NVARCHAR(MAX) = NULL,
    @Status NVARCHAR(50) = 'Open',
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @CreatedByUserId INT = NULL,
    @CaseId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. التحقق من وجود الموكل وصلاحيته
    IF NOT EXISTS (SELECT 1 FROM Clients WHERE Id = @ClientId AND IsDeleted = 0)
    BEGIN
        DECLARE @ErrMsg1 NVARCHAR(200) = N'الموكل المحدد غير موجود في النظام أو تم حذفه.';
        THROW 50001, @ErrMsg1, 1;
    END

    -- 2. التحقق من القضية الأب (إن وجدت)
    IF @ParentCaseId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE Id = @ParentCaseId AND IsDeleted = 0)
    BEGIN
        DECLARE @ErrMsg2 NVARCHAR(200) = N'القضية الأب المحددة غير موجودة أو تم حذفها.';
        THROW 50002, @ErrMsg2, 1;
    END

    -- 3. التحقق من المحامي المسؤول وصلاحية حسابه (إن وجد)
    IF @AssignedLawyerId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Users WHERE Id = @AssignedLawyerId AND IsActive = 1)
    BEGIN
        DECLARE @ErrMsg3 NVARCHAR(200) = N'المحامي المعين غير موجود في النظام أو حسابه غير نشط.';
        THROW 50003, @ErrMsg3, 1;
    END

    -- 4. إدراج السجل
    INSERT INTO Cases (
        ClientId,
        ParentCaseId,
        AssignedLawyerId,
        CaseNumber,
        CaseYear,
        CaseType,
        CourtName,
        CourtCircuit,
        ClientRole,
        OpponentName,
        OpponentLawyer,
        Subject,
        Status,
        StartDate,
        EndDate,
        IsArchived,
        IsDeleted,
        CreatedByUserId,
        CreatedAt
    )
    VALUES (
        @ClientId,
        @ParentCaseId,
        @AssignedLawyerId,
        @CaseNumber,
        @CaseYear,
        @CaseType,
        @CourtName,
        @CourtCircuit,
        @ClientRole,
        @OpponentName,
        @OpponentLawyer,
        @Subject,
        @Status,
        @StartDate,
        @EndDate,
        0, -- IsArchived
        0, -- IsDeleted
        @CreatedByUserId,
        SYSUTCDATETIME()
    );

    SET @CaseId = SCOPE_IDENTITY();
END;
GO

-- ============================================================================
-- 2. sp_Cases_Update
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Cases_Update
    @CaseId INT,
    @ClientId INT,
    @ParentCaseId INT = NULL,
    @AssignedLawyerId INT = NULL,
    @CaseNumber NVARCHAR(100) = NULL,
    @CaseYear INT = NULL,
    @CaseType NVARCHAR(100) = NULL,
    @CourtName NVARCHAR(200) = NULL,
    @CourtCircuit NVARCHAR(100) = NULL,
    @ClientRole NVARCHAR(50) = 'Plaintiff',
    @OpponentName NVARCHAR(200) = NULL,
    @OpponentLawyer NVARCHAR(200) = NULL,
    @Subject NVARCHAR(MAX) = NULL,
    @Status NVARCHAR(50) = 'Open',
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @UpdatedByUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. التحقق من وجود القضية الحالية
    IF NOT EXISTS (SELECT 1 FROM Cases WHERE Id = @CaseId AND IsDeleted = 0)
    BEGIN
        DECLARE @ErrMsg1 NVARCHAR(200) = N'القضية المطلوبة غير موجودة في النظام أو تم حذفها.';
        THROW 50004, @ErrMsg1, 1;
    END

    -- 2. التحقق من وجود الموكل الجديد وصلاحيته
    IF NOT EXISTS (SELECT 1 FROM Clients WHERE Id = @ClientId AND IsDeleted = 0)
    BEGIN
        DECLARE @ErrMsg2 NVARCHAR(200) = N'الموكل المحدد غير موجود في النظام أو تم حذفه.';
        THROW 50005, @ErrMsg2, 1;
    END

    -- 3. التحقق من القضية الأب (إن وجدت)
    IF @ParentCaseId IS NOT NULL 
    BEGIN
        IF @ParentCaseId = @CaseId
        BEGIN
            DECLARE @ErrMsgSelf NVARCHAR(200) = N'لا يمكن ربط القضية بنفسها كقضية أب.';
            THROW 50006, @ErrMsgSelf, 1;
        END

        IF NOT EXISTS (SELECT 1 FROM Cases WHERE Id = @ParentCaseId AND IsDeleted = 0)
        BEGIN
            DECLARE @ErrMsg3 NVARCHAR(200) = N'القضية الأب المحددة غير موجودة أو تم حذفها.';
            THROW 50007, @ErrMsg3, 1;
        END
    END

    -- 4. التحقق من المحامي المسؤول وصلاحية حسابه (إن وجد)
    IF @AssignedLawyerId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Users WHERE Id = @AssignedLawyerId AND IsActive = 1)
    BEGIN
        DECLARE @ErrMsg4 NVARCHAR(200) = N'المحامي المعين غير موجود في النظام أو حسابه غير نشط.';
        THROW 50008, @ErrMsg4, 1;
    END

    -- 5. تحديث البيانات
    UPDATE Cases
    SET 
        ClientId = @ClientId,
        ParentCaseId = @ParentCaseId,
        AssignedLawyerId = @AssignedLawyerId,
        CaseNumber = @CaseNumber,
        CaseYear = @CaseYear,
        CaseType = @CaseType,
        CourtName = @CourtName,
        CourtCircuit = @CourtCircuit,
        ClientRole = @ClientRole,
        OpponentName = @OpponentName,
        OpponentLawyer = @OpponentLawyer,
        Subject = @Subject,
        Status = @Status,
        StartDate = @StartDate,
        EndDate = @EndDate,
        UpdatedByUserId = @UpdatedByUserId,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @CaseId AND IsDeleted = 0;
END;
GO

-- ============================================================================
-- 3. sp_Cases_Delete
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Cases_Delete
    @CaseId INT,
    @DeletedByUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. التحقق من وجود القضية
    IF NOT EXISTS (SELECT 1 FROM Cases WHERE Id = @CaseId AND IsDeleted = 0)
    BEGIN
        DECLARE @ErrMsg NVARCHAR(200) = N'القضية المطلوبة غير موجودة أو محذوفة بالفعل.';
        THROW 50009, @ErrMsg, 1;
    END

    -- 2. التحقق الوقائي من المدفوعات المرتبطة بالقضية (إذا كان جدول المدفوعات موجوداً)
    IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Payments]') AND type in (N'U'))
    BEGIN
        DECLARE @SQL NVARCHAR(MAX) = N'
            IF EXISTS (SELECT 1 FROM Payments WHERE CaseId = @CId AND IsDeleted = 0)
            BEGIN
                DECLARE @PayErr NVARCHAR(200) = N''لا يمكن حذف القضية لوجود مدفوعات مسجلة عليها. يرجى معالجة المدفوعات أولاً.'';
                THROW 50010, @PayErr, 1;
            END';
        EXEC sp_executesql @SQL, N'@CId INT', @CId = @CaseId;
    END

    -- 3. الحذف المنطقي
    UPDATE Cases
    SET 
        IsDeleted = 1,
        DeletedByUserId = @DeletedByUserId,
        DeletedAt = SYSUTCDATETIME()
    WHERE Id = @CaseId AND IsDeleted = 0;

    -- 4. حذف الملاحظات المرتبطة بالقضية منطقياً أيضاً تلقائياً
    UPDATE CaseNotes
    SET 
        IsDeleted = 1,
        DeletedByUserId = @DeletedByUserId,
        DeletedAt = SYSUTCDATETIME()
    WHERE CaseId = @CaseId AND IsDeleted = 0;
END;
GO

-- ============================================================================
-- 4. sp_Cases_Archive (أرشفة القضية)
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Cases_Archive
    @CaseId INT,
    @ArchivedByUserId INT = NULL,
    @IsArchived BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. التحقق من وجود القضية
    IF NOT EXISTS (SELECT 1 FROM Cases WHERE Id = @CaseId AND IsDeleted = 0)
    BEGIN
        DECLARE @ErrMsg NVARCHAR(200) = N'القضية المطلوبة غير موجودة في النظام.';
        THROW 50011, @ErrMsg, 1;
    END

    -- 2. تنفيذ الأرشفة وتحديث الحالة في حال الأرشفة
    UPDATE Cases
    SET 
        IsArchived = @IsArchived,
        Status = CASE WHEN @IsArchived = 1 THEN 'Closed' ELSE Status END,
        ArchivedByUserId = CASE WHEN @IsArchived = 1 THEN @ArchivedByUserId ELSE NULL END,
        ArchivedAt = CASE WHEN @IsArchived = 1 THEN SYSUTCDATETIME() ELSE NULL END,
        UpdatedByUserId = @ArchivedByUserId,
        UpdatedAt = SYSUTCDATETIME()
    WHERE Id = @CaseId AND IsDeleted = 0;
END;
GO

-- ============================================================================
-- 5. sp_Cases_GetById
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Cases_GetById
    @CaseId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.Id,
        c.ClientId,
        cl.FullName AS ClientName,
        cl.PhoneNumber AS ClientPhone,
        c.ParentCaseId,
        pc.CaseNumber AS ParentCaseNumber,
        c.AssignedLawyerId,
        p.FullName AS AssignedLawyerName,
        c.CaseNumber,
        c.CaseYear,
        c.CaseType,
        c.CourtName,
        c.CourtCircuit,
        c.ClientRole,
        c.OpponentName,
        c.OpponentLawyer,
        c.Subject,
        c.Status,
        c.StartDate,
        c.EndDate,
        c.IsArchived,
        c.CreatedAt,
        c.CreatedByUserId,
        c.UpdatedAt,
        c.UpdatedByUserId
    FROM Cases c
    INNER JOIN Clients cl ON c.ClientId = cl.Id
    LEFT JOIN Cases pc ON c.ParentCaseId = pc.Id AND pc.IsDeleted = 0
    LEFT JOIN Users u ON c.AssignedLawyerId = u.Id AND u.IsActive = 1
    LEFT JOIN Persons p ON u.PersonId = p.Id
    WHERE c.Id = @CaseId AND c.IsDeleted = 0;
END;
GO

-- ============================================================================
-- 6. sp_Cases_GetAll
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Cases_GetAll
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @ClientId INT = NULL,
    @AssignedLawyerId INT = NULL,
    @Status NVARCHAR(50) = NULL,
    @IsArchived BIT = NULL,
    @SearchTerm NVARCHAR(100) = NULL,
    @TotalCount INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- حساب الإجمالي للترقيم
    SELECT @TotalCount = COUNT(1)
    FROM Cases c
    INNER JOIN Clients cl ON c.ClientId = cl.Id
    WHERE c.IsDeleted = 0
      AND (@ClientId IS NULL OR c.ClientId = @ClientId)
      AND (@AssignedLawyerId IS NULL OR c.AssignedLawyerId = @AssignedLawyerId)
      AND (@Status IS NULL OR c.Status = @Status)
      AND (@IsArchived IS NULL OR c.IsArchived = @IsArchived)
      AND (@SearchTerm IS NULL 
           OR c.CaseNumber LIKE '%' + @SearchTerm + '%'
           OR c.CourtName LIKE '%' + @SearchTerm + '%'
           OR c.OpponentName LIKE '%' + @SearchTerm + '%'
           OR cl.FullName LIKE '%' + @SearchTerm + '%');

    -- جلب الصفحة المطلوبة مرتبة
    SELECT 
        c.Id,
        c.ClientId,
        cl.FullName AS ClientName,
        c.ParentCaseId,
        c.AssignedLawyerId,
        p.FullName AS AssignedLawyerName,
        c.CaseNumber,
        c.CaseYear,
        c.CaseType,
        c.CourtName,
        c.CourtCircuit,
        c.ClientRole,
        c.OpponentName,
        c.OpponentLawyer,
        c.Subject,
        c.Status,
        c.StartDate,
        c.EndDate,
        c.IsArchived,
        c.CreatedAt
    FROM Cases c
    INNER JOIN Clients cl ON c.ClientId = cl.Id
    LEFT JOIN Users u ON c.AssignedLawyerId = u.Id AND u.IsActive = 1
    LEFT JOIN Persons p ON u.PersonId = p.Id
    WHERE c.IsDeleted = 0
      AND (@ClientId IS NULL OR c.ClientId = @ClientId)
      AND (@AssignedLawyerId IS NULL OR c.AssignedLawyerId = @AssignedLawyerId)
      AND (@Status IS NULL OR c.Status = @Status)
      AND (@IsArchived IS NULL OR c.IsArchived = @IsArchived)
      AND (@SearchTerm IS NULL 
           OR c.CaseNumber LIKE '%' + @SearchTerm + '%'
           OR c.CourtName LIKE '%' + @SearchTerm + '%'
           OR c.OpponentName LIKE '%' + @SearchTerm + '%'
           OR cl.FullName LIKE '%' + @SearchTerm + '%')
    ORDER BY c.Id DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO
