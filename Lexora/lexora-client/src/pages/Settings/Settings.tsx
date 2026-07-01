import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import Card from '../../components/ui/Card/Card';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { ShieldCheck, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import styles from './Settings.module.css';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation(['auth', 'common']);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t('form.error_fields_required', { ns: 'users', defaultValue: 'الرجاء تعبئة كافة الحقول.' }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('change_password.mismatch'));
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      setSuccess(t('change_password.success'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || t('messages.error_occurred', { ns: 'common' });
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} animate-fade-in`} dir={i18n.dir()}>
      <h2 className={styles.title}>{t('change_password.title')}</h2>

      <Card className={styles.card}>
        <h3 className={styles.subtitle}>{t('change_password.subtitle')}</h3>

        {error && (
          <div className={`${styles.alert} ${styles.errorAlert}`}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={`${styles.alert} ${styles.successAlert}`}>
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label={t('change_password.current_password_label')}
            placeholder={t('change_password.current_password_placeholder')}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
            icon={<Lock size={16} />}
            required
          />

          <Input
            label={t('change_password.new_password_label')}
            placeholder={t('change_password.new_password_placeholder')}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            icon={<Lock size={16} />}
            required
          />

          <Input
            label={t('change_password.confirm_password_label')}
            placeholder={t('change_password.confirm_password_placeholder')}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            icon={<Lock size={16} />}
            required
          />

          <Button 
            type="submit" 
            isLoading={loading}
            className={styles.submitBtn}
          >
            <ShieldCheck size={18} />
            <span>{t('buttons.change_password', { ns: 'common' })}</span>
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Settings;
