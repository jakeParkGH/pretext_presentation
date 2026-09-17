import React from 'react';
import { Slide, Card, Callout } from '../common';

export const BackgroundSlide: React.FC = () => {
  return (
    <Slide
      id="background"
      eyebrow="Chapter 1-2 · Origin & Motivation"
      title="💡 pretext 라이브러리의 탄생 배경"
      subtitle="Midjourney · Cheng Lou · React Core"
    >
      {/* 1. 개발 주체 & 미션 요약 바 */}
      <Card style={{ borderLeft: '4px solid var(--accent)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge accent">Platform</span>
            <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>Midjourney Web</strong>
            <span style={{ color: 'var(--rule)' }}>|</span>
            <span className="badge">Author</span>
            <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Cheng Lou (React Core)</span>
            <span style={{ color: 'var(--rule)' }}>|</span>
            <span className="badge">Research</span>
            <span style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>Sebastian Markbåge</span>
          </div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.92rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🎯</span>
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>수만 개 AI 이미지 피드 → 렌더링 병목 해소</span>
        </div>
      </Card>

      {/* 2. 문제 인식 2대 축 (흐름도 중심) */}
      <div className="grid-2" style={{ margin: '16px 0 20px' }}>
        {/* 문제 A */}
        <Card variant="bad">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.08rem', color: 'var(--red)', margin: 0 }}>
              💥 가변 높이 피드 (무한 스크롤)
            </h3>
            <span className="badge red">DOM 역측정 병목</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', margin: '10px 0' }}>
            <div style={{ width: '100%', maxWidth: '240px', textAlign: 'center', background: '#fff', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--red-border)', fontSize: '0.84rem', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>
              가변 프롬프트 텍스트
            </div>
            <span style={{ color: 'var(--red)', fontSize: '0.9rem' }}>↓</span>
            <div style={{ width: '100%', maxWidth: '240px', textAlign: 'center', background: '#fff', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--red-border)', fontSize: '0.84rem', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>
              화면 밖 DOM 마운트
            </div>
            <span style={{ color: 'var(--red)', fontSize: '0.9rem' }}>↓</span>
            <div style={{ width: '100%', maxWidth: '240px', textAlign: 'center', background: '#fff', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--red-border)', fontSize: '0.84rem', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>
              scrollHeight 역측정
            </div>
            <span style={{ color: 'var(--red)', fontSize: '0.9rem' }}>↓</span>
            <div style={{ width: '100%', maxWidth: '240px', textAlign: 'center', background: 'var(--red-bg)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--red-border)', fontSize: '0.84rem', fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--red)' }}>
              Layout Thrashing
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span className="badge red">#LayoutThrashing</span>
            <span className="badge red">#ScrollJump(덜컹거림)</span>
            <span className="badge red">#FPS급락</span>
          </div>
        </Card>

        {/* 문제 B */}
        <Card variant="bad">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.08rem', color: 'var(--red)', margin: 0 }}>
              ⌨️ 실시간 인터랙션 (타이핑 & 리사이즈)
            </h3>
            <span className="badge red">메인 스레드 락</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', margin: '10px 0' }}>
            <div style={{ width: '100%', maxWidth: '240px', textAlign: 'center', background: '#fff', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--red-border)', fontSize: '0.84rem', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>
              키 입력 / 리사이즈
            </div>
            <span style={{ color: 'var(--red)', fontSize: '0.9rem' }}>↓</span>
            <div style={{ width: '100%', maxWidth: '240px', textAlign: 'center', background: '#fff', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--red-border)', fontSize: '0.84rem', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>
              C++ Layout Tree 재계산
            </div>
            <span style={{ color: 'var(--red)', fontSize: '0.9rem' }}>↓</span>
            <div style={{ width: '100%', maxWidth: '240px', textAlign: 'center', background: '#fff', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--red-border)', fontSize: '0.84rem', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>
              메인 스레드 100%
            </div>
            <span style={{ color: 'var(--red)', fontSize: '0.9rem' }}>↓</span>
            <div style={{ width: '100%', maxWidth: '240px', textAlign: 'center', background: 'var(--red-bg)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--red-border)', fontSize: '0.84rem', fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--red)' }}>
              입력 지연 (Jank)
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <span className="badge red">#MainThreadLock</span>
            <span className="badge red">#InputJank</span>
            <span className="badge red">#C++재계산비용</span>
          </div>
        </Card>
      </div>

      {/* 3. 한계점 요약 */}
      <Callout variant="warn">
        <div style={{ fontSize: '0.88rem', fontFamily: 'var(--mono)', color: 'var(--ink)', fontWeight: 600 }}>
          ⚠️ 구조적 한계: DOM 선마운트 → 후역측정 패러다임
        </div>
      </Callout>
    </Slide>
  );
};
