import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input/Input';
import { 
  User as UserIcon, 
  AlertCircle, 
  ShieldCheck, 
  Lock, 
  Headphones, 
  Award, 
  ArrowRight, 
  ArrowLeft,
  Globe
} from 'lucide-react';
import styles from './Login.module.css';

// شعار الميزان الذهبي المعتمد بالتصاميم
const MizanLogo: React.FC = () => (
  <svg 
    viewBox="0 0 64 64" 
    className={styles.mizanLogoSvg}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Base */}
    <path d="M18 52h28a1 1 0 011 1v2a1 1 0 01-1 1H18a1 1 0 01-1-1v-2a1 1 0 011-1z" fill="var(--color-primary)" />
    <path d="M24 48h16v3a1 1 0 01-1 1H25a1 1 0 01-1-1v-3z" fill="var(--color-primary)" opacity="0.8" />
    {/* Center pillar */}
    <path d="M31 16h2v31h-2z" fill="var(--color-primary)" />
    <circle cx="32" cy="12" r="3" fill="var(--color-primary)" />
    {/* Decorative pillar elements */}
    <path d="M29 18h6v2h-6z" fill="var(--color-primary)" opacity="0.9" />
    <path d="M29 44h6v2h-6z" fill="var(--color-primary)" opacity="0.9" />
    {/* Main scale beam */}
    <path d="M12 20c0-1.5 8-3 20-3s20 1.5 20 3c0 0.5-0.5 1-1 1H13c-0.5 0-1-0.5-1-1z" fill="var(--color-primary)" />
    {/* Left plate and strings */}
    <path d="M15 21l-5 18M15 21l5 18" stroke="var(--color-primary)" strokeWidth="1" fill="none" opacity="0.7" />
    <path d="M8 39h14a1 1 0 011 1 5 5 0 01-16 0 1 1 0 011-1z" fill="var(--color-primary)" />
    {/* Right plate and strings */}
    <path d="M49 21l-5 18M49 21l5 18" stroke="var(--color-primary)" strokeWidth="1" fill="none" opacity="0.7" />
    <path d="M42 39h14a1 1 0 011 1 5 5 0 01-16 0 1 1 0 011-1z" fill="var(--color-primary)" />
  </svg>
);

