import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';
import Modal from '../../../components/ui/Modal/Modal';
import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import { User, Mail, Phone, MapPin, FileText, Hash, Building, ShieldAlert, ChevronDown } from 'lucide-react';
import styles from './ClientFormModal.module.css';

interface ClientDto {
  id: number;
  clientType: string;
  fullName: string;
  nationalId?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  notes?: string;
  status: string;
}

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clientToEdit: ClientDto | null;
}

const CLIENT_TYPES = [
  { value: 'Organization', labelKey: 'form.type_organization', descKey: 'form.type_organization_desc' },
  { value: 'Company', labelKey: 'form.type_company', descKey: 'form.type_company_desc' },
  { value: 'Individual', labelKey: 'form.type_individual', descKey: 'form.type_individual_desc' }
];

const CITIES = ['الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'الطائف', 'تبوك', 'بريدة', 'حائل'];

const SOURCES = ['موقع إلكتروني', 'توصية', 'إعلان', 'معرض', 'وسائل التواصل', 'أخرى'];

const STATUSES = ['Active', 'Inactive', 'Archived'];

const ClientFormModal: React.FC<ClientFormModalProps> = ({ isOpen, onClose, onSuccess, clientToEdit }) => {
  const { t } = useTranslation(['clients', 'common']);

  const [clientType, setClientType] = useState('Company');
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Active');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditMode = !!clientToEdit;

  useEffect(() => {
    if (isOpen) {
      if (clientToEdit) {
        setClientType(clientToEdit.clientType || 'Company');
        setFullName(clientToEdit.fullName || '');
        setNationalId(clientToEdit.nationalId || '');
        setPhoneNumber(clientToEdit.phoneNumber || '');
        setEmail(clientToEdit.email || '');
        setAddress(clientToEdit.address || '');
        setCity((clientToEdit as any).city || '');
        setSource((clientToEdit as any).source || '');
        setNotes((clientToEdit as any).notes || '');
        setStatus(clientToEdit.status || 'Active');
      } else {
        setClientType('Company'); setFullName(''); setNationalId(''); setPhoneNumber('');
        setEmail(''); setAddress(''); setCity(''); setSource(''); setNotes(''); setStatus('Active');
      }
      setError(null);
    }
  }, [isOpen, clientToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError(t('form.error_fields_required'));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        clientType,
        fullName: fullName.trim(),
        nationalId: nationalId || undefined,
        phoneNumber: phoneNumber || undefined,
        email: email || undefined,
        address: address || undefined,
        city: city || undefined,
        source: source || undefined,
        notes: notes || undefined,
        ...(isEditMode ? { status } : {})
      };

      if (isEditMode && clientToEdit) {
        await api.put(`/clients/${clientToEdit.id}`, payload);
      } else {
        await api.post('/clients', payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || (isEditMode ? t('form.error_update') : t('form.error_create')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('form.edit_title') : t('form.add_title')} size="md">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorAlert}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* نوع العميل */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>{t('form.type_label')}</label>
          <div className={styles.typeGrid}>
            {CLIENT_TYPES.map(tp => (
              <label key={tp.value} className={`${styles.typeCard} ${clientType === tp.value ? styles.typeActive : ''}`}>
                <input type="radio" name="clientType" value={tp.value} checked={clientType === tp.value} onChange={() => setClientType(tp.value)} className={styles.radioHidden} />
                <div className={styles.typeIcon}>
                  {tp.value === 'Individual' ? <User size={20} /> : <Building size={20} />}
                </div>
                <div className={styles.typeContent}>
                  <span className={styles.typeLabel}>{t(tp.labelKey)}</span>
                  <span className={styles.typeDesc}>{t(tp.descKey)}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* البيانات الأساسية */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('form.basic_info')}</h4>
          <div className={styles.grid}>
            <Input 
              label={t('form.fullname_label')} 
              placeholder={t('form.fullname_placeholder')} 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              icon={<User size={16} />} 
              required 
            />
            
            <Input 
              label={t('form.phone_label')} 
              placeholder="5X XXX XXXX"
              value={phoneNumber} 
              onChange={e => setPhoneNumber(e.target.value)} 
              icon={<Phone size={16} />} 
              required
            />

            <Input 
              label={t('form.nationalid_label')} 
              placeholder={t('form.nationalid_placeholder')} 
              value={nationalId} 
              onChange={e => setNationalId(e.target.value)} 
              icon={<Hash size={16} />} 
              required
            />

            <Input 
              label={t('form.email_label')} 
              placeholder={t('form.email_placeholder')} 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              icon={<Mail size={16} />} 
            />
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('form.additional_info')}</h4>
          <div className={styles.grid}>
            <Input 
              label={t('form.address_label')} 
              placeholder={t('form.address_placeholder')} 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              icon={<MapPin size={16} />} 
              className={styles.fullWidth}
            />

            <div className={styles.selectGroup}>
              <label className={styles.fieldLabel}>{t('form.city_label')}</label>
              <div className={styles.selectWrapper}>
                <select 
                  className={styles.select}
                  value={city}
                  onChange={e => setCity(e.target.value)}
                >
                  <option value="">{t('form.city_placeholder')}</option>
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>

            <div className={styles.selectGroup}>
              <label className={styles.fieldLabel}>{t('form.source_label')}</label>
              <div className={styles.selectWrapper}>
                <select 
                  className={styles.select}
                  value={source}
                  onChange={e => setSource(e.target.value)}
                >
                  <option value="">{t('form.source_placeholder')}</option>
                  {SOURCES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
          </div>

          {/* ملاحظات */}
          <div className={styles.notesGroup}>
            <label className={styles.fieldLabel}>{t('form.notes_label')}</label>
            <textarea
              className={styles.textarea}
              placeholder={t('form.notes_placeholder')}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* الحالة - فقط في التعديل */}
        {isEditMode && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{t('form.status_label')}</label>
            <div className={styles.statusGrid}>
              {STATUSES.map(s => (
                <label key={s} className={`${styles.statusChip} ${status === s ? styles.statusActive : ''}`}>
                  <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className={styles.radioHidden} />
                  <span>{t(`status.${s}`)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>{t('form.cancel')}</Button>
          <Button type="submit" isLoading={loading}>
            <FileText size={16} />
            <span>{t('form.save')}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientFormModal;
