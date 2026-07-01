USE Lexora;
GO

-- ============================================================================
-- 1. sp_Users_Create
-- إنشاء شخص ومستخدم جديد في معاملة واحدة مع فحص تكرار اسم المستخدم
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Users_Create
    @FullName NVARCHAR(200),
    @PhoneNumber NVARCHAR(20) = NULL,
    @Address NVARCHAR(250) = NULL,
    @Email NVARCHAR(150) = NULL,
    @Username NVARCHAR(50),
    @PasswordHash NVARCHAR(500),
    @CreatedByUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- التحقق من تكرار اسم المستخدم
        IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
        BEGIN
            THROW 50001, N'اسم المستخدم موجود بالفعل في النظام.', 1;
        END

        BEGIN TRANSACTION;
            -- 1. إدخال البيانات في جدول Persons
            INSERT INTO Persons (FullName, PhoneNumber, Address, Email, CreatedAt)
            VALUES (@FullName, @PhoneNumber, @Address, @Email, SYSUTCDATETIME());
            
            DECLARE @NewPersonId INT = SCOPE_IDENTITY();
            
            -- 2. إدخال البيانات في جدول Users
            INSERT INTO Users (PersonId, Username, PasswordHash, IsActive, CreatedAt, CreatedByUserId)
            VALUES (@NewPersonId, @Username, @PasswordHash, 1, SYSUTCDATETIME(), @CreatedByUserId);
            
            DECLARE @NewUserId INT = SCOPE_IDENTITY();
            
        COMMIT TRANSACTION;
        
        -- إرجاع المعرف الجديد للمستخدم
        SELECT @NewUserId AS UserId;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 2. sp_Users_GetById
-- جلب بيانات مستخدم محدد مع بيانات الشخص والأدوار المرتبطة به
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Users_GetById
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.Id AS UserId,
        u.Username,
        u.IsActive,
        u.CreatedAt,
        p.Id AS PersonId,
        p.FullName,
        p.PhoneNumber,
        p.Address,
        p.Email,
        (
            SELECT STRING_AGG(r.RoleName, ', ') 
            FROM UserRoles ur
            INNER JOIN Roles r ON ur.RoleId = r.Id
            WHERE ur.UserId = u.Id
        ) AS RoleNames
    FROM Users u
    INNER JOIN Persons p ON u.PersonId = p.Id
    WHERE u.Id = @UserId;
END;
GO

-- ============================================================================
-- 3. sp_Users_GetAll
-- جلب قائمة مستخدمين مرقمة ومفلترة بالاسم أو اسم المستخدم مع جلب الأدوار
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Users_GetAll
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @SearchTerm NVARCHAR(100) = NULL,
    @TotalCount INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- حساب إجمالي السجلات بناءً على الفلترة
    SELECT @TotalCount = COUNT(1)
    FROM Users u
    INNER JOIN Persons p ON u.PersonId = p.Id
    WHERE (@SearchTerm IS NULL 
           OR u.Username LIKE '%' + @SearchTerm + '%'
           OR p.FullName LIKE '%' + @SearchTerm + '%');

    -- جلب الصفحة المطلوبة
    SELECT 
        u.Id AS UserId,
        u.Username,
        u.IsActive,
        u.CreatedAt,
        p.Id AS PersonId,
        p.FullName,
        p.PhoneNumber,
        p.Address,
        p.Email,
        (
            SELECT STRING_AGG(r.RoleName, ', ') 
            FROM UserRoles ur
            INNER JOIN Roles r ON ur.RoleId = r.Id
            WHERE ur.UserId = u.Id
        ) AS RoleNames
    FROM Users u
    INNER JOIN Persons p ON u.PersonId = p.Id
    WHERE (@SearchTerm IS NULL 
           OR u.Username LIKE '%' + @SearchTerm + '%'
           OR p.FullName LIKE '%' + @SearchTerm + '%')
    ORDER BY u.Id DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO

-- ============================================================================
-- 4. sp_Users_Update
-- تحديث بيانات المستخدم وبيانات الشخص في معاملة واحدة
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Users_Update
    @UserId INT,
    @FullName NVARCHAR(200),
    @PhoneNumber NVARCHAR(20) = NULL,
    @Address NVARCHAR(250) = NULL,
    @Email NVARCHAR(150) = NULL,
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        DECLARE @PersonId INT;
        
        -- جلب معرف الشخص المرتبط بالمستخدم
        SELECT @PersonId = PersonId FROM Users WHERE Id = @UserId;
        
        IF @PersonId IS NULL
        BEGIN
            THROW 50002, N'المستخدم المطلوب تحديثه غير موجود في النظام.', 1;
        END

        BEGIN TRANSACTION;
            -- 1. تحديث الشخص
            UPDATE Persons
            SET FullName = @FullName,
                PhoneNumber = @PhoneNumber,
                Address = @Address,
                Email = @Email,
                UpdatedAt = SYSUTCDATETIME()
            WHERE Id = @PersonId;
            
            -- 2. تحديث حالة المستخدم
            UPDATE Users
            SET IsActive = @IsActive
            WHERE Id = @UserId;
            
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 5. sp_Users_Deactivate
-- تعطيل حساب مستخدم (إلغاء التنشيط)
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Users_Deactivate
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Users WHERE Id = @UserId)
        BEGIN
            THROW 50002, N'المستخدم المطلوب إلغاء تنشيطه غير موجود في النظام.', 1;
        END

        UPDATE Users
        SET IsActive = 0
        WHERE Id = @UserId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO
