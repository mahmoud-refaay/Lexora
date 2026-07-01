import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';
import Card from '../../../components/ui/Card/Card';
import Button from '../../../components/ui/Button/Button';
import CaseFormModal from '../components/CaseFormModal';
import {
  Briefcase, FolderPlus, FolderOpen, FolderX, Archive,
  ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Gavel
} from 'lucide-react';
import styles from './CasesHub.module.css';

interface CaseDto {
  id: number;
  caseNumber?: string;
  caseType?: string;
  courtName?: string;
  clientName?: string;
  status: string;
  isArchived: boolean;
  createdAt: string;
}

const CasesHub: React.FC = () => {
  const { t, i18n } = useTranslation(['cases', 'common']);
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  const [stats, setStats] = useState({ total: 0, open: 0, closed: 0, archived: 0 });
  const [recent, setRecent] = useState<CaseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/cases', { params: { pageNumber: 1, pageSize: 1000 } });
        const items: CaseDto[] = response.data.items || [];
        const total = response.data.totalCount || items.length;
        setStats({
          total,
          open: items.filter(c => c.status === 'Open' && !c.isArchived).length,
          closed: items.filter(c => c.status === 'Closed' && !c.isArchived).length,
          archived: items.filter(c => c.isArchived).length
        });
        const sorted = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecent(sorted.slice(0, 5));
      } catch (error) {
        console.error('Error fetching cases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (ds: string) => {
    try { return new Date(ds).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch { return ds; }
  };

  const statCards = [
    { label: t('hub.stats.total'), value: stats.total, icon: <Briefcase size={22} />, cls: styles.primaryIcon },
    { label: t('hub.stats.open'), value: stats.open, icon: <FolderOpen size={22} />, cls: styles.successIcon },
    { label: t('hub.stats.closed'), value: stats.closed, icon: <FolderX size={22} />, cls: styles.secondaryIcon },
    { label: t('hub.stats.archived'), value: stats.archived, icon: <Archive size={22} />, cls: styles.dangerIcon }
  ];

  const navCards = [
    { title: t('hub.card_list_title'), desc: t('hub.card_list_desc'), icon: <Briefcase size={28} />, onClick: () => navigate('/cases/list') },
    { title: t('hub.card_add_title'), desc: t('hub.card_add_desc'), icon: <FolderPlus size={28} />, onClick: () => setIsFormOpen(true) }
  ];

  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className={styles.hubContainer} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{t('hub.title')}</h1>
          <p className={styles.subtitle}>{t('hub.subtitle')}</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className={styles.headerBtn}>
          <FolderPlus size={18} />
          <span>{t('hub.card_add_title')}</span>
        </Button>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((card, idx) => (
          <Card key={idx} className={styles.statCard}>
            <div className={`${styles.iconWrapper} ${card.cls}`}>{card.icon}</div>
            <div className={styles.statDetails}>
              <span className={styles.statLabel}>{card.label}</span>
              <span className={styles.statValue}>{loading ? <span className={styles.shimmer} /> : card.value}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{t('hub.quick_actions')}</h3>
      </div>
      <div className={styles.navigationGrid}>
        {navCards.map((card, idx) => (
          <Card key={idx} className={`${styles.navCard} glass-panel`} onClick={card.onClick}>
            <div className={styles.navCardHeader}>
              <div className={styles.navIconWrapper}>{card.icon}</div>
              <Arrow className={styles.arrow} size={20} />
            </div>
            <h3 className={styles.navCardTitle}>{card.title}</h3>
            <p className={styles.navCardDesc}>{card.desc}</p>
          </Card>
        ))}
      </div>

      <div className={styles.sectionHeader}>
        <div>
          <h3 className={styles.sectionTitle}>{t('hub.recent_title')}</h3>
          <p className={styles.sectionDesc}>{t('hub.recent_desc')}</p>
        </div>
        <button className={styles.viewAllBtn} onClick={() => navigate('/cases/list')}>
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
        ) : recent.length === 0 ? (
          <div className={styles.emptyState}>
            <Briefcase size={32} className={styles.emptyIcon} />
            <span>{t('hub.no_recent')}</span>
          </div>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('list.col_number')}</th>
                  <th>{t('list.col_client')}</th>
                  <th>{t('list.col_court')}</th>
                  <th>{t('list.col_status')}</th>
                  <th>{t('list.col_created')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c.id} className={styles.clickableRow} onClick={() => navigate(`/cases/${c.id}`)}>
                    <td className={styles.caseNumber}>
                      <Gavel size={14} className={styles.gavelIcon} />
                      {c.caseNumber || `#${c.id}`}
                    </td>
                    <td className={styles.clientCell}>{c.clientName || '-'}</td>
                    <td className={styles.courtCell}>{c.courtName || '-'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[`status_${c.status}`] || ''}`}>
                        {t(`status.${c.status}`)}
                      </span>
                      {c.isArchived && <span className={styles.archivedTag}>{t('details.archived_badge')}</span>}
                    </td>
                    <td className={styles.date}>{formatDate(c.createdAt)}</td>
                    <td><ArrowUpRight size={16} className={styles.rowArrow} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <CaseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => { setIsFormOpen(false); window.location.reload(); }}
        caseToEdit={null}
      />
    </div>
  );
};

export default CasesHub;
