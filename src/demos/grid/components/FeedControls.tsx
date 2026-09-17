import React from 'react';
import { HudChip } from '../../../components/common';

interface FeedControlsProps {
  effectiveFeedWidth: number;
  onWidthChange: (width: number) => void;
  itemsCount: number;
  calcTimeUs: string;
  usePretextEstimate: boolean;
  onTogglePretextMode: () => void;
  useTransform: boolean;
  onToggleTransform: () => void;
  onAddMore: (count: number) => void;
  onReset: () => void;
  measureCounter: number;
  onStressTest: () => void;
  isStressTesting: boolean;
  stressTestResult: string | null;
}

export const FeedControls: React.FC<FeedControlsProps> = ({
  effectiveFeedWidth,
  onWidthChange,
  itemsCount,
  calcTimeUs,
  usePretextEstimate,
  onTogglePretextMode,
  useTransform,
  onToggleTransform,
  onAddMore,
  onReset,
  measureCounter,
  onStressTest,
  isStressTesting,
  stressTestResult,
}) => {
  return (
    <>
      <div className="demo-header">
        <div className="range-control">
          <label htmlFor="feed-width-slider">
            <strong>피드 너비:</strong> <span>{effectiveFeedWidth}</span>px
          </label>
          <input
            type="range"
            id="feed-width-slider"
            min={260}
            max={720}
            step={10}
            value={effectiveFeedWidth}
            onChange={(e) => onWidthChange(Number(e.target.value))}
          />
        </div>

        <div className="demo-hud">
          <HudChip variant="highlight">
            ⚡ {itemsCount}개 높이 연산: {calcTimeUs} µs
          </HudChip>
          <HudChip variant={usePretextEstimate ? 'highlight' : 'warning'}>
            DOM 역측정 Reflow: {measureCounter}회
          </HudChip>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <button
          type="button"
          className={`btn-icon ${usePretextEstimate ? 'active' : ''}`}
          onClick={onTogglePretextMode}
          style={{
            background: usePretextEstimate ? 'var(--green-bg)' : 'var(--red-bg)',
            color: usePretextEstimate ? 'var(--green)' : 'var(--red)',
            borderColor: usePretextEstimate ? 'var(--green-border)' : 'var(--red-border)',
            fontWeight: 700,
          }}
        >
          {usePretextEstimate ? '🚀 Pretext Zero-DOM 모드' : '⚠️ Pretext 미적용 (동적 DOM 역측정)'}
        </button>

        <button
          type="button"
          className="btn-icon"
          onClick={onToggleTransform}
          style={{
            background: useTransform ? 'var(--panel)' : 'rgba(220, 38, 38, 0.08)',
            borderColor: useTransform ? 'var(--rule)' : 'var(--red-border)',
          }}
        >
          {useTransform ? '⚡ GPU transform: translate3d' : '🐢 CPU layout: top 속성 (Paint 유발)'}
        </button>

        <button type="button" className="btn-icon" onClick={() => onAddMore(50)}>
          +50개 추가
        </button>

        <button type="button" className="btn-icon" onClick={onReset}>
          초기화
        </button>

        {!usePretextEstimate && (
          <button
            type="button"
            className="btn-icon"
            onClick={onStressTest}
            disabled={isStressTesting}
            style={{
              background: 'var(--red-bg)',
              color: 'var(--red)',
              borderColor: 'var(--red-border)',
              fontWeight: 700,
            }}
          >
            {isStressTesting ? '⏳ 15회 연쇄 측정 중...' : '🔥 15회 연쇄 리플로우 스트레스'}
          </button>
        )}
      </div>

      {stressTestResult && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'var(--red-bg)',
            color: 'var(--red)',
            border: '1px solid var(--red-border)',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '16px',
            fontFamily: 'var(--mono)',
          }}
        >
          {stressTestResult}
        </div>
      )}
    </>
  );
};
