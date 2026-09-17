import React, { useState, useRef, useEffect } from 'react';
import { Slide, Card } from '../common';
import demoVideo from '../../assets/Screen_Recording_20260917_212548_Threads.mp4';
import screenshotPostDddesign from '../../assets/Screenshot_20260917_200236_Threads.png';
import screenshotPostChoi from '../../assets/Screenshot_20260917_200242_Threads.png';

interface ModalMedia {
  type: 'video' | 'image';
  src: string;
  title: string;
  author: string;
  desc: string;
}

export const BackgroundSlide: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [modalMedia, setModalMedia] = useState<ModalMedia | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

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
      id="background"
      eyebrow="Origin & Motivation"
      title="2. Pretext 라이브러리의 탄생 배경"
    >
      {/* 1. 배경 개요 카드 */}
      <Card style={{ borderLeft: '4px solid var(--accent)', marginBottom: '20px', padding: '16px 20px' }}>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.75, color: 'var(--ink)', margin: 0 }}>
          올해 초 오픈소스로 공개되며 프론트엔드 생태계의 큰 주목을 받은 <strong>pretext</strong>는{' '}
          ReasonML 개발자이자 <strong>미드저니(Midjourney)</strong> 웹 플랫폼을 개발하던 <strong>Cheng Lou</strong> 엔지니어가 만든 텍스트 레이아웃 라이브러리 입니다
        </p>
      </Card>

      {/* 2. 미디어 쇼케이스 그리드 (3열): 영상 & 소셜 화제글 2장 */}
      <div className="grid-3" style={{ margin: '0 0 24px', alignItems: 'stretch' }}>

        {/* 열 1: Threads 이미지 1 (@choi.openai) */}
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🐵</span> @choi.openai
            </h3>
            <span className="badge green">#속도500배</span>
          </div>

          <div
            style={{
              position: 'relative',
              background: '#0d1117',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--rule)',
              flex: 1,
              minHeight: '480px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() =>
              setModalMedia({
                type: 'image',
                src: screenshotPostChoi,
                title: '미드저니 엔지니어의 Pretext 공개 소식',
                author: '@choi.openai (03/29)',
                desc: 'DOM 측정·CSS 계산을 건너뛰고 처리 속도 500배 이상 끌어올린 혁신 라이브러리 소개',
              })
            }
          >
            <img
              src={screenshotPostChoi}
              alt="choi.openai Threads 포스트"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '520px',
                objectFit: 'contain',
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
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                pointerEvents: 'none',
              }}
            >
              🔍 클릭하여 확대
            </div>
          </div>
        </Card>

        {/* 열 2: Threads 이미지 2 (@dddesign.io) */}
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🎨</span> @dddesign.io
            </h3>
            <span className="badge accent">#표현자유도10배</span>
          </div>

          <div
            style={{
              position: 'relative',
              background: '#0d1117',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--rule)',
              flex: 1,
              minHeight: '480px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() =>
              setModalMedia({
                type: 'image',
                src: screenshotPostDddesign,
                title: '클로드 코드 × pretext = 미친 조합',
                author: '@dddesign.io (03/30)',
                desc: '텍스트 표현의 자유가 10배 올라가며 CSS로 불가능했던 레이아웃과 물리 인터랙션 구현',
              })
            }
          >
            <img
              src={screenshotPostDddesign}
              alt="dddesign.io Threads 포스트"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '520px',
                objectFit: 'contain',
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
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                pointerEvents: 'none',
              }}
            >
              🔍 클릭하여 확대
            </div>
          </div>
        </Card>

        {/* 열 3: 실시간 인터랙션 데모 영상 카드 */}
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🎬</span> Demo 영상
            </h3>
            <span className="badge green">#60FPS</span>
          </div>

          {/* 비디오 뷰어 컨테이너 */}
          <div
            style={{
              position: 'relative',
              background: '#0d1117',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--rule)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <video
              ref={videoRef}
              src={demoVideo}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                maxHeight: '280px',
                objectFit: 'contain',
                display: 'block',
                cursor: 'pointer',
              }}
              onClick={togglePlay}
            />

            {/* 비디오 오버레이 컨트롤 바 */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '6px 10px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="btn-icon"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                  }}
                  title={isPlaying ? '일시정지' : '재생'}
                >
                  {isPlaying ? '⏸ 일시정지' : '▶ 재생'}
                </button>
                <button
                  type="button"
                  onClick={restartVideo}
                  className="btn-icon"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '3px 6px',
                    fontSize: '0.72rem',
                  }}
                  title="처음부터"
                >
                  🔄
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalMedia({
                    type: 'video',
                    src: demoVideo,
                    title: '도마뱀은 어떻게 움직이는가 (How Lizards Move)',
                    author: '@dddesign.io',
                    desc: 'Pretext 텍스트 래핑 + FABRIK 역운동학(IK) 절차적 애니메이션 데모',
                  })
                }
                className="btn-icon"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                }}
                title="화면 확대"
              >
                🔍 크게 보기
              </button>
            </div>
          </div>

          {/* 데모 상세 설명 */}
          <div style={{ marginTop: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--ink)', marginBottom: '4px' }}>
                🦎 도마뱀 인터랙션 (How Lizards Move)
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.55, margin: 0 }}>
                마우스 커서를 따라 기어다니는 도마뱀(장애물) 주위로 본문 텍스트가 실시간으로 매끄럽게 갈라지며 감싸 흐릅니다.
              </p>
            </div>

            <div
              style={{
                marginTop: '10px',
                background: 'var(--accent-soft)',
                border: '1px solid var(--accent-border)',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '0.78rem',
                color: 'var(--ink)',
                lineHeight: 1.5,
              }}
            >
              💡 <strong>기술 포인트:</strong> 60fps 마우스 실시간 추적 & 양방향 슬롯 분할을 Pretext 순수 연산으로 달성
            </div>
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
              maxWidth: '860px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              color: '#fff',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'var(--rule-light)', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                  {modalMedia.author}
                </span>
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                  {modalMedia.title}
                </span>
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
              maxWidth: '860px',
              maxHeight: '78vh',
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
            {modalMedia.type === 'video' ? (
              <video
                src={modalMedia.src}
                controls
                autoPlay
                loop
                playsInline
                style={{
                  maxWidth: '100%',
                  maxHeight: '78vh',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <img
                src={modalMedia.src}
                alt={modalMedia.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '78vh',
                  objectFit: 'contain',
                }}
              />
            )}
          </div>
        </div>
      )}
    </Slide>
  );
};
