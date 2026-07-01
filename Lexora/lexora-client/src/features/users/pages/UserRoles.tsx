import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';
import Card from '../../../components/ui/Card/Card';
import {
  ArrowLeft, ArrowRight, ShieldCheck, Users,
  Crown, Briefcase, Headphones, Calculator, Loader
} from 'lucide-react';
import styles from './UserRoles.module.css';

interface RoleDetail {
  id: number;
  name: string;
  nameEn: string;
  nameAr: string;
  desc: string;
  descEn: string;
  descAr: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
  permissions: { code: string; labelAr: string; labelEn: string }[];
  userCount: number;
}

const UserRoles: React.FC = () => {
  const { t, i18n } = useTranslation(['users', 'common']);
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  const [roleStats, setRoleStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await api.get('/users', {
          params: { pageNumber: 1, pageSize: 1000 }
        });
        const items = response.data.items || [];
        const counts: Record<string, number> = {};
        items.forEach((u: any) => {
          if (u.roleNames) {
            u.roleNames.split(',').forEach((r: string) => {
              const role = r.trim();
              counts[role] = (counts[role] || 0) + 1;
            });
          }
        });
        setRoleStats(counts);
      } catch (error) {
        console.error('Error fetching role stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserCounts();
  }, []);

  const rolesData: RoleDetail[] = [
    {
      id: 1,
      name: isRtl ? 'مدير النظام' : 'System Administrator',
      nameAr: 'مدير النظام',
      nameEn: 'System Administrator',
      desc: isRtl
        ? 'يمتلك كامل الصلاحيات لإدارة المستخدمين، الأدوار، إعدادات النظام، والتدقيق الأمني.'
        : 'Full system control, managing users, roles, settings, and audit logs.',
      descAr: 'يمتلك كامل الصلاحيات لإدارة المستخدمين، الأدوار، إعدادات النظام، والتدقيق الأمني.',
      descEn: 'Full system control, managing users, roles, settings, and audit logs.',
      icon: <Crown size={26} />,
      color: 'var(--color-primary)',
      glow: 'var(--color-primary-glow)',
      permissions: [
        { code: 'users.view', labelAr: 'عرض المستخدمين', labelEn: 'View Users' },
        { code: 'users.create', labelAr: 'إنشاء مستخدمين', labelEn: 'Create Users' },
        { code: 'users.edit', labelAr: 'تعديل المستخدمين', labelEn: 'Edit Users' },
        { code: 'users.delete', labelAr: 'تعطيل المستخدمين', labelEn: 'Deactivate Users' },
        { code: 'settings.view', labelAr: 'عرض الإعدادات', labelEn: 'View Settings' },
        { code: 'settings.edit', labelAr: 'تعديل الإعدادات', labelEn: 'Edit Settings' },
        { code: 'audit.view', labelAr: 'سجلات التدقيق', labelEn: 'Audit Logs' }
      ],
      userCount: roleStats['Admin'] || 0
    },
    {
      id: 2,
      name: isRtl ? 'محامي' : 'Lawyer / Attorney',
      nameAr: 'محامي',
      nameEn: 'Lawyer / Attorney',
      desc: isRtl
        ? 'إدارة القضايا والملفات، إضافة وتعديل العملاء، وتحديث جلسات المحاكم والمهام.'
        : 'Manage cases, add/edit clients, schedule court hearings and tasks.',
      descAr: 'إدارة القضايا والملفات، إضافة وتعديل العملاء، وتحديث جلسات المحاكم والمهام.',
      descEn: 'Manage cases, add/edit clients, schedule court hearings and tasks.',
      icon: <Briefcase size={26} />,
      color: 'var(--color-secondary)',
      glow: 'var(--color-secondary-glow)',
      permissions: [
        { code: 'clients.view', labelAr: 'عرض العملاء', labelEn: 'View Clients' },
        { code: 'clients.create', labelAr: 'إضافة عملاء', labelEn: 'Add Clients' },
        { code: 'clients.edit', labelAr: 'تعديل العملاء', labelEn: 'Edit Clients' },
        { code: 'cases.view', labelAr: 'عرض القضايا', labelEn: 'View Cases' },
        { code: 'cases.create', labelAr: 'إنشاء القضايا', labelEn: 'Create Cases' },
        { code: 'cases.edit', labelAr: 'تعديل القضايا', labelEn: 'Edit Cases' },
        { code: 'hearings.view', labelAr: 'عرض الجلسات', labelEn: 'View Hearings' },
        { code: 'hearings.edit', labelAr: 'تعديل الجلسات', labelEn: 'Edit Hearings' }
      ],
      userCount: roleStats['Lawyer'] || 0
    },
    {
      id: 3,
      name: isRtl ? 'سكرتير' : 'Secretary / Assistant',
      nameAr: 'سكرتير',
      nameEn: 'Secretary / Assistant',
      desc: isRtl
        ? 'تسجيل العملاء الجدد، تنظيم المواعيد والتقويم، واستعراض تفاصيل القضايا دون تعديلها.'
        : 'Register new clients, organize calendars, view cases and reports without modifying.',
      descAr: 'تسجيل العملاء الجدد، تنظيم المواعيد والتقويم، واستعراض تفاصيل القضايا دون تعديلها.',
      descEn: 'Register new clients, organize calendars, view cases and reports without modifying.',
      icon: <Headphones size={26} />,
      color: 'var(--color-success)',
      glow: 'var(--color-success-glow)',
      permissions: [
        { code: 'clients.view', labelAr: 'عرض العملاء', labelEn: 'View Clients' },
        { code: 'clients.create', labelAr: 'إضافة عملاء', labelEn: 'Add Clients' },
        { code: 'clients.edit', labelAr: 'تعديل العملاء', labelEn: 'Edit Clients' },
        { code: 'cases.view', labelAr: 'عرض القضايا', labelEn: 'View Cases' },
        { code: 'hearings.view', labelAr: 'عرض الجلسات', labelEn: 'View Hearings' }
      ],
      userCount: roleStats['Secretary'] || 0
    },
    {
      id: 4,
      name: isRtl ? 'محاسب' : 'Accountant',
      nameAr: 'محاسب',
      nameEn: 'Accountant',
      desc: isRtl
        ? 'إدارة الحسابات، إصدار فواتير الأتعاب، تتبع المدفوعات والمصروفات المالية للمكتب.'
        : 'Manage billing, issue invoices, track client payments and office expenses.',
      descAr: 'إدارة الحسابات، إصدار فواتير الأتعاب، تتبع المدفوعات والمصروفات المالية للمكتب.',
      descEn: 'Manage billing, issue invoices, track client payments and office expenses.',
      icon: <Calculator size={26} />,
      color: 'var(--color-warning)',
      glow: 'var(--color-warning-glow)',
      permissions: [
        { code: 'billing.view', labelAr: 'عرض الفواتير', labelEn: 'View Billing' },
        { code: 'billing.create', labelAr: 'إنشاء فواتير', labelEn: 'Create Invoices' },
        { code: 'billing.edit', labelAr: 'تعديل الفواتير', labelEn: 'Edit Invoices' },
        { code: 'expenses.view', labelAr: 'عرض المصروفات', labelEn: 'View Expenses' },
        { code: 'expenses.create', labelAr: 'إضافة مصروفات', labelEn: 'Add Expenses' }
      ],
      userCount: roleStats['Accountant'] || 0
    }
  ];

  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const totalUsers = Object.values(roleStats).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.pageContainer} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* رأس الصفحة */}
      <div className={styles.headerRow}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/users')}>
            <BackArrow size={16} />
            <span>{t('hub.title')}</span>
          </button>
          <h1 className={styles.title}>{t('hub.card_roles_title')}</h1>
          <p className={styles.subtitle}>
            {isRtl
              ? `${rolesData.length} أدوار متاحة في النظام • ${totalUsers} مستخدم مسجل`
              : `${rolesData.length} roles available • ${totalUsers} registered users`}
          </p>
        </div>
      </div>

      {/* بطاقات ملخصة */}
      <div className={styles.summaryGrid}>
        {rolesData.map(role => (
          <Card key={`summary-${role.id}`} className={styles.summaryCard}>
            <div className={styles.summaryIcon} style={{ background: role.glow, color: role.color }}>
              {role.icon}
            </div>
            <div className={styles.summaryMeta}>
              <span className={styles.summaryCount}>
                {loading ? <Loader size={14} className={styles.miniSpinner} /> : role.userCount}
              </span>
              <span className={styles.summaryLabel}>{isRtl ? role.nameAr : role.nameEn}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* بطاقات تفصيلية */}
      <div className={styles.rolesGrid}>
        {rolesData.map(role => (
          <Card key={role.id} className={styles.roleCard}>
            {/* رأس البطاقة */}
            <div className={styles.roleHeader}>
              <div className={styles.roleIconWrapper} style={{ background: role.glow, color: role.color }}>
                {role.icon}
              </div>
              <div className={styles.roleTitleMeta}>
                <h3 className={styles.roleName}>{role.name}</h3>
                <div className={styles.roleUserCount}>
                  <Users size={13} />
                  <span>
                    {loading ? '...' : role.userCount} {isRtl ? 'مستخدم' : 'users'}
                  </span>
                </div>
              </div>
            </div>

            {/* الوصف */}
            <p className={styles.roleDesc}>{role.desc}</p>

            {/* الصلاحيات */}
            <div className={styles.permissionsSection}>
              <h4 className={styles.sectionTitle}>
                <ShieldCheck size={14} />
                <span>{isRtl ? 'الصلاحيات الممنوحة' : 'Granted Permissions'}</span>
                <span className={styles.permCount}>{role.permissions.length}</span>
              </h4>
              <div className={styles.permissionsList}>
                {role.permissions.map(perm => (
                  <span key={perm.code} className={styles.permBadge} style={{ borderColor: role.color + '30' }}>
                    <ShieldCheck size={11} style={{ color: role.color }} />
                    <span>{isRtl ? perm.labelAr : perm.labelEn}</span>
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserRoles;
