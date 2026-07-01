import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', animate = false, ...props }) => {
  return (
    <div 
      className={`glass-panel ${styles.card} ${animate ? 'animate-fade-in' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
