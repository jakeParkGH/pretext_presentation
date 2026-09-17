import React from 'react';
import { Slide, Card } from '../common';

export const IntroSlide: React.FC = () => {
  return (
    <Slide
      id="cover"
      eyebrow="Interactive Presentation · Browser Rendering Deep-Dive"
      title={
        <h1>
          Pretext 내부 구조와<br />Zero-Reflow 텍스트 레이아웃
        </h1>
      }
      subtitle={
        <>
          브라우저의 <strong>강제 동기 레이아웃(Forced Synchronous Layout)</strong>을 원천 차단하고,
          순수 자바스크립트 산술 연산만으로 텍스트 높이·줄바꿈을 마이크로초(µs) 단위에 계산하는 패러다임 분석
        </>
      }
    >
      {/* 2-Phase Flow Diagram */}
      <div className="flow">
        <div className="flow-box cold">
          prepare()
          <small>Cold Path · 1회 측정</small>
        </div>
        <span className="flow-arrow">➔</span>
        <div className="flow-box" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
          PreparedText
          <small>Opaque Handle (Typed Array)</small>
        </div>
        <span className="flow-arrow">➔</span>
        <div className="flow-box hot">
          layout()
          <small>Hot Path · ∞회 순수 산술</small>
        </div>
        <span className="flow-arrow">➔</span>
        <div className="flow-box" style={{ borderColor: 'var(--green)', color: 'var(--green)' }}>
          {'{ height, lineCount }'}
          <small>Zero DOM Reflow (0.2µs)</small>
        </div>
      </div>

      <div style={{ marginTop: '28px' }}>
        <Card style={{ borderLeft: '4px solid var(--accent)', background: 'var(--panel)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.18rem', color: 'var(--accent)' }}>
            🎯 이 발표에서 다루는 주제
          </h3>
          <div className="grid-3" style={{ margin: 0, gap: '16px' }}>
            <div style={{ background: '#fff', padding: '16px 18px', borderRadius: '12px', border: '1px solid var(--rule-light)' }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '6px', fontSize: '0.95rem' }}>
                ⚙️ 렌더링 파이프라인
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
                웹 브라우저 렌더링 파이프라인 돌아보기
              </p>
            </div>
            <div style={{ background: '#fff', padding: '16px 18px', borderRadius: '12px', border: '1px solid var(--rule-light)' }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '6px', fontSize: '0.95rem' }}>
                ⏱️ VSync & Thrashing
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
                Layout Queuing, VSync 신호 흐름과 Layout Thrashing의 실체
              </p>
            </div>
            <div style={{ background: '#fff', padding: '16px 18px', borderRadius: '12px', border: '1px solid var(--rule-light)' }}>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '6px', fontSize: '0.95rem' }}>
                🚀 5대 인터랙티브 데모
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
                5가지 데모로 확인하는 pretext 효능
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: '32px', fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center' }}>
        Author: jake.ui · Based on <code>@chenglou/pretext</code>
      </div>
    </Slide>
  );
};
