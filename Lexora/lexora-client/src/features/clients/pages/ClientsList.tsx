import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';
import Card from '../../../components/ui/Card/Card';
import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import ClientFormModal from '../components/ClientFormModal';
import { Search, UserPlus, Edit2, Trash2, ArrowLeft, ArrowRight, Briefcase } from 'lucide-react';
import styles from './ClientsList.module.css';

interface ClientDto {
  id: number;
  clientType: string;
  fullName: string;
  nationalId?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  status: string;
  createdAt: string;
  activeCasesCount: number;
  totalCasesCount: number;
}

const STATUS_FILTERS = ['All', 'Active', 'Inactive', 'Archived'];

const ClientsList: React.FC = () => {
  const { t, i18n } = useTranslation(['clients', 'common']);
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  const [clients, setClients] = useState<ClientDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/clients', {
        params: {
          pageNumber: page,
          pageSize,
          searchTerm: searchTerm || undefined,
          status: statusFilter !== 'All' ? statusFilter : undefined
        }
      });
      setClients(response.data.items || []);
      setTotalCount(response.data.totalCount || 0);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchTerm, statusFilter]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  useEffect(() => { setPage(1); }, [searchTerm, statusFilter]);

  const handleDelete = async (id: number) => {
    if (window.confirm(t('list.confirm_delete'))) {
      try {
        await api.delete(`/clients/${id}`);
        fetchClients();
      } catch (error) {
        alert(t('list.error_delete'));
      }
    }
  };

  const openAddModal = () => { setSelectedClient(null); setIsFormOpen(true); };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const formatDate = (ds: string) => {
    try { return new Date(ds).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch { return ds; }
  };

  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className={styles.pageContainer} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={styles.headerRow}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/clients')}>
            <BackArrow size={16} />
            <span>{t('hub.title')}</span>
          </button>
          <h1 className={styles.title}>{t('list.title')}</h1>
        </div>
        <Button onClick={openAddModal}>
          <UserPlus size={18} />
          <span>{t('hub.card_add_title')}</span>
        </Button>
      </div>

      <Card className={styles.searchCard}>
        <Input
          placeholder={t('list.search_placeholder')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          icon={<Search size={18} />}
          iconPosition="start"
        />
        <div className={styles.filterGroup}>
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              className={`${styles.filterBtn} ${statusFilter === s ? styles.filterActive : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {t(`list.filter_${s.toLowerCase()}`)}
            </button>
          ))}
        </div>
      </Card>

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
                  <th>{t('list.col_name')}</th>
                  <th>{t('list.col_type')}</th>
                  <th>{t('list.col_phone')}</th>
                  <th>{t('list.col_cases')}</th>
                  <th>{t('list.col_status')}</th>
                  <th>{t('list.col_created')}</th>
                  <th>{t('list.col_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr><td colSpan={7} className={styles.emptyState}>{t('list.no_clients')}</td></tr>
                ) : (
                  clients.map(c => (
                    <tr key={c.id}>
                      <td>
                        <span className={styles.nameText} onClick={() => navigate(`/clients/${c.id}`)}>{c.fullName}</span>
                        {c.email && <span className={styles.emailSub}>{c.email}</span>}
                      </td>
                      <td><span className={styles.typeBadge}>{t(`types.${c.clientType}`)}</span></td>
                      <td className={styles.phoneCell}>{c.phoneNumber || '-'}</td>
                      <td>
                        <span className={styles.casesBadge}>
                          <Briefcase size={12} />
                          {c.totalCasesCount}
                          {c.activeCasesCount > 0 && <span className={styles.activeCases}> ({c.activeCasesCount} {isRtl ? 'نشط' : 'active'})</span>}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${c.status === 'Active' ? styles.badgeActive : c.status === 'Inactive' ? styles.badgeInactive : styles.badgeArchived}`}>
                          {t(`status.${c.status}`)}
                        </span>
                      </td>
                      <td className={styles.date}>{formatDate(c.createdAt)}</td>
                      <td>
                        <div className={styles.actions}>
                          <button onClick={() => navigate(`/clients/${c.id}`)} className={styles.actionBtn} title={t('details.title')}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(c.id)} className={`${styles.actionBtn} ${styles.actionBtnDelete}`} title={t('btn_delete', { ns: 'common' })}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => Math.max(p - 1, 1))}>
              {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
              <span>{t('list.pagination_prev')}</span>
            </Button>
            <span className={styles.pageNumber}>{page} / {totalPages}</span>
            <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(p => Math.min(p + 1, totalPages))}>
              <span>{t('list.pagination_next')}</span>
              {isRtl ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </Button>
          </div>
        )}
      </Card>

      <ClientFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchClients}
        clientToEdit={selectedClient}
      />
    </div>
  );
};

export default ClientsList;
