-- ===================================================
-- Seed Data: Identity & Security Module
-- Engine: SQL Server
-- Project: Lexora Case Management System
-- Idempotent Script (Safe to re-run multiple times)
-- ===================================================

USE Lexora;
GO

-- ===================================================
-- 1. Seed: Roles
-- ===================================================

IF NOT EXISTS (SELECT 1 FROM Roles WHERE RoleName = N'Admin')
    INSERT INTO Roles (RoleName, Description, IsSystemRole)
    VALUES (N'Admin', N'مدير النظام - يملك كافة الصلاحيات', 1);

IF NOT EXISTS (SELECT 1 FROM Roles WHERE RoleName = N'Lawyer')
    INSERT INTO Roles (RoleName, Description, IsSystemRole)
    VALUES (N'Lawyer', N'محامي - يدير القضايا والجلسات والمستندات', 1);

IF NOT EXISTS (SELECT 1 FROM Roles WHERE RoleName = N'Secretary')
    INSERT INTO Roles (RoleName, Description, IsSystemRole)
    VALUES (N'Secretary', N'سكرتير - يدير المواعيد والمهام والمستندات', 1);

IF NOT EXISTS (SELECT 1 FROM Roles WHERE RoleName = N'Accountant')
    INSERT INTO Roles (RoleName, Description, IsSystemRole)
    VALUES (N'Accountant', N'محاسب - يدير المدفوعات والفواتير والمصروفات', 1);

PRINT 'Roles seeded.';
GO

-- ===================================================
-- 2. Seed: Permissions
-- ===================================================

-- ----------------------
-- Module: Users
-- ----------------------
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'users.view')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'users.view', N'عرض المستخدمين', N'عرض قائمة المستخدمين وبياناتهم', N'Users');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'users.create')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'users.create', N'إنشاء مستخدم', N'إضافة مستخدم جديد للنظام', N'Users');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'users.edit')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'users.edit', N'تعديل مستخدم', N'تعديل بيانات مستخدم موجود', N'Users');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'users.delete')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'users.delete', N'حذف مستخدم', N'تعطيل أو حذف مستخدم من النظام', N'Users');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'users.assign_roles')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'users.assign_roles', N'إسناد أدوار', N'إسناد أو سحب أدوار من المستخدمين', N'Users');

-- ----------------------
-- Module: Roles
-- ----------------------
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'roles.view')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'roles.view', N'عرض الأدوار', N'عرض الأدوار المتاحة في النظام', N'Roles');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'roles.manage')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'roles.manage', N'إدارة الأدوار', N'إنشاء وتعديل وحذف الأدوار وربط الصلاحيات بها', N'Roles');

-- ----------------------
-- Module: Clients
-- ----------------------
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'clients.view')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'clients.view', N'عرض العملاء', N'عرض قائمة العملاء وبياناتهم', N'Clients');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'clients.create')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'clients.create', N'إنشاء عميل', N'إضافة عميل جديد', N'Clients');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'clients.edit')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'clients.edit', N'تعديل عميل', N'تعديل بيانات عميل موجود', N'Clients');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'clients.delete')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'clients.delete', N'حذف عميل', N'حذف عميل منطقياً من النظام', N'Clients');

-- ----------------------
-- Module: Cases
-- ----------------------
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'cases.view')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'cases.view', N'عرض القضايا', N'عرض القضايا وتفاصيلها', N'Cases');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'cases.create')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'cases.create', N'إنشاء قضية', N'فتح قضية جديدة', N'Cases');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'cases.edit')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'cases.edit', N'تعديل قضية', N'تعديل بيانات قضية موجودة', N'Cases');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'cases.delete')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'cases.delete', N'حذف قضية', N'أرشفة أو حذف قضية', N'Cases');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'cases.assign')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'cases.assign', N'إسناد قضية', N'إسناد قضية لمحامي', N'Cases');

-- ----------------------
-- Module: Hearings
-- ----------------------
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'hearings.view')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'hearings.view', N'عرض الجلسات', N'عرض مواعيد ومحاضر الجلسات', N'Hearings');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'hearings.create')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'hearings.create', N'إنشاء جلسة', N'إضافة جلسة جديدة لقضية', N'Hearings');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'hearings.edit')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'hearings.edit', N'تعديل جلسة', N'تعديل بيانات أو نتيجة جلسة', N'Hearings');

-- ----------------------
-- Module: Documents
-- ----------------------
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'documents.view')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'documents.view', N'عرض المستندات', N'عرض وتنزيل المستندات', N'Documents');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'documents.upload')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'documents.upload', N'رفع مستند', N'رفع مستند جديد', N'Documents');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'documents.delete')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'documents.delete', N'حذف مستند', N'أرشفة أو حذف مستند', N'Documents');

