import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../ui/Card/Card';
import styles from './SmartAssistant.module.css';
import { Sparkles, AlertCircle, FileWarning, UserMinus, ChevronLeft } from 'lucide-react';

interface AIAlert {
  id: string;
  type: 'alert' | 'document' | 'user';
  textAr: string;
  textEn: string;
}

const SmartAssistant: React.FC = () => {
  const { i18n } = useTranslation(['common']);
  const isRtl = i18n.language === 'ar';

  const alerts: AIAlert[] = [
    {
      id: '1',
      type: 'alert',
      textAr: 'لديك قضية تحتاج رفع مذكرة خلال 3 أيام.',
      textEn: 'You have a case that needs a memo uploaded within 3 days.',
    },
    {
      id: '2',
      type: 'document',
      textAr: 'يوجد 4 مستندات ناقصة في قضية رقم 2024/1587.',
      textEn: 'There are 4 missing documents in case #2024/1587.',
    },
    {
      id: '3',
      type: 'user',
      textAr: 'الموكل / محمد السبيعي لم يتم التواصل معه منذ 21 يوم.',
      textEn: 'Client Mohammad Al-Subaie has not been contacted in 21 days.',
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle size={16} className={styles.alertIcon} />;
      case 'document':
        return <FileWarning size={16} className={styles.docIcon} />;
      case 'user':
        return <UserMinus size={16} className={styles.userIcon} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  return (
    <Card className={styles.assistantPanel}>
      <div className={styles.widgetHeader}>
        <div className={styles.titleBlock}>
          <Sparkles size={18} className={styles.sparkleIcon} />
          <h3 className={styles.widgetTitle}>{isRtl ? 'المساعد الذكي Lexora AI' : 'Lexora AI Smart Assistant'}</h3>
        </div>
      </div>

      <div className={styles.alertHeader}>
        <span>{isRtl ? 'تنبيهات ذكية' : 'Smart Alerts'}</span>
      </div>

      <div className={styles.alertsList}>
        {alerts.map((item) => (
          <div key={item.id} className={styles.alertCard}>
            <div className={styles.iconWrapper}>{getAlertIcon(item.type)}</div>
            <p className={styles.alertText}>{isRtl ? item.textAr : item.textEn}</p>
            <ChevronLeft size={16} className={styles.chevronIcon} />
          </div>
        ))}
      </div>

      <div className={styles.panelLink}>
        <span>{isRtl ? 'عرض جميع التنبيهات' : 'View All Alerts'}</span>
      </div>
    </Card>
  );
};

export default SmartAssistant;
