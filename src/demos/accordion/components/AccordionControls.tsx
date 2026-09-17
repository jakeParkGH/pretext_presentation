import React from 'react';
import { HudChip } from '../../../components/common';

interface AccordionControlsProps {
  effectiveWidth: number;
  onWidthChange: (width: number) => void;
  mode: 'pretext' | 'dom';
  onModeChange: (mode: 'pretext' | 'dom') => void;
  onCollapseAll: () => void;
  calcTimeUs: string;
  reflowCount: number;
  lastReflowElapsedUs: string;
  contentWidth: number;
}

export const AccordionControls: React.FC<AccordionControlsProps> = ({
  effectiveWidth,
  onWidthChange,
  mode,
  onModeChange,
  onCollapseAll,
  calcTimeUs,
  reflowCount,
  lastReflowElapsedUs,
  contentWidth,
}) => {
  return (
    <div className="demo-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${mode === 'pretext' ? 'active' : ''}`}
            onClick={() => onModeChange('pretext')}
          >
            🚀 Pretext 모드 (Zero Reflow)
          </button>
          <button
            className={`toggle-btn ${mode === 'dom' ? 'active' : ''}`}
            onClick={() => onModeChange('dom')}
          >
            💥 Naive 모드 (scrollHeight 측정)
          </button>
        </div>

        <button
          type="button"
          className="toggle-btn"
          onClick={onCollapseAll}
          style={{ border: '1px solid var(--rule)', borderRadius: '6px' }}
        >
          모두 접기
        </button>

        <div className="range-control">
          <label htmlFor="demo2-width-slider">
            <strong>너비:</strong> <span>{effectiveWidth}</span>px
          </label>
          <input
            type="range"
            id="demo2-width-slider"
            min={300}
            max={720}
            step={10}
            value={effectiveWidth}
            onChange={(e) => onWidthChange(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="demo-hud">
        <HudChip variant="highlight">
          ⚡ 4개 섹션 높이 연산: <span>{calcTimeUs}</span> µs
        </HudChip>
        <HudChip variant={reflowCount > 0 ? 'warning' : undefined}>
          누적 리플로우: {mode === 'pretext' ? '0회 (차단됨)' : `${reflowCount}회 (소요: ${lastReflowElapsedUs}µs)`}
        </HudChip>
        <HudChip>
          가용 폭: {contentWidth}px
        </HudChip>
      </div>
    </div>
  );
};
