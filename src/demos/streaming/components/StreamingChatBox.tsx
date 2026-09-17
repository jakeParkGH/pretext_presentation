import React from 'react';
import { FONT, LINE_HEIGHT } from '../constants';

interface StreamingChatBoxProps {
  effectiveWidth: number;
  tokenIndex: number;
  totalTokens: number;
  mode: 'pretext' | 'naive';
  forcedReflowCount: number;
  flashKey: number;
  chatBoxRef: React.RefObject<HTMLDivElement | null>;
  currentText: string;
  isStreaming: boolean;
}

export const StreamingChatBox: React.FC<StreamingChatBoxProps> = ({
  effectiveWidth,
  tokenIndex,
  totalTokens,
  mode,
  forcedReflowCount,
  flashKey,
  chatBoxRef,
  currentText,
  isStreaming,
}) => {
  return (
    <div
      style={{
        width: `${effectiveWidth}px`,
        maxWidth: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.75rem',
          color: 'var(--muted)',
          marginBottom: '6px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>AI ASSISTANT (LLM Stream)</span>
        <span>{tokenIndex} / {totalTokens} tokens · 너비 {effectiveWidth}px</span>
      </div>

      <div
        style={{
          position: 'relative',
          borderRadius: '12px',
        }}
      >
        {/* Status Badge floating at top right of chatbox */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '10px',
            zIndex: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            background: mode === 'naive'
              ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
              : 'linear-gradient(135deg, #2b7a4b 0%, #1c5232 100%)',
            color: '#ffffff',
            border: `1px solid ${mode === 'naive' ? '#f87171' : '#48bb78'}`,
          }}
        >
          <span>{mode === 'naive' ? '💥' : '⚡'}</span>
          <span>
            {mode === 'naive'
              ? `scrollHeight 플러시 (${forcedReflowCount}회 Reflow)`
              : 'Pretext Zero-Reflow (0회)'}
          </span>
        </div>

        {/* Prominent Multi-stop Gradient Splash Overlay */}
        <div
          key={mode === 'naive' ? `splash-${flashKey}` : 'pretext-clean'}
          className={`reflow-splash-overlay ${
            mode === 'naive'
              ? flashKey > 0
                ? 'reflow-splash-burst'
                : 'reflow-splash-ambient-naive'
              : 'reflow-splash-ambient-pretext'
          }`}
        />

        <div
          ref={chatBoxRef as React.RefObject<HTMLDivElement>}
          style={{
            height: '220px',
            overflowY: 'auto',
            border: `1px solid ${mode === 'naive' ? 'rgba(220, 38, 38, 0.45)' : 'var(--rule)'}`,
            borderRadius: '12px',
            padding: '12px',
            paddingTop: '34px',
            font: FONT,
            lineHeight: `${LINE_HEIGHT}px`,
            wordBreak: 'break-word',
            background: 'var(--panel)',
            color: 'var(--ink)',
            boxShadow: mode === 'naive'
              ? '0 4px 20px rgba(220, 38, 38, 0.12)'
              : '0 4px 16px rgba(54, 40, 23, 0.05)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {currentText || (
            <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
              스트리밍 시작 버튼을 눌러보세요...
            </span>
          )}
          {isStreaming && (
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '16px',
                background: mode === 'naive' ? '#dc2626' : 'var(--accent)',
                marginLeft: '4px',
                verticalAlign: 'middle',
                animation: 'blink 0.8s infinite',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
