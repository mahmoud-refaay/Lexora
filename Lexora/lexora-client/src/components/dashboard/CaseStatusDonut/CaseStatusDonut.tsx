import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../ui/Card/Card';
import styles from './CaseStatusDonut.module.css';
import { ArrowLeft } from 'lucide-react';

interface CaseStatusItem {
  nameAr: string;
  nameEn: string;
  value: number;
  color: string;
}

const CaseStatusDonut: React.FC = () => {
  const { i18n } = useTranslation(['common']);
  const isRtl = i18n.language === 'ar';

  const data: CaseStatusItem[] = [
    { nameAr: 'جديدة', nameEn: 'New', value: 32, color: '#d9a75d' }, // gold-orange
    { nameAr: 'قيد المراجعة', nameEn: 'Under Review', value: 28, color: '#c09554' }, // luxury gold
    { nameAr: 'جلسة قادمة', nameEn: 'Upcoming Session', value: 24, color: '#38bdf8' }, // sky blue
    { nameAr: 'قيد الحكم', nameEn: 'Under Judgment', value: 18, color: '#0284c7' }, // dark blue
    { nameAr: 'مغلقة', nameEn: 'Closed', value: 22, color: '#475569' }, // muted slate
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // SVG Calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  let accumulatedPercent = 0;

  return (
    <Card className={styles.chartPanel}>
      <h3 className={styles.panelTitle}>{isRtl ? 'حالة القضايا' : 'Case Status'}</h3>
      
      <div className={styles.chartContent}>
        <div className={styles.chartVisual}>
          <svg viewBox="0 0 100 100" className={styles.donutSvg}>
            {data.map((item, index) => {
              const percent = (item.value / total) * 100;
              const strokeLength = (percent / 100) * circumference;
              const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
              accumulatedPercent += percent;

              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="12"
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  transform="rotate(-90 50 50)"
                  className={styles.donutSegment}
                />
              );
            })}
            <circle cx="50" cy="50" r="30" fill="transparent" className={styles.donutInnerCircle} />
          </svg>

          <div className={styles.chartCenterText}>
            <span className={styles.chartCenterNum}>{total}</span>
            <span className={styles.chartCenterLbl}>{isRtl ? 'قضية' : 'Cases'}</span>
          </div>
        </div>

        <div className={styles.chartLegend}>
          {data.map((item, index) => (
            <div key={index} className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: item.color }} />
              <span className={styles.legendName}>{isRtl ? item.nameAr : item.nameEn}</span>
              <span className={styles.legendValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.panelLink}>
        <span>{isRtl ? 'عرض جميع القضايا' : 'View All Cases'}</span>
        <ArrowLeft size={16} className={styles.arrowIcon} />
      </div>
    </Card>
  );
};

export default CaseStatusDonut;
