import React from 'react';
import { Slide, Card, Callout, CodeBlock } from '../common';

const VSYNC_FLOW = `[디스플레이 하드웨어] ➔ VSync 펄스 생성 (60Hz: 16.67ms / 120Hz: 8.33ms / 144Hz: 6.94ms)
       │
       ▼
[OS 디스플레이 서브시스템] ➔ macOS: CVDisplayLink / CoreAnimation, Windows: DWM
       │
       ▼
[Chromium GPU 프로세스 (Viz)] ➔ 프레임 마감 시한(Deadline) 계산 후 BeginFrame IPC 전송
       │
       ▼
[렌더러 컴포지터 스레드 (cc::Scheduler)] ➔ BeginImplFrame ➔ BeginMainFrame 디스패치
       │
       ▼
[렌더러 메인 스레드 (Blink)] ➔ rAF 실행 ➔ Style Recalc ➔ LayoutNG ➔ Pre-Paint ➔ Paint ➔ Commit`;

export const QueuingSlide: React.FC = () => {
  return (
    <Slide
      id="queuing"
      eyebrow="Chapter 2-2 · VSync Signal & Forced Synchronous Layout"
      title="⏱️ Layout Queuing과 VSync, 그리고 강제 플러시"
      subtitle="브라우저가 화면을 그리는 주사율 타임라인과 지연 일괄 배치(Batching)가 무너지는 순간"
    >
      <Card style={{ marginBottom: '24px' }}>
        <h3 style={{ color: 'var(--accent)', marginBottom: '8px' }}>Chromium 기준 VSync 신호 전달 흐름</h3>
        <CodeBlock code={VSYNC_FLOW} />
      </Card>

      <div className="grid-2">
        <Card variant="bad">
          <h3 style={{ color: 'var(--red)' }}>✏️ 더티 플래그 마킹 (Write)</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '12px' }}>
            호출 시 노드에 <code>SetNeedsLayout</code> 비트만 세팅하고 즉시 리턴
          </p>
          <table style={{ fontSize: '0.8rem', width: '100%' }}>
            <thead>
              <tr>
                <th>분류</th>
                <th>대상 Web API</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>스타일 변경</td>
                <td>
                  <code>style.width</code>, <code>style.height</code>, <code>style.padding</code>
                </td>
              </tr>
              <tr>
                <td>폰트 속성</td>
                <td>
                  <code>style.fontSize</code>, <code>fontFamily</code>, <code>lineHeight</code>
                </td>
              </tr>
              <tr>
                <td>클래스/속성</td>
                <td>
                  <code>className</code>, <code>classList.add()</code>, <code>setAttribute()</code>
                </td>
              </tr>
              <tr>
                <td>DOM 트리 조작</td>
                <td>
                  <code>appendChild()</code>, <code>remove()</code>, <code>textContent = ...</code>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        <Card variant="bad">
          <h3 style={{ color: 'var(--red)' }}>👀 레이아웃 트리거 (Read / 강제 플러시)</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '12px' }}>
            호출 시 VSync를 무시하고 C++ UpdateStyleAndLayout() 강제 동기 호출
          </p>
          <table style={{ fontSize: '0.8rem', width: '100%' }}>
            <thead>
              <tr>
                <th>분류</th>
                <th>대상 Web API</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>박스 오프셋</td>
                <td>
                  <code>offsetHeight</code>, <code>offsetWidth</code>, <code>offsetTop</code>
                </td>
              </tr>
              <tr>
                <td>클라이언트 영역</td>
                <td>
                  <code>clientHeight</code>, <code>clientWidth</code>, <code>clientTop</code>
                </td>
              </tr>
              <tr>
                <td>스크롤 영역</td>
                <td>
                  <code>scrollHeight</code>, <code>scrollWidth</code>, <code>scrollTop</code>
                </td>
              </tr>
              <tr>
                <td>지오메트리</td>
                <td>
                  <code>getBoundingClientRect()</code>, <code>getComputedStyle()</code>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>

      <Callout
        variant="good"
        title="💡 왜 canvas.measureText()는 Reflow를 일으키지 않는가?"
        style={{ marginTop: '20px' }}
      >
        <code>offsetHeight</code>는 DOM Tree와 CSSOM이 결합된 브라우저의 <strong>Layout Tree</strong>를 참조합니다.
        반면 <code>canvas.measureText()</code>는 Layout Tree를 완전히 우회하여 OS 네이티브 폰트 셰이핑 엔진(HarfBuzz / CoreText)에
        직접 <em>"이 폰트와 텍스트의 글리프 너비가 얼마인가?"</em>만 묻습니다. DOM이 더럽혀지지 않으므로 리플로우가 0회입니다.
      </Callout>
    </Slide>
  );
};
