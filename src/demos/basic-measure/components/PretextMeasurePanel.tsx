import React from 'react';
import { BORDER, PADDING, FONT, LINE_HEIGHT } from '../constants';

interface PretextMeasurePanelProps {
  effectiveWidth: number;
  totalBoxHeight: number;
  lineCount: number;
  elapsedUs: string;
  mathFlashKey: number;
  text: string;
}

export const PretextMeasurePanel: React.FC<PretextMeasurePanelProps> = ({
  effectiveWidth,
  totalBoxHeight,
  lineCount,
  elapsedUs,
  mathFlashKey,
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
        <span className="badge green">⚡ Pretext 순수 산술식 높이</span>
        <span
          key={mathFlashKey}
          style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--green)', fontWeight: 700 }}
        >
          {totalBoxHeight}px ({lineCount}줄)
        </span>
      </div>

      <div style={{ position: 'relative', borderRadius: '8px' }}>
        <div className="reflow-splash-overlay reflow-splash-ambient-pretext" />
        <div
          style={{
            height: `${totalBoxHeight}px`,
            border: `${BORDER}px solid var(--green-border)`,
            borderRadius: '8px',
            padding: `${PADDING}px`,
            background: 'var(--panel)',
            font: FONT,
            lineHeight: `${LINE_HEIGHT}px`,
            wordBreak: 'break-word',
            overflow: 'hidden',
            transition: 'height 0.1s ease',
            boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(54, 40, 23, 0.04)',
          }}
        >
          {text}
        </div>
      </div>
      <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--muted)', textAlign: 'right', fontFamily: 'var(--mono)' }}>
        연산 소요 시간: {elapsedUs} µs (0 DOM Reflow)
      </div>
    </div>
  );
};
