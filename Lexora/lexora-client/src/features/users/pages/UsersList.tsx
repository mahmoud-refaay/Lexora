import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Card from '../../../components/ui/Card/Card';
import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import UserFormModal from '../components/UserFormModal';
import { Search, UserPlus, Edit2, EyeOff, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import styles from './UsersList.module.css';

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

const UsersList: React.FC = () => {
  const { t, i18n } = useTranslation(['users', 'common']);
  const navigate = useNavigate();

  // حالات البيانات والصفحة
  const [users, setUsers] = useState<UserDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // حالات فتح النوافذ المنبثقة
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  const isRtl = i18n.language === 'ar';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users', {
        params: {
          pageNumber: page,
          pageSize,
          searchTerm: searchTerm || undefined
        }
      });
      setUsers(response.data.items || []);
      setTotalCount(response.data.totalCount || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const handleDeactivate = async (id: number) => {
    const confirmMessage = t('list.confirm_deactivate', { 
      defaultValue: isRtl ? 'هل أنت متأكد من رغبتك في تعطيل هذا المستخدم؟' : 'Are you sure you want to deactivate this user?' 
    });
    if (window.confirm(confirmMessage)) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deactivating user:', error);
        alert(t('list.error_deactivate', { 
          defaultValue: isRtl ? 'فشل تعطيل حساب المستخدم. تأكد من امتلاكك الصلاحية الكافية.' : 'Failed to deactivate user. Make sure you have sufficient permissions.' 
        }));
      }
    }
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const openEditModal = (user: UserDto) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* رأس الصفحة وزر العودة والاضافة */}
      <div className={styles.headerRow}>
        <div>
          <button 
            className={styles.backBtn}
            onClick={() => navigate('/users')}
          >
            {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            <span>{t('hub.title')}</span>
          </button>
          <h2 className={styles.title}>{t('list.title')}</h2>
        </div>
        <Button onClick={openAddModal}>
          <UserPlus size={18} />
          <span>{t('buttons.add_user', { ns: 'common' })}</span>
        </Button>
      </div>

      {/* شريط البحث المطور */}
      <Card className={styles.searchCard}>
        <Input
          placeholder={t('list.search_placeholder')}
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          icon={<Search size={18} />}
          iconPosition="start"
        />
      </Card>

      {/* جدول عرض البيانات */}
      <Card className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingState}>
            <span className={styles.spinner} />
            <span>{t('buttons.loading', { ns: 'common' })}</span>
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
                  <th>{t('list.col_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>
                      <ShieldAlert size={24} className={styles.emptyIcon} />
                      <span>{t('list.no_users')}</span>
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id}>
                      <td className={styles.username}>@{u.username}</td>
                      <td className={styles.fullName}>
                        <div className={styles.nameDetails}>
                          <span 
                            className={styles.nameText}
                            onClick={() => navigate(`/users/${u.id}`)}
                            style={{ cursor: 'pointer', color: 'var(--text-main)' }}
                          >
                            {u.fullName}
                          </span>
                          <span className={styles.emailText}>{u.email || '-'}</span>
                        </div>
                      </td>
                      <td className={styles.roles}>{u.roleNames || '-'}</td>
                      <td>
                        <span 
                          className={`${styles.statusBadge} ${
                            u.isActive ? styles.badgeActive : styles.badgeInactive
                          }`}
                        >
                          {u.isActive ? t('list.status_active') : t('list.status_inactive')}
                        </span>
                      </td>
                      <td className={styles.date}>{formatDate(u.createdAt)}</td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            onClick={() => openEditModal(u)}
                            className={styles.actionBtn}
                            title={t('buttons.edit', { ns: 'common' })}
                          >
                            <Edit2 size={14} />
                          </button>
                          {u.isActive && (
                            <button
                              onClick={() => handleDeactivate(u.id)}
                              className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                              title={t('buttons.deactivate', { ns: 'common' })}
                            >
                              <EyeOff size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* الترقيم والتنقل */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            >
              {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
              <span>{t('list.pagination_prev')}</span>
            </Button>
            
            <span className={styles.pageNumber}>
              {page} / {totalPages}
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            >
              <span>{t('list.pagination_next')}</span>
              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </Button>
          </div>
        )}
      </Card>

      {/* نافذة الإضافة والتعديل المنبثقة */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchUsers}
        userToEdit={selectedUser}
      />
    </div>
  );
};

export default UsersList;
