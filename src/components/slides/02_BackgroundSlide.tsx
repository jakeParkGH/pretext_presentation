import React from 'react';
import { Slide, Card, Callout } from '../common';

export const BackgroundSlide: React.FC = () => {
  return (
    <Slide
      id="background"
      eyebrow="Chapter 1-2 · Origin & Motivation"
      title="💡 pretext 라이브러리의 탄생 배경"
      subtitle="미드저니(Midjourney) 웹 플랫폼의 극한 성능 요구와 리액트 코어 개발자들의 고민에서 출발한 혁신"
    >
      {/* 배경 개요 카드 */}
      <Card style={{ borderLeft: '4px solid var(--accent)', marginBottom: '24px' }}>
        <p style={{ fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
          올해 초 오픈소스로 공개되며 프론트엔드 생태계의 큰 주목을 받은 <strong>pretext</strong>는 단순한 화면 연출용 애니메이션 도구가 아니었습니다.{' '}
          <strong>미드저니(Midjourney)</strong> 웹 엔지니어링 팀에서 <strong>수만 개의 생성형 AI 이미지 피드 무한스크롤</strong>과{' '}
          <strong>실시간 프롬프트 토큰 입력기</strong>에서 마주한 극한의 렌더링 병목을 해결하기 위해 개발되었습니다.
          <br />
          <span style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: '10px', display: 'inline-block' }}>
            ※ React 코어 개발자 <strong>Sebastian Markbåge</strong>의 텍스트 레이아웃 연구(text-layout)를 바탕으로,{' '}
            ReasonML 창시자이자 미드저니 웹 플랫폼을 이끈 <strong>Cheng Lou</strong>가 프로덕션 레벨로 설계했습니다.
          </span>
        </p>
      </Card>

      {/* 2대 핵심 문제 인식 그리드 */}
      <div className="grid-2" style={{ margin: '16px 0 24px' }}>
        <Card variant="bad">
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>💥</div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--red)' }}>
            수만 개 가변 프롬프트 피드의 한계
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
            이미지마다 수십~수백 자의 프롬프트가 동반되어 카드 높이가 제각각입니다.{' '}
            기존 가상 스크롤(Virtual Scroll)은 항목을 화면 밖 DOM에 임시 렌더링한 뒤 <code>scrollHeight</code>나 <code>getBoundingClientRect()</code>를
            역측정해야만 했고, 이로 인해 치명적인 <strong style={{ color: 'var(--red)' }}>Layout Thrashing</strong>과{' '}
            <strong>스크롤 점프(Scroll Jump)</strong> 현상이 불가피했습니다.
          </p>
        </Card>

        <Card variant="bad">
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⌨️</div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--red)' }}>
            실시간 타이핑 & 반응형 리사이즈 병목
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
            프롬프트 생성기에서 사용자가 단어를 입력하거나 브라우저 너비를 조절할 때마다 카드의 줄바꿈과 높이가 실시간으로 재계산되어야 합니다.{' '}
            매 키 입력·리사이즈마다 C++ 브라우저 레이아웃 트리가 동기 재계산되면서 메인 스레드가 멈추고 심각한 프레임 드랍(Jank)이 발생했습니다.
          </p>
        </Card>
      </div>

      <Callout variant="warn" title="⚠️ 당시 웹 프론트엔드 기술의 구조적 한계">
        기존의 그 어떤 가상화 라이브러리(react-window, virtual-core 등)도 <strong>'DOM을 먼저 마운트하고 역측정한다'</strong>는
        브라우저 기본 패러다임을 벗어나지 못했습니다. 텍스트 지오메트리를 알아내기 위해 필연적으로 DOM을 건드릴 수밖에 없던 이 구조가
        웹 텍스트 렌더링 성능의 절대적 병목이었습니다.
      </Callout>
    </Slide>
  );
};
