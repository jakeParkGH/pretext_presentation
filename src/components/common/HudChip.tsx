import React from 'react';

interface HudChipProps {
  variant?: 'default' | 'highlight' | 'warning';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const HudChip: React.FC<HudChipProps> = ({
  variant = 'default',
  children,
  className = '',
  style,
  id,
}) => {
  const variantClass = variant !== 'default' ? variant : '';
  return (
    <div id={id} className={`hud-chip ${variantClass} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};
