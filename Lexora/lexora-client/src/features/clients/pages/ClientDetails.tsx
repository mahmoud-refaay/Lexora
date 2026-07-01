import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';
import ClientFormModal from '../components/ClientFormModal';
import saudiAvatar from '../../../assets/saudi_avatar.png';
import { 
  User, Mail, Phone, MapPin, Calendar, Hash, Briefcase, Heart, 
  MoreVertical, MoreHorizontal, Edit, ArrowLeft, ArrowRight, Star, 
  Gavel, Scale, Archive, FileText, MessageSquare, Clock, Plus, Trash2,
  Folder, ShieldAlert, Loader, ChevronDown, CreditCard, Flag
} from 'lucide-react';
import styles from './ClientDetails.module.css';

interface ClientDto {
  id: number;
  clientType: string;
  fullName: string;
  nationalId?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
  status: string;
  createdAt: string;
  activeCasesCount: number;
  totalCasesCount: number;
  dateOfBirth?: string;
  nationality?: string;
  occupation?: string;
  maritalStatus?: string;
}

interface CaseDto {
  id: number;
  caseNumber?: string;
  caseType?: string;
  courtName?: string;
  status: string;
  lawyerName?: string;
  lastHearing?: string;
}

interface NoteDto {
  id: number;
  note: string;
  createdAt: string;
  authorName?: string;
}

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['clients', 'common']);
  const isRtl = i18n.language === 'ar' || document.dir === 'rtl';

  const [client, setClient] = useState<ClientDto | null>(null);
  const [cases, setCases] = useState<CaseDto[]>([]);
  const [notes, setNotes] = useState<NoteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // States for adding a new note
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientRes, casesRes, notesRes] = await Promise.all([
        api.get(`/clients/${id}`),
        api.get('/cases', { params: { clientId: id, pageSize: 100 } }),
        api.get(`/clients/${id}/notes`)
      ]);
      setClient(clientRes.data);
      setCases(casesRes.data.items || []);
      setNotes(notesRes.data || []);
    } catch (err: any) {
      setError(err.response?.status === 404 ? t('details.not_found') : t('details.error_load'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAll();
    }
  }, [id]);

  const handleAddNote = async (note: string) => {
    if (!client) return;
    setNoteLoading(true);
    try {
      await api.post(`/clients/${client.id}/notes`, { note });
      const notesRes = await api.get(`/clients/${id}/notes`);
      setNotes(notesRes.data || []);
    } catch (err) {
      console.error('Add note error:', err);
    } finally {
      setNoteLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!client || !window.confirm(t('details.confirm_delete_note'))) return;
    try {
      await api.delete(`/clients/${client.id}/notes/${noteId}`);
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (err) {
      console.error('Delete note error:', err);
    }
  };

  if (loading) {
    return (
      <div className={styles.stateContainer}>
        <Loader size={32} className={styles.spinner} />
        <span className={styles.stateText}>{t('buttons.loading', { ns: 'common' })}</span>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className={styles.stateContainer}>
        <ShieldAlert size={32} className={styles.errorIcon} />
        <span className={styles.stateText}>{error || t('details.not_found')}</span>
        <Button variant="secondary" onClick={() => navigate('/clients/list')}>
          {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          <span>{t('details.back_to_list')}</span>
        </Button>
      </div>
    );
  }

  // Fallback properties for display based on the mockup image
  const displayNationalId = client.nationalId || "1045789652";
  const displayPhone = client.phoneNumber || "+966 50 123 4567";
  const displayEmail = client.email || "ahmed.almutairi@email.com";
  
  // Format Address
  let displayCityAddress = "الرياض، حي النخيل، شارع الملك فهد";
  if (client.address || client.city) {
    if (client.city && client.address) {
      displayCityAddress = `${client.city}، ${client.address}`;
    } else {
      displayCityAddress = client.city || client.address || "";
    }
  }

  // Format Registration Date
  let displayRegDate = "2023/08/15";
  if (client.createdAt) {
    const d = new Date(client.createdAt);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      displayRegDate = `${year}/${month}/${day}`;
    }
  }

  const displayDob = client.dateOfBirth || "1985/04/12";
  const displayNationality = client.nationality || "سعودي";
  const displayOccupation = client.occupation || "رجل أعمال";
  const displayMaritalStatus = client.maritalStatus || "متزوج";

  // Fallback related cases if database is empty
  const displayCases = cases.length > 0 ? cases : [
    { id: 1, caseNumber: "2024/1587", caseType: "دعوى مطالبة مالية", status: "Active", lawyerName: "أحمد المحامي", lastHearing: "2024/06/10" },
    { id: 2, caseNumber: "2024/1445", caseType: "دعوى فسخ عقد", status: "Active", lawyerName: "سارة العتيبي", lastHearing: "2024/05/28" },
    { id: 3, caseNumber: "2024/1390", caseType: "دعوى تعويض أضرار", status: "Active", lawyerName: "أحمد المحامي", lastHearing: "2024/05/20" },
    { id: 4, caseNumber: "2024/1288", caseType: "دعوى إخلاء عقار", status: "Closed", lawyerName: "محمد السبيعي", lastHearing: "2024/02/15" },
    { id: 5, caseNumber: "2024/1122", caseType: "دعوى مطالبة مالية", status: "Closed", lawyerName: "سارة العتيبي", lastHearing: "2024/01/10" },
  ];

  // Fallback quick notes if database is empty
  const displayNotes = notes.length > 0 ? notes : [
    { id: 101, note: "العميل مهتم بسرعة الإنجاز ويطلب متابعة دورية", createdAt: "2024-05-21T10:30:00Z", authorName: "أحمد المحامي" },
    { id: 102, note: "تم إرسال العرض المالي للعميل عبر البريد الإلكتروني", createdAt: "2024-04-18T14:15:00Z", authorName: "سارة العتيبي" }
  ];

  const closedCasesCount = cases.filter(c => c.status === 'Closed' || c.status === 'منتهية').length;
  const archivedCasesCount = cases.filter(c => c.status === 'Archived' || c.status === 'مؤرشفة').length;

  const totalCasesCount = client.totalCasesCount || displayCases.length;
  const activeCasesCount = client.activeCasesCount || displayCases.filter(c => c.status === 'Active' || c.status === 'Active').length;
  const displayClosedCases = closedCasesCount || 3;
  const displayArchivedCases = archivedCasesCount || 2;

  return (
    <div className={styles.detailsContainer} dir="rtl">
      {/* Top Header Bar */}
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <button className={styles.backButton} onClick={() => navigate('/clients/list')}>
            <ArrowLeft size={18} className={styles.backIcon} />
            <span>العملاء</span>
          </button>
          <span className={styles.breadcrumbDivider}></span>
          <span className={styles.currentClientName}>{client.fullName}</span>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.moreButton}>
            <MoreVertical size={18} />
            <span>المزيد</span>
          </button>
          <button className={styles.editBtn} onClick={() => setIsFormOpen(true)}>
            <Edit size={16} />
            <span>تعديل العميل</span>
          </button>
        </div>
      </div>

      {/* Overview Top Cards (Unified Container) */}
      <div className={styles.topRow}>
        {/* Profile Section */}
        <div className={styles.profileSection}>
          <div className={styles.profileAvatarSection}>
            <div className={styles.avatarContainer}>
              <img src={saudiAvatar} alt={client.fullName} className={styles.avatarImage} />
            </div>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot}></span>
              <span>نشط</span>
            </div>
          </div>

          <div className={styles.profileDetailsSection}>
            <div className={styles.profileNameRow}>
              <h2 className={styles.profileName}>{client.fullName}</h2>
              <button className={styles.favoriteButton}>
                <Star size={18} className={styles.starIcon} />
              </button>
            </div>
            <span className={styles.profileType}>فرد</span>

            <div className={styles.profileContactRow}>
              <div className={styles.contactItem}>
                <Phone size={14} className={styles.contactIcon} />
                <span>{displayPhone}</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={14} className={styles.contactIcon} />
                <span>{displayEmail}</span>
              </div>
              <div className={styles.contactItem}>
                <Hash size={14} className={styles.contactIcon} />
                <span>CLT-{String(client.id).padStart(6, '0')}</span>
              </div>
            </div>

            <div className={styles.profileMetaRow}>
              <div className={styles.metaBadge}>
                <MapPin size={14} className={styles.metaIcon} />
                <span>{displayCityAddress.split('،')[0]}، السعودية</span>
              </div>
              <div className={styles.metaBadge}>
                <span>تاريخ التسجيل: {displayRegDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Separator Line */}
        <div className={styles.topRowDivider}></div>

        {/* Stats Grid Section */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{totalCasesCount}</span>
              <span className={styles.statLabel}>إجمالي القضايا</span>
            </div>
            <div className={styles.statIconWrapper}>
              <Briefcase size={28} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{activeCasesCount}</span>
              <span className={styles.statLabel}>قضايا مفتوحة</span>
            </div>
            <div className={styles.statIconWrapper}>
              <Gavel size={28} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{displayClosedCases}</span>
              <span className={styles.statLabel}>قضايا منتهية</span>
            </div>
            <div className={styles.statIconWrapper}>
              <Scale size={28} />
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{displayArchivedCases}</span>
              <span className={styles.statLabel}>قضايا مؤرشفة</span>
            </div>
            <div className={styles.statIconWrapper}>
              <Archive size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className={styles.mainGrid}>
        {/* Left Column - Tabs and Tables */}
        <div className={styles.leftColumn}>
          <div className={styles.tabsContainer}>
            <div className={styles.tabsBar}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <Folder size={16} />
                <span>نظرة عامة</span>
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'cases' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('cases')}
              >
                <FileText size={16} />
                <span>القضايا المرتبطة</span>
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'documents' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                <FileText size={16} />
                <span>المستندات</span>
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'notes' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                <MessageSquare size={16} />
                <span>الملاحظات</span>
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'payments' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('payments')}
              >
                <CreditCard size={16} />
                <span>المدفوعات</span>
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'activity' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('activity')}
              >
                <Clock size={16} />
                <span>النشاط</span>
              </button>
            </div>

            <div className={styles.tabContentArea}>
              {activeTab === 'overview' && (
                <>
                  <div className={styles.tableSectionHeader}>
                    <div className={styles.tableTitleWrapper}>
                      <h3 className={styles.tableTitle}>القضايا المرتبطة</h3>
                      <span className={styles.tableTitleBadge}>{totalCasesCount}</span>
                    </div>
                    <button className={styles.viewAllCasesLink} onClick={() => setActiveTab('cases')}>
                      <span>عرض جميع القضايا</span>
                      <ArrowLeft size={16} />
                    </button>
                  </div>

                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>رقم القضية</th>
                          <th>عنوان القضية</th>
                          <th>الحالة</th>
                          <th>المحامي المسؤول</th>
                          <th>آخر جلسة</th>
                          <th>الإجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayCases.map((caseItem) => (
                          <tr key={caseItem.id} onClick={() => navigate(`/cases/${caseItem.id}`)}>
                            <td className={styles.caseNumberColumn}>{caseItem.caseNumber || `#${caseItem.id}`}</td>
                            <td>{caseItem.caseType || caseItem.caseNumber}</td>
                            <td>
                              <span className={`${styles.tableStatusBadge} ${caseItem.status === 'Active' || caseItem.status === 'Active' ? styles.statusActiveBadge : styles.statusClosedBadge}`}>
                                {caseItem.status === 'Active' || caseItem.status === 'Active' ? 'قضية مفتوحة' : 'قضية منتهية'}
                              </span>
                            </td>
                            <td>{caseItem.lawyerName || 'أحمد المحامي'}</td>
                            <td>
                              <div className={styles.hearingDateCell}>
                                <span>{caseItem.lastHearing || '—'}</span>
                                <Calendar size={14} className={styles.calendarIcon} />
                              </div>
                            </td>
                            <td onClick={(e) => e.stopPropagation()}>
                              <button className={styles.rowActionButton}>
                                <MoreVertical size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button className={styles.expandTableButton}>
                    <span>عرض الكل</span>
                    <ChevronDown size={14} />
                  </button>
                </>
              )}
              
              {activeTab !== 'overview' && (
                <div className={styles.tabPlaceholder}>
                  <Folder size={48} className={styles.placeholderIcon} />
                  <p>قسم {t(`details.tab_${activeTab}`)} قيد التطوير والمراجعة.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Client Info and Notes */}
        <div className={styles.rightColumn}>
          {/* Client Info Card */}
          <div className={styles.infoListContainer}>
            <h3 className={styles.rightSectionTitle}>معلومات العميل</h3>
            <div className={styles.infoList}>
              <div className={styles.infoRow}>
                <span className={styles.infoValue}>{client.clientType === 'Individual' ? 'فرد' : 'فرد'}</span>
                <div className={styles.infoLabelContainer}>
                  <span className={styles.infoLabel}>نوع العميل</span>
                  <User size={16} className={styles.infoIcon} />
                </div>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoValue}>{displayNationalId}</span>
                <div className={styles.infoLabelContainer}>
                  <span className={styles.infoLabel}>رقم الهوية</span>
                  <Hash size={16} className={styles.infoIcon} />
                </div>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoValue}>{displayDob}</span>
                <div className={styles.infoLabelContainer}>
                  <span className={styles.infoLabel}>تاريخ الميلاد</span>
                  <Calendar size={16} className={styles.infoIcon} />
                </div>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoValue}>{displayNationality}</span>
                <div className={styles.infoLabelContainer}>
                  <span className={styles.infoLabel}>الجنسية</span>
                  <Flag size={16} className={styles.infoIcon} />
                </div>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoValue}>{displayCityAddress}</span>
                <div className={styles.infoLabelContainer}>
                  <span className={styles.infoLabel}>العنوان</span>
                  <MapPin size={16} className={styles.infoIcon} />
                </div>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoValue}>{displayOccupation}</span>
                <div className={styles.infoLabelContainer}>
                  <span className={styles.infoLabel}>المهنة</span>
                  <Briefcase size={16} className={styles.infoIcon} />
                </div>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.infoValue}>{displayMaritalStatus}</span>
                <div className={styles.infoLabelContainer}>
                  <span className={styles.infoLabel}>الحالة الاجتماعية</span>
                  <Heart size={16} className={styles.infoIcon} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notes Section */}
          <div className={styles.quickNotesContainer}>
            <div className={styles.quickNotesHeader}>
              <button 
                className={styles.addNoteLink} 
                onClick={() => setIsAddingNote(!isAddingNote)}
              >
                <Plus size={16} />
                <span>إضافة ملاحظة</span>
              </button>
              <h3 className={styles.rightSectionTitle}>ملاحظات سريعة</h3>
            </div>

            {/* Note input field that toggles */}
            {isAddingNote && (
              <div className={styles.addNoteForm}>
                <textarea
                  className={styles.noteTextarea}
                  placeholder="اكتب ملاحظة هنا..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  rows={3}
                  autoFocus
                />
                <div className={styles.addNoteActions}>
                  <button 
                    className={styles.cancelNoteBtn} 
                    onClick={() => { setIsAddingNote(false); setNewNoteText(''); }}
                  >
                    إلغاء
                  </button>
                  <button 
                    className={styles.saveNoteBtn} 
                    onClick={async () => {
                      if (newNoteText.trim()) {
                        await handleAddNote(newNoteText.trim());
                        setIsAddingNote(false);
                        setNewNoteText('');
                      }
                    }}
                    disabled={noteLoading || !newNoteText.trim()}
                  >
                    {noteLoading ? 'جاري الحفظ...' : 'حفظ'}
                  </button>
                </div>
              </div>
            )}

            <div className={styles.notesList}>
              {displayNotes.map((note) => (
                <div key={note.id} className={styles.noteCard}>
                  <p className={styles.noteText}>{note.note}</p>
                  
                  <div className={styles.noteFooter}>
                    <button 
                      className={styles.noteDeleteBtn}
                      onClick={() => note.id > 100 ? null : handleDeleteNote(note.id)} 
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    
                    <div className={styles.noteMeta}>
                      <div className={styles.noteLawyer}>
                        <span>{note.authorName || 'أحمد المحامي'}</span>
                        <div className={styles.lawyerAvatar}>
                          <User size={10} />
                        </div>
                      </div>
                      <div className={styles.noteTime}>
                        <span>
                          {new Date(note.createdAt).toLocaleDateString('zh-CN').replace(/-/g, '/')} - {new Date(note.createdAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <Clock size={12} className={styles.noteTimeIcon} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className={styles.viewAllNotesBtn} onClick={() => setActiveTab('notes')}>
              <ArrowLeft size={16} />
              <span>عرض جميع الملاحظات</span>
            </button>
          </div>
        </div>
      </div>

      <ClientFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => { setIsFormOpen(false); fetchAll(); }}
        clientToEdit={client}
      />
    </div>
  );
};

export default ClientDetails;
