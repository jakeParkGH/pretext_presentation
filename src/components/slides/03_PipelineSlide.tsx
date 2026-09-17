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
    name: '구형 Webkit / 구형 WebCore / 초기 Blink',
    subtitle: 'RenderObject 가변 트리 직접 변이 (동기 렌더링 락)',
    steps: [
      { title: '① DOM & Style', desc: 'RenderTree 생성 (DOM + CSSOM)' },
      { title: '② Layout(Reflow)', desc: '💥 RenderObject 좌표·크기 직접 수정', variant: 'danger' },
      { title: '③ Paint', desc: 'CPU 비트맵 직접 래스터화' },
      { title: '④ Composite', desc: 'GPU 전송 및 Z-Order 레이어 합성' },
    ],
  },
  {
    tag: 'Chromium Modern',
    tagVariant: 'green',
    name: 'RenderingNG / LayoutNG',
    subtitle: '순수 함수 모델 & 불변 PhysicalBoxFragment 생성',
    steps: [
      { title: '① Style', desc: 'ComputedStyle 매칭 & Layout Tree 구성' },
      { title: '② LayoutNG', desc: '💥 ConstraintSpace ➔ 불변 Fragment 연산', variant: 'danger' },
      { title: '③ Pre-Paint & Paint', desc: 'Property Trees 빌드 & PaintOp 기록' },
      { title: '④ Commit & Composite', desc: '🚀 Viz 디스플레이 백그라운드 출력', variant: 'success' },
    ],
  },
  {
    tag: 'WebKit Modern',
    tagVariant: 'accent',
    name: 'WebKit / Modern LFC',
    subtitle: '독립 포매팅 컨텍스트 & 지오메트리 분리 캐싱',
    steps: [
      { title: '① Style', desc: 'CSS JIT 매칭 & RenderObject 확정' },
      { title: '② Layout (LFC)', desc: '💥 포매팅 컨텍스트별 분리 연산 (BFC/IFC)', variant: 'danger' },
      { title: '③ Geometry & Paint', desc: '레이어 변형 매핑 & DisplayList 기록' },
      { title: '④ CA Commit', desc: '🚀 OS CoreAnimation(CALayer) 화면 출력', variant: 'success' },
    ],
  },
];

export const PipelineSlide: React.FC = () => {
  return (
    <Slide
      id="pipeline"
      eyebrow="Modern Browser Architecture"
      title="4. 웹 브라우저 렌더링 파이프라인"
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

      <p style={{ fontSize: '0.98rem', lineHeight: 1.75, color: 'var(--ink)', margin: 0 }}>
        👉🏻 Layout: 화면에 표시될 요소들의 기하학적 정보(크기: Width·Height, 위치: X·Y 좌표)를 계산해서 확정하는건 변하지 않고 동일
      </p>
    </Slide>
  );
};
