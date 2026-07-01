import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import Input from '../../../../components/ui/Input/Input';
import Button from '../../../../components/ui/Button/Button';
import styles from './QuickNotesSection.module.css';

interface Note {
  id: number;
  note: string;
  createdAt: string;
  authorName?: string;
}

interface QuickNotesSectionProps {
  notes: Note[];
  onAddNote: (note: string) => Promise<void>;
  onDeleteNote: (noteId: number) => Promise<void>;
  isLoading?: boolean;
}

const QuickNotesSection: React.FC<QuickNotesSectionProps> = ({ 
  notes, 
  onAddNote, 
  onDeleteNote, 
  isLoading = false 
}) => {
  const { t, i18n } = useTranslation(['clients', 'common']);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    await onAddNote(newNote.trim());
    setNewNote('');
  };

  const formatDateTime = (ds: string) => {
    try { 
      return new Date(ds).toLocaleString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }); 
    } catch { return ds; }
  };

  return (
    <div className={styles.notesContainer}>
      <div className={styles.notesHeader}>
        <h3 className={styles.sectionTitle}>{t('details.section_notes')}</h3>
        <button className={styles.addNoteBtn} onClick={() => {}}>
          <Plus size={16} />
          {t('details.add_note')}
        </button>
      </div>

      <div className={styles.noteInputWrapper}>
        <Input
          placeholder={t('details.add_note_placeholder')}
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddNote(); } }}
        />
        <Button size="sm" onClick={handleAddNote} isLoading={isLoading} disabled={!newNote.trim()}>
          {t('details.add_note')}
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>{t('details.no_notes')}</p>
        </div>
      ) : (
        <>
          <div className={styles.notesList}>
            {notes.slice(0, 3).map(note => (
              <div key={note.id} className={styles.noteItem}>
                <div className={styles.noteHeader}>
                  <span className={styles.noteAuthor}>{note.authorName || '—'}</span>
                  <button 
                    className={styles.noteDelete} 
                    onClick={() => onDeleteNote(note.id)}
                    title={t('details.delete_note')}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className={styles.noteText}>{note.note}</p>
                <span className={styles.noteDate}>{formatDateTime(note.createdAt)}</span>
              </div>
            ))}
          </div>
          {notes.length > 3 && (
            <button className={styles.viewAllBtn}>
              {t('details.view_all_notes')}
              <ExternalLink size={14} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default QuickNotesSection;
