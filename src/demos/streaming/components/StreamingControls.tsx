import React from 'react';
import { HudChip } from '../../../components/common';

interface StreamingControlsProps {
  isStreaming: boolean;
  onStartPause: () => void;
  onReset: () => void;
  tokenIndex: number;
  totalTokens: number;
  mode: 'pretext' | 'naive';
  onModeChange: (mode: 'pretext' | 'naive') => void;
  effectiveWidth: number;
  onWidthChange: (width: number) => void;
  forcedReflowCount: number;
}

export const StreamingControls: React.FC<StreamingControlsProps> = ({
  isStreaming,
  onStartPause,
  onReset,
  tokenIndex,
  totalTokens,
  mode,
  onModeChange,
  effectiveWidth,
  onWidthChange,
  forcedReflowCount,
}) => {
  return (
    <div className="demo-header">
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn-icon"
          onClick={onStartPause}
          style={{ background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600 }}
        >
          {isStreaming ? '⏸ 일시 정지' : tokenIndex >= totalTokens ? '▶ 다시 시작' : '▶ 토큰 스트리밍 시작'}
        </button>
        <button type="button" className="btn-icon" onClick={onReset}>
          초기화
        </button>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${mode === 'pretext' ? 'active' : ''}`}
            onClick={() => onModeChange('pretext')}
          >
            ⚡ Pretext (Zero Reflow)
          </button>
          <button
            className={`toggle-btn ${mode === 'naive' ? 'active' : ''}`}
            onClick={() => onModeChange('naive')}
          >
            💥 Naive (scrollHeight 플러시)
          </button>
        </div>

        <div className="range-control">
          <label htmlFor="demo3-width-slider">
            <strong>너비:</strong> <span>{effectiveWidth}</span>px
          </label>
          <input
            type="range"
            id="demo3-width-slider"
            min={260}
            max={600}
            step={10}
            value={effectiveWidth}
            onChange={(e) => onWidthChange(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="demo-hud">
        <HudChip>토큰 수: {tokenIndex} / {totalTokens}</HudChip>
        <HudChip variant={mode === 'pretext' ? 'highlight' : 'warning'}>
          누적 강제 리플로우: {forcedReflowCount}회
        </HudChip>
      </div>
    </div>
  );
};