// أيقونة جوجل للمصادقة الخارجية
const GoogleIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// أيقونة مايكروسوفت للمصادقة الخارجية
const MicrosoftIcon: React.FC = () => (
  <svg viewBox="0 0 23 23" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f35325" d="M1 1h10v10H1z"/>
    <path fill="#81bc06" d="M12 1h10v10H12z"/>
    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
    <path fill="#ffba08" d="M12 12h10v10H12z"/>
  </svg>
);

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['auth', 'common']);
  const isRtl = i18n.language === 'ar';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError(t('login.failed'));
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || t('login.failed');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className={styles.loginPage} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* زر تغيير اللغة بالزاوية العليا */}
      <button onClick={toggleLanguage} className={styles.langToggleBtn}>
        <Globe size={14} />
        <span>{isRtl ? 'English' : 'العربية'}</span>
      </button>

      <div className={styles.splitLayout}>
        
        {/* القسم الأيسر: ترويجي للمكتب القانوني */}
        <div className={styles.leftPane} dir={isRtl ? 'rtl' : 'ltr'}>
          <div className={styles.leftPaneContent}>
            {/* الشعار بالأعلى مع المحاذاة الأفقية للأيقونة والاسم */}
            <div className={styles.promoBrand}>
              <div className={styles.promoBrandText}>
                <span className={styles.brandTitle}>ميزان</span>
                <span className={styles.brandSubtitle}>LEXORA</span>
              </div>
              <MizanLogo />
            </div>

            {/* نصوص ترويجية في المنتصف */}
            <div className={styles.promoTextWrapper}>
              <h2 className={styles.promoTitle}>
                {t('login.promo_title')}
              </h2>
              <p className={styles.promoDesc}>
                {t('login.promo_desc')}
              </p>
            </div>
            
            {/* فارغ بالأسفل للمحافظة على التوزيع العمودي الترويجي */}
            <div className={styles.promoFooter} />
          </div>
        </div>

        {/* القسم الأيمن: لوحة تسجيل الدخول */}
        <div className={styles.rightPane} dir={isRtl ? 'rtl' : 'ltr'}>
          <div className={styles.formContainer}>
            <div className={`${styles.loginCard} glass-panel`}>
              <div className={styles.formHeader}>
                <h1 className={styles.title}>
                  {t('login.submit')}
                </h1>
                <p className={styles.subtitle}>
                  {t('login.subtitle')}
                </p>
              </div>

              {error && (
                <div className={styles.errorAlert}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                  label={t('login.username_label')}
                  placeholder={t('login.username_placeholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<UserIcon size={16} />}
                  disabled={submitting}
                  required
                  className={styles.loginInputWrapper}
                />

                <Input
                  label={t('login.password_label')}
                  placeholder={t('login.password_placeholder')}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={16} />}
                  disabled={submitting}
                  required
                  className={styles.loginInputWrapper}
                />

                {/* خيارات تذكرني ونسيت كلمة المرور */}
                <div className={styles.extraOptions}>
                  <label className={styles.rememberMeLabel}>
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={styles.rememberCheckbox}
                    />
                    <span>{t('login.remember_me')}</span>
                  </label>
                  
                  <a href="#forgot" className={styles.forgotLink} onClick={(e) => e.preventDefault()}>
                    {t('login.forgot_password')}
                  </a>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting} 
                  className={styles.submitBtn}
                >
                  <div className={styles.btnContent}>
                    {submitting ? (
                      <span className={styles.spinner} />
                    ) : (
                      <>
                        {isRtl ? <ArrowLeft size={16} className={styles.btnArrow} /> : <ArrowRight size={16} className={styles.btnArrow} />}
                        <span className={styles.btnText}>{t('login.submit')}</span>
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* خط فاصل للبدائل */}
              <div className={styles.divider}>
                <span>{t('login.or_login_with')}</span>
              </div>

              {/* أزرار تسجيل الدخول البديل */}
              <div className={styles.socialButtons}>
                <button className={styles.socialBtn} onClick={(e) => e.preventDefault()}>
                  <GoogleIcon />
                </button>
                <button className={styles.socialBtn} onClick={(e) => e.preventDefault()}>
                  <MicrosoftIcon />
                </button>
                <button className={styles.socialBtn} onClick={(e) => e.preventDefault()}>
                  <ShieldCheck size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* السطر السفلي لخصائص الأمان */}
      <footer className={styles.loginFooter}>
        <div className={styles.footerInner}>
          <div className={styles.badgesContainer}>
            <div className={styles.badgeItem}>
              <Award size={20} className={styles.badgeIcon} />
              <div className={styles.badgeTextWrapper}>
                <span className={styles.badgeTitle}>{t('login.badge_trusted')}</span>
                <span className={styles.badgeDesc}>{t('login.badge_trusted_desc')}</span>
              </div>
            </div>
            <div className={styles.badgeItem}>
              <Headphones size={20} className={styles.badgeIcon} />
              <div className={styles.badgeTextWrapper}>
                <span className={styles.badgeTitle}>{t('login.badge_support')}</span>
                <span className={styles.badgeDesc}>{t('login.badge_support_desc')}</span>
              </div>
            </div>
            <div className={styles.badgeItem}>
              <Lock size={20} className={styles.badgeIcon} />
              <div className={styles.badgeTextWrapper}>
                <span className={styles.badgeTitle}>{t('login.badge_encryption')}</span>
                <span className={styles.badgeDesc}>{t('login.badge_encryption_desc')}</span>
              </div>
            </div>
            <div className={styles.badgeItem}>
              <ShieldCheck size={20} className={styles.badgeIcon} />
              <div className={styles.badgeTextWrapper}>
                <span className={styles.badgeTitle}>{t('login.badge_security')}</span>
                <span className={styles.badgeDesc}>{t('login.badge_security_desc')}</span>
              </div>
            </div>
          </div>

          <div className={styles.copyrightText}>
            {isRtl ? 'جميع الحقوق محفوظة.. Lexora. © 2024' : '© 2024 Lexora. All rights reserved.'}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
