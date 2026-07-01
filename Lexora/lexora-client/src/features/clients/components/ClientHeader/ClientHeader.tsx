import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, MoreHorizontal, Edit } from 'lucide-react';
import styles from './ClientHeader.module.css';

interface ClientHeaderProps {
  clientName: string;
  onEdit: () => void;
  onMore?: () => void;
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ clientName, onEdit, onMore }) => {
  const { t } = useTranslation(['clients', 'common']);

  return (
    <div className={styles.header}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => window.history.back()}>
          {t('clients.title')}
        </button>
        <ChevronRight size={16} className={styles.breadcrumbSeparator} />
        <span className={styles.currentPage}>{clientName}</span>
      </div>

      <div className={styles.headerActions}>
        <button className={styles.iconButton} onClick={onMore}>
          <MoreHorizontal size={20} />
        </button>
        <button className={styles.editButton} onClick={onEdit}>
          <Edit size={16} />
          {t('details.btn_edit')}
        </button>
      </div>
    </div>
  );
};

export default ClientHeader;
