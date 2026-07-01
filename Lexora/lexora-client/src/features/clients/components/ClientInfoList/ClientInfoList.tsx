import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Hash, Calendar, MapPin, Briefcase, Heart, Building } from 'lucide-react';
import styles from './ClientInfoList.module.css';

interface ClientInfoListProps {
  client: {
    clientType: string;
    nationalId?: string;
    dateOfBirth?: string;
    nationality?: string;
    address?: string;
    city?: string;
    occupation?: string;
    maritalStatus?: string;
  };
}

const ClientInfoList: React.FC<ClientInfoListProps> = ({ client }) => {
  const { t } = useTranslation(['clients', 'common']);

  const infoItems = [
    {
      icon: <User size={16} />,
      label: t('details.info_type'),
      value: t(`types.${client.clientType}`)
    },
    {
      icon: <Hash size={16} />,
      label: t('details.national_id'),
      value: client.nationalId || t('details.not_specified')
    },
    {
      icon: <Calendar size={16} />,
      label: t('details.date_of_birth'),
      value: client.dateOfBirth || t('details.not_specified')
    },
    {
      icon: <Building size={16} />,
      label: t('details.nationality'),
      value: client.nationality || t('details.not_specified')
    },
    {
      icon: <MapPin size={16} />,
      label: t('details.address'),
      value: client.city && client.address ? `${client.city}, ${client.address}` : client.city || client.address || t('details.not_specified')
    },
    {
      icon: <Briefcase size={16} />,
      label: t('details.occupation'),
      value: client.occupation || t('details.not_specified')
    },
    {
      icon: <Heart size={16} />,
      label: t('details.marital_status'),
      value: client.maritalStatus || t('details.not_specified')
    }
  ];

  return (
    <div className={styles.infoListContainer}>
      <h3 className={styles.sectionTitle}>{t('details.section_personal')}</h3>
      <div className={styles.infoList}>
        {infoItems.map((item, index) => (
          <div key={index} className={styles.infoItem}>
            <div className={styles.infoIcon}>{item.icon}</div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>{item.label}</span>
              <span className={styles.infoValue}>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientInfoList;
