import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../ui/Card/Card';
import styles from './RecentActivities.module.css';
import { ArrowLeft, FileText, Gavel, DollarSign, RefreshCw, Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  timeAr: string;
  timeEn: string;
  descAr: string;
  descEn: string;
  actionType: 'document' | 'session' | 'payment' | 'status';
}

const RecentActivities: React.FC = () => {
  const { i18n } = useTranslation(['common']);
  const isRtl = i18n.language === 'ar';

  const activities: ActivityItem[] = [
    {
      id: '1',
      timeAr: '09:30 ص',
      timeEn: '09:30 AM',
      descAr: 'تم رفع مستند جديد في قضية دعوى تجارية ضد شركة الشرق',
      descEn: 'New document uploaded in commercial lawsuit vs Al-Sharq',
      actionType: 'document',
    },
    {
      id: '2',
      timeAr: '11:15 ص',
      timeEn: '11:15 AM',
      descAr: 'تم إضافة جلسة جديدة في قضية أحوال شخصية',
      descEn: 'New session added in personal status case',
      actionType: 'session',
    },
    {
      id: '3',
      timeAr: '01:45 م',
      timeEn: '01:45 PM',
      descAr: 'تم استلام دفعة مالية من العميل: محمد السبيعي',
      descEn: 'Payment received from client: Mohammad Al-Subaie',
      actionType: 'payment',
    },
    {
      id: '4',
      timeAr: '03:20 م',
      timeEn: '03:20 PM',
      descAr: 'تم تحديث حالة قضية دعوى عمالية ضد مؤسسة النور',
      descEn: 'Case status updated for labor lawsuit vs Al-Noor Est.',
      actionType: 'status',
    },
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText size={14} className={styles.docIcon} />;
      case 'session':
        return <Gavel size={14} className={styles.sessionIcon} />;
      case 'payment':
        return <DollarSign size={14} className={styles.payIcon} />;
      case 'status':
        return <RefreshCw size={14} className={styles.statusIcon} />;
      default:
        return <Activity size={14} className={styles.defaultIcon} />;
    }
  };

  return (
    <Card className={styles.activitiesPanel}>
      <div className={styles.header}>
        <Activity size={18} className={styles.titleIcon} />
        <h3 className={styles.panelTitle}>{isRtl ? 'النشاطات الأخيرة' : 'Recent Activities'}</h3>
      </div>

      <div className={styles.timeline}>
        {activities.map((item) => (
          <div key={item.id} className={styles.timelineItem}>
            <div className={styles.timelineLine} />
            <div className={styles.iconNode}>{getActionIcon(item.actionType)}</div>
            <div className={styles.content}>
              <div className={styles.metaRow}>
                <span className={styles.timeStr}>{isRtl ? item.timeAr : item.timeEn}</span>
              </div>
              <p className={styles.description}>{isRtl ? item.descAr : item.descEn}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.panelLink}>
        <span>{isRtl ? 'عرض جميع النشاطات' : 'View All Activities'}</span>
        <ArrowLeft size={16} className={styles.arrowIcon} />
      </div>
    </Card>
  );
};

export default RecentActivities;
