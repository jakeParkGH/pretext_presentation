import React from 'react';
import { Slide, Card, Callout } from '../common';

export const ResolveSlide: React.FC = () => {
  return (
    <Slide
      id="resolve"
      eyebrow="Chapter 2-3 · Solution & Core Engine"
      title="💡 해결: Zero-DOM 산술 레이아웃과 2-Phase 엔진"
    >
      {/* 1. 상단: 3대 핵심 성과 메트릭 바 */}
      <Card style={{ borderLeft: '4px solid var(--green)', marginBottom: '18px', padding: '18px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
          <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--green-border)' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--mono)' }}>0 Reflow</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>DOM 리플로우 100% 차단</div>
          </div>
          <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--green-border)' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--mono)' }}>0.2µs / block</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>0.0002ms 순수 산술 연산</div>
          </div>
          <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--green-border)' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--mono)' }}>120Hz Lock</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>무한 스크롤 무감속 방어</div>
          </div>
        </div>
        <div style={{ marginTop: '12px', fontSize: '0.88rem', color: 'var(--muted)', textAlign: 'center' }}>
          💡 <strong>발상의 전환</strong>: TFC 규칙 JS 이식 → 사전 측정 + 초고속 산술
        </div>
      </Card>

      {/* 2. 중단: 핵심 엔진 prepare() & layout() 카드 + 키워드 소개 */}
      <div className="grid-2" style={{ margin: '14px 0 18px' }}>
        {/* prepare() 카드 */}
        <Card style={{ background: '#fff', borderTop: '4px solid var(--accent)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--accent)', margin: 0 }}>
              <code>prepare()</code>
            </h3>
            <span className="badge accent">Phase 1 · Cold Path</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0 12px' }}>
            <span className="badge accent">#ColdPath</span>
            <span className="badge accent">#1회측정</span>
            <span className="badge accent">#OffscreenCanvas</span>
            <span className="badge accent">#IntlSegmenter</span>
            <span className="badge accent">#2단계캐싱</span>
            <span className="badge accent">#너비비의존적</span>
          </div>

          <div style={{ fontSize: '0.86rem', fontFamily: 'var(--mono)', color: 'var(--ink)', lineHeight: 1.6 }}>
            <div>① <strong>정규화</strong>: white-space 공백 병합</div>
            <div>② <strong>분절</strong>: Intl.Segmenter · UAX #14</div>
            <div>③ <strong>측정</strong>: OffscreenCanvas 메모리 측정</div>
            <div>④ <strong>적재</strong>: PreparedText 반환</div>
          </div>
        </Card>

        {/* layout() 카드 */}
        <Card style={{ background: '#fff', borderTop: '4px solid var(--green)', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--green)', margin: 0 }}>
              <code>layout()</code>
            </h3>
            <span className="badge green">Phase 2 · Hot Path</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0 12px' }}>
            <span className="badge green">#HotPath</span>
            <span className="badge green">#순수산술연산</span>
            <span className="badge green">#0.2µs(0.0002ms)</span>
            <span className="badge green">#ZeroReflow</span>
            <span className="badge green">#0Canvas</span>
            <span className="badge green">#0DOM</span>
          </div>

          <div style={{ fontSize: '0.86rem', fontFamily: 'var(--mono)', color: 'var(--ink)', lineHeight: 1.6 }}>
            <div>① <strong>Zero-DOM</strong>: Reflow 0회</div>
            <div>② <strong>산술 합산</strong>: lineW += w 누적</div>
            <div>③ <strong>스펙 충실</strong>: Trailing WS · Grapheme</div>
            <div>④ <strong>즉시 반환</strong>: {'{ lineCount, height }'} 0.2µs</div>
          </div>
        </Card>
      </div>

      {/* 3. 하단: 🎯 핵심 성과 Callout */}
      <Callout variant="good" title="🎯 핵심 성과 (Midjourney 프로덕션 실증)">
        <div style={{ fontSize: '0.88rem', fontFamily: 'var(--mono)', color: 'var(--ink)' }}>
          수만 개 가변 높이 피드 → DOM 레이아웃 0회 → 120fps 무감속
        </div>
      </Callout>
    </Slide>
  );
};
