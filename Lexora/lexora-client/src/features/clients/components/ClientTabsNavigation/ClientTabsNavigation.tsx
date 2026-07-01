import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ClientTabsNavigation.module.css';

interface ClientTabsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ClientTabsNavigation: React.FC<ClientTabsNavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation(['clients', 'common']);

  const tabs = [
    { id: 'activity', label: t('details.tab_activity') },
    { id: 'payments', label: t('details.tab_payments') },
    { id: 'notes', label: t('details.tab_notes') },
    { id: 'documents', label: t('details.tab_documents') },
    { id: 'cases', label: t('details.tab_cases') },
    { id: 'overview', label: t('details.tab_overview') }
  ];

  return (
    <div className={styles.tabsContainer}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabActive : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ClientTabsNavigation;
