import React from 'react';
import { Slide, Callout } from '../common';

interface FlowStep {
  title: string;
  desc: string;
  variant?: 'default' | 'danger' | 'success';
}

interface PipelineEngine {
  tag: string;
  tagVariant: 'accent' | 'green' | 'default';
  name: string;
  subtitle: string;
  steps: FlowStep[];
}

const PIPELINE_ENGINES: PipelineEngine[] = [
  {
    tag: 'Legacy Model',
    tagVariant: 'accent',
    name: '구형 웹킷 / 초기 Blink - Legacy WebCore',
    subtitle: 'RenderObject 가변 트리 직접 변이 (동기 렌더링 락)',
    steps: [
      { title: '① DOM & Style', desc: 'Layout Tree 구성' },
      { title: '② In-place Reflow', desc: '💥 가변 트리 순회 수정', variant: 'danger' },
      { title: '③ Paint', desc: 'CPU 비트맵 래스터' },
      { title: '④ Composite', desc: 'Z-Index 레이어 복사' },
    ],
  },
  {
    tag: 'Chromium Modern',
    tagVariant: 'green',
    name: 'RenderingNG / LayoutNG',
    subtitle: '순수 함수 모델 & 불변 PhysicalBoxFragment 생성',
    steps: [
      { title: '① DOM & Style', desc: 'Layout Tree 생성' },
      { title: '② LayoutNG', desc: '💥 불변 프래그먼트 연산', variant: 'danger' },
      { title: '③ Pre-Paint', desc: 'Property Trees 빌드' },
      { title: '④ Commit (cc)', desc: '🚀 GPU Viz 백그라운드', variant: 'success' },
    ],
  },
  {
    tag: 'WebKit Modern',
    tagVariant: 'accent',
    name: 'WebKit / LFC Engine',
    subtitle: '불변 지오메트리 캐싱 & DisplayList 직렬화',
    steps: [
      { title: '① Style Match', desc: 'CSS JIT 매칭' },
      { title: '② Layout (LFC)', desc: '💥 Formatting Context', variant: 'danger' },
      { title: '③ Paint', desc: 'DisplayList 기록' },
      { title: '④ CoreAnimation', desc: '🚀 CALayer 화면 직행', variant: 'success' },
    ],
  },
];

export const PipelineSlide: React.FC = () => {
  return (
    <Slide
      id="pipeline"
      eyebrow="Chapter 2-1 · Modern Browser Architecture"
      title="⚙️ 웹 브라우저 렌더링 파이프라인의 진화"
      subtitle="3대 엔진 파이프라인 비교와 Layout의 비용"
    >
      {/* 3대 브라우저 엔진 파이프라인 가로방향 3줄 다이어그램 */}
      <div className="pipeline-rows-stack">
        {PIPELINE_ENGINES.map((engine, idx) => (
          <div key={idx} className="pipeline-row">
            {/* 좌측: 엔진 식별 헤더 */}
            <div className="pipeline-row-header">
              <span className={`badge ${engine.tagVariant}`}>{engine.tag}</span>
              <div className="pipeline-row-title">{engine.name}</div>
              <div className="pipeline-row-desc">{engine.subtitle}</div>
            </div>

            {/* 우측: 가로 방향 4단계 다이어그램 플로우 */}
            <div className="pipeline-diagram-flow">
              {engine.steps.map((step, stepIdx) => (
                <React.Fragment key={stepIdx}>
                  <div
                    className={`pipeline-flow-node ${step.variant === 'danger'
                      ? 'highlight-danger'
                      : step.variant === 'success'
                        ? 'highlight-success'
                        : ''
                      }`}
                  >
                    <div className="node-title">{step.title}</div>
                    <div className="node-desc">{step.desc}</div>
                  </div>
                  {stepIdx < engine.steps.length - 1 && (
                    <div className="pipeline-flow-arrow">➔</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 2단 심층 분석 카드 (LayoutNG 압도적 비용 vs 스레드 분리와 Jank) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
          margin: '16px 0',
        }}
      >
        <div
          style={{
            background: 'var(--red-bg)',
            border: '1px solid var(--red-border)',
            padding: '14px 16px',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              color: 'var(--red)',
              fontWeight: 700,
              fontSize: '14px',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>💥</span>
            <span>Reflow(Layout) 연쇄 재계산 비용</span>
          </div>
          <div style={{ fontSize: '0.84rem', fontFamily: 'var(--mono)', color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600 }}>1자 변경</span> / <code>offsetHeight</code> 질의 → <span style={{ fontWeight: 600 }}>연쇄 지오메트리 재계산</span>
            <br />→ <span style={{ fontWeight: 600, color: 'var(--red)' }}>메인 스레드 독점</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span className="badge red">#C++레이아웃연산</span>
            <span className="badge red">#메인스레드독점</span>
          </div>
        </div>

        <div
          style={{
            background: 'var(--panel)',
            border: '1px solid var(--rule)',
            padding: '14px 16px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(54, 40, 23, 0.03)',
          }}
        >
          <div
            style={{
              color: 'var(--accent)',
              fontWeight: 700,
              fontSize: '14px',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⚠️</span>
            <span>스레드 분리와 화면 끊김 (Jank)</span>
          </div>
          <div style={{ fontSize: '0.84rem', fontFamily: 'var(--mono)', color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 600 }}>메인 스레드 Layout 락</span> → Compositor 커밋 정지
            <br />→ <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Frame Drop (Jank)</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span className="badge accent">#Compositor중단</span>
            <span className="badge accent">#FrameDrop(Jank)</span>
          </div>
        </div>
      </div>

      <Callout
        variant="good"
        title="💡 핵심 한계: 최신 엔진(RenderingNG / LFC)도 DOM 질의 앞에서는 무력"
        style={{ marginTop: '16px' }}
      >
        <div style={{ fontSize: '0.88rem', fontFamily: 'var(--mono)', color: 'var(--ink)' }}>
          <span style={{ fontWeight: 600 }}>DOM Read</span> → C++ <code>UpdateStyleAndLayout()</code> 강제 호출 → <span style={{ fontWeight: 600 }}>파이프라인 무력화</span>
        </div>
      </Callout>
    </Slide>
  );
};
