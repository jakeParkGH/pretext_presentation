import React, { useState, useEffect } from 'react';
import { Slide, Card } from '../common';
import md01 from '../../assets/md01.png';
import md02 from '../../assets/md02.png';

interface ModalMedia {
  src: string;
  title: string;
  desc: string;
}

export const ProblemSlide: React.FC = () => {
  const [modalMedia, setModalMedia] = useState<ModalMedia | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalMedia(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Slide
      id="problem"
      eyebrow="Problem Analysis"
      title="3. 미드저니(Midjourney) 플랫폼에서 발견한 문제"
    >
      {/* 1. 2대 핵심 문제 인식 그리드 */}
      <div className="grid-2" style={{ margin: '0 0 20px' }}>
        <Card variant="bad" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.3rem' }}>💥</span>
            <h3 style={{ fontSize: '1.02rem', margin: 0, color: 'var(--red)' }}>
              수만 개 가변 프롬프트 피드의 한계
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
            이미지마다 수십~수백 자의 프롬프트가 동반되어 카드 높이가 제각각인데{' '}
            기존 가상 스크롤(Virtual Scroll)은 항목을 화면 밖 DOM에 임시 렌더링한 뒤 <code>scrollHeight</code>나 <code>getBoundingClientRect()</code>를
            역측정해야만 했고, 이로 인해 치명적인 <strong style={{ color: 'var(--red)' }}>Layout Thrashing</strong>으로 인한 성능저하가 발생
          </p>
        </Card>

        <Card variant="bad" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.3rem' }}>⌨️</span>
            <h3 style={{ fontSize: '1.02rem', margin: 0, color: 'var(--red)' }}>
              실시간 타이핑 & 반응형 리사이즈 병목
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
            프롬프트 생성기에서 사용자가 단어를 입력하거나 브라우저 너비를 조절할 때마다 카드의 줄바꿈과 높이가 실시간으로 재계산되어야 합니다.{' '}
            매 키 입력·리사이즈마다 C++ 브라우저 레이아웃 트리가 동기 재계산되면서 메인 스레드가 멈추고 심각한 프레임 드랍(Jank)이 발생
          </p>
        </Card>
      </div>

      {/* 2. 미드저니 실제 UI 현장 이미지 그리드 */}
      <div className="grid-2" style={{ margin: '0 0 24px', alignItems: 'stretch' }}>
        {/* 왼쪽: Explore 피드 무한스크롤 이미지 */}
        <Card style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🖼️</span> Midjourney Explore (무한 피드)
            </div>
            <span className="badge red" style={{ fontSize: '0.7rem' }}>#가변높이_역측정병목</span>
          </div>

          <div
            style={{
              position: 'relative',
              background: '#0d1117',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid var(--rule)',
              flex: 1,
              minHeight: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() =>
              setModalMedia({
                src: md01,
                title: 'Midjourney Explore 피드 (무한 스크롤 & 가변 메이슨리 레이아웃)',
                desc: '수만 장의 가변 높이 이미지와 프롬프트 카드로 인한 가상 스크롤 역측정 Layout Thrashing 발생 지점',
              })
            }
          >
            <img
              src={md01}
              alt="Midjourney Explore 피드"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '280px',
                objectFit: 'cover',
                objectPosition: 'top left',
                display: 'block',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                pointerEvents: 'none',
              }}
            >
              🔍 클릭하여 확대
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.5 }}>
            카드마다 프롬프트 길이가 제각각이라 사전 높이 계산 불가 → 화면 밖 DOM 임시 렌더링 후 역측정 반복
          </div>
        </Card>

        {/* 오른쪽: 프롬프트 에디터 실시간 입력 이미지 */}
        <Card style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⌨️</span> Midjourney Prompt Editor (실시간 타이핑)
            </div>
            <span className="badge red" style={{ fontSize: '0.7rem' }}>#키입력마다_동기Reflow</span>
          </div>

          <div
            style={{
              position: 'relative',
              background: '#0d1117',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid var(--rule)',
              flex: 1,
              minHeight: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() =>
              setModalMedia({
                src: md02,
                title: 'Midjourney Prompt Editor (실시간 텍스트 프롬프트 에디터)',
                desc: '키 입력 및 파라미터 변경 시마다 브라우저 레이아웃 트리가 동기 재계산되어 메인 스레드 정지 발생',
              })
            }
          >
            <img
              src={md02}
              alt="Midjourney Prompt Editor"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '280px',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                background: 'rgba(0,0,0,0.75)',
                color: '#fff',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                pointerEvents: 'none',
              }}
            >
              🔍 클릭하여 확대
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.5 }}>
            장문 프롬프트 타이핑 및 리사이즈 시 실시간 줄바꿈 연산 → 브라우저 레이아웃 엔진 멈춤 및 Jank 유발
          </div>
        </Card>
      </div>

      {/* 3. 고해상도 라이트박스 모달 */}
      {modalMedia && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(18, 15, 13, 0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setModalMedia(null)}
        >
          {/* 모달 헤더 바 */}
          <div
            style={{
              width: '100%',
              maxWidth: '960px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              color: '#fff',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                {modalMedia.title}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                {modalMedia.desc}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalMedia(null)}
              className="btn-icon"
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '6px 14px',
                fontSize: '0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              ✕ 닫기 (ESC)
            </button>
          </div>

          {/* 모달 미디어 본체 */}
          <div
            style={{
              maxWidth: '960px',
              maxHeight: '80vh',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
              background: '#0a0d12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalMedia.src}
              alt={modalMedia.title}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      )}
    </Slide>
  );
};
