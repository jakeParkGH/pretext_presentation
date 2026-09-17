import React from 'react';

interface CardProps {
  variant?: 'default' | 'accent' | 'good' | 'bad';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  style,
}) => {
  const variantClass = variant !== 'default' ? variant : '';
  return (
    <div className={`card ${variantClass} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};
