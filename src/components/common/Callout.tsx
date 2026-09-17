import React from 'react';

interface CalloutProps {
  variant?: 'default' | 'good' | 'warn';
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Callout: React.FC<CalloutProps> = ({
  variant = 'default',
  title,
  children,
  className = '',
  style,
}) => {
  const variantClass = variant !== 'default' ? variant : '';
  return (
    <div className={`callout ${variantClass} ${className}`.trim()} style={style}>
      {title && <div style={{ fontWeight: 700, marginBottom: '6px' }}>{title}</div>}
      {children}
    </div>
  );
};
