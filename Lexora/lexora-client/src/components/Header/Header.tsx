import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  Search, Bell, Globe, ChevronDown, User as UserIcon,
  LogOut, Settings as SettingsIcon
} from 'lucide-react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation(['common']);
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lexora_lang', newLang);
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className={styles.header} dir="ltr">
      {/* شريط البحث */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t('dashboard.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* عناصر التحكم والمعلومات */}
      <div className={styles.headerActions}>
        {/* زر تغيير اللغة */}
        <button onClick={toggleLanguage} className={styles.langBtn} title={isRtl ? 'Switch to English' : 'تغيير إلى العربية'}>
          <Globe size={16} />
          <span>{i18n.language === 'ar' ? 'English' : 'العربية'}</span>
        </button>

        {/* الإشعارات — لون ذهبي */}
        <button className={styles.notificationBtn} title={isRtl ? 'التنبيهات' : 'Notifications'}>
          <Bell size={18} />
          <span className={styles.badge}>3</span>
        </button>

        {/* معلومات المستخدم + القائمة المنسدلة */}
        {user && (
          <div className={styles.userBlock} ref={menuRef}>
            <button
              className={styles.userTrigger}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className={styles.userInfoBlock}>
                <span className={styles.uName}>{user.fullName}</span>
                <span className={styles.uTitle}>{t('dashboard.role_senior')}</span>
              </div>
              <div className={styles.userAvatar}>
                <UserIcon size={20} />
              </div>
              <ChevronDown size={14} className={`${styles.chevron} ${userMenuOpen ? styles.chevronOpen : ''}`} />
            </button>

            {/* القائمة المنسدلة */}
            {userMenuOpen && (
              <div className={styles.dropdownMenu} dir={isRtl ? 'rtl' : 'ltr'}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownAvatar}>
                    <UserIcon size={24} />
                  </div>
                  <div className={styles.dropdownUserMeta}>
                    <span className={styles.dropdownName}>{user.fullName}</span>
                    <span className={styles.dropdownUsername}>@{user.username}</span>
                  </div>
                </div>
                <div className={styles.dropdownDivider} />
                <button
                  className={styles.dropdownItem}
                  onClick={() => { setUserMenuOpen(false); navigate('/settings'); }}
                >
                  <UserIcon size={16} />
                  <span>{isRtl ? 'عرض الملف الشخصي' : 'View Profile'}</span>
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => { setUserMenuOpen(false); navigate('/settings'); }}
                >
                  <SettingsIcon size={16} />
                  <span>{isRtl ? 'الإعدادات' : 'Settings'}</span>
                </button>
                <div className={styles.dropdownDivider} />
                <button className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
