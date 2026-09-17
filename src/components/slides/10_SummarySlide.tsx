import React from 'react';
import { Slide, Card, Callout } from '../common';

export const SummarySlide: React.FC = () => {
  return (
    <Slide
      id="summary"
      eyebrow="Key Takeaways"
      title="8. 정리"
    >

      {/* 2. 중단: 2대 핵심 영역 (브라우저 병목 3단계 vs Pretext 회피 기동) */}
      <div className="grid-2" style={{ margin: '0 0 18px', gap: '18px' }}>
        {/* 좌측 카드: 브라우저 병목의 3단계 메커니즘 */}
        <Card variant="bad" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🚨</span>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--red)' }}>
                  브라우저 병목의 3단계 메커니즘
                </h3>
              </div>
              <span className="badge red">#ForcedReflow</span>
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--muted)', margin: '0 0 14px 0', lineHeight: 1.5 }}>
              브라우저의 최적화 스케줄링(VSync)이 깨지고 프레임 드랍이 발생하는 원리
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* 1. VSync와 더티 플래그 */}
              <div style={{ background: '#fff', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--red-border)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--red)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>①</span>
                  <span>VSync와 더티 플래그 (Write 지연 큐잉)</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink)', lineHeight: 1.55 }}>
                  브라우저는 렌더링 비용을 아끼기 위해 스타일 변경 시 즉시 계산하지 않고, 노드에 <code>SetNeedsLayout</code> 비트만 마킹한 채 VSync 신호까지 작업을 큐에 모아둡니다.
                </div>
              </div>

              {/* 2. 강제 리플로우 */}
              <div style={{ background: '#fff', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--red-border)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--red)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>②</span>
                  <span>강제 동기 리플로우 (Forced Reflow / 조기 플러시)</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink)', lineHeight: 1.55 }}>
                  더티 플래그가 꽂힌 상태에서 JS가 <code>offsetHeight</code>, <code>scrollHeight</code> 등을 읽는 순간, 브라우저는 VSync를 기다리지 못하고 <strong>C++ 레이아웃 트리를 즉시 강제 계산</strong>합니다.
                </div>
              </div>

              {/* 3. 레이아웃 쓰레싱 */}
              <div style={{ background: '#fff', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--red-border)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--red)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>③</span>
                  <span>레이아웃 쓰레싱 (Layout Thrashing / 연쇄 파괴)</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink)', lineHeight: 1.55 }}>
                  수많은 가변 카드 피드를 렌더링할 때 루프 안에서 <code>Write ➔ Read</code>가 초당 수십~수백 번 교차 반복되며, 16.6ms VSync 예산을 초과해 <strong>심각한 화면 끊김(Jank)</strong>을 유발합니다.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
            <span className="badge red">#SetNeedsLayout</span>
            <span className="badge red">#강제동기레이아웃</span>
            <span className="badge red">#LayoutThrashing</span>
            <span className="badge red">#프레임드랍</span>
          </div>
        </Card>

        {/* 우측 카드: Pretext의 강제 리플로우 회피 기동 */}
        <Card variant="good" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--green)' }}>
                  Pretext의 강제 리플로우 회피 기동
                </h3>
              </div>
              <span className="badge green">#ZeroReflow</span>
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--muted)', margin: '0 0 14px 0', lineHeight: 1.5 }}>
              DOM 읽기(Read)를 원천 금지하고, 2-Phase 수학 모델로 120fps를 지켜내는 해결책
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* prepare() */}
              <div style={{ background: '#fff', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--green-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <code>prepare()</code>
                    <span>: 정밀한 1회 측정</span>
                  </div>
                  <span className="badge accent">Cold Path</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink)', lineHeight: 1.55 }}>
                  DOM 트리를 전혀 만들지 않고 <strong>1×1 <code>OffscreenCanvas</code></strong> 메모리 컨텍스트에서 유니코드 분절(UAX #14) 및 텍스트 너비를 <strong>단 1회 정밀 측정</strong>하여 전역 해시맵 캐시에 적재합니다.
                </div>
              </div>

              {/* layout() */}
              <div style={{ background: '#fff', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--green-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <code>layout()</code>
                    <span>: 순수 산술 연산 & 직접 주입</span>
                  </div>
                  <span className="badge green">Hot Path (0.2µs)</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink)', lineHeight: 1.55 }}>
                  <div style={{ marginBottom: '4px' }}>
                    🚫 <strong>읽기 금지</strong>: DOM 프로퍼티(높이·너비)를 역측정하는 행위를 원천 배제합니다.
                  </div>
                  <div>
                    ⚡ <strong>직접 주입</strong>: 수많은 가변 높이 피드를 <strong>순수 산술 연산(<code>lineW += w</code>)</strong>만으로 0.2µs만에 도출하여, 가상 스크롤러와 GPU에 <strong>직접 주입(Write ➔ Write)</strong>합니다.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
            <span className="badge green">#OffscreenCanvas</span>
            <span className="badge green">#읽기금지(0-DOM-Reads)</span>
            <span className="badge green">#순수산술(0.2µs)</span>
            <span className="badge green">#가변피드직접주입</span>
            <span className="badge green">#120fps무감속</span>
          </div>
        </Card>
      </div>

      {/* 3. 하단: 🎯 핵심 패러다임 전환 Callout */}
      <Callout variant="good" title="🎯 읽기(Read) 순서에 주의하시오">
        <div style={{ fontSize: '0.86rem', fontFamily: 'var(--mono)', color: 'var(--ink)', lineHeight: 1.6 }}>
          쓰기(Write) 호출 이 후에 읽기(Read) 호출은 강제 리플로우를 발생시키니 주의하시오
        </div>
      </Callout>
    </Slide>
  );
};
