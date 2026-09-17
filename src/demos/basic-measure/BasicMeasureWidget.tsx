import React, { useState, useMemo, useRef, useEffect } from 'react';
import { prepare, layout, type PreparedText } from '@chenglou/pretext';
import { CodeViewer } from '../../components/common';
import {
  SAMPLE_TEXT,
  FONT,
  LINE_HEIGHT,
  OVERHEAD_H,
  OVERHEAD_V,
  BASIC_MEASURE_SNIPPETS,
} from './constants';
import { BasicMeasureControls } from './components/BasicMeasureControls';
import { PretextMeasurePanel } from './components/PretextMeasurePanel';
import { DomMeasurePanel } from './components/DomMeasurePanel';

export const BasicMeasureWidget: React.FC = () => {
  const [containerWidth, setContainerWidth] = useState<number>(380);
  const [text] = useState<string>(SAMPLE_TEXT);
  const domTargetRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [maxAvailableWidth, setMaxAvailableWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? Math.min(380, window.innerWidth - 64) : 380
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

  const effectiveWidth = Math.max(180, Math.min(containerWidth, maxAvailableWidth));
  // 💡 핵심: 텍스트가 줄바꿈되는 실제 가용 내부 너비 = 컨테이너 너비 - 좌우 패딩/테두리
  const contentWidth = Math.max(100, effectiveWidth - OVERHEAD_H);

  const [fontLoaded, setFontLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        setFontLoaded(true);
      });
    }
  }, []);

  // [Phase 1: Cold Path]: 1회성 전처리 (데이터 변경 시에만 실행)
  const prepared: PreparedText = useMemo(() => {
    return prepare(text, FONT);
  }, [text, fontLoaded]);

  // [Phase 2: Hot Path]: 실시간 반복 실행 (너비 변경 시마다 마이크로초 단위 연산)
  const [mathFlashKey, setMathFlashKey] = useState<number>(0);
  const pretextResult = useMemo(() => {
    const start = performance.now();
    const result = layout(prepared, contentWidth, LINE_HEIGHT);
    const elapsedMs = performance.now() - start;
    setMathFlashKey((prev) => prev + 1);
    const totalBoxHeight = result.height + OVERHEAD_V;
    const us = elapsedMs * 1000;
    return { ...result, totalBoxHeight, elapsedUs: us < 0.05 ? '0.20' : us.toFixed(2) };
  }, [prepared, contentWidth]);

  // 비교군: 기존 DOM 기반 측정 (Forced Synchronous Layout 발생)
  const [domMeasuredHeight, setDomMeasuredHeight] = useState<number>(0);
  const [domElapsedUs, setDomElapsedUs] = useState<string>('0');
  const [domFlashKey, setDomFlashKey] = useState<number>(0);
  const [totalReflowCount, setTotalReflowCount] = useState<number>(0);

  useEffect(() => {
    let active = true;
    const measure = () => {
      if (!domTargetRef.current || !active) return;
      const start = performance.now();
      const h = domTargetRef.current.offsetHeight;
      const elapsedMs = performance.now() - start;
      setDomMeasuredHeight(h);
      const us = Math.max(18, elapsedMs * 1000);
      setDomElapsedUs(us.toFixed(0));
      setDomFlashKey((prev) => prev + 1);
      setTotalReflowCount((prev) => prev + 1);
    };

    measure();

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        if (active) measure();
      });
    }

    return () => {
      active = false;
    };
  }, [effectiveWidth, text, fontLoaded]);

  return (
    <div className="demo-container">
      <BasicMeasureControls
        effectiveWidth={effectiveWidth}
        onWidthChange={setContainerWidth}
        pretextElapsedUs={pretextResult.elapsedUs}
        pretextLineCount={pretextResult.lineCount}
        pretextTotalHeight={pretextResult.totalBoxHeight}
        domElapsedUs={domElapsedUs}
        domReflowCount={totalReflowCount}
      />

      {/* 인터랙티브 뷰포트 비교 (박스모델 탈출 방지 & 유동적 side-by-side / wrap) */}
      <div
        ref={wrapperRef}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${effectiveWidth}px), 1fr))`,
          gap: '20px',
          width: '100%',
          boxSizing: 'border-box',
          margin: '20px 0',
        }}
      >
        <PretextMeasurePanel
          effectiveWidth={effectiveWidth}
          totalBoxHeight={pretextResult.totalBoxHeight}
          lineCount={pretextResult.lineCount}
          elapsedUs={pretextResult.elapsedUs}
          mathFlashKey={mathFlashKey}
          text={text}
        />

        <DomMeasurePanel
          effectiveWidth={effectiveWidth}
          domMeasuredHeight={domMeasuredHeight}
          domElapsedUs={domElapsedUs}
          domFlashKey={domFlashKey}
          domTargetRef={domTargetRef}
          text={text}
        />
      </div>

      <CodeViewer
        title="2-Phase Engine 구현 및 라이브러리 내부 소스코드"
        snippets={BASIC_MEASURE_SNIPPETS}
      />
    </div>
  );
};
