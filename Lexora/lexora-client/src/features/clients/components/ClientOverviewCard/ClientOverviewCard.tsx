import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Calendar, Hash, Briefcase, CheckCircle, Archive, FileText } from 'lucide-react';
import styles from './ClientOverviewCard.module.css';

interface ClientOverviewCardProps {
  client: {
    id: number;
    fullName: string;
    clientType: string;
    status: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    nationalId?: string;
    createdAt: string;
    city?: string;
    activeCasesCount: number;
    totalCasesCount: number;
  };
  closedCases?: number;
  archivedCases?: number;
}

const ClientOverviewCard: React.FC<ClientOverviewCardProps> = ({ client, closedCases = 0, archivedCases = 0 }) => {
  const { t, i18n } = useTranslation(['clients', 'common']);
  
  const formatDate = (ds: string) => {
    try { 
      return new Date(ds).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }); 
    } catch { return ds; }
  };

  if (!client) {
    return null;
  }

  const totalCasesCount = client.totalCasesCount ?? 0;
  const activeCasesCount = client.activeCasesCount ?? 0;

  return (
    <div className={styles.overviewCard}>
      <div className={styles.cardContent}>
        {/* Left Section - 70% */}
        <div className={styles.leftSection}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              <User size={64} />
            </div>
          </div>

          <div className={styles.clientInfo}>
            <h2 className={styles.clientName}>{client.fullName || t('details.not_specified')}</h2>
            <span className={styles.clientType}>{t(`types.${client.clientType}`)}</span>
          </div>

          <div className={styles.contactRow}>
            <div className={styles.contactItem}>
              <Phone size={18} className={styles.contactIcon} />
              <span className={styles.contactValue}>{client.phoneNumber || t('details.not_specified')}</span>
            </div>
            <div className={styles.contactItem}>
              <Mail size={18} className={styles.contactIcon} />
              <span className={styles.contactValue}>{client.email || t('details.not_specified')}</span>
            </div>
            <div className={styles.contactItem}>
              <Hash size={18} className={styles.contactIcon} />
              <span className={styles.contactValue}>CLT-{String(client.id).padStart(6, '0')}</span>
            </div>
          </div>

          <div className={styles.metaRow}>
            <div className={styles.metaBadge}>
              <MapPin size={16} className={styles.metaIcon} />
              <span className={styles.metaValue}>{client.city || client.address || t('details.not_specified')}</span>
            </div>
            <div className={styles.metaBadge}>
              <Calendar size={16} className={styles.metaIcon} />
              <span className={styles.metaValue}>{formatDate(client.createdAt)}</span>
            </div>
          </div>

          <div className={styles.statusBadge}>
            <span className={`${styles.statusDot} ${styles[`status_${client.status}`]}`}></span>
            {t(`status.${client.status}`)}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className={styles.divider}></div>

        {/* Right Section - 30% */}
        <div className={styles.rightSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIconWrapper}>
                <FileText size={24} className={styles.statIcon} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{totalCasesCount}</span>
                <span className={styles.statLabel}>{t('details.total_cases')}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrapper}>
                <Briefcase size={24} className={styles.statIcon} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{activeCasesCount}</span>
                <span className={styles.statLabel}>{t('details.active_cases')}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrapper}>
                <CheckCircle size={24} className={styles.statIcon} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{closedCases}</span>
                <span className={styles.statLabel}>{t('details.closed_cases')}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrapper}>
                <Archive size={24} className={styles.statIcon} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{archivedCases}</span>
                <span className={styles.statLabel}>{t('details.archived_cases')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOverviewCard;
