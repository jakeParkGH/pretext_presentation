import React from 'react';
import { Slide, Card } from '../common';

export const SummarySlide: React.FC = () => {
  return (
    <Slide
      id="summary"
      eyebrow="Chapter 4 · Key Takeaways"
      title="4. 정리: Pretext가 제시하는 새로운 패러다임"
      subtitle="4가지 핵심 원칙"
    >
      <div className="grid-2">
        <Card variant="good">
          <span className="badge green">원칙 1</span>
          <h3 style={{ marginTop: '8px' }}>DOM에 기하학적 수치를 묻지 마라</h3>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            <code>offsetHeight</code>
            <code>scrollHeight</code>
            <span className="badge red">#Reflow트리거</span>
          </div>
        </Card>

        <Card variant="good">
          <span className="badge green">원칙 2</span>
          <h3 style={{ marginTop: '8px' }}>2-Phase 분리 (Cold vs Hot Path)</h3>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            <code>prepare()</code>
            <code>layout()</code>
            <span className="badge accent">#Cold/Hot분리</span>
          </div>
        </Card>

        <Card variant="good">
          <span className="badge green">원칙 3</span>
          <h3 style={{ marginTop: '8px' }}>가상 스크롤 10만 개 정밀 높이 주입</h3>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            <code>layout()</code>
            <span className="badge green">#Reflow0회</span>
            <span className="badge green">#60fps</span>
          </div>
        </Card>

        <Card variant="good">
          <span className="badge green">원칙 4</span>
          <h3 style={{ marginTop: '8px' }}>GPU 합성 레이어 직행</h3>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            <code>transform: translate3d()</code>
            <span className="badge green">#Compositor직행</span>
          </div>
        </Card>
      </div>
    </Slide>
  );
};
