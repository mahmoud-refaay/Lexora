import React from 'react';
import styles from './Switch.module.css';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = ''
}) => {
  const toggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div 
      className={`${styles.container} ${disabled ? styles.disabled : ''} ${className}`}
      onClick={toggle}
    >
      <div className={`${styles.switch} ${checked ? styles.checked : ''}`}>
        <span className={styles.thumb} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
};

export default Switch;
