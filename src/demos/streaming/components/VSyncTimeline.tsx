import React from 'react';

interface VSyncTimelineProps {
  mode: 'pretext' | 'naive';
  forcedReflowCount: number;
}

export const VSyncTimeline: React.FC<VSyncTimelineProps> = ({
  mode,
  forcedReflowCount,
}) => {
  const isJank = mode === 'naive' && forcedReflowCount > 0;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        marginTop: '12px',
        padding: '10px 14px',
        borderRadius: '8px',
        background: 'rgba(149, 95, 59, 0.04)',
        border: '1px solid var(--rule-light)',
        boxSizing: 'border-box',
        fontSize: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
          ⏱️ 16.6ms VSync Frame Budget 모니터
        </span>
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '11px',
            color: isJank ? 'var(--red)' : 'var(--green)',
            fontWeight: 700,
          }}
        >
          {isJank ? '⚠️ Forced Synchronous Layout 발생 (프레임 드랍 위험)' : '✨ VSync 예산 100% 보존 (60/120fps)'}
        </span>
      </div>

      {/* Progress track */}
      <div
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: 'var(--rule)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: isJank ? '92%' : '8%',
            height: '100%',
            borderRadius: '3px',
            background: isJank
              ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
              : 'linear-gradient(90deg, #10b981, #059669)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '4px',
          fontFamily: 'var(--mono)',
          fontSize: '10px',
          color: 'var(--muted)',
        }}
      >
        <span>0ms</span>
        <span>8.3ms (120Hz)</span>
        <span>16.6ms (60Hz 한도)</span>
      </div>
    </div>
  );
};
