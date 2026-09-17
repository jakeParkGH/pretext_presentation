import React from 'react';

interface FeedHudCardsProps {
  totalCount: number;
  renderedCount: number;
  calcTimeUs: string;
  usePretextEstimate: boolean;
  measureCounter: number;
  measuredReflowTimeMs: number;
}

export const FeedHudCards: React.FC<FeedHudCardsProps> = ({
  totalCount,
  renderedCount,
  calcTimeUs,
  usePretextEstimate,
  measureCounter,
  measuredReflowTimeMs,
}) => {
  const reductionPercent = totalCount > 0 ? ((1 - renderedCount / totalCount) * 100).toFixed(1) : '0.0';
  const unmountedCount = Math.max(0, totalCount - renderedCount);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '12px',
        marginBottom: '16px',
      }}
    >
      {/* 1. 총 피드 카드 수 */}
      <div
        style={{
          background: 'var(--panel)',
          padding: '14px',
          borderRadius: '8px',
          border: '1px solid var(--rule)',
          boxShadow: '0 1px 4px rgba(54,40,23,0.03)',
        }}
      >
        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>총 가상화 피드 카드</div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', marginTop: '4px' }}>
          {totalCount.toLocaleString()}개
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
          스크롤 시 자동 무한 로딩
        </div>
      </div>

      {/* 2. 현재 뷰포트 마운트 DOM 노드 (DOM 절감율) */}
      <div
        style={{
          background: 'var(--panel)',
          padding: '14px',
          borderRadius: '8px',
          border: '1px solid var(--rule)',
          boxShadow: '0 1px 4px rgba(54,40,23,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>현재 마운트 DOM 노드</span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--green)',
              background: 'var(--green-bg)',
              padding: '2px 6px',
              borderRadius: '10px',
              border: '1px solid var(--green-border)',
            }}
          >
            절감율 {reductionPercent}%
          </span>
        </div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--green)', marginTop: '4px' }}>
          {renderedCount}개{' '}
          <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>
            / 전체 {totalCount.toLocaleString()}개
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', lineHeight: '1.4' }}>
          💡 실제 렌더링된 DOM은 <strong>{renderedCount}개</strong>이며 나머지{' '}
          <strong>{unmountedCount.toLocaleString()}개</strong>는 메모리에만 존재
        </div>
      </div>

      {/* 3. Pretext 높이 산출 시간 */}
      <div
        style={{
          background: 'var(--panel)',
          padding: '14px',
          borderRadius: '8px',
          border: '1px solid var(--rule)',
          boxShadow: '0 1px 4px rgba(54,40,23,0.03)',
        }}
      >
        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Pretext 높이 산출 시간</div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)', marginTop: '4px' }}>
          {calcTimeUs} µs
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
          카드당 약 0.0002ms 순수 산술식
        </div>
      </div>

      {/* 4. DOM 역측정 및 강제 리플로우 횟수 */}
      <div
        style={{
          background: 'var(--panel)',
          padding: '14px',
          borderRadius: '8px',
          border: '1px solid var(--rule)',
          boxShadow: '0 1px 4px rgba(54,40,23,0.03)',
        }}
      >
        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>DOM 역측정(리플로우) 횟수</div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: usePretextEstimate ? 'var(--green)' : 'var(--red)',
            marginTop: '4px',
          }}
        >
          {usePretextEstimate ? '0회 (Zero Reflow)' : `${measureCounter}회 호출`}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: usePretextEstimate ? 'var(--green)' : 'var(--red)',
            marginTop: '2px',
          }}
        >
          {usePretextEstimate
            ? '✨ VSync 주기 100% 보존'
            : `⚠️ 총 ${measuredReflowTimeMs.toFixed(2)}ms 블로킹`}
        </div>
      </div>
    </div>
  );
};
