import React from 'react';
import { FONT, LINE_HEIGHT, CONTAINER_HEIGHT } from '../constants';

interface ShapeFlowCanvasProps {
  effectiveWidth: number;
  effectiveObstacleX: number;
  obstacleY: number;
  obstacleRadius: number;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  lines: Array<{ text: string; x: number; y: number; width: number }>;
}

export const ShapeFlowCanvas: React.FC<ShapeFlowCanvasProps> = ({
  effectiveWidth,
  effectiveObstacleX,
  obstacleY,
  obstacleRadius,
  isDragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  lines,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: `${effectiveWidth}px`,
        maxWidth: '100%',
        height: `${CONTAINER_HEIGHT}px`,
        background: 'var(--panel)',
        border: '1px solid var(--rule)',
        borderRadius: '12px',
        margin: '0 auto',
        overflow: 'hidden',
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
    >
      {/* 직접 드래그 가능한 장애물 원형 오브젝트 */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: 'absolute',
          left: `${effectiveObstacleX - obstacleRadius}px`,
          top: `${obstacleY - obstacleRadius}px`,
          width: `${obstacleRadius * 2}px`,
          height: `${obstacleRadius * 2}px`,
          borderRadius: '50%',
          background: isDragging
            ? 'radial-gradient(circle at 30% 30%, #60a5fa, #2563eb)'
            : 'radial-gradient(circle at 30% 30%, #3b82f6, #1d4ed8)',
          boxShadow: isDragging
            ? '0 0 32px rgba(37, 99, 235, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.4)'
            : '0 8px 20px rgba(37, 99, 235, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 800,
          zIndex: 20,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
          border: isDragging ? '2px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.6)',
          transform: isDragging ? 'scale(1.04)' : 'scale(1)',
          transition: isDragging ? 'none' : 'transform 0.15s ease, box-shadow 0.2s ease',
        }}
      >
        <span style={{ fontSize: '10px', letterSpacing: '0.6px', opacity: 0.9 }}>OBSTACLE</span>
        <span style={{ fontSize: '12px', fontWeight: 900, marginTop: '2px' }}>
          {isDragging ? '⚡ 이동 중' : '✋ 드래그'}
        </span>
        <span style={{ fontSize: '9px', opacity: 0.75, marginTop: '2px', fontFamily: 'var(--mono)' }}>
          ({effectiveObstacleX}, {obstacleY})
        </span>
      </div>

      {/* 라인별 텍스트 출력 */}
      {lines.map((item, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: `${item.x}px`,
            top: `${item.y}px`,
            width: `${item.width}px`,
            height: `${LINE_HEIGHT}px`,
            lineHeight: `${LINE_HEIGHT}px`,
            font: FONT,
            color: 'var(--ink)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};
