import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  prepareWithSegments,
  layoutNextLine,
  type LayoutCursor,
} from '@chenglou/pretext';
import { CodeViewer } from '../../components/common';
import {
  ARTICLE_TEXT,
  FONT,
  LINE_HEIGHT,
  CONTAINER_WIDTH,
  CONTAINER_HEIGHT,
  SHAPE_FLOW_SNIPPETS,
} from './constants';
import {
  type Interval,
  circleIntervalForBand,
  carveTextLineSlots,
} from './geometry';
import { ShapeFlowControls } from './components/ShapeFlowControls';
import { ShapeFlowCanvas } from './components/ShapeFlowCanvas';

export const ShapeFlowWidget: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [maxAvailableWidth, setMaxAvailableWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? Math.min(580, window.innerWidth - 64) : 580
  );

  useEffect(() => {
    if (!wrapperRef.current) return;
    const updateWidth = () => {
      if (wrapperRef.current) {
        setMaxAvailableWidth(Math.floor(wrapperRef.current.clientWidth));
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const effectiveWidth = Math.max(280, Math.min(CONTAINER_WIDTH, maxAvailableWidth));

  const [obstacleX, setObstacleX] = useState<number>(() => Math.floor(effectiveWidth / 2));
  const [obstacleY, setObstacleY] = useState<number>(190);
  const [obstacleRadius, setObstacleRadius] = useState<number>(55);

  const effectiveObstacleX = Math.max(
    obstacleRadius + 10,
    Math.min(effectiveWidth - obstacleRadius - 10, obstacleX)
  );

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initX: number;
    initY: number;
  } | null>(null);

  // 1회성 전처리: prepareWithSegments (라인별 커서 기반 탐색을 위해 세그먼트 보존)
  const prepared = useMemo(() => {
    return prepareWithSegments(ARTICLE_TEXT, FONT);
  }, []);

  // Pretext 다중 슬롯 장애물 회피 레이아웃
  const lines = useMemo(() => {
    const resultLines: Array<{ text: string; x: number; y: number; width: number }> = [];
    let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
    let lineTop = 14;
    const maxY = CONTAINER_HEIGHT - 12;
    const baseInterval: Interval = { left: 14, right: effectiveWidth - 14 };

    while (lineTop + LINE_HEIGHT <= maxY) {
      const bandTop = lineTop;
      const bandBottom = lineTop + LINE_HEIGHT;

      const blocked: Interval[] = [];
      const circleInterval = circleIntervalForBand(
        effectiveObstacleX,
        obstacleY,
        obstacleRadius,
        bandTop,
        bandBottom,
        14,
        4
      );
      if (circleInterval !== null) {
        blocked.push(circleInterval);
      }

      const slots = carveTextLineSlots(baseInterval, blocked, 38);
      if (slots.length === 0) {
        lineTop += LINE_HEIGHT;
        continue;
      }

      const orderedSlots = [...slots].sort((a, b) => a.left - b.left);

      for (let slotIndex = 0; slotIndex < orderedSlots.length; slotIndex++) {
        const slot = orderedSlots[slotIndex]!;
        const slotWidth = slot.right - slot.left;

        let line = layoutNextLine(prepared, cursor, slotWidth);
        if (line === null) {
          cursor = { segmentIndex: 0, graphemeIndex: 0 };
          line = layoutNextLine(prepared, cursor, slotWidth);
        }

        if (!line) continue;

        resultLines.push({
          text: line.text,
          x: Math.round(slot.left),
          y: Math.round(lineTop),
          width: Math.round(line.width),
        });

        cursor = line.end;
      }

      lineTop += LINE_HEIGHT;
    }

    return resultLines;
  }, [prepared, effectiveObstacleX, obstacleY, obstacleRadius, effectiveWidth]);

  const dualSlotLineCount = useMemo(() => {
    const yCounts = new Map<number, number>();
    for (const l of lines) {
      yCounts.set(l.y, (yCounts.get(l.y) || 0) + 1);
    }
    let count = 0;
    for (const c of yCounts.values()) {
      if (c > 1) count++;
    }
    return count;
  }, [lines]);

  // Pointer Capture를 활용한 매끄러운 60fps 드래그
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: obstacleX,
      initY: obstacleY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    const minX = Math.round(obstacleRadius + 10);
    const maxX = Math.round(effectiveWidth - obstacleRadius - 10);
    const minY = Math.round(obstacleRadius + 10);
    const maxY = Math.round(CONTAINER_HEIGHT - obstacleRadius - 10);

    const newX = Math.max(minX, Math.min(maxX, dragStartRef.current.initX + dx));
    const newY = Math.max(minY, Math.min(maxY, dragStartRef.current.initY + dy));

    setObstacleX(newX);
    setObstacleY(newY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      setIsDragging(false);
      dragStartRef.current = null;
    }
  };

  return (
    <div className="demo-container">
      <ShapeFlowControls
        effectiveObstacleX={effectiveObstacleX}
        obstacleY={obstacleY}
        obstacleRadius={obstacleRadius}
        effectiveWidth={effectiveWidth}
        dualSlotLineCount={dualSlotLineCount}
        totalLineCount={lines.length}
        onXChange={setObstacleX}
        onYChange={setObstacleY}
        onRadiusChange={setObstacleRadius}
        onSetPreset={(x, y) => {
          setObstacleX(x);
          setObstacleY(y);
        }}
      />

      {/* 인터랙티브 래핑 뷰포트 wrapper (박스모델 탈출 방지) */}
      <div ref={wrapperRef} style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
        <ShapeFlowCanvas
          effectiveWidth={effectiveWidth}
          effectiveObstacleX={effectiveObstacleX}
          obstacleY={obstacleY}
          obstacleRadius={obstacleRadius}
          isDragging={isDragging}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          lines={lines}
        />
      </div>

      <CodeViewer
        title="layoutNextLine() 다중 슬롯 커서 라우팅 및 라이브러리 내부 소스코드"
        snippets={SHAPE_FLOW_SNIPPETS}
      />
    </div>
  );
};