-- ----------------------
-- Module: Tasks
-- ----------------------
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'tasks.view')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'tasks.view', N'عرض المهام', N'عرض المهام المسندة', N'Tasks');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'tasks.create')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'tasks.create', N'إنشاء مهمة', N'إضافة مهمة جديدة', N'Tasks');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'tasks.edit')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'tasks.edit', N'تعديل مهمة', N'تعديل أو تحديث حالة مهمة', N'Tasks');

-- ----------------------
-- Module: Payments
-- ----------------------
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'payments.view')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'payments.view', N'عرض المدفوعات', N'عرض سجل المدفوعات', N'Payments');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'payments.create')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'payments.create', N'إنشاء دفعة', N'تسجيل دفعة جديدة', N'Payments');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'payments.edit')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'payments.edit', N'تعديل دفعة', N'تعديل أو إلغاء دفعة', N'Payments');

-- ----------------------
-- Module: Notifications
-- ----------------------
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'notifications.view')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'notifications.view', N'عرض الإشعارات', N'عرض الإشعارات الخاصة بالمستخدم', N'Notifications');

-- ----------------------
-- Module: Settings
-- ----------------------
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'settings.view')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'settings.view', N'عرض الإعدادات', N'عرض إعدادات النظام', N'Settings');

IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'settings.edit')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'settings.edit', N'تعديل الإعدادات', N'تعديل إعدادات النظام', N'Settings');

-- ----------------------
-- Module: AuditLogs
-- ----------------------
IF NOT EXISTS (SELECT 1 FROM Permissions WHERE PermissionCode = N'auditlogs.view')
    INSERT INTO Permissions (PermissionCode, PermissionName, Description, ModuleName)
    VALUES (N'auditlogs.view', N'عرض سجل التدقيق', N'عرض سجل العمليات والتغييرات في النظام', N'AuditLogs');

PRINT 'Permissions seeded.';
GO

-- ===================================================
-- 3. Seed: RolePermissions (Admin gets ALL)
-- ===================================================

-- Admin Role: Grant ALL permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.Id, p.Id
FROM Roles r
CROSS JOIN Permissions p
WHERE r.RoleName = N'Admin'
  AND NOT EXISTS (
      SELECT 1 FROM RolePermissions rp
      WHERE rp.RoleId = r.Id AND rp.PermissionId = p.Id
  );

PRINT 'Admin permissions assigned.';
GO

-- Lawyer Role
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.Id, p.Id
FROM Roles r
CROSS JOIN Permissions p
WHERE r.RoleName = N'Lawyer'
  AND p.PermissionCode IN (
      N'clients.view', N'clients.create', N'clients.edit',
      N'cases.view', N'cases.create', N'cases.edit', N'cases.assign',
      N'hearings.view', N'hearings.create', N'hearings.edit',
      N'documents.view', N'documents.upload',
      N'tasks.view', N'tasks.create', N'tasks.edit',
      N'payments.view',
      N'notifications.view'
  )
  AND NOT EXISTS (
      SELECT 1 FROM RolePermissions rp
      WHERE rp.RoleId = r.Id AND rp.PermissionId = p.Id
  );

PRINT 'Lawyer permissions assigned.';
GO

-- Secretary Role
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.Id, p.Id
FROM Roles r
CROSS JOIN Permissions p
WHERE r.RoleName = N'Secretary'
  AND p.PermissionCode IN (
      N'clients.view', N'clients.create', N'clients.edit',
      N'cases.view',
      N'hearings.view', N'hearings.create', N'hearings.edit',
      N'documents.view', N'documents.upload',
      N'tasks.view', N'tasks.create', N'tasks.edit',
      N'notifications.view'
  )
  AND NOT EXISTS (
      SELECT 1 FROM RolePermissions rp
      WHERE rp.RoleId = r.Id AND rp.PermissionId = p.Id
  );

PRINT 'Secretary permissions assigned.';
GO

-- Accountant Role
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.Id, p.Id
FROM Roles r
CROSS JOIN Permissions p
WHERE r.RoleName = N'Accountant'
  AND p.PermissionCode IN (
      N'clients.view',
      N'cases.view',
      N'payments.view', N'payments.create', N'payments.edit',
      N'documents.view', N'documents.upload',
      N'notifications.view'
  )
  AND NOT EXISTS (
      SELECT 1 FROM RolePermissions rp
      WHERE rp.RoleId = r.Id AND rp.PermissionId = p.Id
  );

