import React from 'react';
import Card from '../../ui/Card/Card';
import styles from './StatCard.module.css';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: string; // 3D icon path
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  sparklineData?: number[];
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
  variant?: 'default' | 'banner';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  trend,
  trendDirection = 'neutral',
  sparklineData,
  actionText,
  onActionClick,
  className = '',
  variant = 'default',
}) => {
  // Simple SVG Sparkline Renderer
  const renderSparkline = (data: number[]) => {
    if (!data || data.length < 2) return null;
    const width = 100;
    const height = 30;
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

    return (
      <svg className={styles.sparkline} viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const renderValue = (val: string | number) => {
    if (typeof val === 'string' && val.includes(' ')) {
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

  if (variant === 'banner') {
    return (
      <Card className={`${styles.statCard} ${styles.bannerCard} ${className}`}>
        {/* Top: Icon left, Title/Value right */}
        <div className={styles.bannerHeader}>
          {icon && (
            <div className={styles.bannerIconContainer}>
              <img src={icon} alt={title} className={styles.bannerIcon3d} />
            </div>
          )}
          <div className={styles.bannerMeta}>
            <span className={styles.bannerTitle}>{title}</span>
            {renderValue(value)}
          </div>
        </div>

        {/* Middle: Subtext / Trend */}
        <div className={styles.bannerMiddle}>
          {subtext && <span className={styles.bannerSubtext}>{subtext}</span>}
          {trend && (
            <span
              className={`
                ${styles.trend} 
                ${trendDirection === 'up' ? styles.trendUp : ''}
                ${trendDirection === 'down' ? styles.trendDown : ''}
              `}
              style={{ marginTop: '2px', display: 'inline-flex', justifyContent: 'center' }}
            >
              {trendDirection === 'up' && <ArrowUpRight size={14} />}
              {trendDirection === 'down' && <ArrowDownRight size={14} />}
              {trend}
            </span>
          )}
        </div>

        {/* Bottom: Full-width button */}
        {actionText && onActionClick && (
          <button onClick={onActionClick} className={styles.bannerActionBtn}>
            {actionText}
          </button>
        )}
      </Card>
    );
  }

  return (
    <Card className={`${styles.statCard} ${className}`}>
      <div className={styles.mainContent}>
        {icon && (
          <div className={styles.iconContainer}>
            <img src={icon} alt={title} className={styles.icon3d} />
          </div>
        )}
        <div className={styles.contentCol}>
          <span className={styles.title}>{title}</span>
          {renderValue(value)}
          <div className={styles.trendRow}>
            {trend && (
              <span
                className={`
                  ${styles.trend} 
                  ${trendDirection === 'up' ? styles.trendUp : ''}
                  ${trendDirection === 'down' ? styles.trendDown : ''}
                `}
              >
                {trendDirection === 'up' && <ArrowUpRight size={13} />}
                {trendDirection === 'down' && <ArrowDownRight size={13} />}
                {trend}
              </span>
            )}
            {subtext && <span className={styles.subtext}>{subtext}</span>}
          </div>
        </div>
      </div>
      {sparklineData && (
        <div className={styles.sparklineWrapper}>
          {renderSparkline(sparklineData)}
        </div>
      )}
    </Card>
  );
};

export default StatCard;
