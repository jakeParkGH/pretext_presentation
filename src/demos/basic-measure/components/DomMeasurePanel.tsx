import React from 'react';
import { BORDER, PADDING, FONT, LINE_HEIGHT } from '../constants';

interface DomMeasurePanelProps {
  effectiveWidth: number;
  domMeasuredHeight: number;
  domElapsedUs: string;
  domFlashKey: number;
  domTargetRef: React.RefObject<HTMLDivElement | null>;
  text: string;
}

export const DomMeasurePanel: React.FC<DomMeasurePanelProps> = ({
  effectiveWidth,
  domMeasuredHeight,
  domElapsedUs,
  domFlashKey,
  domTargetRef,
  text,
}) => {
  return (
    <div
      style={{
        width: `${effectiveWidth}px`,
        maxWidth: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span className="badge red">💥 브라우저 실제 offsetHeight</span>
        <span
          key={domFlashKey}
          style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--red)', fontWeight: 700 }}
        >
          {domMeasuredHeight}px
        </span>
      </div>

      <div style={{ position: 'relative', borderRadius: '8px' }}>
        <div
          key={`dom-splash-${domFlashKey}`}
          className={`reflow-splash-overlay ${
            domFlashKey > 0 ? 'reflow-splash-burst' : 'reflow-splash-ambient-naive'
          }`}
        />
        <div
          ref={domTargetRef as React.RefObject<HTMLDivElement>}
          style={{
            border: `${BORDER}px solid var(--red-border)`,
            borderRadius: '8px',
            padding: `${PADDING}px`,
            background: 'var(--panel)',
            font: FONT,
            lineHeight: `${LINE_HEIGHT}px`,
            wordBreak: 'break-word',
            boxSizing: 'border-box',
            overflow: 'hidden',
            transition: 'border-color 0.15s ease',
            boxShadow: '0 2px 8px rgba(54, 40, 23, 0.04)',
          }}
        >
          {text}
        </div>
      </div>
      <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--muted)', textAlign: 'right', fontFamily: 'var(--mono)' }}>
        offsetHeight 측정 비용: {domElapsedUs} µs (강제 동기 레이아웃)
      </div>
    </div>
  );
};
