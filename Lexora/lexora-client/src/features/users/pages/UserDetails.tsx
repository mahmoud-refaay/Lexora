import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';
import Card from '../../../components/ui/Card/Card';
import Button from '../../../components/ui/Button/Button';
import UserFormModal from '../components/UserFormModal';
import {
  ArrowLeft, ArrowRight, User as UserIcon, Mail, Phone, MapPin,
  Calendar, ShieldCheck, ShieldAlert, Edit2, EyeOff, UserCheck,
  AlertCircle, Loader
} from 'lucide-react';
import styles from './UserDetails.module.css';

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
  createdByUserId?: number | null;
}

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['users', 'common']);
  const isRtl = i18n.language === 'ar';

  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
      } catch (err: any) {
        const status = err.response?.status;
        setError(status === 404 ? t('details.not_found') : t('details.error_load'));
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, t]);

  const handleDeactivate = async () => {
    if (!user) return;
    if (window.confirm(t('details.confirm_deactivate'))) {
      setActionLoading(true);
      try {
        await api.delete(`/users/${user.id}`);
        setUser({ ...user, isActive: false });
      } catch (err) {
        console.error('Error deactivating user:', err);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(
        i18n.language === 'ar' ? 'ar-EG' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      );
    } catch {
      return dateString;
    }
  };

  const rolesArray = user?.roleNames
    ? user.roleNames.split(',').map(r => r.trim()).filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className={styles.stateContainer}>
        <Loader size={32} className={styles.spinner} />
        <span className={styles.stateText}>{t('buttons.loading', { ns: 'common' })}</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.stateContainer}>
        <AlertCircle size={32} className={styles.errorIcon} />
        <span className={styles.stateText}>{error || t('details.not_found')}</span>
        <Button variant="secondary" onClick={() => navigate('/users/list')} className={styles.stateBtn}>
          <BackArrow size={16} />
          <span>{t('details.back_to_list')}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.detailsContainer} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* شريط العلوي: زر العودة + الإجراءات */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/users/list')}>
          <BackArrow size={16} />
          <span>{t('details.back_to_list')}</span>
        </button>

        <div className={styles.actionsBar}>
          <Button variant="secondary" onClick={() => setIsFormOpen(true)} disabled={actionLoading}>
            <Edit2 size={16} />
            <span>{t('details.btn_edit')}</span>
          </Button>
          {user.isActive && (
            <Button variant="danger" onClick={handleDeactivate} isLoading={actionLoading}>
              <EyeOff size={16} />
              <span>{t('details.btn_deactivate')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* بطاقة العنوان: اسم المستخدم + الحالة */}
      <Card className={styles.profileHeader}>
        <div className={styles.profileAvatar}>
          <UserIcon size={48} />
        </div>
        <div className={styles.profileMeta}>
          <h1 className={styles.profileName}>{user.fullName}</h1>
          <span className={styles.profileUsername}>@{user.username}</span>
          <div className={styles.profileBadges}>
            <span className={`${styles.statusBadge} ${user.isActive ? styles.badgeActive : styles.badgeInactive}`}>
              {user.isActive ? <UserCheck size={14} /> : <ShieldAlert size={14} />}
              {user.isActive ? t('details.active') : t('details.inactive')}
            </span>
            {rolesArray.map((role, i) => (
              <span key={i} className={styles.roleBadge}>
                <ShieldCheck size={14} />
                {role}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* بطاقات المعلومات */}
      <div className={styles.infoGrid}>
        {/* بيانات الحساب */}
        <Card className={styles.infoCard}>
          <h3 className={styles.cardTitle}>{t('details.section_account')}</h3>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}><UserIcon size={16} /></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>{t('details.username')}</span>
                <span className={styles.infoValue}>@{user.username}</span>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}><ShieldCheck size={16} /></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>{t('details.status')}</span>
                <span className={`${styles.infoValue} ${user.isActive ? styles.textSuccess : styles.textDanger}`}>
                  {user.isActive ? t('details.active') : t('details.inactive')}
                </span>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}><Calendar size={16} /></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>{t('details.created_at')}</span>
                <span className={styles.infoValue}>{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* البيانات الشخصية */}
        <Card className={styles.infoCard}>
          <h3 className={styles.cardTitle}>{t('details.section_personal')}</h3>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}><UserIcon size={16} /></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>{t('details.full_name')}</span>
                <span className={styles.infoValue}>{user.fullName}</span>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}><Mail size={16} /></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>{t('details.email')}</span>
                <span className={styles.infoValue}>{user.email || t('details.not_specified')}</span>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}><Phone size={16} /></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>{t('details.phone')}</span>
                <span className={styles.infoValue}>{user.phoneNumber || t('details.not_specified')}</span>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}><MapPin size={16} /></div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>{t('details.address')}</span>
                <span className={styles.infoValue}>{user.address || t('details.not_specified')}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* مودال التعديل */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          setLoading(true);
          api.get(`/users/${id}`).then(r => setUser(r.data)).finally(() => setLoading(false));
        }}
        userToEdit={user}
      />
    </div>
  );
};

export default UserDetails;
