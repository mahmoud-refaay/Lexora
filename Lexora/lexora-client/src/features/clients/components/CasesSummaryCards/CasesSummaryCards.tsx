import React from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, FileText, CheckCircle, Archive } from 'lucide-react';
import styles from './CasesSummaryCards.module.css';

interface CasesSummaryCardsProps {
  totalCases: number;
  activeCases: number;
  closedCases: number;
  archivedCases: number;
}

const CasesSummaryCards: React.FC<CasesSummaryCardsProps> = ({
  totalCases,
  activeCases,
  closedCases,
  archivedCases
}) => {
  const { t } = useTranslation(['clients', 'common']);

  const cards = [
    {
      icon: <Briefcase size={20} />,
      label: t('details.total_cases'),
      value: totalCases,
      color: 'var(--color-primary)',
      bgColor: 'rgba(192, 149, 84, 0.1)'
    },
    {
      icon: <FileText size={20} />,
      label: t('details.active_cases'),
      value: activeCases,
      color: '#0ea5e9',
      bgColor: 'rgba(14, 165, 233, 0.1)'
    },
    {
      icon: <CheckCircle size={20} />,
      label: t('details.closed_cases'),
      value: closedCases,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      icon: <Archive size={20} />,
      label: t('details.archived_cases'),
      value: archivedCases,
      color: '#6b7280',
      bgColor: 'rgba(107, 114, 128, 0.1)'
    }
  ];

  return (
    <div className={styles.summaryGrid}>
      {cards.map((card, index) => (
        <div key={index} className={styles.summaryCard} style={{ '--card-color': card.color, '--card-bg': card.bgColor } as React.CSSProperties}>
          <div className={styles.cardIcon} style={{ color: card.color, background: card.bgColor }}>
            {card.icon}
          </div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{card.value}</span>
            <span className={styles.cardLabel}>{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CasesSummaryCards;
