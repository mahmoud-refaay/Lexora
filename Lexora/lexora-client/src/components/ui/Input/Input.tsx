import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'start',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${styles.wrapper} ${error ? styles.hasError : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {icon && iconPosition === 'start' && (
          <span className={`${styles.icon} ${styles.iconStart}`}>{icon}</span>
        )}
        <input
          id={inputId}
          className={`${styles.input} ${icon ? (iconPosition === 'start' ? styles.padStart : styles.padEnd) : ''}`}
          {...props}
        />
        {icon && iconPosition === 'end' && (
          <span className={`${styles.icon} ${styles.iconEnd}`}>{icon}</span>
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;
