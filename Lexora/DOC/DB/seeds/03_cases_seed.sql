-- ===================================================
-- Seed Data: Clients, ClientNotes, Cases & Case Notes
-- Engine: SQL Server
-- Project: Lexora Case Management System
-- Idempotent Script (Safe to run multiple times)
-- ===================================================

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

USE Lexora;
GO

PRINT '==========================================';
PRINT 'Starting Expanded Seed Data...';
PRINT '==========================================';
GO

-- 1. Get Admin User Id for tracking
DECLARE @AdminUserId INT;
SELECT @AdminUserId = Id FROM Users WHERE Username = N'admin';

-- ===================================================
-- Step 1: Seed Clients (8 Clients)
-- ===================================================

-- Client 1
IF NOT EXISTS (SELECT 1 FROM Clients WHERE FullName = N'محمد أحمد السعيد')
BEGIN
    INSERT INTO Clients (ClientType, FullName, NationalId, PhoneNumber, Email, Address, Notes, Status, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (N'Individual', N'محمد أحمد السعيد', N'29001011234567', N'01012345678', N'mohamed.saeed@example.com', N'الدقي، الجيزة، مصر', N'عميل مستمر للمكتب بخصوص النزاعات التجارية والسكنية', N'Active', 0, @AdminUserId, SYSUTCDATETIME());
    PRINT 'Client "محمد أحمد السعيد" created.';
END

-- Client 2
IF NOT EXISTS (SELECT 1 FROM Clients WHERE FullName = N'شركة الأهرام للاستيراد والتصدير')
BEGIN
    INSERT INTO Clients (ClientType, FullName, NationalId, PhoneNumber, Email, Address, Notes, Status, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (N'Company', N'شركة الأهرام للاستيراد والتصدير', N'100200300', N'0233445566', N'info@ahram-import.com', N'المنطقة الحرة، مدينة نصر، القاهرة', N'شركة كبرى، يتم تمثيلها في القضايا العمالية والتجارية وتخليص الشحنات', N'Active', 0, @AdminUserId, SYSUTCDATETIME());
    PRINT 'Client "شركة الأهرام" created.';
END

-- Client 3
IF NOT EXISTS (SELECT 1 FROM Clients WHERE FullName = N'سارة محمود عبد العزيز')
BEGIN
    INSERT INTO Clients (ClientType, FullName, NationalId, PhoneNumber, Email, Address, Notes, Status, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (N'Individual', N'سارة محمود عبد العزيز', N'29505051234567', N'01122334455', N'sara.mahme@example.com', N'المعادي، القاهرة، مصر', N'تتعامل مع المكتب في قضايا الأحوال الشخصية والأسرة والوراثة', N'Active', 0, @AdminUserId, SYSUTCDATETIME());
    PRINT 'Client "سارة محمود عبد العزيز" created.';
END

-- Client 4
IF NOT EXISTS (SELECT 1 FROM Clients WHERE FullName = N'أحمد رأفت الهواري')
BEGIN
    INSERT INTO Clients (ClientType, FullName, NationalId, PhoneNumber, Email, Address, Notes, Status, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (N'Individual', N'أحمد رأفت الهواري', N'28503031234567', N'01233445566', N'ahmed.hawary@example.com', N'مصر الجديدة، القاهرة، مصر', N'رجل أعمال، نزاعات تجارية ومدنية وشيكات بدون رصيد', N'Active', 0, @AdminUserId, SYSUTCDATETIME());
    PRINT 'Client "أحمد رأفت الهواري" created.';
END

-- Client 5
IF NOT EXISTS (SELECT 1 FROM Clients WHERE FullName = N'مؤسسة الرواد للمقاولات')
BEGIN
    INSERT INTO Clients (ClientType, FullName, NationalId, PhoneNumber, Email, Address, Notes, Status, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (N'Company', N'مؤسسة الرواد للمقاولات', N'400500600', N'0222778899', N'contact@alrowad.com', N'التجمع الخامس، القاهرة الجديدة', N'مؤسسة مقاولات وإنشاءات، نزاعات عقود مقاولات وتأخير تسليم ومستخلصات مالية', N'Active', 0, @AdminUserId, SYSUTCDATETIME());
    PRINT 'Client "مؤسسة الرواد للمقاولات" created.';
END

-- Client 6
IF NOT EXISTS (SELECT 1 FROM Clients WHERE FullName = N'خديجة عمر الفاروق')
BEGIN
    INSERT INTO Clients (ClientType, FullName, NationalId, PhoneNumber, Email, Address, Notes, Status, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (N'Individual', N'خديجة عمر الفاروق', N'29208081234567', N'01555667788', N'khadija.omer@example.com', N'العجوزة، الجيزة، مصر', N'نزاعات إيجارية ومستأجرين وشقق سكنية', N'Active', 0, @AdminUserId, SYSUTCDATETIME());
    PRINT 'Client "خديجة عمر الفاروق" created.';
END

-- Client 7
IF NOT EXISTS (SELECT 1 FROM Clients WHERE FullName = N'يوسف حسن الجبالي')
BEGIN
    INSERT INTO Clients (ClientType, FullName, NationalId, PhoneNumber, Email, Address, Notes, Status, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (N'Individual', N'يوسف حسن الجبالي', N'28004041234567', N'01099887766', N'youssef.jebali@example.com', N'شبرا، القاهرة، مصر', N'نزاع تسوية مستحقات وظيفية مع جهة إدارية حكومية ومجلس الدولة', N'Active', 0, @AdminUserId, SYSUTCDATETIME());
    PRINT 'Client "يوسف حسن الجبالي" created.';
END

-- Client 8
IF NOT EXISTS (SELECT 1 FROM Clients WHERE FullName = N'شركة النور للخدمات البترولية')
BEGIN
    INSERT INTO Clients (ClientType, FullName, NationalId, PhoneNumber, Email, Address, Notes, Status, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (N'Company', N'شركة النور للخدمات البترولية', N'700800900', N'0222998877', N'legal@alnoor-petroleum.com', N'القرية الذكية، طريق مصر إسكندرية الصحراوي', N'شركة خدمات بترولية، قضايا عمالية كبرى وعقود توريد وتأجير معدات', N'Active', 0, @AdminUserId, SYSUTCDATETIME());
    PRINT 'Client "شركة النور للخدمات البترولية" created.';
END
GO

-- ===================================================
-- Step 2: Seed ClientNotes
-- ===================================================
DECLARE @AdminUserId INT;
SELECT @AdminUserId = Id FROM Users WHERE Username = N'admin';

DECLARE @ClId1 INT, @ClId2 INT, @ClId3 INT, @ClId5 INT;
SELECT @ClId1 = Id FROM Clients WHERE FullName = N'محمد أحمد السعيد';
SELECT @ClId2 = Id FROM Clients WHERE FullName = N'شركة الأهرام للاستيراد والتصدير';
SELECT @ClId3 = Id FROM Clients WHERE FullName = N'سارة محمود عبد العزيز';
SELECT @ClId5 = Id FROM Clients WHERE FullName = N'مؤسسة الرواد للمقاولات';

-- ملاحظات العميل الأول
IF @ClId1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ClientNotes WHERE ClientId = @ClId1)
BEGIN
    INSERT INTO ClientNotes (ClientId, Note, CreatedByUserId, CreatedAt)
    VALUES (@ClId1, N'العميل يفضل التواصل عبر الواتساب ويفضل الحضور للمكتب مساءً.', @AdminUserId, SYSUTCDATETIME());
    INSERT INTO ClientNotes (ClientId, Note, CreatedByUserId, CreatedAt)
    VALUES (@ClId1, N'تم تسلم التوكيل الرسمي العام للقضايا رقم 2451 حرف ب لسنة 2024 توثيق الأهرام.', @AdminUserId, DATEADD(hour, 1, SYSUTCDATETIME()));
END

-- ملاحظات العميل الثاني
IF @ClId2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ClientNotes WHERE ClientId = @ClId2)
BEGIN
    INSERT INTO ClientNotes (ClientId, Note, CreatedByUserId, CreatedAt)
    VALUES (@ClId2, N'تم الاتفاق على نظام سنوي للاستشارات والتمثيل القانوني بموجب عقد موقع في يناير 2025.', @AdminUserId, SYSUTCDATETIME());
    INSERT INTO ClientNotes (ClientId, Note, CreatedByUserId, CreatedAt)
    VALUES (@ClId2, N'الشخص المسؤول عن المتابعة هو الأستاذ مجدي إبراهيم مدير الشؤون القانونية بالشركة.', @AdminUserId, DATEADD(hour, 1, SYSUTCDATETIME()));
END

-- ملاحظات العميل الثالث
IF @ClId3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ClientNotes WHERE ClientId = @ClId3)
BEGIN
    INSERT INTO ClientNotes (ClientId, Note, CreatedByUserId, CreatedAt)
    VALUES (@ClId3, N'قضايا حساسة تخص النفقات والحضانة، يجب التعامل معها بسرية تامة وعدم إعطاء معلومات إلا للموكلة شخصياً.', @AdminUserId, SYSUTCDATETIME());
END

-- ملاحظات العميل الخامس
IF @ClId5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ClientNotes WHERE ClientId = @ClId5)
BEGIN
    INSERT INTO ClientNotes (ClientId, Note, CreatedByUserId, CreatedAt)
    VALUES (@ClId5, N'متابعة مستمرة لعقود التوريد والمقاولات مع مكاتب الاستشارات الهندسية.', @AdminUserId, SYSUTCDATETIME());
END
GO

-- ===================================================
-- Step 3: Seed Cases (12 Cases covering various scopes)
-- ===================================================
DECLARE @AdminUserId INT;
SELECT @AdminUserId = Id FROM Users WHERE Username = N'admin';

DECLARE @Cl1 INT, @Cl2 INT, @Cl3 INT, @Cl4 INT, @Cl5 INT, @Cl6 INT, @Cl7 INT, @Cl8 INT;
SELECT @Cl1 = Id FROM Clients WHERE FullName = N'محمد أحمد السعيد';
SELECT @Cl2 = Id FROM Clients WHERE FullName = N'شركة الأهرام للاستيراد والتصدير';
SELECT @Cl3 = Id FROM Clients WHERE FullName = N'سارة محمود عبد العزيز';
SELECT @Cl4 = Id FROM Clients WHERE FullName = N'أحمد رأفت الهواري';
SELECT @Cl5 = Id FROM Clients WHERE FullName = N'مؤسسة الرواد للمقاولات';
SELECT @Cl6 = Id FROM Clients WHERE FullName = N'خديجة عمر الفاروق';
SELECT @Cl7 = Id FROM Clients WHERE FullName = N'يوسف حسن الجبالي';
SELECT @Cl8 = Id FROM Clients WHERE FullName = N'شركة النور للخدمات البترولية';

-- Case 1: المدني الكلي - تعويض
IF @Cl1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE ClientId = @Cl1 AND CaseNumber = N'1524' AND CaseYear = 2025)
BEGIN
    INSERT INTO Cases (ClientId, ParentCaseId, AssignedLawyerId, CaseNumber, CaseYear, CaseType, CourtName, CourtCircuit, ClientRole, OpponentName, OpponentLawyer, Subject, Status, StartDate, EndDate, IsArchived, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (
        @Cl1, NULL, @AdminUserId, N'1524', 2025, N'مدني كلي تعويضات', N'محكمة الجيزة الابتدائية', N'الدائرة 3 تعويضات كلي', N'Plaintiff', 
        N'خالد مصطفى الجمال', N'أشرف عبد الرحيم المحامي',
        N'طالب بمبلغ 150,000 جنيه كتعويض عن الأضرار المادية والأدبية التي لحقت بالموكل نتيجة إخلال الخصم بعقد البيع المبرم بينهما.',
        N'Open', '2025-09-01', NULL, 0, 0, @AdminUserId, SYSUTCDATETIME()
    );
    PRINT 'Case 1 (Civil Compensation) created.';
END

-- Case 2: استئناف قضية التعويض (توضيح درجات التقاضي)
DECLARE @ParentCaseId INT;
SELECT @ParentCaseId = Id FROM Cases WHERE ClientId = @Cl1 AND CaseNumber = N'1524' AND CaseYear = 2025;

IF @Cl1 IS NOT NULL AND @ParentCaseId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE ClientId = @Cl1 AND CaseNumber = N'8430' AND CaseYear = 2026)
BEGIN
    INSERT INTO Cases (ClientId, ParentCaseId, AssignedLawyerId, CaseNumber, CaseYear, CaseType, CourtName, CourtCircuit, ClientRole, OpponentName, OpponentLawyer, Subject, Status, StartDate, EndDate, IsArchived, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (
        @Cl1, @ParentCaseId, @AdminUserId, N'8430', 2026, N'استئناف مدني تعويضات', N'محكمة استئناف عالي الجيزة', N'الدائرة 11 عالي مدني', N'Plaintiff', 
        N'خالد مصطفى الجمال', N'أشرف عبد الرحيم المحامي',
        N'استئناف الحكم الصادر لصالح الخصم ابتدائياً لزيادة قيمة التعويض المقضي به ومطالبة بكامل التعويض الاتفاقي.',
        N'Open', '2026-05-10', NULL, 0, 0, @AdminUserId, SYSUTCDATETIME()
    );
    PRINT 'Case 2 (Appeal Civil Case) created.';
END

-- Case 3: عمالي جزئي - موظف ضد الشركة
IF @Cl2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE ClientId = @Cl2 AND CaseNumber = N'982' AND CaseYear = 2026)
BEGIN
    INSERT INTO Cases (ClientId, ParentCaseId, AssignedLawyerId, CaseNumber, CaseYear, CaseType, CourtName, CourtCircuit, ClientRole, OpponentName, OpponentLawyer, Subject, Status, StartDate, EndDate, IsArchived, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (
        @Cl2, NULL, @AdminUserId, N'982', 2026, N'عمالي جزئي', N'محكمة القاهرة الجديدة العمالية', N'الدائرة 2 عمال مستعجل', N'Defendant', 
        N'محمود عبد الكريم رأفت (موظف سابق)', N'مكتب العدالة للمحاماة',
        N'دعوى مرفوعة من الموظف السابق يدعي فيها الفصل التعسفي ويطالب بمستحقات مالية متأخرة ومكافأة نهاية الخدمة وتعويض عن إنهاء العقد.',
        N'Pending', '2026-02-15', NULL, 0, 0, @AdminUserId, SYSUTCDATETIME()
    );
    PRINT 'Case 3 (Labor Dispute) created.';
END

-- Case 4: جنائي جنح مستأنف (تبديد شيك)
IF @Cl4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE ClientId = @Cl4 AND CaseNumber = N'412' AND CaseYear = 2024)
BEGIN
    INSERT INTO Cases (ClientId, ParentCaseId, AssignedLawyerId, CaseNumber, CaseYear, CaseType, CourtName, CourtCircuit, ClientRole, OpponentName, OpponentLawyer, Subject, Status, StartDate, EndDate, IsArchived, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (
        @Cl4, NULL, @AdminUserId, N'412', 2024, N'جنائي جنح مستأنف', N'محكمة جنح العجوزة المستأنفة', N'الدائرة 5 جنح مستأنف', N'Defendant', 
        N'بنك مصر ش.م.م', N'مستشارو البنك القانونيون',
        N'قضية جنحة شيك بدون رصيد مرفوعة ضد العميل من قبل البنك، وصدر ضده حكم غيابي بالحبس وتم عمل معارضة استئنافية للتصالح والسداد.',
        N'Closed', '2024-03-01', '2024-08-20', 0, 0, @AdminUserId, SYSUTCDATETIME()
    );
    PRINT 'Case 4 (Criminal Check Case) created.';
END

-- Case 5: تجاري إفلاس وحراسة
IF @Cl5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE ClientId = @Cl5 AND CaseNumber = N'703' AND CaseYear = 2025)
BEGIN
    INSERT INTO Cases (ClientId, ParentCaseId, AssignedLawyerId, CaseNumber, CaseYear, CaseType, CourtName, CourtCircuit, ClientRole, OpponentName, OpponentLawyer, Subject, Status, StartDate, EndDate, IsArchived, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (
        @Cl5, NULL, @AdminUserId, N'703', 2025, N'تجاري إفلاس وحراسة', N'المحكمة الاقتصادية بالقاهرة', N'الدائرة 1 إفلاس كلي', N'Plaintiff', 
        N'شركة الصفا للمقاولات والتجارة', N'يسري الشافعي المحامي',
        N'دعوى شهر إفلاس وتعيين أمين تفليسة وحراسة قضائية ضد الشركة المدعى عليها نتيجة توقفها عن سداد الديون المستحقة لموكلنا البالغة 2.5 مليون جنيه.',
        N'Open', '2025-11-20', NULL, 0, 0, @AdminUserId, SYSUTCDATETIME()
    );
    PRINT 'Case 5 (Commercial Bankruptcy) created.';
END

-- Case 6: أسرة أحوال شخصية (نفقة)
IF @Cl3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE ClientId = @Cl3 AND CaseNumber = N'339' AND CaseYear = 2026)
BEGIN
    INSERT INTO Cases (ClientId, ParentCaseId, AssignedLawyerId, CaseNumber, CaseYear, CaseType, CourtName, CourtCircuit, ClientRole, OpponentName, OpponentLawyer, Subject, Status, StartDate, EndDate, IsArchived, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (
        @Cl3, NULL, @AdminUserId, N'339', 2026, N'أسرة أحوال شخصية', N'محكمة أسرة الدقي', N'الدائرة 2 نفقة ومتعة', N'Plaintiff', 
        N'حسام جلال المرشدي (مطلق الموكلة)', N'عادل عبد الهادي المحامي',
        N'دعوى فرض نفقة صغار بأنواعها ونفقة زوجية متأخرة ضد طليق الموكلة، وتحديد دخل الخصم الحقيقي ومستحقات الموكلة.',
        N'Scheduled', '2026-01-10', NULL, 0, 0, @AdminUserId, SYSUTCDATETIME()
    );
    PRINT 'Case 6 (Family Court Case) created.';
END

-- Case 7: مدني مستعجل - طرد للإيجار
IF @Cl6 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE ClientId = @Cl6 AND CaseNumber = N'1055' AND CaseYear = 2025)
BEGIN
    INSERT INTO Cases (ClientId, ParentCaseId, AssignedLawyerId, CaseNumber, CaseYear, CaseType, CourtName, CourtCircuit, ClientRole, OpponentName, OpponentLawyer, Subject, Status, StartDate, EndDate, IsArchived, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (
        @Cl6, NULL, @AdminUserId, N'1055', 2025, N'مدني مستعجل طرد', N'محكمة شمال القاهرة الابتدائية', N'الدائرة 8 إيجارات مستعجل', N'Plaintiff', 
        N'عبد الحميد وائل شريف', N'شريف النجار المحامي',
        N'دعوى طرد المستأجر من الشقة السكنية المملوكة للموكلة نتيجة تأخره في سداد الأجرة الشهرية لأكثر من 6 أشهر.',
        N'Closed', '2025-04-05', '2025-10-15', 0, 0, @AdminUserId, SYSUTCDATETIME()
    );
    PRINT 'Case 7 (Tenant Eviction Primary) created.';
END

-- Case 8: استئناف طرد الإيجار (درجات التقاضي)
DECLARE @ParentCaseId2 INT;
SELECT @ParentCaseId2 = Id FROM Cases WHERE ClientId = @Cl6 AND CaseNumber = N'1055' AND CaseYear = 2025;

IF @Cl6 IS NOT NULL AND @ParentCaseId2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE ClientId = @Cl6 AND CaseNumber = N'2215' AND CaseYear = 2026)
BEGIN
    INSERT INTO Cases (ClientId, ParentCaseId, AssignedLawyerId, CaseNumber, CaseYear, CaseType, CourtName, CourtCircuit, ClientRole, OpponentName, OpponentLawyer, Subject, Status, StartDate, EndDate, IsArchived, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (
        @Cl6, @ParentCaseId2, @AdminUserId, N'2215', 2026, N'استئناف عالي إيجارات طرد', N'محكمة استئناف عالي القاهرة', N'الدائرة 15 عالي إيجارات', N'Defendant', 
        N'عبد الحميد وائل شريف', N'شريف النجار المحامي',
        N'الخصم قام بعمل استئناف على حكم الطرد الصادر لصالح موكلتنا ابتدائياً، ونقوم بالدفاع عن الحكم الابتدائي وحضور جلسات الاستئناف.',
        N'Open', '2026-03-20', NULL, 0, 0, @AdminUserId, SYSUTCDATETIME()
    );
    PRINT 'Case 8 (Appeal Tenant Eviction) created.';
END

-- Case 9: مجلس الدولة - إداري تسوية مستحقات
IF @Cl7 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE ClientId = @Cl7 AND CaseNumber = N'120' AND CaseYear = 2026)
BEGIN
    INSERT INTO Cases (ClientId, ParentCaseId, AssignedLawyerId, CaseNumber, CaseYear, CaseType, CourtName, CourtCircuit, ClientRole, OpponentName, OpponentLawyer, Subject, Status, StartDate, EndDate, IsArchived, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (
        @Cl7, NULL, @AdminUserId, N'120', 2026, N'قضاء إداري تسوية مستحقات', N'مجلس الدولة بالقاهرة', N'الدائرة 3 قضاء إداري ترقيات ورسومات', N'Plaintiff', 
        N'وزارة التربية والتعليم والتعليم الفني', N'هيئة قضايا الدولة (الحاضرة عن الدولة)',
        N'دعوى مطالبة بتسوية المستحقات المالية للموكل وترقيته إلى درجة مستشار قانوني طبقاً للقرار الوزاري الملغى الصادر ضده.',
        N'Pending', '2026-04-12', NULL, 0, 0, @AdminUserId, SYSUTCDATETIME()
    );
    PRINT 'Case 9 (Administrative Court Case) created.';
END

-- Case 10: تجاري كلي نزاع عقدي (أرشفة - Archived)
IF @Cl8 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE ClientId = @Cl8 AND CaseNumber = N'55' AND CaseYear = 2024)
BEGIN
    INSERT INTO Cases (ClientId, ParentCaseId, AssignedLawyerId, CaseNumber, CaseYear, CaseType, CourtName, CourtCircuit, ClientRole, OpponentName, OpponentLawyer, Subject, Status, StartDate, EndDate, IsArchived, IsDeleted, CreatedByUserId, CreatedAt, ArchivedAt, ArchivedByUserId)
    VALUES (
        @Cl8, NULL, @AdminUserId, N'55', 2024, N'تجاري كلي نزاع عقدي', N'محكمة جنوب القاهرة الابتدائية', N'الدائرة 4 تجاري كلي', N'Plaintiff', 
        N'الشركة الوطنية للحفر والتنقيب', N'مصطفى كمال المفتي المحامي',
        N'نزاع بخصوص فسخ عقد إيجار حفار بترولي ومطالبة بالشرط الجزائي، تم إنهاء النزاع ودياً بالتصالح والتسوية.',
        N'Closed', '2024-01-15', '2024-11-20', 1, 0, @AdminUserId, SYSUTCDATETIME(), SYSUTCDATETIME(), @AdminUserId
    );
    PRINT 'Case 10 (Archived Commercial Dispute) created.';
END

-- Case 11: جنح شيك بدون رصيد (موكلنا هو المدعي بالحق المدني)
IF @Cl4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE ClientId = @Cl4 AND CaseNumber = N'3201' AND CaseYear = 2026)
BEGIN
    INSERT INTO Cases (ClientId, ParentCaseId, AssignedLawyerId, CaseNumber, CaseYear, CaseType, CourtName, CourtCircuit, ClientRole, OpponentName, OpponentLawyer, Subject, Status, StartDate, EndDate, IsArchived, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (
        @Cl4, NULL, @AdminUserId, N'3201', 2026, N'جنحة مباشرة شيك بدون رصيد', N'محكمة جنح الهرم الجزئية', N'الدائرة 3 جنح الهرم', N'Plaintiff', 
        N'مدحت توفيق عبد الرحمن', N'محامي حر للخصم',
        N'جنحة مباشرة مقامة ضد المتهم بسبب إصداره شيكاً بنكياً لصالح موكلنا بمبلغ 80 ألف جنيه مسحوباً على بنك CIB بدون رصيد كافٍ.',
        N'Open', '2026-05-18', NULL, 0, 0, @AdminUserId, SYSUTCDATETIME()
    );
    PRINT 'Case 11 (Check Violation Plaintiff) created.';
END

-- Case 12: عمالي فصل تعسفي
IF @Cl8 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Cases WHERE ClientId = @Cl8 AND CaseNumber = N'415' AND CaseYear = 2026)
BEGIN
    INSERT INTO Cases (ClientId, ParentCaseId, AssignedLawyerId, CaseNumber, CaseYear, CaseType, CourtName, CourtCircuit, ClientRole, OpponentName, OpponentLawyer, Subject, Status, StartDate, EndDate, IsArchived, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (
        @Cl8, NULL, @AdminUserId, N'415', 2026, N'عمالي فصل تعسفي', N'محكمة عمال جنوب القاهرة', N'الدائرة 6 عمال كلي', N'Defendant', 
        N'شريف طارق عبد اللطيف (مهندس بترول سابق بالشركة)', N'مكتب العمال القانوني للمحاماة',
        N'دعوى تعويض عن فصل تعسفي رفعها مهندس بفرع الشركة بالبحر الأحمر يدعي إنهاء خدمته تعسفياً ويطالب بنصف مليون جنيه تعويض.',
        N'Open', '2026-06-05', NULL, 0, 0, @AdminUserId, SYSUTCDATETIME()
    );
    PRINT 'Case 12 (Labor Claim Defendant) created.';
END
GO

-- ===================================================
-- Step 4: Seed CaseNotes (Rich timelines)
-- ===================================================
DECLARE @AdminUserId INT;
SELECT @AdminUserId = Id FROM Users WHERE Username = N'admin';

DECLARE @Case1 INT, @Case3 INT, @Case5 INT, @Case6 INT, @Case7 INT, @Case11 INT;
SELECT @Case1 = Id FROM Cases WHERE CaseNumber = N'1524' AND CaseYear = 2025;
SELECT @Case3 = Id FROM Cases WHERE CaseNumber = N'982' AND CaseYear = 2026;
SELECT @Case5 = Id FROM Cases WHERE CaseNumber = N'703' AND CaseYear = 2025;
SELECT @Case6 = Id FROM Cases WHERE CaseNumber = N'339' AND CaseYear = 2026;
SELECT @Case7 = Id FROM Cases WHERE CaseNumber = N'1055' AND CaseYear = 2025;
SELECT @Case11 = Id FROM Cases WHERE CaseNumber = N'3201' AND CaseYear = 2026;

-- ملاحظات القضية الأولى (المدني الكلي)
IF @Case1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM CaseNotes WHERE CaseId = @Case1)
BEGIN
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case1, N'تمت كتابة صحيفة الدعوى ومراجعة بنود العقد المخل به وإرفاق إيصالات السداد المؤيدة للحق.', 0, @AdminUserId, SYSUTCDATETIME());
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case1, N'تم الإعلان بصحيفة الدعوى وإعادة الإعلان للخصم على عنوانه المذكور ببطاقته الشخصية.', 0, @AdminUserId, DATEADD(day, 2, SYSUTCDATETIME()));
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case1, N'تم حجز القضية للتقرير بواسطة خبير حسابي من مكتب خبراء الجيزة لإعداد تقرير الإخلال المالي.', 0, @AdminUserId, DATEADD(day, 10, SYSUTCDATETIME()));
END

