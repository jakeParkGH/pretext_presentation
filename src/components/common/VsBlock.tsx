import React from 'react';

interface VsBlockProps {
  badTitle: React.ReactNode;
  badContent: React.ReactNode;
  goodTitle: React.ReactNode;
  goodContent: React.ReactNode;
}

export const VsBlock: React.FC<VsBlockProps> = ({
  badTitle,
  badContent,
  goodTitle,
  goodContent,
}) => {
  return (
    <div className="vs">
      <div className="vs-col bad">
        <h3 style={{ color: 'var(--red)' }}>{badTitle}</h3>
        {badContent}
      </div>
      <div className="vs-divider">VS</div>
      <div className="vs-col good">
        <h3 style={{ color: 'var(--green)' }}>{goodTitle}</h3>
        {goodContent}
      </div>
    </div>
  );
};
