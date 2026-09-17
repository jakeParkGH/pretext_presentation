import React from 'react';
import { HudChip } from '../../../components/common';

interface BasicMeasureControlsProps {
  effectiveWidth: number;
  onWidthChange: (width: number) => void;
  pretextElapsedUs: string;
  pretextLineCount: number;
  pretextTotalHeight: number;
  domElapsedUs: string;
  domReflowCount: number;
}

export const BasicMeasureControls: React.FC<BasicMeasureControlsProps> = ({
  effectiveWidth,
  onWidthChange,
  pretextElapsedUs,
  pretextLineCount,
  pretextTotalHeight,
  domElapsedUs,
  domReflowCount,
}) => {
  return (
    <div className="demo-header">
      <div className="range-control">
        <label htmlFor="demo1-slider">
          <strong>컨테이너 너비:</strong> <span>{effectiveWidth}</span>px
        </label>
        <input
          type="range"
          id="demo1-slider"
          min={180}
          max={650}
          value={effectiveWidth}
          onChange={(e) => onWidthChange(Number(e.target.value))}
          style={{ width: '200px' }}
        />
      </div>

      <div className="demo-hud">
        <HudChip variant="highlight">
          ⚡ Pretext: <span>{pretextElapsedUs}</span> µs · Reflow: 0회
        </HudChip>
        <HudChip>
          줄 수: {pretextLineCount}줄 / 높이: {pretextTotalHeight}px
        </HudChip>
        <HudChip variant="warning">
          💥 DOM: <span>{domElapsedUs}</span> µs · Reflow: <span>{domReflowCount}</span>회
        </HudChip>
      </div>
    </div>
  );
};
