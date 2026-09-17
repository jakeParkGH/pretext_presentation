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
      subtitle="브라우저를 속이지 않는 텍스트 레이아웃"
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
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🎯</span>
          <span>발표 핵심 아젠다</span>
        </div>
        <div className="grid-3" style={{ margin: 0 }}>
          <Card style={{ borderTop: '3px solid var(--accent)', padding: '16px' }}>
            <span className="badge accent" style={{ fontSize: '0.78rem' }}>Part 1</span>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--ink)', margin: '8px 0 10px' }}>
              렌더링 파이프라인
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <span className="badge">#3대엔진</span>
              <span className="badge">#RenderingNG</span>
              <span className="badge red">#Reflow비용</span>
            </div>
          </Card>

          <Card style={{ borderTop: '3px solid var(--red)', padding: '16px' }}>
            <span className="badge red" style={{ fontSize: '0.78rem' }}>Part 2</span>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--ink)', margin: '8px 0 10px' }}>
              Queuing &amp; Thrashing
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <span className="badge">#VSync신호</span>
              <span className="badge">#SetNeedsLayout</span>
              <span className="badge red">#강제동기레이아웃</span>
            </div>
          </Card>

          <Card style={{ borderTop: '3px solid var(--green)', padding: '16px' }}>
            <span className="badge green" style={{ fontSize: '0.78rem' }}>Part 3</span>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--ink)', margin: '8px 0 10px' }}>
              Zero-Reflow 실증 데모
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <span className="badge">#5대인터랙션</span>
              <span className="badge">#가상스크롤</span>
              <span className="badge green">#0.2µs산술</span>
            </div>
          </Card>
        </div>
      </div>

      <div style={{ marginTop: '32px', fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center' }}>
        Author: jake.ui · Based on <code>@chenglou/pretext</code>
      </div>
    </Slide>
  );
};
