USE Lexora;
GO

-- ============================================================================
-- ROLES PROCEDURES
-- ============================================================================

-- 1. sp_Roles_GetAll
-- جلب جميع الأدوار المتاحة في النظام
CREATE OR ALTER PROCEDURE sp_Roles_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, RoleName, Description, IsSystemRole FROM Roles;
END;
GO

-- 2. sp_Roles_GetById
-- جلب دور محدد بناءً على معرّفه
CREATE OR ALTER PROCEDURE sp_Roles_GetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, RoleName, Description, IsSystemRole FROM Roles WHERE Id = @Id;
END;
GO


-- ============================================================================
-- USER ROLES PROCEDURES
-- ============================================================================

-- 3. sp_UserRoles_Assign
-- إسناد دور معين لمستخدم، مع فحص ما إذا كان الدور مسنداً بالفعل لمنع التكرار
CREATE OR ALTER PROCEDURE sp_UserRoles_Assign
    @UserId INT,
    @RoleId INT,
    @AssignedByUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UserId = @UserId AND RoleId = @RoleId)
        BEGIN
            INSERT INTO UserRoles (UserId, RoleId, AssignedAt, AssignedByUserId)
            VALUES (@UserId, @RoleId, SYSUTCDATETIME(), @AssignedByUserId);
        END
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- 4. sp_UserRoles_Remove
-- إزالة دور من مستخدم مع تطبيق قيود تمنع بقاء المستخدم بدون أدوار إذا كان دور نظام
CREATE OR ALTER PROCEDURE sp_UserRoles_Remove
    @UserId INT,
    @RoleId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- 1. التحقق من وجود الدور مسنداً للمستخدم بالفعل
        IF NOT EXISTS (SELECT 1 FROM UserRoles WHERE UserId = @UserId AND RoleId = @RoleId)
        BEGIN
            THROW 50021, N'هذا الدور غير مسند للمستخدم المطلوب.', 1;
        END

        -- 2. التحقق من عدد الأدوار الحالية للمستخدم
        DECLARE @RolesCount INT;
        SELECT @RolesCount = COUNT(1) FROM UserRoles WHERE UserId = @UserId;
        
        -- إذا كان هذا هو الدور الوحيد للمستخدم، نمنع حذفه منعاً لترك مستخدم بلا دور
        IF @RolesCount <= 1
        BEGIN
            THROW 50020, N'لا يمكن حذف هذا الدور لأنه الدور الوحيد المتبقي للمستخدم في النظام.', 1;
        END
        
        -- 3. حذف الارتباط
        DELETE FROM UserRoles
        WHERE UserId = @UserId AND RoleId = @RoleId;
        
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- 5. sp_UserRoles_GetByUserId
-- جلب كافة الأدوار المسندة لمستخدم محدد
CREATE OR ALTER PROCEDURE sp_UserRoles_GetByUserId
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        r.Id AS RoleId,
        r.RoleName,
        r.Description,
        r.IsSystemRole,
        ur.AssignedAt,
        ur.AssignedByUserId
    FROM UserRoles ur
    INNER JOIN Roles r ON ur.RoleId = r.Id
    WHERE ur.UserId = @UserId;
END;
GO


-- ============================================================================
-- ROLE PERMISSIONS PROCEDURES
-- ============================================================================

-- 6. sp_RolePermissions_GetByRoleId
-- جلب كل الصلاحيات المرتبطة بدور محدد
CREATE OR ALTER PROCEDURE sp_RolePermissions_GetByRoleId
    @RoleId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.Id AS PermissionId,
        p.PermissionCode,
        p.PermissionName,
        p.Description,
        p.ModuleName,
        rp.GrantedAt,
        rp.GrantedByUserId
    FROM RolePermissions rp
    INNER JOIN Permissions p ON rp.PermissionId = p.Id
    WHERE rp.RoleId = @RoleId;
END;
GO

-- 7. sp_Permissions_GetAll
-- جلب كافة صلاحيات النظام مرتبة ومجمعة حسب اسم الموديل (القسم)
CREATE OR ALTER PROCEDURE sp_Permissions_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        PermissionCode,
        PermissionName,
        Description,
        ModuleName
    FROM Permissions
    ORDER BY ModuleName, PermissionName;
END;
GO


-- ============================================================================
-- SETTINGS PROCEDURES
-- ============================================================================

-- 8. sp_Settings_GetAll
-- جلب كافة إعدادات النظام
CREATE OR ALTER PROCEDURE sp_Settings_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        SettingKey,
        SettingValue,
        Description,
        UpdatedAt,
        UpdatedByUserId
    FROM Settings;
END;
GO

-- 9. sp_Settings_GetByKey
-- جلب إعداد محدد بمفتاحه
CREATE OR ALTER PROCEDURE sp_Settings_GetByKey
    @SettingKey NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        SettingKey,
        SettingValue,
        Description,
        UpdatedAt,
        UpdatedByUserId
    FROM Settings
    WHERE SettingKey = @SettingKey;
END;
GO

