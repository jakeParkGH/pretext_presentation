import React from 'react';
import type { SlideId } from '../../types/presentation';

interface SlideProps {
  id: SlideId;
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Slide: React.FC<SlideProps> = ({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = '',
  style,
}) => {
  return (
    <section id={id} className={`slide ${className}`.trim()} style={style}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      {title && (typeof title === 'string' ? <h2>{title}</h2> : title)}
      {subtitle && <p style={{ fontSize: '1em', lineHeight: '1.8em', marginBottom: '12px' }} className="subtitle">{subtitle}</p>}
      {children}
    </section>
  );
};
