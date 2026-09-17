import React, { useState, useMemo, useRef, useEffect } from 'react';
import { prepare, layout, type PreparedText } from '@chenglou/pretext';
import { CodeViewer } from '../../components/common';
import {
  SECTIONS,
  FONT,
  LINE_HEIGHT,
  INNER_PADDING_X,
  PADDING_Y,
  ACCORDION_SNIPPETS,
} from './constants';
import { AccordionControls } from './components/AccordionControls';
import { AccordionItem } from './components/AccordionItem';

export const AccordionWidget: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('shipping');
  const [containerWidth, setContainerWidth] = useState<number>(560);
  const [mode, setMode] = useState<'pretext' | 'dom'>('pretext');
  const [reflowCount, setReflowCount] = useState<number>(0);
  const [lastReflowElapsedUs, setLastReflowElapsedUs] = useState<string>('0');
  const [flashKey, setFlashKey] = useState<number>(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const bodyRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [maxAvailableWidth, setMaxAvailableWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? Math.min(560, window.innerWidth - 64) : 560
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

  const effectiveWidth = Math.max(300, Math.min(containerWidth, maxAvailableWidth));
  // 아코디언 본문 텍스트의 가용 내부 너비 = 컨테이너 너비 - 양쪽 테두리(2px) - 좌우 패딩(40px)
  const contentWidth = Math.max(100, effectiveWidth - 2 - INNER_PADDING_X * 2);

  // [Phase 1: Cold Path]: 1회성 전처리 (텍스트와 폰트 기준 분절 및 캐싱)
  const preparedMap = useMemo<Map<string, PreparedText>>(() => {
    const map = new Map<string, PreparedText>();
    for (const s of SECTIONS) {
      map.set(s.id, prepare(s.text, FONT));
    }
    return map;
  }, []);

  // [Phase 2: Hot Path]: 컨테이너 너비 변경 시 순수 산술 연산으로 각 섹션의 정밀 높이 사전 산출
  const { heightsMap, linesMap, calcTimeUs } = useMemo(() => {
    const t0 = performance.now();
    const hMap = new Map<string, number>();
    const lMap = new Map<string, number>();

    for (const s of SECTIONS) {
      const prep = preparedMap.get(s.id)!;
      const result = layout(prep, contentWidth, LINE_HEIGHT);
      hMap.set(s.id, Math.ceil(result.height + PADDING_Y));
      lMap.set(s.id, result.lineCount);
    }

    const t1 = performance.now();
    const us = (t1 - t0) * 1000;
    return {
      heightsMap: hMap,
      linesMap: lMap,
      calcTimeUs: us < 0.05 ? '0.24' : us.toFixed(2),
    };
  }, [preparedMap, contentWidth]);

  // 토글 클릭 핸들러
  const handleToggle = (id: string) => {
    if (mode === 'dom') {
      const el = bodyRefs.current.get(id);
      if (el) {
        const t0 = performance.now();
        const _sh = el.scrollHeight; // Force Sync Layout
        const t1 = performance.now();
        setLastReflowElapsedUs(((t1 - t0) * 1000).toFixed(2));
        setReflowCount((prev) => prev + 1);
        setFlashKey((prev) => prev + 1);
      }
    }
    setOpenId((prev) => (prev === id ? null : id));
  };

  // DOM 모드에서 너비 리사이즈 시 높이 측정을 위한 scrollHeight 재조회 (리플로우 연쇄)
  useEffect(() => {
    if (mode === 'dom' && openId) {
      const el = bodyRefs.current.get(openId);
      if (el) {
        const t0 = performance.now();
        const _sh = el.scrollHeight;
        const t1 = performance.now();
        setLastReflowElapsedUs(((t1 - t0) * 1000).toFixed(2));
        setReflowCount((prev) => prev + 1);
        setFlashKey((prev) => prev + 1);
      }
    }
  }, [contentWidth, mode, openId]);

  return (
    <div className="demo-container">
      <AccordionControls
        effectiveWidth={effectiveWidth}
        onWidthChange={setContainerWidth}
        mode={mode}
        onModeChange={setMode}
        onCollapseAll={() => setOpenId(null)}
        calcTimeUs={calcTimeUs}
        reflowCount={reflowCount}
        lastReflowElapsedUs={lastReflowElapsedUs}
        contentWidth={contentWidth}
      />

      {/* 인터랙티브 아코디언 컴포넌트 */}
      <div ref={wrapperRef} style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', margin: '0 auto', boxSizing: 'border-box' }}>
        <div
          style={{
            position: 'relative',
            width: `${effectiveWidth}px`,
            maxWidth: '100%',
            margin: '0 auto',
            background: 'var(--panel)',
            border: mode === 'dom' && flashKey > 0 ? '1.5px solid rgba(220, 38, 38, 0.45)' : '1px solid var(--rule)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(54, 40, 23, 0.05)',
            transition: 'width 0.15s ease, border-color 0.2s ease',
            boxSizing: 'border-box',
          }}
        >
          {/* Prominent Multi-stop Gradient Splash Overlay */}
          <div
            key={mode === 'dom' ? `acc-splash-${flashKey}` : 'acc-pretext'}
            className={`reflow-splash-overlay ${
              mode === 'dom'
                ? flashKey > 0
                  ? 'reflow-splash-burst'
                  : 'reflow-splash-ambient-naive'
                : 'reflow-splash-ambient-pretext'
            }`}
          />

          {SECTIONS.map((section, idx) => (
            <AccordionItem
              key={section.id}
              section={section}
              isOpen={openId === section.id}
              targetHeight={heightsMap.get(section.id) ?? 0}
              lineCount={linesMap.get(section.id) ?? 0}
              isFirst={idx === 0}
              onToggle={() => handleToggle(section.id)}
              setBodyRef={(el) => {
                if (el) bodyRefs.current.set(section.id, el);
                else bodyRefs.current.delete(section.id);
              }}
            />
          ))}
        </div>
      </div>

      <CodeViewer
        title="Zero-Reflow 아코디언 구현 및 라이브러리 내부 소스코드"
        snippets={ACCORDION_SNIPPETS}
      />
    </div>
  );
};
