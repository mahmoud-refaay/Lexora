import React from 'react';
import { useTranslation } from 'react-i18next';
import { Gavel, MoreVertical, ExternalLink } from 'lucide-react';
import styles from './RelatedCasesTable.module.css';

interface Case {
  id: number;
  caseNumber?: string;
  caseType?: string;
  courtName?: string;
  status: string;
  lawyerName?: string;
  lastHearing?: string;
}

interface RelatedCasesTableProps {
  cases: Case[];
  onViewAll?: () => void;
  onCaseClick?: (caseId: number) => void;
}

const RelatedCasesTable: React.FC<RelatedCasesTableProps> = ({ cases, onViewAll, onCaseClick }) => {
  const { t } = useTranslation(['clients', 'common']);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#0ea5e9';
      case 'Closed': return '#10b981';
      case 'Pending': return '#f59e0b';
      case 'Archived': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3 className={styles.tableTitle}>
          {t('details.section_cases')} {cases.length > 0 && cases.length}
        </h3>
        <button className={styles.viewAllBtn} onClick={onViewAll}>
          {t('details.view_all_cases')}
          <ExternalLink size={14} />
        </button>
      </div>

      {cases.length === 0 ? (
        <div className={styles.emptyState}>
          <Gavel size={32} className={styles.emptyIcon} />
          <p className={styles.emptyText}>{t('details.no_cases')}</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('details.case_number')}</th>
                <th>{t('details.case_title')}</th>
                <th>{t('details.case_status')}</th>
                <th>{t('details.case_lawyer')}</th>
                <th>{t('details.last_hearing')}</th>
                <th>{t('details.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => (
                <tr key={caseItem.id} className={styles.tableRow} onClick={() => onCaseClick?.(caseItem.id)}>
                  <td className={styles.caseNumber}>{caseItem.caseNumber || `#${caseItem.id}`}</td>
                  <td className={styles.caseTitle}>
                    <div className={styles.caseTitleContent}>
                      <span className={styles.caseType}>{caseItem.caseType || '-'}</span>
                      <span className={styles.caseCourt}>{caseItem.courtName || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className={styles.statusBadge} 
                      style={{ 
                        color: getStatusColor(caseItem.status),
                        background: `${getStatusColor(caseItem.status)}15`,
                        borderColor: `${getStatusColor(caseItem.status)}40`
                      }}
                    >
                      {t(`status.${caseItem.status}`, { ns: 'cases' })}
                    </span>
                  </td>
                  <td className={styles.lawyerName}>{caseItem.lawyerName || '-'}</td>
                  <td className={styles.lastHearing}>{caseItem.lastHearing || '-'}</td>
                  <td className={styles.actionsCell}>
                    <button className={styles.actionBtn}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RelatedCasesTable;
