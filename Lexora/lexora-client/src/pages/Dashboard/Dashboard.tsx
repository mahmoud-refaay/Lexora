import React from 'react';
import { useTranslation } from 'react-i18next';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner/WelcomeBanner';
import StatCard from '../../components/dashboard/StatCard/StatCard';
import CaseStatusDonut from '../../components/dashboard/CaseStatusDonut/CaseStatusDonut';
import CriticalCasesList from '../../components/dashboard/CriticalCasesList/CriticalCasesList';
import RecentActivities from '../../components/dashboard/RecentActivities/RecentActivities';
import SmartAssistant from '../../components/dashboard/SmartAssistant/SmartAssistant';
import QuickActionCard from '../../components/dashboard/QuickActionCard/QuickActionCard';
import FinancialOverview from '../../components/dashboard/FinancialOverview/FinancialOverview';
import CalendarWidget from '../../components/dashboard/CalendarWidget/CalendarWidget';
import welcomeStyles from '../../components/dashboard/WelcomeBanner/WelcomeBanner.module.css';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { i18n } = useTranslation(['common']);
  const isRtl = i18n.language === 'ar';

  const handleQuickAction = (actionName: string) => {
    alert(isRtl ? `تم اختيار: ${actionName}` : `Selected action: ${actionName}`);
  };

  return (
    <div className={styles.dashboardContainer} dir="ltr">
      {/* الصف الأول: الترحيب المدمج مع الكروت الإحصائية (عرض كامل تحت الهيدر) */}
      <div className={styles.rowWelcomeStats}>
        <WelcomeBanner>
          <StatCard
            variant="banner"
            className={welcomeStyles.bannerStatCard}
            title={isRtl ? 'قضايا حرجة' : 'Critical Cases'}
            value="8"
            subtext={isRtl ? 'تحتاج متابعة عاجلة' : 'Needs urgent follow-up'}
            icon="/images/3d/lexora_logo.png"
            actionText={isRtl ? 'عرض التفاصيل' : 'View Details'}
            onActionClick={() => handleQuickAction(isRtl ? 'عرض تفاصيل القضايا الحرجة' : 'View Critical Cases Details')}
          />
          <StatCard
            variant="banner"
            className={welcomeStyles.bannerStatCard}
            title={isRtl ? 'جلسات اليوم' : "Today's Sessions"}
            value="5"
            subtext={isRtl ? 'جلسات مجدولة اليوم' : 'Scheduled sessions today'}
            icon="/images/3d/calendar.png"
            actionText={isRtl ? 'عرض التقويم' : 'View Calendar'}
            onActionClick={() => handleQuickAction(isRtl ? 'فتح التقويم' : 'Open Calendar')}
          />
          <StatCard
            variant="banner"
            className={welcomeStyles.bannerStatCard}
            title={isRtl ? 'إيرادات الشهر' : "Month's Revenue"}
            value={isRtl ? '128,450 ريال' : '128,450 SAR'}
            trend={isRtl ? '+18% عن الشهر الماضي' : '+18% from last month'}
            trendDirection="up"
            icon="/images/3d/gold_coins.png"
            actionText={isRtl ? 'عرض التقرير' : 'View Report'}
            onActionClick={() => handleQuickAction(isRtl ? 'عرض التقارير المالية' : 'View Financial Reports')}
          />
        </WelcomeBanner>
      </div>

      <div className={styles.dashboardGrid}>
        {/* المساحة الرئيسية اليسرى (Left Main Content Area) */}
        <div className={styles.mainContentArea}>
          {/* الصف الثاني: 4 كروت إحصائيات عامة */}
          <div className={styles.rowGeneralStats}>
            <StatCard
              title={isRtl ? 'إجمالي القضايا' : 'Total Cases'}
              value="124"
              trend={isRtl ? '+15% عن الشهر الماضي' : '+15% from last month'}
              trendDirection="up"
              icon="/images/3d/documents.png"
              sparklineData={[12, 14, 15, 13, 17, 16, 19, 22]}
            />
            <StatCard
              title={isRtl ? 'جلسات اليوم' : "Today's Sessions"}
              value="8"
              trend={isRtl ? '+1 عن أمس' : '+1 from yesterday'}
              trendDirection="up"
              icon="/images/3d/gavel.png"
            />
            <StatCard
              title={isRtl ? 'المستندات' : 'Documents'}
              value="232"
              trend={isRtl ? '+16% عن الشهر الماضي' : '+16% from last month'}
              trendDirection="up"
              icon="/images/3d/documents.png"
            />
            <StatCard
              title={isRtl ? 'إجمالي الإيرادات' : 'Total Revenue'}
              value={isRtl ? '128,450 ريال' : '128,450 SAR'}
              trend={isRtl ? '+18% عن الشهر الماضي' : '+18% from last month'}
              trendDirection="up"
              icon="/images/3d/gold_coins.png"
            />
          </div>

          {/* الصف الثالث: الحالات والقضايا والنشاطات */}
          <div className={styles.rowMiddleWidgets}>
            <CaseStatusDonut />
            <CriticalCasesList />
            <RecentActivities />
          </div>

          {/* الصف الرابع: إجراءات سريعة + نظرة مالية */}
          <div className={styles.rowBottomActions}>
            <div className={`${styles.quickActionsSection} glass-panel`}>
              <h4 className={styles.sectionTitle}>{isRtl ? 'إجراءات سريعة' : 'Quick Actions'}</h4>
              <div className={styles.quickActionsGrid}>
                <QuickActionCard
                  title={isRtl ? 'إضافة قضية جديدة' : 'Add New Case'}
                  icon="/images/3d/documents.png"
                  onClick={() => handleQuickAction(isRtl ? 'إضافة قضية جديدة' : 'Add New Case')}
                />
                <QuickActionCard
                  title={isRtl ? 'إضافة عميل جديد' : 'Add New Client'}
                  icon="/images/3d/lawyer_avatar.png"
                  onClick={() => handleQuickAction(isRtl ? 'إضافة عميل جديد' : 'Add New Client')}
                />
                <QuickActionCard
                  title={isRtl ? 'جدولة جلسة' : 'Schedule Session'}
                  icon="/images/3d/calendar.png"
                  onClick={() => handleQuickAction(isRtl ? 'جدولة جلسة' : 'Schedule Session')}
                />
                <QuickActionCard
                  title={isRtl ? 'رفع مستند' : 'Upload Document'}
                  icon="/images/3d/documents.png"
                  actionType="upload"
                  onClick={() => handleQuickAction(isRtl ? 'رفع مستند' : 'Upload Document')}
                />
                <QuickActionCard
                  title={isRtl ? 'إنشاء مهمة' : 'Create Task'}
                  icon="/images/3d/checklist.png"
                  onClick={() => handleQuickAction(isRtl ? 'إنشاء مهمة' : 'Create Task')}
                />
                <QuickActionCard
                  title={isRtl ? 'تسجيل دفعة' : 'Record Payment'}
                  icon="/images/3d/wallet.png"
                  onClick={() => handleQuickAction(isRtl ? 'تسجيل دفعة' : 'Record Payment')}
                />
              </div>
            </div>

            <div className={styles.financialSection}>
              <FinancialOverview />
            </div>
          </div>

        </div>

        {/* الشريط الجانبي الأيمن (Right Sidebar Widget Area) */}
        <div className={styles.rightSidebarArea}>
          <SmartAssistant />
          <CalendarWidget />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
