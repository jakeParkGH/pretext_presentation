import React from 'react';

interface CodeBlockProps {
  code: string;
  caption?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  caption,
  className = '',
  style,
}) => {
  return (
    <div className={`code-block ${className}`.trim()} style={style}>
      {caption && (
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '6px' }}>
          {caption}
        </div>
      )}
      <pre style={{ margin: 0, overflowX: 'auto' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};
