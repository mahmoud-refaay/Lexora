import React from 'react';
import { Plus, Upload } from 'lucide-react';
import styles from './QuickActionCard.module.css';

interface QuickActionProps {
  title: string;
  icon: string; // 3D icon path
  onClick: () => void;
  actionType?: 'plus' | 'upload';
}

const QuickActionCard: React.FC<QuickActionProps> = ({
  title,
  icon,
  onClick,
  actionType = 'plus',
}) => {
  return (
    <div className={styles.actionCard} onClick={onClick}>
      <div className={styles.iconWrapper}>
        <div className={styles.iconContainer}>
          <img src={icon} alt={title} className={styles.icon3d} />
        </div>
        <div className={styles.badgeOverlay}>
          {actionType === 'upload' ? <Upload size={11} strokeWidth={3} /> : <Plus size={11} strokeWidth={3} />}
        </div>
      </div>
      <span className={styles.title}>{title}</span>
    </div>
  );
};

export default QuickActionCard;
