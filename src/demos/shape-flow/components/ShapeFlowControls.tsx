import React from 'react';
import { HudChip } from '../../../components/common';

interface ShapeFlowControlsProps {
  effectiveObstacleX: number;
  obstacleY: number;
  obstacleRadius: number;
  effectiveWidth: number;
  dualSlotLineCount: number;
  totalLineCount: number;
  onXChange: (x: number) => void;
  onYChange: (y: number) => void;
  onRadiusChange: (r: number) => void;
  onSetPreset: (x: number, y: number) => void;
}

export const ShapeFlowControls: React.FC<ShapeFlowControlsProps> = ({
  effectiveObstacleX,
  obstacleY,
  obstacleRadius,
  effectiveWidth,
  dualSlotLineCount,
  totalLineCount,
  onXChange,
  onYChange,
  onRadiusChange,
  onSetPreset,
}) => {
  return (
    <>
      <div className="demo-header">
        <div style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
          💡 파란색 원형 오브젝트를 <strong>직접 마우스나 터치로 드래그</strong>해 보세요! 실시간 양방향 분할 래핑됩니다.
        </div>
        <div className="demo-hud">
          <HudChip variant="highlight">⚡ 60 FPS 고정</HudChip>
          <HudChip variant="highlight">양방향 분할: {dualSlotLineCount}줄</HudChip>
          <HudChip>총 라인 수: {totalLineCount}줄</HudChip>
        </div>
      </div>

      {/* 위치 조절 슬라이더 및 프리셋 */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
        <div className="range-control">
          <label>X 위치: {effectiveObstacleX}px</label>
          <input
            type="range"
            min={Math.round(obstacleRadius + 10)}
            max={Math.round(effectiveWidth - obstacleRadius - 10)}
            value={effectiveObstacleX}
            onChange={(e) => onXChange(Number(e.target.value))}
          />
        </div>

        <div className="range-control">
          <label>Y 위치: {obstacleY}px</label>
          <input
            type="range"
            min={70}
            max={345}
            value={obstacleY}
            onChange={(e) => onYChange(Number(e.target.value))}
          />
        </div>

        <div className="range-control">
          <label>반경 R: {obstacleRadius}px</label>
          <input
            type="range"
            min={35}
            max={75}
            value={obstacleRadius}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
          />
        </div>
      </div>

      {/* 프리셋 버튼 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>
          위치 프리셋:
        </span>
        <button
          type="button"
          className="btn-icon"
          style={{ fontSize: '11.5px', padding: '3px 8px' }}
          onClick={() => onSetPreset(Math.floor(effectiveWidth / 2), 190)}
        >
          🎯 중앙 (양방향 분할)
        </button>
        <button
          type="button"
          className="btn-icon"
          style={{ fontSize: '11.5px', padding: '3px 8px' }}
          onClick={() => onSetPreset(Math.max(obstacleRadius + 10, Math.floor(effectiveWidth * 0.25)), 190)}
        >
          ⬅️ 좌측 배치
        </button>
        <button
          type="button"
          className="btn-icon"
          style={{ fontSize: '11.5px', padding: '3px 8px' }}
          onClick={() => onSetPreset(Math.min(effectiveWidth - obstacleRadius - 10, Math.floor(effectiveWidth * 0.75)), 190)}
        >
          ➡️ 우측 배치
        </button>
        <button
          type="button"
          className="btn-icon"
          style={{ fontSize: '11.5px', padding: '3px 8px' }}
          onClick={() => onSetPreset(Math.floor(effectiveWidth / 2), 90)}
        >
          ⬆️ 상단 중앙
        </button>
      </div>
    </>
  );
};
