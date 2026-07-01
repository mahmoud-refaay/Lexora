import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../ui/Card/Card';
import styles from './CriticalCasesList.module.css';
import { ArrowLeft, AlertTriangle, Clock } from 'lucide-react';

interface CriticalCaseItem {
  id: string;
  titleAr: string;
  titleEn: string;
  statusAr: string;
  statusEn: string;
  subtitleAr: string;
  subtitleEn: string;
  severity: 'high' | 'medium' | 'low';
}

const CriticalCasesList: React.FC = () => {
  const { i18n } = useTranslation(['common']);
  const isRtl = i18n.language === 'ar';

  const cases: CriticalCaseItem[] = [
    {
      id: '1',
      titleAr: 'دعوى تجارية ضد شركة الشرق',
      titleEn: 'Commercial Lawsuit vs Al-Sharq',
      statusAr: 'بعد يومين',
      statusEn: 'In 2 days',
      subtitleAr: 'جلسة استئناف | رقم القضية: 2024/1587',
      subtitleEn: 'Appeal hearing | Case No: 2024/1587',
      severity: 'high',
    },
    {
      id: '2',
      titleAr: 'قضية أحوال شخصية',
      titleEn: 'Personal Status Case',
      statusAr: 'بعد 5 أيام',
      statusEn: 'In 5 days',
      subtitleAr: 'جلسة أولى | رقم القضية: 2024/1890',
      subtitleEn: 'First hearing | Case No: 2024/1890',
      severity: 'medium',
    },
    {
      id: '3',
      titleAr: 'دعوى عمالية ضد مؤسسة النور',
      titleEn: 'Labor Lawsuit vs Al-Noor Est.',
      statusAr: 'بعد 7 أيام',
      statusEn: 'In 7 days',
      subtitleAr: 'مذكرة جوابية | رقم القضية: 2024/1123',
      subtitleEn: 'Defense memo | Case No: 2024/1123',
      severity: 'low',
    },
  ];

  return (
    <Card className={styles.listPanel}>
      <div className={styles.header}>
        <AlertTriangle size={18} className={styles.titleIcon} />
        <h3 className={styles.panelTitle}>{isRtl ? 'القضايا الحرجة' : 'Critical Cases'}</h3>
      </div>

      <div className={styles.casesList}>
        {cases.map((item) => (
          <div key={item.id} className={styles.caseItem}>
            {/* 1. Badge on the left */}
            <div
              className={`
                ${styles.statusBadge}
                ${item.severity === 'high' ? styles.badgeHigh : ''}
                ${item.severity === 'medium' ? styles.badgeMed : ''}
                ${item.severity === 'low' ? styles.badgeLow : ''}
              `}
            >
              {isRtl ? item.statusAr : item.statusEn}
            </div>

            {/* 2. Content in the middle */}
            <div className={styles.caseContent}>
              <span className={styles.caseTitle}>{isRtl ? item.titleAr : item.titleEn}</span>
              <span className={styles.caseSubtitle}>{isRtl ? item.subtitleAr : item.subtitleEn}</span>
            </div>

            {/* 3. Clock Icon on the right */}
            <div className={styles.iconCircle}>
              <Clock size={13} className={styles.clockIcon} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.panelLink}>
        <span>{isRtl ? 'عرض جميع القضايا الحرجة' : 'View All Critical Cases'}</span>
        {isRtl ? <ArrowLeft size={16} className={styles.arrowIcon} /> : <ArrowLeft size={16} className={`${styles.arrowIcon} ${styles.arrowFlipped}`} />}
      </div>
    </Card>
  );
};

export default CriticalCasesList;
