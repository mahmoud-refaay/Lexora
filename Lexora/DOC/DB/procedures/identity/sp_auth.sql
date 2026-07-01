USE Lexora;
GO

-- ============================================================================
-- 1. sp_Auth_GetUserByUsername
-- الحصول على بيانات المستخدم للتحقق من تسجيل الدخول
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Auth_GetUserByUsername
    @Username NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.Id AS UserId,
        u.Username,
        u.PasswordHash,
        u.IsActive,
        p.Id AS PersonId,
        p.FullName
    FROM Users u
    INNER JOIN Persons p ON u.PersonId = p.Id
    WHERE u.Username = @Username AND u.IsActive = 1;
END;
GO

-- ============================================================================
-- 2. sp_Auth_UpdateLastLogin
-- تسجيل عملية الدخول في جدول التدقيق (AuditLogs) نظراً لعدم وجود حقل LastLogin في جدول المستخدمين
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Auth_UpdateLastLogin
    @UserId INT,
    @IpAddress NVARCHAR(45) = NULL,
    @UserAgent NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO AuditLogs (
            UserId, 
            Action, 
            EntityName, 
            EntityId, 
            OldValues, 
            NewValues, 
            IpAddress, 
            UserAgent, 
            CreatedAt
        )
        VALUES (
            @UserId,
            N'Login',
            N'Users',
            CAST(@UserId AS NVARCHAR(100)),
            NULL,
            N'{"Status": "Success"}',
            @IpAddress,
            @UserAgent,
            SYSUTCDATETIME()
        );
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 3. sp_Auth_ChangePassword
-- تغيير كلمة المرور للمستخدم وتسجيل العملية في جدول التدقيق
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Auth_ChangePassword
    @UserId INT,
    @NewPasswordHash NVARCHAR(500),
    @IpAddress NVARCHAR(45) = NULL,
    @UserAgent NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
            -- تحديث كلمة المرور
            UPDATE Users
            SET PasswordHash = @NewPasswordHash
            WHERE Id = @UserId;
            
            -- تسجيل العملية في AuditLogs
            INSERT INTO AuditLogs (
                UserId, 
                Action, 
                EntityName, 
                EntityId, 
                OldValues, 
                NewValues, 
                IpAddress, 
                UserAgent, 
                CreatedAt
            )
            VALUES (
                @UserId,
                N'ChangePassword',
                N'Users',
                CAST(@UserId AS NVARCHAR(100)),
                N'{"PasswordHash": "[HIDDEN]"}',
                N'{"PasswordHash": "[HIDDEN]"}',
                @IpAddress,
                @UserAgent,
                SYSUTCDATETIME()
            );
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
-- 4. sp_Auth_GetUserPermissions
-- جلب جميع كود الصلاحيات الممنوحة للمستخدم بناءً على أدواره
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_Auth_GetUserPermissions
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT
        p.PermissionCode
    FROM UserRoles ur
    INNER JOIN RolePermissions rp ON ur.RoleId = rp.RoleId
    INNER JOIN Permissions p ON rp.PermissionId = p.Id
    WHERE ur.UserId = @UserId;
END;
GO
