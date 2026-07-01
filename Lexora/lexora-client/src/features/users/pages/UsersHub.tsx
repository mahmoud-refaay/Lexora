import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';
import Card from '../../../components/ui/Card/Card';
import Button from '../../../components/ui/Button/Button';
import UserFormModal from '../components/UserFormModal';
import {
  Users, Shield, UserCheck, UserX, UserPlus,
  ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import styles from './UsersHub.module.css';

interface UserDto {
  id: number;
  personId: number;
  username: string;
  isActive: boolean;
  createdAt: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  email?: string;
  roleNames?: string;
}

const AVAILABLE_ROLES_COUNT = 4;

const UsersHub: React.FC = () => {
  const { t, i18n } = useTranslation(['users', 'common']);
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [recentUsers, setRecentUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/users', {
          params: { pageNumber: 1, pageSize: 1000 }
        });
        const items: UserDto[] = response.data.items || [];
        const active = items.filter(u => u.isActive).length;
        const total = response.data.totalCount || items.length;
        setStats({ total, active, inactive: total - active });

        const sorted = [...items].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentUsers(sorted.slice(0, 5));
      } catch (error) {
        console.error('Error fetching users data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(
        i18n.language === 'ar' ? 'ar-EG' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' }
      );
    } catch {
      return dateString;
    }
  };

  const statCards = [
    {
      label: t('hub.stats.total'),
      value: stats.total,
      icon: <Users size={22} />,
      iconClass: styles.primaryIcon,
      glow: 'var(--color-primary-glow)',
      color: 'var(--color-primary)'
    },
    {
      label: t('hub.stats.active'),
      value: stats.active,
      icon: <UserCheck size={22} />,
      iconClass: styles.successIcon,
      glow: 'var(--color-success-glow)',
      color: 'var(--color-success)'
    },
    {
      label: t('hub.stats.inactive'),
      value: stats.inactive,
      icon: <UserX size={22} />,
      iconClass: styles.dangerIcon,
      glow: 'var(--color-danger-glow)',
      color: 'var(--color-danger)'
    },
    {
      label: t('hub.stats.roles'),
      value: AVAILABLE_ROLES_COUNT,
      icon: <Shield size={22} />,
      iconClass: styles.secondaryIcon,
      glow: 'var(--color-secondary-glow)',
      color: 'var(--color-secondary)'
    }
  ];

  const navCards = [
    {
      title: t('hub.card_users_title'),
      desc: t('hub.card_users_desc'),
      icon: <Users size={28} />,
      onClick: () => navigate('/users/list')
    },
    {
      title: t('hub.card_roles_title'),
      desc: t('hub.card_roles_desc'),
      icon: <Shield size={28} />,
      onClick: () => navigate('/users/roles')
    },
    {
      title: t('hub.card_add_title'),
      desc: t('hub.card_add_desc'),
      icon: <UserPlus size={28} />,
      onClick: () => setIsFormOpen(true)
    }
  ];

  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className={styles.hubContainer} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* رأس الصفحة */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{t('hub.title')}</h1>
          <p className={styles.subtitle}>{t('hub.subtitle')}</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className={styles.headerBtn}>
          <UserPlus size={18} />
          <span>{t('hub.card_add_title')}</span>
        </Button>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className={styles.statsGrid}>
        {statCards.map((card, idx) => (
          <Card key={idx} className={styles.statCard}>
            <div className={`${styles.iconWrapper} ${card.iconClass}`}>
              {card.icon}
            </div>
            <div className={styles.statDetails}>
              <span className={styles.statLabel}>{card.label}</span>
              <span className={styles.statValue}>
                {loading ? <span className={styles.shimmer} /> : card.value}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* بطاقات الانتقال السريع */}
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{isRtl ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
      </div>
      <div className={styles.navigationGrid}>
        {navCards.map((card, idx) => (
          <Card
            key={idx}
            className={`${styles.navCard} glass-panel`}
            onClick={card.onClick}
          >
            <div className={styles.navCardHeader}>
              <div className={styles.navIconWrapper}>{card.icon}</div>
              <Arrow className={styles.arrow} size={20} />
            </div>
            <h3 className={styles.navCardTitle}>{card.title}</h3>
            <p className={styles.navCardDesc}>{card.desc}</p>
          </Card>
        ))}
      </div>

      {/* جدول أحدث المستخدمين */}
      <div className={styles.sectionHeader}>
        <div>
          <h3 className={styles.sectionTitle}>{t('hub.recent_section_title')}</h3>
          <p className={styles.sectionDesc}>{t('hub.recent_section_desc')}</p>
        </div>
        <button className={styles.viewAllBtn} onClick={() => navigate('/users/list')}>
          <span>{t('hub.view_all')}</span>
          {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <Card className={styles.recentCard}>
        {loading ? (
          <div className={styles.loadingState}>
            <span className={styles.spinner} />
            <span>{t('buttons.loading', { ns: 'common' })}</span>
          </div>
        ) : recentUsers.length === 0 ? (
          <div className={styles.emptyState}>
            <Users size={32} className={styles.emptyIcon} />
            <span>{t('hub.no_recent')}</span>
          </div>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('list.col_username')}</th>
                  <th>{t('list.col_name')}</th>
                  <th>{t('list.col_roles')}</th>
                  <th>{t('list.col_status')}</th>
                  <th>{t('list.col_created')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(u => (
                  <tr
                    key={u.id}
                    className={styles.clickableRow}
                    onClick={() => navigate(`/users/${u.id}`)}
                  >
                    <td className={styles.username}>@{u.username}</td>
                    <td className={styles.fullName}>{u.fullName}</td>
                    <td className={styles.roles}>
                      {u.roleNames ? (
                        u.roleNames.split(',').map((role, i) => (
                          <span key={i} className={styles.roleBadge}>{role.trim()}</span>
                        ))
                      ) : '-'}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${u.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                        {u.isActive ? t('list.status_active') : t('list.status_inactive')}
                      </span>
                    </td>
                    <td className={styles.date}>{formatDate(u.createdAt)}</td>
                    <td>
                      <ArrowUpRight size={16} className={styles.rowArrow} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* نافذة الإضافة المنبثقة */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setLoading(true);
          window.location.reload();
        }}
        userToEdit={null}
      />
    </div>
  );
};

export default UsersHub;
