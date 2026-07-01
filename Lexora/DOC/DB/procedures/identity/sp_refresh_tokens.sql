USE Lexora;
GO

-- ============================================================================
-- 1. sp_RefreshTokens_Create
-- إنشاء رمز تحديث جديد
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_RefreshTokens_Create
    @UserId INT,
    @FamilyId NVARCHAR(100),
    @TokenHash NVARCHAR(500),
    @ExpiresAt DATETIME2,
    @CreatedByIp NVARCHAR(45) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO RefreshTokens (
            UserId,
            FamilyId,
            TokenHash,
            ExpiresAt,
            CreatedAt,
            CreatedByIp
        )
        VALUES (
            @UserId,
            @FamilyId,
            @TokenHash,
            @ExpiresAt,
            SYSUTCDATETIME(),
            @CreatedByIp
        );
        
        SELECT SCOPE_IDENTITY() AS Id;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 2. sp_RefreshTokens_GetByTokenHash
-- جلب الرمز بناءً على الهاش الخاص به للتحقق منه
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_RefreshTokens_GetByTokenHash
    @TokenHash NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        UserId,
        FamilyId,
        TokenHash,
        ExpiresAt,
        CreatedAt,
        CreatedByIp,
        RevokedAt,
        RevokedByIp,
        ReplacedByTokenId,
        RevokeReason
    FROM RefreshTokens
    WHERE TokenHash = @TokenHash;
END;
GO

-- ============================================================================
-- 3. sp_RefreshTokens_Rotate
-- تدوير الرمز (استبدال الرمز القديم بجديد) ومعالجة هجمات إعادة التشغيل Replay Attacks
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_RefreshTokens_Rotate
    @OldTokenHash NVARCHAR(500),
    @NewTokenHash NVARCHAR(500),
    @NewExpiresAt DATETIME2,
    @ClientIp NVARCHAR(45) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        DECLARE @UserId INT;
        DECLARE @FamilyId NVARCHAR(100);
        DECLARE @OldTokenId INT;
        DECLARE @OldRevokedAt DATETIME2;
        DECLARE @OldExpiresAt DATETIME2;
        
        -- جلب بيانات الرمز القديم
        SELECT 
            @OldTokenId = Id,
            @UserId = UserId,
            @FamilyId = FamilyId,
            @OldRevokedAt = RevokedAt,
            @OldExpiresAt = ExpiresAt
        FROM RefreshTokens
        WHERE TokenHash = @OldTokenHash;
        
        -- إذا لم يتم العثور على الرمز
        IF @OldTokenId IS NULL
        BEGIN
            THROW 50012, N'رمز التحديث غير صالح أو غير موجود.', 1;
        END
        
        -- التحقق من هجمات إعادة التشغيل (إذا كان الرمز ملغياً بالفعل)
        IF @OldRevokedAt IS NOT NULL
        BEGIN
            BEGIN TRANSACTION;
                -- إلغاء كافة الرموز المرتبطة بنفس العائلة كإجراء أمان حاسم
                UPDATE RefreshTokens
                SET RevokedAt = SYSUTCDATETIME(),
                    RevokedByIp = @ClientIp,
                    RevokeReason = N'Replay Attack Detected'
                WHERE FamilyId = @FamilyId AND RevokedAt IS NULL;
                
            COMMIT TRANSACTION;
            
            THROW 50010, N'تم كشف محاولة اختراق وإعادة استخدام رمز ملغى. تم إلغاء كافة رموز الجلسة للأمان.', 1;
        END
        
        -- التحقق من انتهاء الصلاحية للرمز القديم
        IF @OldExpiresAt < SYSUTCDATETIME()
        BEGIN
            THROW 50011, N'رمز التحديث منتهي الصلاحية.', 1;
        END
        
        BEGIN TRANSACTION;
            -- 1. إلغاء الرمز القديم
            UPDATE RefreshTokens
            SET RevokedAt = SYSUTCDATETIME(),
                RevokedByIp = @ClientIp,
                RevokeReason = N'Rotated'
            WHERE Id = @OldTokenId;
            
            -- 2. إنشاء الرمز الجديد بنفس العائلة والمستخدم
            INSERT INTO RefreshTokens (
                UserId,
                FamilyId,
                TokenHash,
                ExpiresAt,
                CreatedAt,
                CreatedByIp
            )
            VALUES (
                @UserId,
                @FamilyId,
                @NewTokenHash,
                @NewExpiresAt,
                SYSUTCDATETIME(),
                @ClientIp
            );
            
            DECLARE @NewTokenId INT = SCOPE_IDENTITY();
            
            -- 3. ربط الرمز القديم بالجديد لمعرفة تسلسل الاستبدال
            UPDATE RefreshTokens
            SET ReplacedByTokenId = @NewTokenId
            WHERE Id = @OldTokenId;
            
        COMMIT TRANSACTION;
        
        -- إرجاع المعرف الجديد ومعرف المستخدم
        SELECT @NewTokenId AS NewTokenId, @UserId AS UserId;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 4. sp_RefreshTokens_RevokeByUserId
-- إلغاء تنشيط كافة رموز المستخدم النشطة (تسجيل الخروج من كل الأجهزة)
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_RefreshTokens_RevokeByUserId
    @UserId INT,
    @Reason NVARCHAR(255) = NULL,
    @ClientIp NVARCHAR(45) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE RefreshTokens
        SET RevokedAt = SYSUTCDATETIME(),
            RevokedByIp = @ClientIp,
            RevokeReason = ISNULL(@Reason, N'Force Revocation')
        WHERE UserId = @UserId AND RevokedAt IS NULL AND ExpiresAt > SYSUTCDATETIME();
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 5. sp_RefreshTokens_CleanupExpired
-- تنظيف وحذف الرموز منتهية الصلاحية والملغاة التي مر عليها عدد معين من الأيام لصيانة قاعدة البيانات
-- ============================================================================
CREATE OR ALTER PROCEDURE sp_RefreshTokens_CleanupExpired
    @DaysOld INT = 30
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        DELETE FROM RefreshTokens
        WHERE (ExpiresAt < SYSUTCDATETIME() OR RevokedAt IS NOT NULL)
          AND CreatedAt < DATEADD(DAY, -@DaysOld, SYSUTCDATETIME());
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;
GO
