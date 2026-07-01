import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button/Button';
import { Home, ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation(['common']);
  const isRtl = i18n.language === 'ar';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className={styles.container} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={styles.glowOrb} />

      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Compass size={48} className={styles.icon} />
        </div>

        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>
          {isRtl ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h2>
        <p className={styles.description}>
          {isRtl
            ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر.'
            : 'Sorry, the page you are looking for does not exist or has been moved.'}
        </p>

        <div className={styles.actions}>
          <Button onClick={() => navigate('/dashboard')}>
            <Home size={16} />
            <span>{isRtl ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <BackArrow size={16} />
            <span>{isRtl ? 'الصفحة السابقة' : 'Go Back'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
