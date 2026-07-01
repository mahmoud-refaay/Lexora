import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../ui/Card/Card';
import styles from './WelcomeBanner.module.css';

interface WelcomeBannerProps {
  children?: React.ReactNode;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ children }) => {
  const { i18n } = useTranslation(['common']);
  const isRtl = i18n.language === 'ar';

  return (
    <Card className={styles.welcomeBanner}>
      <div className={styles.overlay} />
      <div className={styles.bannerContainer}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {isRtl ? 'اتخذ قرارات قانونية أسرع بثقة أكبر' : 'Make Smarter Legal Decisions Faster with Confidence'}
          </h1>
          <p className={styles.subtitle}>
            {isRtl 
              ? 'منصة متكاملة تمنحك رؤية لحظية للقضايا والموكلين والمستندات والإيرادات في واجهة فائقة الاحترافية.'
              : 'An integrated platform providing real-time insights into cases, clients, documents, and revenue in an ultra-professional interface.'}
          </p>
          <div className={styles.divider} />
        </div>
        {children && (
          <div className={styles.statsSection}>
            {children}
          </div>
        )}
      </div>
    </Card>
  );
};

export default WelcomeBanner;
