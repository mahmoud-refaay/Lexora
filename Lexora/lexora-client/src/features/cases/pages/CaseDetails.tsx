import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';
import Card from '../../../components/ui/Card/Card';
import Button from '../../../components/ui/Button/Button';
import Input from '../../../components/ui/Input/Input';
import CaseFormModal from '../components/CaseFormModal';
import {
  ArrowLeft, ArrowRight, Hash, Calendar, Gavel, Building2, Scale,
  Users, Briefcase, Edit2, Trash2, Archive, ArchiveRestore,
  AlertCircle, Loader, Send, User, Phone
} from 'lucide-react';
import styles from './CaseDetails.module.css';

interface CaseDto {
  id: number;
  clientId: number;
  clientName?: string;
  clientPhone?: string;
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
  isArchived: boolean;
  createdAt: string;
  assignedLawyerId?: number;
  assignedLawyerName?: string;
  parentCaseId?: number;
  parentCaseNumber?: string;
}

interface NoteDto {
  id: number;
  note: string;
  createdAt: string;
  authorName?: string;
}

const CaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['cases', 'common']);
  const isRtl = i18n.language === 'ar';

  const [caseData, setCaseData] = useState<CaseDto | null>(null);
  const [notes, setNotes] = useState<NoteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [caseRes, notesRes] = await Promise.all([
        api.get(`/cases/${id}`),
        api.get(`/cases/${id}/notes`)
      ]);
      setCaseData(caseRes.data);
      setNotes(notesRes.data || []);
    } catch (err: any) {
      setError(err.response?.status === 404 ? t('details.not_found') : t('details.error_load'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  const handleDelete = async () => {
    if (!caseData || !window.confirm(t('details.confirm_delete'))) return;
    try { await api.delete(`/cases/${caseData.id}`); navigate('/cases/list'); }
    catch (err) { console.error('Delete error:', err); }
  };

  const handleArchive = async () => {
    if (!caseData) return;
    const msg = caseData.isArchived ? t('details.confirm_unarchive') : t('details.confirm_archive');
    if (!window.confirm(msg)) return;
    try {
      await api.put(`/cases/${caseData.id}/archive?isArchived=${!caseData.isArchived}`);
      setCaseData({ ...caseData, isArchived: !caseData.isArchived });
    } catch (err) { console.error('Archive error:', err); }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !caseData) return;
    setNoteLoading(true);
    try {
      await api.post(`/cases/${caseData.id}/notes`, { note: newNote.trim() });
      setNewNote('');
      const notesRes = await api.get(`/cases/${caseData.id}/notes`);
      setNotes(notesRes.data || []);
    } catch (err) { console.error('Add note error:', err); }
    finally { setNoteLoading(false); }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!caseData || !window.confirm(t('details.confirm_delete_note'))) return;
    try {
      await api.delete(`/cases/${caseData.id}/notes/${noteId}`);
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (err) { console.error('Delete note error:', err); }
  };

  const formatDate = (ds?: string) => {
    if (!ds) return t('details.not_specified');
    try { return new Date(ds).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return ds; }
  };

  const formatDateTime = (ds: string) => {
    try { return new Date(ds).toLocaleString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return ds; }
  };

  if (loading) {
    return (
      <div className={styles.stateContainer}>
        <Loader size={32} className={styles.spinner} />
        <span className={styles.stateText}>{t('buttons.loading', { ns: 'common' })}</span>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className={styles.stateContainer}>
        <AlertCircle size={32} className={styles.errorIcon} />
        <span className={styles.stateText}>{error || t('details.not_found')}</span>
        <Button variant="secondary" onClick={() => navigate('/cases/list')}>
          <BackArrow size={16} /><span>{t('details.back_to_list')}</span>
        </Button>
      </div>
    );
  }

  const caseInfoRows = [
    { icon: <Hash size={16} />, label: t('details.case_number'), value: caseData.caseNumber || `#${caseData.id}` },
    { icon: <Calendar size={16} />, label: t('details.case_year'), value: caseData.caseYear?.toString() || t('details.not_specified') },
    { icon: <Briefcase size={16} />, label: t('details.case_type'), value: caseData.caseType || t('details.not_specified') },
    { icon: <Gavel size={16} />, label: t('details.status'), value: t(`status.${caseData.status}`), highlight: true },
    { icon: <Calendar size={16} />, label: t('details.start_date'), value: formatDate(caseData.startDate) },
    { icon: <Calendar size={16} />, label: t('details.end_date'), value: formatDate(caseData.endDate) },
    { icon: <Calendar size={16} />, label: t('details.created_at'), value: formatDate(caseData.createdAt) }
  ];

  const courtRows = [
    { icon: <Building2 size={16} />, label: t('details.court_name'), value: caseData.courtName || t('details.not_specified') },
    { icon: <Gavel size={16} />, label: t('details.court_circuit'), value: caseData.courtCircuit || t('details.not_specified') }
  ];

  const partyRows = [
    { icon: <User size={16} />, label: t('details.client'), value: caseData.clientName || '-', clickable: () => navigate(`/clients/${caseData.clientId}`) },
    { icon: <Scale size={16} />, label: t('details.client_role'), value: t(`roles.${caseData.clientRole}`) },
    { icon: <Phone size={16} />, label: t('details.client_phone'), value: caseData.clientPhone || t('details.not_specified') },
    { icon: <Users size={16} />, label: t('details.opponent_name'), value: caseData.opponentName || t('details.not_specified') },
    { icon: <Gavel size={16} />, label: t('details.opponent_lawyer'), value: caseData.opponentLawyer || t('details.not_specified') },
    { icon: <User size={16} />, label: t('details.assigned_lawyer'), value: caseData.assignedLawyerName || t('details.not_specified') }
  ];

  return (
    <div className={styles.detailsContainer} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/cases/list')}>
          <BackArrow size={16} /><span>{t('details.back_to_list')}</span>
        </button>
        <div className={styles.actionsBar}>
          <Button variant="secondary" onClick={() => setIsFormOpen(true)}>
            <Edit2 size={16} /><span>{t('details.btn_edit')}</span>
          </Button>
          <Button variant="secondary" onClick={handleArchive}>
            {caseData.isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
            <span>{caseData.isArchived ? t('details.btn_unarchive') : t('details.btn_archive')}</span>
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 size={16} /><span>{t('details.btn_delete')}</span>
          </Button>
        </div>
      </div>

      {/* رأس الملف */}
      <Card className={styles.profileHeader}>
        <div className={styles.profileAvatar}>
          <Gavel size={48} />
        </div>
        <div className={styles.profileMeta}>
          <h1 className={styles.profileName}>{caseData.caseNumber || `#${caseData.id}`}</h1>
          <span className={styles.profileType}>{caseData.caseType || t('details.not_specified')}</span>
          <div className={styles.profileBadges}>
            <span className={`${styles.statusBadge} ${styles[`status_${caseData.status}`] || ''}`}>
              {t(`status.${caseData.status}`)}
            </span>
            {caseData.isArchived && (
              <span className={styles.archivedBadge}>{t('details.archived_badge')}</span>
            )}
            {caseData.clientName && (
              <span className={styles.clientBadge}>
                <User size={14} />{caseData.clientName}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* الموضوع */}
      {caseData.subject && (
        <Card className={styles.subjectCard}>
          <h3 className={styles.cardTitle}>{t('details.subject')}</h3>
          <p className={styles.subjectText}>{caseData.subject}</p>
        </Card>
      )}

      <div className={styles.contentGrid}>
        {/* العمود الرئيسي */}
        <div className={styles.mainCol}>
          <Card className={styles.infoCard}>
            <h3 className={styles.cardTitle}>{t('details.section_case')}</h3>
            <div className={styles.infoList}>
              {caseInfoRows.map((row, idx) => (
                <div key={idx} className={styles.infoRow}>
                  <div className={styles.infoIcon}>{row.icon}</div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>{row.label}</span>
                    <span className={`${styles.infoValue} ${row.highlight ? styles.highlightValue : ''}`}>{row.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className={styles.infoCard}>
            <h3 className={styles.cardTitle}>{t('details.section_court')}</h3>
            <div className={styles.infoList}>
              {courtRows.map((row, idx) => (
                <div key={idx} className={styles.infoRow}>
                  <div className={styles.infoIcon}>{row.icon}</div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>{row.label}</span>
                    <span className={styles.infoValue}>{row.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className={styles.infoCard}>
            <h3 className={styles.cardTitle}>{t('details.section_parties')}</h3>
            <div className={styles.infoList}>
              {partyRows.map((row, idx) => (
                <div key={idx} className={styles.infoRow}>
                  <div className={styles.infoIcon}>{row.icon}</div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>{row.label}</span>
                    <span
                      className={`${styles.infoValue} ${row.clickable ? styles.clickableValue : ''}`}
                      onClick={row.clickable}
                    >
                      {row.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* العمود الجانبي: الملاحظات */}
        <div className={styles.sideCol}>
          <Card className={styles.notesCard}>
            <h3 className={styles.cardTitle}>{t('details.section_notes')}</h3>
            <div className={styles.noteInputWrapper}>
              <Input
                placeholder={t('details.add_note_placeholder')}
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddNote(); } }}
              />
              <Button size="sm" onClick={handleAddNote} isLoading={noteLoading} disabled={!newNote.trim()}>
                <Send size={14} />
              </Button>
            </div>
            {notes.length === 0 ? (
              <div className={styles.emptySection}>{t('details.no_notes')}</div>
            ) : (
              <div className={styles.notesList}>
                {notes.map(n => (
                  <div key={n.id} className={styles.noteItem}>
                    <div className={styles.noteHeader}>
                      <span className={styles.noteAuthor}>{n.authorName || '—'}</span>
                      <button className={styles.noteDelete} onClick={() => handleDeleteNote(n.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <p className={styles.noteText}>{n.note}</p>
                    <span className={styles.noteDate}>{formatDateTime(n.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <CaseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => { setIsFormOpen(false); fetchAll(); }}
        caseToEdit={caseData}
      />
    </div>
  );
};

export default CaseDetails;
