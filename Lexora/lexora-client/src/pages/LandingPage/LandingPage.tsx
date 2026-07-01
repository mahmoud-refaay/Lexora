import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Bell, 
  FileText, 
  BarChart3, 
  Users, 
  Briefcase, 
  Calendar, 
  CheckSquare, 
  CreditCard,
  Globe,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
  const { t, i18n } = useTranslation(['common']);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  // توجيه تلقائي للوحة التحكم إذا كان مسجلاً للدخول بالفعل
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lexora_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const handleStartNow = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={styles.landingContainer} dir={i18n.dir()}>
      {/* الشريط العلوي للملاحة */}
      <header className={styles.navbar}>
        <div className={styles.navBrand}>
          <span className={styles.logoText}>ميزان</span>
          <span className={styles.logoSubtext}>LEXORA</span>
        </div>
        
        <nav className={styles.navLinks}>
          <a href="#hero" className={styles.activeLink}>{isRtl ? 'الرئيسية' : 'Home'}</a>
          <a href="#features">{isRtl ? 'المميزات' : 'Features'}</a>
          <a href="#services">{isRtl ? 'الخدمات' : 'Services'}</a>
          <a href="#about">{isRtl ? 'من نحن' : 'About Us'}</a>
        </nav>

        <div className={styles.navActions}>
          <button onClick={toggleLanguage} className={styles.langBtn}>
            <Globe size={16} />
            <span>{i18n.language === 'ar' ? 'English' : 'العربية'}</span>
          </button>
          
          {isAuthenticated ? (
            <Button onClick={() => navigate('/dashboard')}>
              {isRtl ? 'لوحة التحكم' : 'Go to Dashboard'}
            </Button>
          ) : (
            <>
              <Link to="/login" className={styles.loginLink}>
                {t('buttons.login')}
              </Link>
              <Button onClick={handleStartNow}>
                {isRtl ? 'ابدأ الآن' : 'Start Now'}
              </Button>
            </>
          )}
        </div>
      </header>

      {/* قسم البطل الرئيسي (Hero Section) */}
      <section id="hero" className={styles.heroSection}>
        <div className="cyber-bg-glow" />
        <div className={styles.heroContent}>
          <span className={styles.tagline}>{isRtl ? 'نظام إدارة مكاتب المحاماة' : 'Law Firm Management System'}</span>
          <h1 className={styles.heroTitle}>
            {isRtl ? 'إدارة قانونية ذكية تنظم عملك .. وتوفر وقتك' : 'Smart Legal Management That Organizes Your Work'}
          </h1>
          <p className={styles.heroDescription}>
            {isRtl 
              ? 'ميزان (Lexora) هو نظام متكامل يساعد مكاتب المحاماة على إدارة العملاء، القضايا، الجلسات، المستندات، المهام، المدفوعات والتقارير من مكان واحد بكفاءة وأمان تام.'
              : 'Mizan (Lexora) is an integrated system that helps law firms manage clients, cases, court sessions, documents, tasks, payments and reports from a single place securely.'}
          </p>
          <div className={styles.heroActions}>
            <Button size="lg" onClick={handleStartNow}>
              <span>{isRtl ? 'ابدأ تجربة مجانية' : 'Start Free Trial'}</span>
              {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </Button>
            <Button size="lg" variant="secondary">
              {isRtl ? 'استكشاف المميزات' : 'Explore Features'}
            </Button>
          </div>
          <span className={styles.badgeText}>🛡️ {isRtl ? 'آمن • موثوق • مصمم لمكاتب المحاماة' : 'Secure • Trusted • Built for Law Firms'}</span>
        </div>

        {/* عرض معاينة النظام (Mockup Laptop) */}
        <div className={styles.mockupContainer}>
          <div className={styles.laptopFrame}>
            <img 
              src="/images/img_dashboard.jpg" 
              alt="Lexora Dashboard Preview" 
              className={styles.dashboardPreview} 
            />
          </div>
          <div className={styles.justiceScale}>
            {/* تمثال العدالة الذهبي الديكوري */}
            <div className={styles.scaleIconWrapper}>⚖️</div>
          </div>
        </div>
      </section>

      {/* شريط الميزات الممتازة */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <ShieldCheck size={28} />
            </div>
            <div className={styles.featureText}>
              <h4>{isRtl ? 'آمن وموثوق' : 'Secure & Reliable'}</h4>
              <p>{isRtl ? 'حماية بياناتك بمعايير أمنية عالية' : 'Protect your data with military-grade security'}</p>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <Bell size={28} />
            </div>
            <div className={styles.featureText}>
              <h4>{isRtl ? 'تنبيهات ذكية' : 'Smart Alerts'}</h4>
              <p>{isRtl ? 'إشعارات بالمواعيد، الجلسات، المهام والمدفوعات' : 'Get notified of court sessions, tasks & dues'}</p>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FileText size={28} />
            </div>
            <div className={styles.featureText}>
              <h4>{isRtl ? 'إدارة مستندات' : 'Document Management'}</h4>
              <p>{isRtl ? 'رفع وتنظيم والبحث في جميع المستندات القانونية' : 'Upload, organize and search all legal documents'}</p>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <BarChart3 size={28} />
            </div>
            <div className={styles.featureText}>
              <h4>{isRtl ? 'تقارير احترافية' : 'Professional Reports'}</h4>
              <p>{isRtl ? 'تقارير دقيقة تساعدك على اتخاذ قرارات أفضل' : 'Accurate insights to help you make better decisions'}</p>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <Users size={28} />
            </div>
            <div className={styles.featureText}>
              <h4>{isRtl ? 'صلاحيات مرنة' : 'Flexible Permissions'}</h4>
              <p>{isRtl ? 'إدارة المستخدمين والصلاحيات بمرونة وأمان' : 'Manage users and accessibility levels securely'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الخدمات الستة */}
      <section id="services" className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{isRtl ? 'نظام متكامل' : 'All-in-One System'}</span>
          <h2 className={styles.sectionTitle}>{isRtl ? 'كل ما تحتاجه في مكتبك القانوني' : 'Everything You Need in Your Law Office'}</h2>
          <p className={styles.sectionSubtitle}>
            {isRtl 
              ? 'من إدارة العملاء والقضايا إلى الجلسات والتقارير المالية، ميزان يغطي جميع احتياجات مكتبك القانوني في نظام واحد متكامل.'
              : 'From managing clients and cases to court hearings and financial statistics, Mizan covers all your legal firm needs in one place.'}
          </p>
        </div>

        <div className={styles.servicesGrid}>
          <Card className={styles.serviceCard}>
            <Users size={36} className={styles.serviceIcon} />
            <h3>{isRtl ? 'العملاء' : 'Clients'}</h3>
            <p>{isRtl ? 'إدارة بيانات العملاء والتواصل' : 'Manage client files and communication history'}</p>
          </Card>

          <Card className={styles.serviceCard}>
            <Briefcase size={36} className={styles.serviceIcon} />
            <h3>{isRtl ? 'القضايا' : 'Cases'}</h3>
            <p>{isRtl ? 'إدارة القضايا وتتبع مراحلها' : 'Track legal cases stages and opposition details'}</p>
          </Card>

          <Card className={styles.serviceCard}>
            <Calendar size={36} className={styles.serviceIcon} />
            <h3>{isRtl ? 'الجلسات' : 'Sessions'}</h3>
            <p>{isRtl ? 'جدولة الجلسات والتذكيرات' : 'Schedule court sessions, hearings, and dates'}</p>
          </Card>

          <Card className={styles.serviceCard}>
            <FileText size={36} className={styles.serviceIcon} />
            <h3>{isRtl ? 'المستندات' : 'Documents'}</h3>
            <p>{isRtl ? 'تنظيم المستندات والملفات' : 'Organize power of attorney, contracts, and briefs'}</p>
          </Card>

          <Card className={styles.serviceCard}>
            <CheckSquare size={36} className={styles.serviceIcon} />
            <h3>{isRtl ? 'المهام' : 'Tasks'}</h3>
            <p>{isRtl ? 'إدارة المهام ومتابعة الإنجاز' : 'Assign tasks to lawyers and trace progress'}</p>
          </Card>

          <Card className={styles.serviceCard}>
            <CreditCard size={36} className={styles.serviceIcon} />
            <h3>{isRtl ? 'المدفوعات' : 'Payments'}</h3>
            <p>{isRtl ? 'تتبع المدفوعات والمستحقات' : 'Trace client invoices, collections, and expenses'}</p>
          </Card>
        </div>
      </section>

      {/* التذييل السفلي */}
      <footer className={styles.footer}>
        <p>© 2026 Lexora. {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
      </footer>
    </div>
  );
};

export default LandingPage;
