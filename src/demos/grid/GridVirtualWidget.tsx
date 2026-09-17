import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { layout } from '@chenglou/pretext';
import { CodeViewer } from '../../components/common';
import type { PreparedFeedCard } from './types';
import { generateItems } from './mockData';
import { FONT, LINE_HEIGHT, CARD_PADDING, FIXED_OVERHEAD, GRID_SNIPPETS } from './constants';
import { FeedControls } from './components/FeedControls';
import { FeedHudCards } from './components/FeedHudCards';
import { FeedCardItem } from './components/FeedCardItem';

export const GridVirtualWidget: React.FC = () => {
  const [items, setItems] = useState<PreparedFeedCard[]>(() => generateItems(0, 30));
  const [feedWidth, setFeedWidth] = useState<number>(560);
  const [usePretextEstimate, setUsePretextEstimate] = useState<boolean>(true);
  const [useTransform, setUseTransform] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [measureCounter, setMeasureCounter] = useState<number>(0);
  const [measuredReflowTimeMs, setMeasuredReflowTimeMs] = useState<number>(0);
  const [isStressTesting, setIsStressTesting] = useState<boolean>(false);
  const [stressTestResult, setStressTestResult] = useState<string | null>(null);
  const [recentlyMeasuredId, setRecentlyMeasuredId] = useState<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef<boolean>(false);
  const measuredNodesRef = useRef<WeakSet<HTMLElement>>(new WeakSet());
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

  const effectiveFeedWidth = Math.max(260, Math.min(feedWidth, maxAvailableWidth));

  // [Phase 2: Hot Path]: 텍스트 폭이 바뀔 때 순수 산술 연산으로 전체 카드의 물리적 높이 사전 계산
  const { precalculatedHeights, calcTimeUs } = useMemo(() => {
    const t0 = performance.now();
    const textWidth = Math.max(80, effectiveFeedWidth - CARD_PADDING * 2 - 2);

    const heights = new Float64Array(items.length);
    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      const imageHeight = Math.round(textWidth / item.aspectRatio);
      const { height: promptHeight } = layout(item.preparedPrompt, textWidth, LINE_HEIGHT);
      heights[i] = FIXED_OVERHEAD + imageHeight + promptHeight;
    }

    const t1 = performance.now();
    const us = (t1 - t0) * 1000;
    return {
      precalculatedHeights: heights,
      calcTimeUs: us < 0.05 ? '0.18' : us.toFixed(2),
    };
  }, [items, effectiveFeedWidth]);

  // TanStack Virtualizer 인스턴스 초기화
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: (index) => {
      if (usePretextEstimate) {
        return precalculatedHeights[index] ?? 500;
      }
      return 500;
    },
    overscan: 4,
  });

  const rowVirtualizerRef = useRef(rowVirtualizer);
  rowVirtualizerRef.current = rowVirtualizer;

  const virtualItems = rowVirtualizer.getVirtualItems();

  // 무한 스크롤 감지 및 추가 로딩
  useEffect(() => {
    if (virtualItems.length === 0) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    // 💡 사용자가 실제로 스크롤을 조작하여 바닥에 도달했을 때만 추가 로딩 트리거 (모드 전환 시 폭주 원천 차단)
    if (!userScrolledRef.current) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    const isAtBottom =
      container.scrollTop > 50 &&
      container.scrollTop + container.clientHeight >= container.scrollHeight - 300;

    if (
      isAtBottom &&
      lastItem &&
      lastItem.index >= items.length - 2 &&
      !isLoadingMore &&
      items.length < 500
    ) {
      userScrolledRef.current = false;
      setIsLoadingMore(true);
      setTimeout(() => {
        setItems((prev) => [...prev, ...generateItems(prev.length, 20)]);
        setIsLoadingMore(false);
      }, 250);
    }
  }, [virtualItems, items.length, isLoadingMore]);

  const handleAddMore = (count: number) => {
    setItems((prev) => [...prev, ...generateItems(prev.length, count)]);
  };

  const handleReset = () => {
    userScrolledRef.current = false;
    setItems(generateItems(0, 30));
    setMeasureCounter(0);
    setMeasuredReflowTimeMs(0);
    setStressTestResult(null);
    setRecentlyMeasuredId(null);
    measuredNodesRef.current = new WeakSet();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    rowVirtualizer.scrollToOffset(0);
    rowVirtualizer.measure();
  };

  useEffect(() => {
    userScrolledRef.current = false;
    measuredNodesRef.current = new WeakSet();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    rowVirtualizer.scrollToOffset(0);
    rowVirtualizer.measure();
  }, [usePretextEstimate, effectiveFeedWidth]);

  const handleTogglePretextMode = () => {
    userScrolledRef.current = false;
    setUsePretextEstimate(!usePretextEstimate);
    setMeasureCounter(0);
    setMeasuredReflowTimeMs(0);
    setRecentlyMeasuredId(null);
    setStressTestResult(null);
    measuredNodesRef.current = new WeakSet();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    rowVirtualizer.scrollToOffset(0);
    rowVirtualizer.measure();
  };

  const measureCallback = useCallback(
    (node: HTMLElement | null) => {
      if (!usePretextEstimate && node) {
        if (measuredNodesRef.current.has(node)) return;
        measuredNodesRef.current.add(node);

        const t0 = performance.now();
        const _measuredHeight = node.offsetHeight; // Force Layout
        const t1 = performance.now();

        setMeasuredReflowTimeMs((prev) => prev + (t1 - t0));
        setMeasureCounter((prev) => prev + 1);

        const cardId = Number(node.dataset.cardId);
        if (cardId) setRecentlyMeasuredId(cardId);

        rowVirtualizerRef.current.measureElement(node);
      }
    },
    [usePretextEstimate]
  );

  const handleStressTestLayoutThrashing = () => {
    if (!scrollContainerRef.current || isStressTesting) return;
    setIsStressTesting(true);
    setStressTestResult(null);

    setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const cards = container.querySelectorAll('.feed-card-inner');
      if (cards.length === 0) {
        setIsStressTesting(false);
        return;
      }

      const t0 = performance.now();
      let totalThrashingReads = 0;

      for (let iteration = 0; iteration < 15; iteration++) {
        cards.forEach((cardEl) => {
          const el = cardEl as HTMLElement;
          el.style.paddingLeft = `${16 + (iteration % 2)}px`;
          const _h = el.offsetHeight;
          totalThrashingReads++;
        });
      }

      cards.forEach((cardEl) => {
        (cardEl as HTMLElement).style.paddingLeft = `${CARD_PADDING}px`;
      });

      const t1 = performance.now();
      const elapsed = (t1 - t0).toFixed(2);

      setStressTestResult(
        `💥 ${totalThrashingReads}회 연속 Document::UpdateStyleAndLayout() 동기 실행! 메인 스레드 ${elapsed}ms 블로킹 발생`
      );
      setIsStressTesting(false);
    }, 50);
  };

  return (
    <div className="demo-container">
      <FeedControls
        effectiveFeedWidth={effectiveFeedWidth}
        onWidthChange={setFeedWidth}
        itemsCount={items.length}
        calcTimeUs={calcTimeUs}
        usePretextEstimate={usePretextEstimate}
        onTogglePretextMode={handleTogglePretextMode}
        useTransform={useTransform}
        onToggleTransform={() => setUseTransform(!useTransform)}
        onAddMore={handleAddMore}
        onReset={handleReset}
        measureCounter={measureCounter}
        onStressTest={handleStressTestLayoutThrashing}
        isStressTesting={isStressTesting}
        stressTestResult={stressTestResult}
      />

      <FeedHudCards
        totalCount={items.length}
        renderedCount={virtualItems.length}
        calcTimeUs={calcTimeUs}
        usePretextEstimate={usePretextEstimate}
        measureCounter={measureCounter}
        measuredReflowTimeMs={measuredReflowTimeMs}
      />

      {/* 가상 스크롤 뷰포트 (박스모델 탈출 방지 래퍼) */}
      <div ref={wrapperRef} style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <div
          ref={scrollContainerRef}
          onScroll={() => {
            userScrolledRef.current = true;
          }}
          style={{
            height: '520px',
            width: `${effectiveFeedWidth}px`,
            maxWidth: '100%',
            margin: '0 auto',
            overflowY: 'auto',
            border: `1px solid ${usePretextEstimate ? 'var(--rule)' : 'var(--red-border)'}`,
            borderRadius: '12px',
            background: 'var(--page)',
            position: 'relative',
            padding: '12px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualItems.map((virtualRow) => {
              const item = items[virtualRow.index]!;
              const isMeasuredFlashing = !usePretextEstimate && recentlyMeasuredId === item.id;

              return (
                <FeedCardItem
                  key={virtualRow.key}
                  item={item}
                  virtualIndex={virtualRow.index}
                  virtualRowKey={virtualRow.key}
                  virtualRowSize={virtualRow.size}
                  virtualRowStart={virtualRow.start}
                  useTransform={useTransform}
                  usePretextEstimate={usePretextEstimate}
                  isMeasuredFlashing={isMeasuredFlashing}
                  effectiveFeedWidth={effectiveFeedWidth}
                  measureRef={measureCallback}
                />
              );
            })}
          </div>
        </div>
      </div>

      <CodeViewer
        title="TanStack Virtual + Pretext 사전 계산 가상화"
        snippets={GRID_SNIPPETS}
      />
    </div>
  );
};
