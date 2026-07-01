import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Gavel, 
  CheckSquare, 
  FolderOpen, 
  CreditCard, 
  BarChart3, 
  Shield, 
  Archive, 
  Settings, 
  Headphones
} from 'lucide-react';
import Header from '../Header/Header';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['common']);
  const isRtl = i18n.language === 'ar';

  return (
    <div className={styles.appContainer} dir="ltr">
      {/* الخلفية المضيئة المخصصة */}
      <div className="cyber-bg-glow" />

      {/* شريط التحكم الجانبي */}
      <aside className={`${styles.sidebar} glass-panel`}>
        {/* الهوية والشعار */}
        <div className={styles.brand}>
          <img src="/images/3d/lexora_logo.png" alt="Mizan Logo" className={styles.brandLogo3d} />
          <div className={styles.brandTextWrapper}>
            <span className={styles.brandText}>ميزان</span>
            <span className={styles.brandSubtext}>LEXORA</span>
          </div>
        </div>



        {/* روابط الملاحة الاثني عشر */}
        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ''}`
            }
          >
            <LayoutDashboard size={24} />
            <span>{t('nav.dashboard')}</span>
          </NavLink>

          <NavLink
            to="/cases"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ''}`
            }
          >
            <Briefcase size={24} />
            <span>{t('nav.cases')}</span>
          </NavLink>

          <NavLink
            to="/clients"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ''}`
            }
          >
            <Users size={24} />
            <span>{t('nav.clients')}</span>
          </NavLink>

          <NavLink
            to="/sessions"
            onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
            className={styles.navLink}
          >
            <Gavel size={24} />
            <span>{t('nav.sessions')}</span>
          </NavLink>

          <NavLink
            to="/tasks"
            onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
            className={styles.navLink}
          >
            <CheckSquare size={24} />
            <span>{t('nav.tasks')}</span>
          </NavLink>

          <NavLink
            to="/documents"
            onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
            className={styles.navLink}
          >
            <FolderOpen size={24} />
            <span>{t('nav.documents')}</span>
          </NavLink>

          <NavLink
            to="/finance"
            onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
            className={styles.navLink}
          >
            <CreditCard size={24} />
            <span>{t('nav.finance')}</span>
          </NavLink>

          <NavLink
            to="/reports"
            onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
            className={styles.navLink}
          >
            <BarChart3 size={24} />
            <span>{t('nav.reports')}</span>
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ''}`
            }
          >
            <Shield size={24} />
            <span>{t('nav.users')}</span>
          </NavLink>

          <NavLink
            to="/archive"
            onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
            className={styles.navLink}
          >
            <Archive size={24} />
            <span>{isRtl ? 'الأرشيف' : 'Archive'}</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.activeLink : ''}`
            }
          >
            <Settings size={24} />
            <span>{t('nav.settings')}</span>
          </NavLink>

        </nav>

        {/* زر الدعم والمساعدة المدمج في أسفل القائمة */}
        <div className={styles.sidebarFooter}>
          <button 
            className={styles.supportButton}
            onClick={() => navigate('/dashboard')}
            title={isRtl ? 'الدعم والمساعدة' : 'Support & Help'}
          >
            <Headphones size={24} />
            <span>{isRtl ? 'الدعم والمساعدة' : 'Support & Help'}</span>
          </button>
        </div>

        {/* تمثال العدالة كديكور مدمج */}
        <img src="/images/3d/lady_justice.png" alt="Lady Justice" className={styles.ladyJusticeDecoration} />
      </aside>

      {/* مساحة العرض الرئيسية */}
      <main className={styles.contentArea} dir="ltr">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
