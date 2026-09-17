import React from 'react';
import { Slide, Card, Callout } from '../common';

export const QueuingSlide: React.FC = () => {
  return (
    <Slide
      id="queuing"
      eyebrow="VSync Signal & Forced Synchronous Layout"
      title="5. Layout Queuing과 VSync, 그리고 Forced Reflow"
      subtitle="VSync 신호와 강제 플러시의 메커니즘"
    >
      <Card style={{ marginBottom: '20px', padding: '18px 20px' }}>
        <h3 style={{ color: 'var(--accent)', marginBottom: '8px', fontSize: '1.05rem' }}>VSync 신호 전달 흐름 (디스플레이 → 메인 스레드)</h3>
        <div className="flow" style={{ margin: '12px 0 6px', justifyContent: 'space-between' }}>
          <div className="flow-box" style={{ flex: '1 1 140px', minWidth: '130px', padding: '10px 8px' }}>
            디스플레이 H/W
            <small>VSync 펄스</small>
          </div>
          <span className="flow-arrow">➔</span>
          <div className="flow-box" style={{ flex: '1 1 140px', minWidth: '130px', padding: '10px 8px' }}>
            OS SubSystem
            <small>CVDisplayLink / DWM</small>
          </div>
          <span className="flow-arrow">➔</span>
          <div className="flow-box" style={{ flex: '1 1 140px', minWidth: '130px', padding: '10px 8px' }}>
            GPU 프로세스(Chromium)
            <small>BeginFrame IPC</small>
          </div>
          <span className="flow-arrow">➔</span>
          <div className="flow-box" style={{ flex: '1 1 140px', minWidth: '130px', padding: '10px 8px' }}>
            컴포지터 스레드
            <small>BeginMainFrame</small>
          </div>
          <span className="flow-arrow">➔</span>
          <div className="flow-box hot" style={{ flex: '1 1 140px', minWidth: '130px', padding: '10px 8px' }}>
            메인 스레드
            <small>rAF → Layout → Paint</small>
          </div>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: '10px' }}>
          👉🏻 Vsync 수신 간격은 디스플레이 하드웨어 스펙에 따라 (16.67ms: 60Hz / 8.33ms: 120Hz / 6.94ms: 144Hz) 등으로 나뉜다
        </p>
      </Card>

      <div className="grid-2">
        <Card variant="bad">
          <h3 style={{ color: 'var(--red)' }}>✏️ 더티 플래그 마킹 (Write)</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: '10px' }}>
            노드에 <code>SetNeedsLayout</code> 비트만 세팅
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
            <code>style.width</code>
            <code>style.fontSize</code>
            <code>className</code>
            <code>appendChild()</code>
            <code>textContent</code>
          </div>
        </Card>

        <Card variant="bad">
          <h3 style={{ color: 'var(--red)' }}>👀 레이아웃 트리거 (Read / 강제 플러시)</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: '10px' }}>
            VSync 무시 → C++ 동기 호출
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
            <code>offsetHeight</code>
            <code>clientHeight</code>
            <code>scrollHeight</code>
            <code>getBoundingClientRect()</code>
            <code>getComputedStyle()</code>
          </div>
        </Card>
      </div>

      <Callout
        variant="warn"
        title="💡 Layout Thrashing (레이아웃 스래싱)"
        style={{ marginTop: '20px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '8px' }}>
          <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid var(--red-border)' }}>
            <div style={{ fontWeight: 600, color: 'var(--red)', marginBottom: '4px', fontSize: '0.9rem' }}>
              쓰기(Write) API 호출로 인한 더티 플래그 마킹 (Invalidation)
            </div>
            <div style={{ fontSize: '0.84rem', fontFamily: 'var(--mono)', color: 'var(--ink)' }}>
              마킹된 상태에서 읽기(Read) API 호출로 인한 강제 레이아웃 계산 → 전역 리플로우
            </div>
          </div>
          <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid var(--green-border)' }}>
            <div style={{ fontWeight: 600, color: 'var(--green)', marginBottom: '4px', fontSize: '0.9rem' }}>
              이 때문에 복잡한 앱이나 애니메이션 라이브러리(FastDOM 등)에서는
            </div>
            <div style={{ fontSize: '0.84rem', fontFamily: 'var(--mono)', color: 'var(--ink)' }}>
              글로벌 큐를 둬서 "모든 컴포넌트의 Read 작업을 먼저 전부 실행한 뒤, 모든 Write 작업을 몰아서 실행"하는 방식으로 스케줄링을 통일
            </div>
          </div>
        </div>
      </Callout>
    </Slide>
  );
};
