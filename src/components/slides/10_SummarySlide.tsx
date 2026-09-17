import React from 'react';
import { Slide, Card } from '../common';

export const SummarySlide: React.FC = () => {
  return (
    <Slide
      id="summary"
      eyebrow="Chapter 4 · Key Takeaways"
      title="4. 정리: Pretext가 제시하는 새로운 패러다임"
      subtitle="브라우저 렌더링 병목을 극복하고 초당 120프레임의 부드러운 반응성을 달성하는 4가지 원칙"
    >
      <div className="grid-2">
        <Card variant="good">
          <span className="badge green">원칙 1</span>
          <h3 style={{ marginTop: '8px' }}>DOM에 기하학적 수치를 묻지 마라</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
            <code>offsetHeight</code>, <code>scrollHeight</code> 등의 조회를 코드에서 완전히 제거하세요.
            수치를 묻는 순간 브라우저는 큐에 대기 중이던 렌더링 작업을 동기식으로 플러시하며 메인 스레드를 멈춥니다.
          </p>
        </Card>

        <Card variant="good">
          <span className="badge green">원칙 2</span>
          <h3 style={{ marginTop: '8px' }}>2-Phase 분리 (Cold vs Hot Path)</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
            무거운 문자열 분절과 캔버스 폰트 측정은 텍스트가 바뀔 때 <code>prepare()</code>로 1회만 수행하세요.
            이후 윈도우 리사이즈, 아코디언, 무한 스크롤에서는 순수 숫자 덧셈인 <code>layout()</code>만 반복 호출합니다.
          </p>
        </Card>

        <Card variant="good">
          <span className="badge green">원칙 3</span>
          <h3 style={{ marginTop: '8px' }}>가상 스크롤 10만 개 정밀 높이 주입</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
            가상화 라이브러리에 대충 추정값을 넣고 <code>measureElement</code>로 보정하지 마세요.
            Pretext로 1px 오차 없는 높이 배열을 사전 주입하면 10만 개 격자에서도 스크롤 중 리플로우 0회와 60fps가 완성됩니다.
          </p>
        </Card>

        <Card variant="good">
          <span className="badge green">원칙 4</span>
          <h3 style={{ marginTop: '8px' }}>GPU 합성 레이어 직행</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
            <code>top: Ypx</code> 대신 <code>transform: translate3d(x, y, 0)</code>를 사용하세요.
            메인 스레드의 Layout/Paint 단계를 완전히 건너뛰고 컴포지터 스레드와 GPU가 화면 합성을 전담합니다.
          </p>
        </Card>
      </div>
    </Slide>
  );
};
