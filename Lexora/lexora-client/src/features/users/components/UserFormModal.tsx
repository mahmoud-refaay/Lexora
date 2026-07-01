import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';
import Modal from '../../../components/ui/Modal/Modal';
import Input from '../../../components/ui/Input/Input';
import Switch from '../../../components/ui/Switch/Switch';
import Button from '../../../components/ui/Button/Button';
import { User, Mail, Phone, MapPin, Lock, ShieldAlert } from 'lucide-react';
import styles from './UserFormModal.module.css';

interface UserDto {
  id: number;
  personId: number;
  username: string;
  isActive: boolean;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  email?: string;
  roleNames?: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userToEdit: UserDto | null;
}

const AVAILABLE_ROLES = [
  { id: 1, nameKey: 'roles.admin', defaultName: 'مدير النظام (Admin)' },
  { id: 2, nameKey: 'roles.lawyer', defaultName: 'محامي (Lawyer)' },
  { id: 3, nameKey: 'roles.secretary', defaultName: 'سكرتير (Secretary)' },
  { id: 4, nameKey: 'roles.accountant', defaultName: 'محاسب (Accountant)' }
];

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userToEdit
}) => {
  const { t } = useTranslation(['users', 'common']);
  
  // حقول الإدخال
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditMode = !!userToEdit;

  // تهيئة البيانات عند فتح المودال أو تغيير المستخدم المراد تعديله
  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setUsername(userToEdit.username);
        setFullName(userToEdit.fullName);
        setEmail(userToEdit.email || '');
        setPhoneNumber(userToEdit.phoneNumber || '');
        setAddress(userToEdit.address || '');
        setIsActive(userToEdit.isActive);
        
        // استرجاع الأدوار بناءً على النص
        const roles: number[] = [];
        if (userToEdit.roleNames) {
          if (userToEdit.roleNames.includes('Admin')) roles.push(1);
          if (userToEdit.roleNames.includes('Lawyer')) roles.push(2);
          if (userToEdit.roleNames.includes('Secretary')) roles.push(3);
          if (userToEdit.roleNames.includes('Accountant')) roles.push(4);
        }
        setSelectedRoleIds(roles);
      } else {
        setUsername('');
        setPassword('');
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setAddress('');
        setIsActive(true);
        setSelectedRoleIds([]);
      }
      setError(null);
    }
  }, [isOpen, userToEdit]);

  const handleRoleChange = (roleId: number) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || (!isEditMode && (!username || !password))) {
      setError(t('form.error_fields_required', { defaultValue: 'الرجاء ملء كافة الحقول المطلوبة.' }));
      return;
    }

    if (selectedRoleIds.length === 0) {
      setError(t('form.error_role_required', { defaultValue: 'الرجاء اختيار دور واحد على الأقل.' }));
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && userToEdit) {
        await api.put(`/users/${userToEdit.id}`, {
          fullName,
          email: email || undefined,
          phoneNumber: phoneNumber || undefined,
          address: address || undefined,
          isActive,
          roleIds: selectedRoleIds
        });
      } else {
        await api.post('/users', {
          username,
          password,
          fullName,
          email: email || undefined,
          phoneNumber: phoneNumber || undefined,
          address: address || undefined,
          roleIds: selectedRoleIds
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || (isEditMode ? t('form.error_update') : t('form.error_create')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? t('form.edit_title') : t('form.add_title')}
      size="md"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorAlert}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className={styles.grid}>
          {/* الاسم الكامل */}
          <Input
            label={t('form.fullname_label')}
            placeholder={t('form.fullname_placeholder')}
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            icon={<User size={16} />}
            required
          />

          {/* البريد الإلكتروني */}
          <Input
            label={t('form.email_label')}
            placeholder={t('form.email_placeholder')}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<Mail size={16} />}
          />

          {/* اسم المستخدم */}
          <Input
            label={t('form.username_label')}
            placeholder={t('form.username_placeholder')}
            value={username}
            onChange={e => setUsername(e.target.value)}
            icon={<User size={16} />}
            disabled={isEditMode}
            required
          />

          {/* رقم الهاتف */}
          <Input
            label={t('form.phone_label')}
            placeholder={t('form.phone_placeholder')}
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            icon={<Phone size={16} />}
          />

          {/* كلمة المرور - تظهر في وضع الإضافة فقط */}
          {!isEditMode && (
            <Input
              label={t('form.password_label')}
              placeholder={t('form.password_placeholder')}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={<Lock size={16} />}
              required
            />
          )}

          {/* العنوان الوطني */}
          <Input
            label={t('form.address_label')}
            placeholder={t('form.address_placeholder')}
            value={address}
            onChange={e => setAddress(e.target.value)}
            icon={<MapPin size={16} />}
          />
        </div>

        {/* اختيار الأدوار */}
        <div className={styles.rolesSection}>
          <label className={styles.rolesLabel}>{t('form.roles_label')}</label>
          <div className={styles.rolesGrid}>
            {AVAILABLE_ROLES.map(role => (
              <label 
                key={role.id} 
                className={`${styles.roleCard} ${selectedRoleIds.includes(role.id) ? styles.roleActive : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedRoleIds.includes(role.id)}
                  onChange={() => handleRoleChange(role.id)}
                  className={styles.checkboxHidden}
                />
                <span>{t(role.nameKey, { defaultValue: role.defaultName })}</span>
              </label>
            ))}
          </div>
        </div>

        {/* حالة الحساب - تظهر في وضع التعديل فقط */}
        {isEditMode && (
          <div className={styles.statusSection}>
            <Switch
              checked={isActive}
              onChange={setIsActive}
              label={t('form.status_label')}
            />
          </div>
        )}

        <div className={styles.actions}>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose} 
            disabled={loading}
          >
            {t('buttons.cancel', { ns: 'common' })}
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={loading}
          >
            {t('buttons.save', { ns: 'common' })}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
