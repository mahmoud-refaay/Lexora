SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

USE Lexora;
GO

-- ============================================================================
-- 1. sp_Clients_Create
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Clients_Create
    @ClientType NVARCHAR(50),
    @FullName NVARCHAR(200),
    @NationalId NVARCHAR(50) = NULL,
    @PhoneNumber NVARCHAR(20) = NULL,
    @Email NVARCHAR(150) = NULL,
    @Address NVARCHAR(250) = NULL,
    @Notes NVARCHAR(MAX) = NULL,
    @CreatedByUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- التحقق من تكرار الرقم القومي أو السجل التجاري للعملاء غير المحذوفين
        IF @NationalId IS NOT NULL AND EXISTS (SELECT 1 FROM Clients WHERE NationalId = @NationalId AND IsDeleted = 0)
        BEGIN
            THROW 50005, N'الرقم القومي أو رقم السجل التجاري مدخل بالفعل لعميل آخر.', 1;
        END

        INSERT INTO Clients (
            ClientType, FullName, NationalId, PhoneNumber, Email, Address, Notes, Status, IsDeleted, CreatedAt, CreatedByUserId
        )
        VALUES (
            @ClientType, @FullName, @NationalId, @PhoneNumber, @Email, @Address, @Notes, 'Active', 0, SYSUTCDATETIME(), @CreatedByUserId
        );

        DECLARE @NewClientId INT = SCOPE_IDENTITY();
        SELECT @NewClientId AS ClientId;

    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 2. sp_Clients_Update
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Clients_Update
    @ClientId INT,
    @ClientType NVARCHAR(50),
    @FullName NVARCHAR(200),
    @NationalId NVARCHAR(50) = NULL,
    @PhoneNumber NVARCHAR(20) = NULL,
    @Email NVARCHAR(150) = NULL,
    @Address NVARCHAR(250) = NULL,
    @Notes NVARCHAR(MAX) = NULL,
    @Status NVARCHAR(50),
    @UpdatedByUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- التحقق من وجود العميل
        IF NOT EXISTS (SELECT 1 FROM Clients WHERE Id = @ClientId AND IsDeleted = 0)
        BEGIN
            THROW 50006, N'العميل المطلوب تعديله غير موجود في النظام.', 1;
        END

        -- التحقق من تكرار الرقم القومي مع عميل آخر نشط
        IF @NationalId IS NOT NULL AND EXISTS (SELECT 1 FROM Clients WHERE NationalId = @NationalId AND Id <> @ClientId AND IsDeleted = 0)
        BEGIN
            THROW 50005, N'الرقم القومي أو رقم السجل التجاري مدخل بالفعل لعميل آخر.', 1;
        END

        UPDATE Clients
        SET ClientType = @ClientType,
            FullName = @FullName,
            NationalId = @NationalId,
            PhoneNumber = @PhoneNumber,
            Email = @Email,
            Address = @Address,
            Notes = @Notes,
            Status = @Status,
            UpdatedAt = SYSUTCDATETIME(),
            UpdatedByUserId = @UpdatedByUserId
        WHERE Id = @ClientId;

    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 3. sp_Clients_Delete
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Clients_Delete
    @ClientId INT,
    @DeletedByUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- التحقق من وجود العميل
        IF NOT EXISTS (SELECT 1 FROM Clients WHERE Id = @ClientId AND IsDeleted = 0)
        BEGIN
            THROW 50006, N'العميل المطلوب حذفه غير موجود في النظام.', 1;
        END

        -- التحقق الوقائي من وجود قضايا نشطة (إذا كان جدول القضايا موجوداً)
        IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Cases]') AND type in (N'U'))
        BEGIN
            DECLARE @ActiveCases INT = 0;
            DECLARE @CheckCasesSQL NVARCHAR(MAX) = N'
                SELECT @Count = COUNT(1) FROM Cases 
                WHERE ClientId = @ClientId AND IsDeleted = 0 AND Status <> ''Closed''';
            EXEC sp_executesql @CheckCasesSQL, N'@ClientId INT, @Count INT OUTPUT', @ClientId = @ClientId, @Count = @ActiveCases OUTPUT;
            
            IF @ActiveCases > 0
            BEGIN
                THROW 50010, N'لا يمكن حذف العميل لوجود قضايا نشطة مرتبطة به.', 1;
            END
        END

        -- التحقق الوقائي من وجود مدفوعات مسجلة (إذا كان جدول المدفوعات موجوداً)
        IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Payments]') AND type in (N'U'))
        BEGIN
            DECLARE @PaymentsCount INT = 0;
            DECLARE @CheckPaymentsSQL NVARCHAR(MAX) = N'
                SELECT @Count = COUNT(1) FROM Payments 
                WHERE ClientId = @ClientId AND Status = ''Completed''';
            EXEC sp_executesql @CheckPaymentsSQL, N'@ClientId INT, @Count INT OUTPUT', @ClientId = @ClientId, @Count = @PaymentsCount OUTPUT;
            
            IF @PaymentsCount > 0
            BEGIN
                THROW 50011, N'لا يمكن حذف العميل لوجود عمليات دفع مكتملة مسجلة باسمه. يفضل تغيير حالته إلى Inactive بدلاً من الحذف.', 1;
            END
        END

        -- تنفيذ الحذف المنطقي
        UPDATE Clients
        SET IsDeleted = 1,
            DeletedAt = SYSUTCDATETIME(),
            DeletedByUserId = @DeletedByUserId
        WHERE Id = @ClientId;

    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 4. sp_Clients_GetById
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Clients_GetById
    @ClientId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @ActiveCasesCount INT = 0;
    DECLARE @TotalCasesCount INT = 0;

    -- جلب إحصائيات القضايا بشكل ديناميكي إن وجد جدول القضايا
    IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Cases]') AND type in (N'U'))
    BEGIN
        DECLARE @SQL NVARCHAR(MAX) = N'
            SELECT 
                @Active = COUNT(CASE WHEN Status <> ''Closed'' AND IsDeleted = 0 THEN 1 END),
                @Total = COUNT(CASE WHEN IsDeleted = 0 THEN 1 END)
            FROM Cases 
            WHERE ClientId = @ClientId';
        EXEC sp_executesql @SQL, 
            N'@ClientId INT, @Active INT OUTPUT, @Total INT OUTPUT', 
            @ClientId = @ClientId, @Active = @ActiveCasesCount OUTPUT, @Total = @TotalCasesCount OUTPUT;
    END

    SELECT 
        Id,
        ClientType,
        FullName,
        NationalId,
        PhoneNumber,
        Email,
        Address,
        Notes,
        Status,
        CreatedAt,
        CreatedByUserId,
        UpdatedAt,
        UpdatedByUserId,
        @ActiveCasesCount AS ActiveCasesCount,
        @TotalCasesCount AS TotalCasesCount
    FROM Clients
    WHERE Id = @ClientId AND IsDeleted = 0;
