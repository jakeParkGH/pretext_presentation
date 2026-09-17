import React from 'react';
import type { AccordionSection } from '../types';
import {
  FONT,
  LINE_HEIGHT,
  INNER_PADDING_TOP,
  INNER_PADDING_X,
  INNER_PADDING_BOTTOM,
} from '../constants';

interface AccordionItemProps {
  section: AccordionSection;
  isOpen: boolean;
  targetHeight: number;
  lineCount: number;
  isFirst: boolean;
  onToggle: () => void;
  setBodyRef: (el: HTMLDivElement | null) => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  section,
  isOpen,
  targetHeight,
  lineCount,
  isFirst,
  onToggle,
  setBodyRef,
}) => {
  return (
    <div
      style={{
        borderTop: isFirst ? 'none' : '1px solid var(--rule-light)',
        boxSizing: 'border-box',
      }}
    >
      {/* 아코디언 헤더 토글 버튼 */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto auto',
          gap: '12px',
          alignItems: 'center',
          width: '100%',
          padding: '16px 20px',
          border: 0,
          background: isOpen ? 'rgba(149, 95, 59, 0.05)' : 'transparent',
          color: 'var(--ink)',
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>{section.title}</span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                border: '1px solid var(--accent-border)',
              }}
            >
              {section.tag}
            </span>
          </div>
        </div>

        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '11px',
            color: 'var(--muted)',
            whiteSpace: 'nowrap',
          }}
        >
          {lineCount}줄 · {targetHeight}px
        </div>

        {/* 회전 글리프 */}
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            width: '18px',
            height: '18px',
            color: isOpen ? 'var(--accent)' : 'var(--muted)',
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 180ms ease, color 0.18s ease',
          }}
        >
          <span style={{ fontSize: '10px' }}>▶</span>
        </div>
      </button>

      {/* 아코디언 본문 (Pretext 정밀 높이 주입 & 부드러운 CSS transition) */}
      <div
        ref={setBodyRef}
        style={{
          height: isOpen ? `${targetHeight}px` : '0px',
          overflow: 'clip',
          transition: 'height 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxSizing: 'border-box',
          willChange: 'height',
        }}
      >
        <div
          style={{
            padding: `${INNER_PADDING_TOP}px ${INNER_PADDING_X}px ${INNER_PADDING_BOTTOM}px`,
            boxSizing: 'border-box',
          }}
        >
          <p
            style={{
              margin: 0,
              font: FONT,
              lineHeight: `${LINE_HEIGHT}px`,
              color: 'var(--ink)',
              wordBreak: 'break-word',
            }}
          >
            {section.text}
          </p>
        </div>
      </div>
    </div>
  );
};
