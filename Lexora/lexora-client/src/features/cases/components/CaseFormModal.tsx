import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';
import Modal from '../../../components/ui/Modal/Modal';
import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import { Briefcase, Hash, Calendar, Gavel, Building2, Users, Scale, FileText, ShieldAlert } from 'lucide-react';
import styles from './CaseFormModal.module.css';

interface CaseDto {
  id: number;
  clientId: number;
  caseNumber?: string;
  caseYear?: number;
  caseType?: string;
  courtName?: string;
  courtCircuit?: string;
  clientRole: string;
  opponentName?: string;
  opponentLawyer?: string;
  subject?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  assignedLawyerId?: number;
  parentCaseId?: number;
}

interface ClientOption { id: number; fullName: string; }
interface LawyerOption { id: number; fullName: string; }

interface CaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  caseToEdit: CaseDto | null;
}

const CASE_STATUSES = ['Open', 'Pending', 'Scheduled', 'Closed'];

const CaseFormModal: React.FC<CaseFormModalProps> = ({ isOpen, onClose, onSuccess, caseToEdit }) => {
  const { t } = useTranslation(['cases', 'common']);
  const isEditMode = !!caseToEdit;

  const [clients, setClients] = useState<ClientOption[]>([]);
  const [lawyers, setLawyers] = useState<LawyerOption[]>([]);

  const [clientId, setClientId] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseYear, setCaseYear] = useState('');
  const [caseType, setCaseType] = useState('');
  const [courtName, setCourtName] = useState('');
  const [courtCircuit, setCourtCircuit] = useState('');
  const [clientRole, setClientRole] = useState('Plaintiff');
  const [opponentName, setOpponentName] = useState('');
  const [opponentLawyer, setOpponentLawyer] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('Open');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignedLawyerId, setAssignedLawyerId] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get('/clients', { params: { pageSize: 1000 } }).then(r => {
        setClients((r.data.items || []).map((c: any) => ({ id: c.id, fullName: c.fullName })));
      }).catch(() => {});
      api.get('/users', { params: { pageSize: 1000 } }).then(r => {
        setLawyers((r.data.items || []).map((u: any) => ({ id: u.id, fullName: u.fullName })));
      }).catch(() => {});

      if (caseToEdit) {
        setClientId(String(caseToEdit.clientId || ''));
        setCaseNumber(caseToEdit.caseNumber || '');
        setCaseYear(caseToEdit.caseYear ? String(caseToEdit.caseYear) : '');
        setCaseType(caseToEdit.caseType || '');
        setCourtName(caseToEdit.courtName || '');
        setCourtCircuit(caseToEdit.courtCircuit || '');
        setClientRole(caseToEdit.clientRole || 'Plaintiff');
        setOpponentName(caseToEdit.opponentName || '');
        setOpponentLawyer(caseToEdit.opponentLawyer || '');
        setSubject(caseToEdit.subject || '');
        setStatus(caseToEdit.status || 'Open');
        setStartDate(caseToEdit.startDate ? caseToEdit.startDate.split('T')[0] : '');
        setEndDate(caseToEdit.endDate ? caseToEdit.endDate.split('T')[0] : '');
        setAssignedLawyerId(caseToEdit.assignedLawyerId ? String(caseToEdit.assignedLawyerId) : '');
      } else {
        setClientId(''); setCaseNumber(''); setCaseYear(''); setCaseType(''); setCourtName('');
        setCourtCircuit(''); setClientRole('Plaintiff'); setOpponentName(''); setOpponentLawyer('');
        setSubject(''); setStatus('Open'); setStartDate(''); setEndDate(''); setAssignedLawyerId('');
      }
      setError(null);
    }
  }, [isOpen, caseToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientId) {
      setError(t('form.client_required'));
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        clientId: parseInt(clientId),
        caseNumber: caseNumber || undefined,
        caseYear: caseYear ? parseInt(caseYear) : undefined,
        caseType: caseType || undefined,
        courtName: courtName || undefined,
        courtCircuit: courtCircuit || undefined,
        clientRole,
        opponentName: opponentName || undefined,
        opponentLawyer: opponentLawyer || undefined,
        subject: subject || undefined,
        status,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        assignedLawyerId: assignedLawyerId ? parseInt(assignedLawyerId) : undefined,
      };

      if (isEditMode && caseToEdit) {
        await api.put(`/cases/${caseToEdit.id}`, payload);
      } else {
        await api.post('/cases', payload);
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('form.edit_title') : t('form.add_title')} size="lg">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorAlert}>
            <ShieldAlert size={16} /><span>{error}</span>
          </div>
        )}

        {/* اختيار العميل */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>{t('form.client_label')} *</label>
          <select className={styles.select} value={clientId} onChange={e => setClientId(e.target.value)} required>
            <option value="">{t('form.client_placeholder')}</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
          </select>
        </div>

        <div className={styles.grid3}>
          <Input label={t('form.case_number_label')} placeholder={t('form.case_number_placeholder')} value={caseNumber} onChange={e => setCaseNumber(e.target.value)} icon={<Hash size={16} />} />
          <Input label={t('form.case_year_label')} placeholder={t('form.case_year_placeholder')} type="number" value={caseYear} onChange={e => setCaseYear(e.target.value)} icon={<Calendar size={16} />} />
          <Input label={t('form.case_type_label')} placeholder={t('form.case_type_placeholder')} value={caseType} onChange={e => setCaseType(e.target.value)} icon={<Briefcase size={16} />} />
        </div>

        <div className={styles.grid2}>
          <Input label={t('form.court_name_label')} placeholder={t('form.court_name_placeholder')} value={courtName} onChange={e => setCourtName(e.target.value)} icon={<Building2 size={16} />} />
          <Input label={t('form.court_circuit_label')} placeholder={t('form.court_circuit_placeholder')} value={courtCircuit} onChange={e => setCourtCircuit(e.target.value)} icon={<Gavel size={16} />} />
        </div>

        {/* صفة الموكل */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>{t('form.client_role_label')}</label>
          <div className={styles.roleGrid}>
            <label className={`${styles.roleCard} ${clientRole === 'Plaintiff' ? styles.roleActive : ''}`}>
              <input type="radio" name="clientRole" value="Plaintiff" checked={clientRole === 'Plaintiff'} onChange={() => setClientRole('Plaintiff')} className={styles.radioHidden} />
              <Scale size={18} /><span>{t('form.role_plaintiff')}</span>
            </label>
            <label className={`${styles.roleCard} ${clientRole === 'Defendant' ? styles.roleActive : ''}`}>
              <input type="radio" name="clientRole" value="Defendant" checked={clientRole === 'Defendant'} onChange={() => setClientRole('Defendant')} className={styles.radioHidden} />
              <Scale size={18} /><span>{t('form.role_defendant')}</span>
            </label>
          </div>
        </div>

        <div className={styles.grid2}>
          <Input label={t('form.opponent_name_label')} placeholder={t('form.opponent_name_placeholder')} value={opponentName} onChange={e => setOpponentName(e.target.value)} icon={<Users size={16} />} />
          <Input label={t('form.opponent_lawyer_label')} placeholder={t('form.opponent_lawyer_placeholder')} value={opponentLawyer} onChange={e => setOpponentLawyer(e.target.value)} icon={<Gavel size={16} />} />
        </div>

        {/* الموضوع */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>{t('form.subject_label')}</label>
          <textarea className={styles.textarea} placeholder={t('form.subject_placeholder')} value={subject} onChange={e => setSubject(e.target.value)} rows={2} />
        </div>

        <div className={styles.grid3}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{t('form.status_label')}</label>
            <select className={styles.select} value={status} onChange={e => setStatus(e.target.value)}>
              {CASE_STATUSES.map(s => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
            </select>
          </div>
          <Input label={t('form.start_date_label')} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <Input label={t('form.end_date_label')} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>

        {/* المحامي المسؤول */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>{t('form.assigned_lawyer_label')}</label>
          <select className={styles.select} value={assignedLawyerId} onChange={e => setAssignedLawyerId(e.target.value)}>
            <option value="">{t('form.assigned_lawyer_placeholder')}</option>
            {lawyers.map(l => <option key={l.id} value={l.id}>{l.fullName}</option>)}
          </select>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>{t('buttons.cancel', { ns: 'common' })}</Button>
          <Button type="submit" isLoading={loading}>
            <FileText size={16} /><span>{t('buttons.save', { ns: 'common' })}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CaseFormModal;
