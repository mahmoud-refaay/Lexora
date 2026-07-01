import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';
import Card from '../../../components/ui/Card/Card';
import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import CaseFormModal from '../components/CaseFormModal';
import { Search, FolderPlus, Edit2, Trash2, Archive, ArchiveRestore, ArrowLeft, ArrowRight, Gavel } from 'lucide-react';
import styles from './CasesList.module.css';

interface CaseDto {
  id: number;
  clientId: number;
  clientRole: string;
  caseNumber?: string;
  caseType?: string;
  courtName?: string;
  courtCircuit?: string;
  clientName?: string;
  assignedLawyerName?: string;
  assignedLawyerId?: number;
  opponentName?: string;
  opponentLawyer?: string;
  subject?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  isArchived: boolean;
  createdAt: string;
}

const STATUS_FILTERS = ['All', 'Open', 'Pending', 'Scheduled', 'Closed'];

const CasesList: React.FC = () => {
  const { t, i18n } = useTranslation(['cases', 'common']);
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  const [cases, setCases] = useState<CaseDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseDto | null>(null);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/cases', {
        params: {
          pageNumber: page, pageSize,
          searchTerm: searchTerm || undefined,
          status: statusFilter !== 'All' ? statusFilter : undefined,
          isArchived: showArchived ? undefined : false
        }
      });
      setCases(response.data.items || []);
      setTotalCount(response.data.totalCount || 0);
    } catch (error) { console.error('Error fetching cases:', error); }
    finally { setLoading(false); }
  }, [page, pageSize, searchTerm, statusFilter, showArchived]);

  useEffect(() => { fetchCases(); }, [fetchCases]);
  useEffect(() => { setPage(1); }, [searchTerm, statusFilter, showArchived]);

  const handleDelete = async (id: number) => {
    if (window.confirm(t('list.confirm_delete'))) {
      try { await api.delete(`/cases/${id}`); fetchCases(); }
      catch { alert(t('list.error_delete')); }
    }
  };

  const handleArchive = async (c: CaseDto) => {
    const msg = c.isArchived ? t('list.confirm_unarchive') : t('list.confirm_archive');
    if (window.confirm(msg)) {
      try { await api.put(`/cases/${c.id}/archive?isArchived=${!c.isArchived}`); fetchCases(); }
      catch { console.error('Archive error'); }
    }
  };

  const openAddModal = () => { setSelectedCase(null); setIsFormOpen(true); };
  const openEditModal = (c: CaseDto) => { setSelectedCase(c); setIsFormOpen(true); };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className={styles.pageContainer} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={styles.headerRow}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate('/cases')}>
            <BackArrow size={16} /><span>{t('hub.title')}</span>
          </button>
          <h1 className={styles.title}>{t('list.title')}</h1>
        </div>
        <Button onClick={openAddModal}>
          <FolderPlus size={18} /><span>{t('hub.card_add_title')}</span>
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
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            {STATUS_FILTERS.map(s => (
              <button key={s} className={`${styles.filterBtn} ${statusFilter === s ? styles.filterActive : ''}`} onClick={() => setStatusFilter(s)}>
                {t(`list.filter_${s.toLowerCase()}`)}
              </button>
            ))}
          </div>
          <button className={`${styles.filterBtn} ${showArchived ? styles.filterActive : ''}`} onClick={() => setShowArchived(!showArchived)}>
            <Archive size={14} />
            <span>{showArchived ? t('list.filter_unarchived') : t('list.filter_archived')}</span>
          </button>
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
                  <th>{t('list.col_number')}</th>
                  <th>{t('list.col_client')}</th>
                  <th>{t('list.col_type')}</th>
                  <th>{t('list.col_court')}</th>
                  <th>{t('list.col_lawyer')}</th>
                  <th>{t('list.col_status')}</th>
                  <th>{t('list.col_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {cases.length === 0 ? (
                  <tr><td colSpan={7} className={styles.emptyState}>{t('list.no_cases')}</td></tr>
                ) : (
                  cases.map(c => (
                    <tr key={c.id}>
                      <td>
                        <span className={styles.caseNumber} onClick={() => navigate(`/cases/${c.id}`)}>
                          <Gavel size={14} />
                          {c.caseNumber || `#${c.id}`}
                        </span>
                        {c.isArchived && <span className={styles.archivedTag}>{t('details.archived_badge')}</span>}
                      </td>
                      <td className={styles.clientCell}>{c.clientName || '-'}</td>
                      <td className={styles.typeCell}>{c.caseType || '-'}</td>
                      <td className={styles.courtCell}>{c.courtName || '-'}</td>
                      <td className={styles.lawyerCell}>{c.assignedLawyerName || '-'}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[`status_${c.status}`] || ''}`}>
                          {t(`status.${c.status}`)}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button onClick={() => openEditModal(c)} className={styles.actionBtn} title={t('details.btn_edit')}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleArchive(c)} className={styles.actionBtn} title={c.isArchived ? t('details.btn_unarchive') : t('details.btn_archive')}>
                            {c.isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                          </button>
                          <button onClick={() => handleDelete(c.id)} className={`${styles.actionBtn} ${styles.actionBtnDelete}`} title={t('details.btn_delete')}>
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

      <CaseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchCases}
        caseToEdit={selectedCase}
      />
    </div>
  );
};

export default CasesList;