-- 10. sp_Settings_Update
-- تحديث قيمة إعداد معين وتعديل بيانات التحديث
CREATE OR ALTER PROCEDURE sp_Settings_Update
    @SettingKey NVARCHAR(100),
    @NewValue NVARCHAR(MAX),
    @UpdatedByUserId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE Settings
        SET SettingValue = @NewValue,
            UpdatedAt = SYSUTCDATETIME(),
            UpdatedByUserId = @UpdatedByUserId
        WHERE SettingKey = @SettingKey;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO


-- ============================================================================
-- AUDIT LOGS PROCEDURES
-- ============================================================================

-- 11. sp_AuditLogs_Create
-- إضافة سجل تدقيق جديد للعمليات الحساسة في النظام
CREATE OR ALTER PROCEDURE sp_AuditLogs_Create
    @UserId INT = NULL,
    @Action NVARCHAR(100),
    @EntityName NVARCHAR(100) = NULL,
    @EntityId NVARCHAR(100) = NULL,
    @OldValues NVARCHAR(MAX) = NULL,
    @NewValues NVARCHAR(MAX) = NULL,
    @IpAddress NVARCHAR(45) = NULL,
    @UserAgent NVARCHAR(500) = NULL,
    @TraceId NVARCHAR(100) = NULL
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
            TraceId,
            CreatedAt
        )
        VALUES (
            @UserId,
            @Action,
            @EntityName,
            @EntityId,
            @OldValues,
            @NewValues,
            @IpAddress,
            @UserAgent,
            @TraceId,
            SYSUTCDATETIME()
        );
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- 12. sp_AuditLogs_Search
-- البحث المتقدم والفلترة لسجلات التدقيق مع الترقيم
CREATE OR ALTER PROCEDURE sp_AuditLogs_Search
    @UserId INT = NULL,
    @Action NVARCHAR(100) = NULL,
    @EntityName NVARCHAR(100) = NULL,
    @FromDate DATETIME2 = NULL,
    @ToDate DATETIME2 = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @TotalCount INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- حساب إجمالي السجلات المطابقة
    SELECT @TotalCount = COUNT(1)
    FROM AuditLogs
    WHERE (@UserId IS NULL OR UserId = @UserId)
      AND (@Action IS NULL OR Action = @Action)
      AND (@EntityName IS NULL OR EntityName = @EntityName)
      AND (@FromDate IS NULL OR CreatedAt >= @FromDate)
      AND (@ToDate IS NULL OR CreatedAt <= @ToDate);
      
    -- جلب الصفحة المطلوبة
    SELECT 
        Id,
        UserId,
        Action,
        EntityName,
        EntityId,
        OldValues,
        NewValues,
        IpAddress,
        UserAgent,
        TraceId,
        CreatedAt
    FROM AuditLogs
    WHERE (@UserId IS NULL OR UserId = @UserId)
      AND (@Action IS NULL OR Action = @Action)
      AND (@EntityName IS NULL OR EntityName = @EntityName)
      AND (@FromDate IS NULL OR CreatedAt >= @FromDate)
      AND (@ToDate IS NULL OR CreatedAt <= @ToDate)
    ORDER BY CreatedAt DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO


-- ============================================================================
-- NOTIFICATIONS PROCEDURES
-- ============================================================================

-- 13. sp_Notifications_Create
-- إنشاء إشعار جديد لمستخدم
CREATE OR ALTER PROCEDURE sp_Notifications_Create
    @UserId INT,
    @Message NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO Notifications (UserId, Message, IsRead, CreatedAt)
        VALUES (@UserId, @Message, 0, SYSUTCDATETIME());
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- 14. sp_Notifications_GetByUserId
-- جلب إشعارات مستخدم محدد مع الترقيم وخيار فلترة المقروءة/غير المقروءة
CREATE OR ALTER PROCEDURE sp_Notifications_GetByUserId
    @UserId INT,
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @UnreadOnly BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        UserId,
        Message,
        IsRead,
        CreatedAt,
        ReadAt
    FROM Notifications
    WHERE UserId = @UserId
      AND (@UnreadOnly = 0 OR IsRead = 0)
    ORDER BY CreatedAt DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO

-- 15. sp_Notifications_MarkAsRead
-- تحديد إشعار محدد بأنه مقروء
CREATE OR ALTER PROCEDURE sp_Notifications_MarkAsRead
    @NotificationId INT,
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE Notifications
        SET IsRead = 1,
            ReadAt = SYSUTCDATETIME()
        WHERE Id = @NotificationId AND UserId = @UserId;

        IF @@ROWCOUNT = 0
        BEGIN
            THROW 50030, N'الإشعار المطلوب غير موجود أو لا يخص هذا المستخدم.', 1;
        END
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- 16. sp_Notifications_GetUnreadCount
-- جلب عدد الإشعارات غير المقروءة للمستخدم
CREATE OR ALTER PROCEDURE sp_Notifications_GetUnreadCount
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT COUNT(1) AS UnreadCount
    FROM Notifications
    WHERE UserId = @UserId AND IsRead = 0;
END;
GO
