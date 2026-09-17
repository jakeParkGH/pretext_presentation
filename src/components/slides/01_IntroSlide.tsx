import React from 'react';
import { Slide, Card } from '../common';

export const IntroSlide: React.FC = () => {
  return (
    <Slide
      id="cover"
      eyebrow="Interactive Presentation · Browser Rendering Deep-Dive"
      title={
        <h1>
          Pretext 내부 구조와<br />Zero-Reflow 텍스트 레이아웃
        </h1>
      }
      subtitle={
        <>
          브라우저의 <strong>강제 동기 레이아웃(Forced Synchronous Layout)</strong>을 원천 차단하고,
          순수 자바스크립트 산술 연산만으로 텍스트 높이·줄바꿈을 마이크로초(µs) 단위에 계산하는 패러다임 분석
        </>
      }
    >
      {/* 2-Phase Flow Diagram */}
      <div className="flow">
        <div className="flow-box cold">
          prepare()
          <small>Cold Path · 1회 측정</small>
        </div>
        <span className="flow-arrow">➔</span>
        <div className="flow-box" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
          PreparedText
          <small>Opaque Handle (Typed Array)</small>
        </div>
        <span className="flow-arrow">➔</span>
        <div className="flow-box hot">
          layout()
          <small>Hot Path · ∞회 순수 산술</small>
        </div>
        <span className="flow-arrow">➔</span>
        <div className="flow-box" style={{ borderColor: 'var(--green)', color: 'var(--green)' }}>
          {'{ height, lineCount }'}
          <small>Zero DOM Reflow (0.2µs)</small>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '28px' }}>
        <Card>
          <h3>💡 pretext 라이브러리의 탄생 배경</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--muted)' }}>
            올해 초 주목받았던 라이브러리인 <strong>pretext</strong>는 단순한 화면 연출용 애니메이션 라이브러리가 아니었습니다.{' '}
            <strong>pretext</strong>는 <strong>미드저니(Midjourney)</strong> 플랫폼 웹 엔지니어링 팀에서 피드 형태의 무한스크롤 및 토큰 입력 시 맞닿은 레이아웃 크기가 실시간으로 변하는 화면의 렌더링 병목을 해결하기 위해 개발되었습니다.
          </p>
        </Card>
        <Card>
          <h3>🎯 이 발표에서 다루는 주제</h3>
          <ul style={{ fontSize: '0.92rem', color: 'var(--muted)', paddingLeft: '20px', lineHeight: 1.7 }}>
            <li>웹 브라우저 렌더링 파이프라인 돌아보기</li>
            <li>Layout Queuing, VSync 신호 흐름과 Layout Thrashing의 실체</li>
            <li>5가지 데모로 확인하는 pretext 효능</li>
          </ul>
        </Card>
      </div>

      <div style={{ marginTop: '32px', fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center' }}>
        Author: jake.ui · Based on <code>@chenglou/pretext</code>
      </div>
    </Slide>
  );
};
