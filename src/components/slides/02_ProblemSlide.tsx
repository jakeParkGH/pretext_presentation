import React from 'react';
import { Slide, VsBlock, Callout } from '../common';

export const ProblemSlide: React.FC = () => {
  return (
    <Slide
      id="problem"
      eyebrow="Chapter 1-3 · Problem Analysis"
      title="🚨 문제: 브라우저 리플로우의 치명적 비용"
      subtitle="텍스트 높이나 줄바꿈 위치를 알아내기 위해 관습적으로 호출하던 DOM 측정 API들은 브라우저의 렌더링 최적화를 완전히 파괴합니다."
    >
      <VsBlock
        badTitle="❌ 전통적인 DOM 접근 방식"
        badContent={
          <>
            <ul style={{ fontSize: '0.9rem', paddingLeft: '20px', marginTop: '12px', color: 'var(--ink)' }}>
              <li>
                <code>element.offsetHeight</code> / <code>offsetWidth</code>
              </li>
              <li>
                <code>element.getBoundingClientRect()</code>
              </li>
              <li>
                <code>element.scrollHeight</code> / <code>scrollTop</code>
              </li>
              <li>
                <code>window.getComputedStyle(element)</code>
              </li>
            </ul>
            <div style={{ fontSize: '0.85rem', marginTop: '16px', color: 'var(--red)', fontWeight: 500 }}>
              ➔ 브라우저 VSync 턴을 기다리지 못하고 즉시 동기 레이아웃 강제 실행
              <br />
              ➔ 루프 안에서 반복 호출 시 <strong style={{ color: 'var(--red)' }}>Layout Thrashing(연쇄 폭발)</strong>
            </div>
          </>
        }
        goodTitle="✅ Pretext 순수 산술 방식"
        goodContent={
          <>
            <ul style={{ fontSize: '0.9rem', paddingLeft: '20px', marginTop: '12px', color: 'var(--ink)' }}>
              <li>
                <code>canvas.measureText()</code> (Cold Path 1회만 캐싱)
              </li>
              <li>결과를 Typed Array(Float64Array) 메모리에 적재</li>
              <li>
                이후 모든 리사이즈·애니메이션은 <em>100% 순수 산술 연산</em>
              </li>
              <li>DOM 접근 0회 · Canvas 재호출 0회</li>
            </ul>
            <div style={{ fontSize: '0.85rem', marginTop: '16px', color: 'var(--green)', fontWeight: 600 }}>
              ➔ <strong style={{ color: 'var(--green)' }}>DOM Reflow 0회 완벽 보장</strong>
              <br />
              ➔ 프레임당 약 0.0002ms (0.2µs) 연산으로 120Hz 무감속 방어
            </div>
          </>
        }
      />

      <Callout
        variant="warn"
        title="💥 Layout Thrashing (레이아웃 스래싱)이란?"
        style={{ marginTop: '20px' }}
      >
        JavaScript 코드가 <code>DOM 수정 (Write) ➔ 기하 수치 조회 (Read) ➔ DOM 수정 (Write)</code>을 반복할 때,
        브라우저는 매 회차마다 대기열을 강제로 플러시하고 레이아웃 트리를 통째로 다시 계산합니다. 요소 N개를 순회하면
        1프레임(16.6ms) 안에서 <strong>O(N)번의 C++ 레이아웃 재계산</strong>이 동기 실행되어 메인 스레드가 완전히
        멈춥니다.
      </Callout>
    </Slide>
  );
};