-- ملاحظات القضية الثالثة (العمالي الجزئي)
IF @Case3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM CaseNotes WHERE CaseId = @Case3)
BEGIN
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case3, N'تم تسلم حافظة مستندات من إدارة الموارد البشرية بالشركة تشتمل على كشوف الحضور والانصراف وعقد العمل الموقع من العامل لتفنيد دعوى الفصل التعسفي.', 0, @AdminUserId, SYSUTCDATETIME());
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case3, N'حضرنا في الجلسة الأولى وطلبنا تقديم مذكرة دفاع وتقرير بإيداع ملف التأمينات الخاص بالعامل.', 0, @AdminUserId, DATEADD(day, 5, SYSUTCDATETIME()));
END

-- ملاحظات القضية الخامسة (إفلاس المحكمة الاقتصادية)
IF @Case5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM CaseNotes WHERE CaseId = @Case5)
BEGIN
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case5, N'تقديم عريضة إشهار الإفلاس للمحكمة وتحديد تاريخ الجلسة الافتتاحية للمناقشة وتعيين وكيل الدائنين مؤقتاً.', 0, @AdminUserId, SYSUTCDATETIME());
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case5, N'الخصم تقدم بطلب تسوية تصالح واقترح جدول زمني لجدولة الدين، وتم إرسال المقترح للعميل للدراسة والموافقة.', 0, @AdminUserId, DATEADD(day, 7, SYSUTCDATETIME()));
END