PRINT 'Accountant permissions assigned.';
GO

-- ===================================================
-- 4. Seed: Super Admin Account
-- Password: Admin@123 (hashed with BCrypt)
-- IMPORTANT: Change this password after first login!
-- ===================================================

-- Step 1: Create Person record
IF NOT EXISTS (SELECT 1 FROM Persons WHERE FullName = N'مدير النظام')
BEGIN
    INSERT INTO Persons (FullName, PhoneNumber)
    VALUES (N'مدير النظام', N'0000000000');
    PRINT 'Admin person created.';
END
GO

-- Step 2: Create User account
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = N'admin')
BEGIN
    DECLARE @AdminPersonId INT;
    SELECT @AdminPersonId = Id FROM Persons WHERE FullName = N'مدير النظام';

    IF @AdminPersonId IS NOT NULL
    BEGIN
        INSERT INTO Users (PersonId, Username, PasswordHash, IsActive)
        VALUES (
            @AdminPersonId,
            N'admin',
            -- Placeholder hash - MUST be replaced by the application at first run
            N'$PLACEHOLDER_HASH_REPLACE_AT_FIRST_RUN$',
            1
        );
        PRINT 'Admin user created.';
    END
END
GO

-- Step 3: Assign Admin role
IF NOT EXISTS (
    SELECT 1 FROM UserRoles ur
    INNER JOIN Users u ON ur.UserId = u.Id
    INNER JOIN Roles r ON ur.RoleId = r.Id
    WHERE u.Username = N'admin' AND r.RoleName = N'Admin'
)
BEGIN
    DECLARE @AdminUserId INT;
    DECLARE @AdminRoleId INT;

    SELECT @AdminUserId = Id FROM Users WHERE Username = N'admin';
    SELECT @AdminRoleId = Id FROM Roles WHERE RoleName = N'Admin';

    IF @AdminUserId IS NOT NULL AND @AdminRoleId IS NOT NULL
    BEGIN
        INSERT INTO UserRoles (UserId, RoleId)
        VALUES (@AdminUserId, @AdminRoleId);
        PRINT 'Admin role assigned to admin user.';
    END
END
GO

-- ===================================================
-- 5. Seed: Default Settings
-- ===================================================

IF NOT EXISTS (SELECT 1 FROM Settings WHERE SettingKey = N'system.name')
    INSERT INTO Settings (SettingKey, SettingValue, Description)
    VALUES (N'system.name', N'Lexora', N'اسم النظام');

IF NOT EXISTS (SELECT 1 FROM Settings WHERE SettingKey = N'system.language')
    INSERT INTO Settings (SettingKey, SettingValue, Description)
    VALUES (N'system.language', N'ar', N'اللغة الافتراضية');

IF NOT EXISTS (SELECT 1 FROM Settings WHERE SettingKey = N'system.timezone')
    INSERT INTO Settings (SettingKey, SettingValue, Description)
    VALUES (N'system.timezone', N'Africa/Cairo', N'المنطقة الزمنية');

IF NOT EXISTS (SELECT 1 FROM Settings WHERE SettingKey = N'auth.access_token_expiry_minutes')
    INSERT INTO Settings (SettingKey, SettingValue, Description)
    VALUES (N'auth.access_token_expiry_minutes', N'15', N'مدة صلاحية Access Token بالدقائق');

IF NOT EXISTS (SELECT 1 FROM Settings WHERE SettingKey = N'auth.refresh_token_expiry_days')
    INSERT INTO Settings (SettingKey, SettingValue, Description)
    VALUES (N'auth.refresh_token_expiry_days', N'14', N'مدة صلاحية Refresh Token بالأيام');

IF NOT EXISTS (SELECT 1 FROM Settings WHERE SettingKey = N'auth.max_failed_login_attempts')
    INSERT INTO Settings (SettingKey, SettingValue, Description)
    VALUES (N'auth.max_failed_login_attempts', N'5', N'أقصى عدد محاولات تسجيل دخول فاشلة قبل القفل');

IF NOT EXISTS (SELECT 1 FROM Settings WHERE SettingKey = N'auth.lockout_duration_minutes')
    INSERT INTO Settings (SettingKey, SettingValue, Description)
    VALUES (N'auth.lockout_duration_minutes', N'30', N'مدة قفل الحساب بعد تجاوز المحاولات بالدقائق');

PRINT 'Default settings seeded.';
GO

PRINT '==========================================';
PRINT 'Seed data completed successfully!';
PRINT '==========================================';
GO
