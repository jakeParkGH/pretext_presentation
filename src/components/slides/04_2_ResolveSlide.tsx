import React from 'react';
import { Slide, Card, Callout } from '../common';

export const ResolveSlide: React.FC = () => {
  return (
    <Slide
      id="resolve"
      eyebrow="Chapter 2-3 · Solution & Core Engine"
      title="💡 해결: Zero-DOM 산술 레이아웃과 2-Phase 엔진"
      subtitle="브라우저 텍스트 포맷팅 규칙을 자바스크립트로 이식하여 DOM 리플로우를 원천 차단하고 마이크로초 단위 연산을 실현"
    >
      {/* 1. 상단: Zero-DOM 산술 레이아웃 패러다임 */}
      <Card style={{ borderLeft: '4px solid var(--green)', marginBottom: '20px' }}>
        <h3 style={{ color: 'var(--green)', fontSize: '1.15rem', marginBottom: '8px' }}>
          ⚡ Zero-DOM 산술 레이아웃 패러다임
        </h3>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
          <em>"텍스트 높이와 줄바꿈을 굳이 매번 무거운 브라우저 C++ DOM 렌더러에 물어봐야 하는가?"</em>
          <br />
          브라우저의 텍스트 줄바꿈 명세(유니코드 UAX #14, CSS <code>white-space: normal</code>)를 순수 자바스크립트 엔진으로 이식하여,{' '}
          <strong>너비 비의존적인 1회 측정 캐싱(prepare)</strong>과 <strong>너비 의존적인 초고속 산술 연산(layout)</strong>으로
          역할을 엄격히 분리했습니다. DOM을 전혀 건드리지 않고 텍스트 높이를 마이크로초 단위에 예측합니다.
        </p>
      </Card>

      {/* 2. 중단: 핵심 엔진 prepare() & layout() 카드 + 키워드 소개 */}
      <div className="grid-2" style={{ margin: '16px 0 20px' }}>
        {/* prepare() 카드 */}
        <Card style={{ background: '#fff', borderTop: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--accent)', margin: 0 }}>
              <code>prepare()</code>
            </h3>
            <span className="badge accent">Phase 1 · Cold Path</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0 14px' }}>
            <span className="badge accent">#ColdPath</span>
            <span className="badge accent">#1회측정</span>
            <span className="badge accent">#OffscreenCanvas</span>
            <span className="badge accent">#IntlSegmenter</span>
            <span className="badge accent">#2단계캐싱</span>
            <span className="badge accent">#너비비의존적</span>
          </div>

          <ul style={{ fontSize: '0.88rem', color: 'var(--ink)', paddingLeft: '18px', lineHeight: 1.75, margin: 0 }}>
            <li>
              <strong>텍스트 분석 & 정규화</strong>: CSS <code>white-space</code> 명세 충실 구현 (공백 병합 및 개행 처리)
            </li>
            <li>
              <strong>유니코드 세그멘테이션</strong>: <code>Intl.Segmenter</code> & UAX #14 기반 단어·구두점 단위 분절
            </li>
            <li>
              <strong>1x1 OffscreenCanvas 측정</strong>: DOM 노드 생성 없이 메모리 상에서 폰트 메트릭 측정
            </li>
            <li>
              <strong>불투명 핸들 반환</strong>: 전역 캐시를 거쳐 병렬 배열(너비·종류)을 담은 <code>PreparedText</code> 생성
            </li>
          </ul>
        </Card>

        {/* layout() 카드 */}
        <Card style={{ background: '#fff', borderTop: '4px solid var(--green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--green)', margin: 0 }}>
              <code>layout()</code>
            </h3>
            <span className="badge green">Phase 2 · Hot Path</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0 14px' }}>
            <span className="badge green">#HotPath</span>
            <span className="badge green">#순수산술연산</span>
            <span className="badge green">#0.2µs(0.0002ms)</span>
            <span className="badge green">#ZeroReflow</span>
            <span className="badge green">#0Canvas</span>
            <span className="badge green">#0DOM</span>
          </div>

          <ul style={{ fontSize: '0.88rem', color: 'var(--ink)', paddingLeft: '18px', lineHeight: 1.75, margin: 0 }}>
            <li>
              <strong>DOM & Canvas 0회 보장</strong>: 렌더링 파이프라인 정체(Reflow)를 100% 원천 차단
            </li>
            <li>
              <strong>초고속 라인 워커</strong>: 가변 <code>maxWidth</code>에서 <code>widths</code> 배열의 단순 산술 합산 (<code>lineW += w</code>)
            </li>
            <li>
              <strong>CSS 명세 에뮬레이션</strong>: 후행 공백(Trailing Space) 매달림 및 단어 오버플로 분절 처리
            </li>
            <li>
              <strong>즉시 높이 산출</strong>: <code>{'{ lineCount, height }'}</code>를 단 1회의 곱셈으로 0.2µs 내에 반환
            </li>
          </ul>
        </Card>
      </div>

      {/* 3. 하단: 🎯 핵심 성과 Callout */}
      <Callout variant="good" title="🎯 핵심 성과 (Midjourney 프로덕션 실증)">
        미드저니 웹 피드는 이 아키텍처를 도입하여 수만 개의 가변 높이 피드 카드가 실시간으로 스크롤·리사이즈되는 환경에서도,
        DOM 레이아웃 계산을 <strong>0회로 원천 차단</strong>하여 <strong>120Hz 고주사율 디스플레이에서 완벽한 무감속 60~120fps</strong>를 달성했습니다.
      </Callout>
    </Slide>
  );
};