END;
GO

-- ============================================================================
-- 5. sp_Clients_GetAll
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Clients_GetAll
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @SearchTerm NVARCHAR(100) = NULL,
    @Status NVARCHAR(50) = NULL,
    @TotalCount INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- حساب إجمالي السجلات للترقيم
    SELECT @TotalCount = COUNT(1)
    FROM Clients
    WHERE IsDeleted = 0
      AND (@Status IS NULL OR Status = @Status)
      AND (@SearchTerm IS NULL 
           OR FullName LIKE '%' + @SearchTerm + '%'
           OR PhoneNumber LIKE '%' + @SearchTerm + '%'
           OR NationalId LIKE '%' + @SearchTerm + '%');

    -- جلب الصفحة المطلوبة
    SELECT 
        Id,
        ClientType,
        FullName,
        NationalId,
        PhoneNumber,
        Email,
        Address,
        Notes,
        Status,
        CreatedAt,
        CreatedByUserId,
        UpdatedAt,
        UpdatedByUserId
    FROM Clients
    WHERE IsDeleted = 0
      AND (@Status IS NULL OR Status = @Status)
      AND (@SearchTerm IS NULL 
           OR FullName LIKE '%' + @SearchTerm + '%'
           OR PhoneNumber LIKE '%' + @SearchTerm + '%'
           OR NationalId LIKE '%' + @SearchTerm + '%')
    ORDER BY Id DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO

-- ============================================================================
-- 6. sp_Clients_CheckConflict
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Clients_CheckConflict
    @SearchName NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    CREATE TABLE #ConflictResults (
        EntityId INT,
        Name NVARCHAR(200),
        Type NVARCHAR(50),
        Role NVARCHAR(50),
        Status NVARCHAR(50),
        CaseNumber NVARCHAR(100),
        CaseTitle NVARCHAR(200)
    );

    -- 1. البحث في جدول العملاء
    INSERT INTO #ConflictResults (EntityId, Name, Type, Role, Status, CaseNumber, CaseTitle)
    SELECT 
        Id,
        FullName,
        ClientType,
        'Client',
        Status,
        NULL,
        NULL
    FROM Clients
    WHERE IsDeleted = 0 AND FullName LIKE '%' + @SearchName + '%';

    -- 2. البحث في جدول القضايا كخصم (إذا كان الجدول موجوداً في قاعدة البيانات)
    IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Cases]') AND type in (N'U'))
    BEGIN
        DECLARE @SQL NVARCHAR(MAX) = N'
            INSERT INTO #ConflictResults (EntityId, Name, Type, Role, Status, CaseNumber, CaseTitle)
            SELECT 
                Id,
                OpponentName,
                ''Opponent'',
                ''Opponent'',
                Status,
                CaseNumber,
                CaseTitle
            FROM Cases
            WHERE IsDeleted = 0 AND OpponentName LIKE ''%'' + @Name + ''%''';
        EXEC sp_executesql @SQL, N'@Name NVARCHAR(200)', @Name = @SearchName;
    END

    SELECT * FROM #ConflictResults ORDER BY Role ASC, Name ASC;

    DROP TABLE #ConflictResults;
END;
GO