-- ملاحظات القضية السادسة (أسرة ونفقة)
IF @Case6 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM CaseNotes WHERE CaseId = @Case6)
BEGIN
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case6, N'تم رفع عريضة الدعوى بمحكمة الأسرة بعد اجتياز فترة التسوية والمصالحة المقررة بـ 15 يوماً ودون جدوى.', 0, @AdminUserId, SYSUTCDATETIME());
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case6, N'طلبنا من المحكمة تصريحاً للتحري من قسم الشرطة عن دخل الزوج الحقيقي كونه يعمل في الأعمال الحرة والتجارة الخاصة.', 0, @AdminUserId, DATEADD(day, 3, SYSUTCDATETIME()));
END

-- ملاحظات القضية السابعة (طرد للإيجار)
IF @Case7 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM CaseNotes WHERE CaseId = @Case7)
BEGIN
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case7, N'تم رفع الدعوى المستعجلة لإخلاء الشقة وإنهاء التعاقد المبرم طبقاً للقانون المدني.', 0, @AdminUserId, SYSUTCDATETIME());
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case7, N'صدر حكم نهائي من المحكمة بطرد المستأجر وإخلاء الشقة السكنية وتسليمها خالية للموكلة.', 0, @AdminUserId, DATEADD(day, 20, SYSUTCDATETIME()));
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case7, N'تم تسليم مسودة الحكم لمحضري التنفيذ للبدء في إجراءات الطرد الجبري.', 0, @AdminUserId, DATEADD(day, 25, SYSUTCDATETIME()));
END

-- ملاحظات القضية الحادية عشر (شيك الهرم)
IF @Case11 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM CaseNotes WHERE CaseId = @Case11)
BEGIN
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case11, N'تم إيداع أصل الشيك البنكي ومحضر رفض البنك لعدم كفاية الرصيد في ملف الدعوى.', 0, @AdminUserId, SYSUTCDATETIME());
    INSERT INTO CaseNotes (CaseId, Note, IsDeleted, CreatedByUserId, CreatedAt)
    VALUES (@Case11, N'الخصم اتصل مبدياً استعداده لسداد نصف المبلغ فوراً وتقسيط الباقي على 3 أشهر مقابل التنازل والتصالح.', 0, @AdminUserId, DATEADD(day, 4, SYSUTCDATETIME()));
END
GO

PRINT '==========================================';
PRINT 'Expanded Seed Data Completed Successfully!';
PRINT '==========================================';
GO
