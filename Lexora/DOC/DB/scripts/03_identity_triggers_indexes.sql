USE Lexora;
GO

-- ============================================================================
-- 1. الفهارس الإضافية لتحسين الأداء (Advanced Performance Indexes)
-- ============================================================================

-- فهرس لتسريع البحث عن المستخدمين بالاسم الكامل
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Persons_FullName' AND object_id = OBJECT_ID(N'[dbo].[Persons]'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Persons_FullName ON Persons(FullName);
    PRINT 'Index "IX_Persons_FullName" created.';
END
GO

-- فهرس لتسريع جلب وتصفية سجلات التدقيق حسب نوع العملية وتاريخها
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_AuditLogs_Action_CreatedAt' AND object_id = OBJECT_ID(N'[dbo].[AuditLogs]'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_AuditLogs_Action_CreatedAt ON AuditLogs(Action, CreatedAt DESC);
    PRINT 'Index "IX_AuditLogs_Action_CreatedAt" created.';
END
GO

-- فهرس لتسريع تصفية سجلات التدقيق حسب اسم الكيان والمعرف الخاص به
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_AuditLogs_Entity' AND object_id = OBJECT_ID(N'[dbo].[AuditLogs]'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_AuditLogs_Entity ON AuditLogs(EntityName, EntityId);
    PRINT 'Index "IX_AuditLogs_Entity" created.';
END
GO

-- فهرس لتسريع تنظيف الرموز منتهية الصلاحية
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_RefreshTokens_ExpiresAt' AND object_id = OBJECT_ID(N'[dbo].[RefreshTokens]'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_RefreshTokens_ExpiresAt ON RefreshTokens(ExpiresAt);
    PRINT 'Index "IX_RefreshTokens_ExpiresAt" created.';
END
GO

-- فهرس لتسريع البحث عن صلاحيات معينة داخل دور محدد
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_RolePermissions_PermissionId' AND object_id = OBJECT_ID(N'[dbo].[RolePermissions]'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_RolePermissions_PermissionId ON RolePermissions(PermissionId);
    PRINT 'Index "IX_RolePermissions_PermissionId" created.';
END
GO

-- فهرس لتسريع الاستعلام عن المستخدمين المسندين لدور معين
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_UserRoles_RoleId' AND object_id = OBJECT_ID(N'[dbo].[UserRoles]'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_UserRoles_RoleId ON UserRoles(RoleId);
    PRINT 'Index "IX_UserRoles_RoleId" created.';
END
GO


-- ============================================================================
-- 2. المشغلات التلقائية (Triggers) لتحديث حقول التعديل تلقائياً
-- ============================================================================

-- مشغل لتحديث حقل UpdatedAt تلقائياً عند تعديل أي بيانات في جدول Persons
CREATE OR ALTER TRIGGER trg_Persons_UpdateTimestamp
ON Persons
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted)
    BEGIN
        UPDATE Persons
        SET UpdatedAt = SYSUTCDATETIME()
        FROM Persons p
        INNER JOIN inserted i ON p.Id = i.Id;
    END
END;
GO
PRINT 'Trigger "trg_Persons_UpdateTimestamp" created/updated.';
GO

-- مشغل لتحديث حقل UpdatedAt تلقائياً عند تعديل أي قيمة إعداد في جدول Settings
CREATE OR ALTER TRIGGER trg_Settings_UpdateTimestamp
ON Settings
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted)
    BEGIN
        UPDATE Settings
        SET UpdatedAt = SYSUTCDATETIME()
        FROM Settings s
        INNER JOIN inserted i ON s.Id = i.Id;
    END
END;
GO
PRINT 'Trigger "trg_Settings_UpdateTimestamp" created/updated.';
GO
