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
      <Card style={{ borderLeft: '4px solid var(--accent)', marginBottom: '20px' }}>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
          올해 초 오픈소스로 공개되며 프론트엔드 생태계의 큰 주목을 받은 <strong>pretext</strong>는 단순한 화면 연출용 애니메이션 도구가 아니었습니다.{' '}
          <strong>미드저니(Midjourney)</strong> 웹 엔지니어링 팀에서 <strong>수만 개의 생성형 AI 이미지 피드 무한스크롤</strong>과{' '}
          <strong>실시간 프롬프트 토큰 입력기</strong>에서 발생하는 극심한 렌더링 병목을 해결하기 위해 개발되었습니다.
          <br />
          <span style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: '8px', display: 'inline-block' }}>
            ※ React 코어 개발자 <strong>Sebastian Markbåge</strong>의 텍스트 레이아웃 연구(text-layout)를 바탕으로,{' '}
            ReasonML 창시자이자 미드저니 웹 플랫폼을 이끈 <strong>Cheng Lou</strong>가 프로덕션 레벨로 설계했습니다.
          </span>
        </p>
      </Card>

      {/* 3대 핵심 문제 및 돌파구 그리드 */}
      <div className="grid-3" style={{ margin: '16px 0 20px' }}>
        <Card>
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>💥</div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>수만 개 가변 프롬프트 피드</h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
            이미지마다 수십~수백 글자의 프롬프트가 동반되어 카드 높이가 제각각입니다. 기존 가상 스크롤(Virtual Scroll)은
            항목을 화면 밖 DOM에 임시 렌더링한 뒤 <code>scrollHeight</code>를 역측정해야 했고, 이는 치명적인{' '}
            <strong style={{ color: 'var(--red)' }}>Layout Thrashing</strong>과 <strong>스크롤 점프(Scroll Jump)</strong>를 유발했습니다.
          </p>
        </Card>

        <Card>
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⌨️</div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>실시간 타이핑 & 동적 리사이즈</h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
            프롬프트 생성기에서 사용자가 단어를 입력하거나 브라우저 너비를 조절할 때마다 카드 높이가 실시간으로 변화합니다.
            매 키 입력·리사이즈마다 발생하는 브라우저 C++ 레이아웃 트리 연쇄 재계산으로 인해 메인 스레드가 멈추고 반응성이 저하되었습니다.
          </p>
        </Card>

        <Card style={{ borderLeft: '3px solid var(--green)' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>⚡</div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', color: 'var(--green)' }}>Zero-DOM 산술 레이아웃</h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
            <em>"텍스트 높이를 굳이 무거운 DOM 렌더러에 물어봐야 하는가?"</em><br />
            브라우저의 텍스트 줄바꿈 규칙(UAX #14, CSS white-space)을 순수 JS 엔진으로 이식하여,{' '}
            <strong>1회 측정 캐싱(prepare)</strong> 후 <strong>순수 산술 연산(layout, 0.2µs)</strong>으로 완벽한 Zero-Reflow를 실현했습니다.
          </p>
        </Card>
      </div>

      <Callout variant="good" title="🎯 핵심 성과">
        미드저니 웹 피드는 이 아키텍처를 통해 수천 개의 가변 높이 피드 카드가 실시간으로 스크롤되는 환경에서도,
        DOM 레이아웃 계산을 <strong>0회로 원천 차단</strong>하여 <strong>120Hz 고주사율 디스플레이에서 완벽한 무감속 60~120fps</strong>를 달성했습니다.
      </Callout>
    </Slide>
  );
};
