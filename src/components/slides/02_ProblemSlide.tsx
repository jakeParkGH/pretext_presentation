import React from 'react';
import { Slide, VsBlock, Callout } from '../common';

export const ProblemSlide: React.FC = () => {
  return (
    <Slide
      id="problem"
      eyebrow="Chapter 1-3 · Problem Analysis"
      title="🚨 문제: 브라우저 리플로우의 치명적 비용"
    >
      <VsBlock
        badTitle="❌ 전통적인 DOM 접근 방식"
        badContent={
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
              <code style={{ fontSize: '0.82rem' }}>offsetHeight</code>
              <code style={{ fontSize: '0.82rem' }}>getBoundingClientRect()</code>
              <code style={{ fontSize: '0.82rem' }}>scrollHeight</code>
              <code style={{ fontSize: '0.82rem' }}>getComputedStyle()</code>
            </div>

            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid var(--red-border)', margin: '12px 0', fontSize: '0.85rem', fontFamily: 'var(--mono)', color: 'var(--ink)' }}>
              DOM Read → VSync 무시 → 동기 Reflow → <strong style={{ color: 'var(--red)' }}>Layout Thrashing</strong>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span className="badge red">#강제동기레이아웃</span>
              <span className="badge red">#MainThreadLock</span>
              <span className="badge red">#O(N)연쇄폭발</span>
            </div>
          </>
        }
        goodTitle="✅ Pretext 순수 산술 방식"
        goodContent={
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
              <code style={{ fontSize: '0.82rem', borderColor: 'var(--green-border)', color: 'var(--green)' }}>prepare() (1회 캐싱)</code>
              <code style={{ fontSize: '0.82rem', borderColor: 'var(--green-border)', color: 'var(--green)' }}>Float64Array 메모리</code>
              <code style={{ fontSize: '0.82rem', borderColor: 'var(--green-border)', color: 'var(--green)' }}>layout() (순수 산술)</code>
            </div>

            <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid var(--green-border)', margin: '12px 0', fontSize: '0.85rem', fontFamily: 'var(--mono)', color: 'var(--ink)' }}>
              1회 측정 → Typed Array → 순수 산술 → <strong style={{ color: 'var(--green)' }}>Reflow 0회</strong>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span className="badge green">#Reflow0회</span>
              <span className="badge green">#0.0002ms(0.2µs)</span>
              <span className="badge green">#120Hz무감속</span>
            </div>
          </>
        }
      />

      {/* Layout Thrashing 악순환 다이어그램 */}
      <Callout
        variant="warn"
        title="💥 Layout Thrashing (레이아웃 스래싱) 연쇄 폭발 메커니즘"
        style={{ marginTop: '20px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', margin: '10px 0 6px', fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>
          <div style={{ background: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--rule)' }}>
            ① DOM 수정 (Write)
          </div>
          <span>➔</span>
          <div style={{ background: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--red-border)', color: 'var(--red)', fontWeight: 600 }}>
            ② 수치 조회 (Read)
          </div>
          <span>➔</span>
          <div style={{ background: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--red-border)', color: 'var(--red)', fontWeight: 600 }}>
            ③ 대기열 강제 플러시
          </div>
          <span>➔</span>
          <div style={{ background: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--red-border)', color: 'var(--red)', fontWeight: 700 }}>
            ④ O(N)번 C++ 레이아웃 재계산
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '8px' }}>
          ※ N개 요소 × 동기 Layout = 메인 스레드 정지
        </div>
      </Callout>
    </Slide>
  );
};
