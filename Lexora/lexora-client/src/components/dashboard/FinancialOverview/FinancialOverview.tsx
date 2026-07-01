import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../ui/Card/Card';
import styles from './FinancialOverview.module.css';
import { TrendingUp, DollarSign } from 'lucide-react';

const FinancialOverview: React.FC = () => {
  const { i18n } = useTranslation(['common']);
  const isRtl = i18n.language === 'ar';

  // Sample data for the line chart (sparkline)
  const sparklineData = [10, 15, 8, 22, 18, 30, 25, 45];

  const renderAreaSparkline = (data: number[]) => {
    if (!data || data.length < 2) return null;
    const width = 200;
    const height = 60;
    const padding = 2;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
      .map((val, index) => {
        const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((val - min) / range) * (height - padding * 2) - padding;
        return `${x},${y}`;
      })
      .join(' ');

    const areaPoints = `0,${height} ${points} ${width},${height}`;

    return (
      <svg className={styles.sparkline} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="financialGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon fill="url(#financialGlow)" points={areaPoints} />
        <polyline
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const renderValue = (val: string) => {
    if (val.includes(' ')) {
      const parts = val.split(' ');
      const numberPart = parts[0];
      const textPart = parts.slice(1).join(' ');
      return (
        <div className={styles.valueSplitWrapper}>
          <span className={styles.valueNumber}>{numberPart}</span>
          <span className={styles.valueText}>{textPart}</span>
        </div>
      );
    }
    return <span className={styles.value}>{val}</span>;
  };

  return (
    <Card className={styles.financialCard}>
      <div className={styles.header}>
        <DollarSign size={18} className={styles.headerIcon} />
        <h3 className={styles.panelTitle}>{isRtl ? 'نظرة عامة مالية' : 'Financial Overview'}</h3>
      </div>

      <div className={styles.mainInfo}>
        <div className={styles.meta}>
          <span className={styles.label}>{isRtl ? 'إجمالي الإيرادات' : 'Total Revenue'}</span>
          {renderValue(isRtl ? '128,450 ريال' : '128,450 SAR')}
          <span className={styles.trend}>
            <TrendingUp size={14} className={styles.trendIcon} />
            <span>{isRtl ? '+18% عن الشهر الماضي' : '+18% from last month'}</span>
          </span>
        </div>

        {renderAreaSparkline(sparklineData)}
      </div>

      <div className={styles.footerRow}>
        <div className={styles.footerCol}>
          <span className={styles.colLabel}>{isRtl ? 'المستحقات' : 'Dues'}</span>
          <span className={`${styles.colValue} ${styles.duesText}`}>
            {isRtl ? '45,230 ريال' : '45,230 SAR'}
          </span>
        </div>

        <div className={styles.footerCol}>
          <span className={styles.colLabel}>{isRtl ? 'المدفوعات' : 'Payments'}</span>
          <span className={`${styles.colValue} ${styles.paymentsText}`}>
            {isRtl ? '83,220 ريال' : '83,220 SAR'}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default FinancialOverview;
