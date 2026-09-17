import React from 'react';
import { Slide, Card, Callout } from '../common';

export const PipelineSlide: React.FC = () => {
  return (
    <Slide
      id="pipeline"
      eyebrow="Chapter 2-1 · Modern Browser Architecture"
      title="🔍 웹 브라우저 렌더링 파이프라인의 진화"
      subtitle="크롬과 사파리는 레이아웃 비용을 줄이기 위해 수년에 걸쳐 엔진을 완전히 재설계했습니다. 하지만 Web API의 태생적 한계로 인해 여전히 강제 동기 레이아웃은 발생합니다."
    >
      <div className="grid-3">
        <Card>
          <span className="badge accent">Legacy Model</span>
          <h3 style={{ marginTop: '10px' }}>구형 웹킷/블링크</h3>
          <ol style={{ fontSize: '0.86rem', color: 'var(--muted)', paddingLeft: '18px', lineHeight: 1.65 }}>
            <li>
              <strong>RenderTree</strong>: DOM + CSSOM 결합
            </li>
            <li>
              <strong>Reflow</strong>: RenderObject 트리를 순회하며 좌표/크기를 in-place로 직접 수정
            </li>
            <li>
              <strong>Paint</strong>: 화면 버퍼에 비트맵 직접 래스터화
            </li>
            <li>
              <strong>Composite</strong>: 레이어를 GPU로 전송하여 Z-index 합성
            </li>
          </ol>
        </Card>

        <Card variant="good">
          <span className="badge green">Chromium Modern</span>
          <h3 style={{ marginTop: '10px' }}>RenderingNG / LayoutNG</h3>
          <ol style={{ fontSize: '0.86rem', color: 'var(--muted)', paddingLeft: '18px', lineHeight: 1.65 }}>
            <li>
              <strong>Style</strong>: CSS 매칭 ➔ 순수 기하학 Layout Tree 생성
            </li>
            <li>
              <strong>LayoutNG</strong>: ConstraintSpace 순수 함수 모델 ➔ 불변 <code>PhysicalBoxFragment</code> 생성
            </li>
            <li>
              <strong>Pre-Paint</strong>: Property Trees 빌드 + <code>PaintOpBuffer</code> 기록
            </li>
            <li>
              <strong>Commit</strong>: 컴포지터 스레드 백그라운드 래스터화 ➔ Viz 디스플레이
            </li>
          </ol>
        </Card>

        <Card variant="accent">
          <span className="badge accent">WebKit Modern</span>
          <h3 style={{ marginTop: '10px' }}>WebKit / LFC Engine</h3>
          <ol style={{ fontSize: '0.86rem', color: 'var(--muted)', paddingLeft: '18px', lineHeight: 1.65 }}>
            <li>
              <strong>Style</strong>: CSS JIT 매칭 ➔ RenderObject 구성
            </li>
            <li>
              <strong>Layout (LFC)</strong>: 모던 LFC 엔진 ➔ 불변 박스 모델 기반 지오메트리 캐싱
            </li>
            <li>
              <strong>Paint</strong>: DisplayList 직렬화 커맨드 기록
            </li>
            <li>
              <strong>CoreAnimation</strong>: OS 네이티브 합성기(CALayer) 화면 직행
            </li>
          </ol>
        </Card>
      </div>

      <Callout
        variant="good"
        title="💡 핵심 통찰: 최신 엔진도 왜 텍스트 높이 측정에서 무력한가?"
        style={{ marginTop: '24px' }}
      >
        RenderingNG나 LFC 엔진 모두 내부 구조를 불변(Immutable) 프래그먼트로 바꾸어 멀티스레드 페인트를
        최적화했습니다. 그러나 <strong>JavaScript에서 `offsetHeight`를 읽는 순간</strong>, C++ 레이어는
        정확한 픽셀 값을 보장하기 위해 <code>Document::UpdateStyleAndLayout()</code>을 호출하여{' '}
        <strong>모든 텍스트의 줄바꿈을 동기식으로 재계산</strong>해야만 합니다.
      </Callout>
    </Slide>
  );
};
