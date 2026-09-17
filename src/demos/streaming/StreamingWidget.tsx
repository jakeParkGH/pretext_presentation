import React, { useState, useEffect, useRef, useMemo } from 'react';
import { prepare, layout } from '@chenglou/pretext';
import { CodeViewer } from '../../components/common';
import { STREAMING_SOURCE, FONT, LINE_HEIGHT, STREAMING_SNIPPETS } from './constants';
import { StreamingControls } from './components/StreamingControls';
import { StreamingChatBox } from './components/StreamingChatBox';
import { VSyncTimeline } from './components/VSyncTimeline';

export const StreamingWidget: React.FC = () => {
  const [containerWidth, setContainerWidth] = useState<number>(440);
  const [tokenIndex, setTokenIndex] = useState<number>(0);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [mode, setMode] = useState<'naive' | 'pretext'>('pretext');
  const [forcedReflowCount, setForcedReflowCount] = useState<number>(0);
  const [flashKey, setFlashKey] = useState<number>(0);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [maxAvailableWidth, setMaxAvailableWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? Math.min(440, window.innerWidth - 64) : 440
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

  const effectiveWidth = Math.max(260, Math.min(containerWidth, maxAvailableWidth));

  // 현재까지 수신된 텍스트
  const currentText = useMemo(() => {
    return STREAMING_SOURCE.slice(0, tokenIndex).join('');
  }, [tokenIndex]);

  // 스트리밍 타이머
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setTokenIndex((prev) => {
        if (prev >= STREAMING_SOURCE.length) {
          setIsStreaming(false);
          return prev;
        }
        return prev + 1;
      });
    }, 60); // 60ms마다 새 토큰 유입

    return () => clearInterval(interval);
  }, [isStreaming]);

  // 스크롤 동기화 처리
  useEffect(() => {
    if (!chatBoxRef.current || tokenIndex === 0) return;

    if (mode === 'naive') {
      // 💥 안티패턴: 토큰 추가 직후 곧바로 scrollHeight를 읽음 ➔ 강제 동기 리플로우 발생!
      const targetScroll = chatBoxRef.current.scrollHeight;
      chatBoxRef.current.scrollTop = targetScroll;
      setForcedReflowCount((prev) => prev + 1);
      setFlashKey((prev) => prev + 1);
    } else {
      // ⚡ Pretext 패턴: DOM을 묻지 않고 layout()으로 계산된 높이 사용
      const prepared = prepare(currentText, FONT);
      const { height } = layout(prepared, effectiveWidth - 24, LINE_HEIGHT);
      chatBoxRef.current.scrollTop = height;
    }
  }, [currentText, effectiveWidth, mode, tokenIndex]);

  const handleStart = () => {
    setTokenIndex(0);
    setForcedReflowCount(0);
    setIsStreaming(true);
  };

  const handleReset = () => {
    setIsStreaming(false);
    setTokenIndex(0);
    setForcedReflowCount(0);
  };

  return (
    <div className="demo-container">
      <StreamingControls
        isStreaming={isStreaming}
        onStartPause={isStreaming ? () => setIsStreaming(false) : handleStart}
        onReset={handleReset}
        tokenIndex={tokenIndex}
        totalTokens={STREAMING_SOURCE.length}
        mode={mode}
        onModeChange={setMode}
        effectiveWidth={effectiveWidth}
        onWidthChange={setContainerWidth}
        forcedReflowCount={forcedReflowCount}
      />

      {/* 스트리밍 채팅창 뷰포트 (박스모델 탈출 방지 wrapper) */}
      <div ref={wrapperRef} style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        <StreamingChatBox
          effectiveWidth={effectiveWidth}
          tokenIndex={tokenIndex}
          totalTokens={STREAMING_SOURCE.length}
          mode={mode}
          forcedReflowCount={forcedReflowCount}
          flashKey={flashKey}
          chatBoxRef={chatBoxRef}
          currentText={currentText}
          isStreaming={isStreaming}
        />

        <div style={{ width: `${effectiveWidth}px`, maxWidth: '100%', margin: '0 auto' }}>
          <VSyncTimeline
            mode={mode}
            forcedReflowCount={forcedReflowCount}
          />
        </div>
      </div>

      <CodeViewer
        title="LLM 스트리밍 오토스크롤 최적화 원리"
        snippets={STREAMING_SNIPPETS}
      />
    </div>
  );
};
