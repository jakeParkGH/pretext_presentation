import React from 'react';
import { Slide, Card } from '../common';

interface ReferenceItem {
  title: string;
  url: string;
  source: string;
  description: string;
  tags: string[];
  icon: string;
}

const REFERENCES: ReferenceItem[] = [
  {
    title: 'chenglou/pretext',
    url: 'https://github.com/chenglou/pretext',
    source: 'GitHub',
    description: 'Pretext 라이브러리 공식 소스 코드 및 명세. Zero-DOM 2-Phase Text Layout 엔진 (prepare, layout, rich-inline).',
    tags: ['#CoreEngine', '#MIT', '#Pretext'],
    icon: '📦',
  },
  {
    title: 'Chromium RenderingNG Architecture',
    url: 'https://developer.chrome.com/docs/chromium/renderingng-architecture?hl=ko',
    source: 'Chrome Developers',
    description: '크로미움의 차세대 렌더링 파이프라인(RenderingNG) 총괄 아키텍처. Style, Layout, Paint, Composite 단계별 구조와 최적화 원리.',
    tags: ['#Chromium', '#RenderingNG', '#Architecture'],
    icon: '🌐',
  },
  {
    title: 'WebKit Deep Dive: Layout & Rendering (DisplayTree)',
    url: 'https://docs.webkit.org/Deep%20Dive/Layout%20%26%20Rendering/DisplayTree.html',
    source: 'WebKit Docs',
    description: 'Safari WebKit 렌더링 엔진의 디스플레이 트리(DisplayTree) 및 Inline Formatting Context(IFC) 동작 원리 심층 기술 문서.',
    tags: ['#WebKit', '#Safari', '#DisplayTree'],
    icon: '🧭',
  },
  {
    title: '대규모의 복잡한 레이아웃 및 레이아웃 스래싱 방지',
    url: 'https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing?hl=ko',
    source: 'web.dev',
    description: '구글 웹 개발 공식 가이드. 레이아웃 범위 최소화 기법 및 강제 동기 리플로우(Layout Thrashing) 방지 실무 패턴.',
    tags: ['#web.dev', '#LayoutThrashing', '#Optimization'],
    icon: '⚡',
  },
  {
    title: 'Forced Reflow (강제 리플로우)',
    url: 'https://developer.chrome.com/docs/performance/insights/forced-reflow',
    source: 'Chrome DevTools Insights',
    description: '크롬 개발자 도구의 성능 인사이트. JavaScript 실행 도중 발생하는 강제 동기 리플로우의 원인 측정과 디버깅 가이드.',
    tags: ['#DevTools', '#ForcedReflow', '#Profiling'],
    icon: '🔍',
  },
  {
    title: 'Blink Renderer Core Layout Architecture',
    url: 'https://chromium.googlesource.com/chromium/src/%2B/main/third_party/blink/renderer/core/layout/README.md',
    source: 'Chromium Source Code',
    description: 'Blink 렌더러의 C++ 코어 레이아웃 엔진 소스 문서. LayoutNG, Box Fragment, Text Formatting Context 구현 상세.',
    tags: ['#Blink', '#LayoutNG', '#C++Source'],
    icon: '⚙️',
  },
];

export const ReferencesSlide: React.FC = () => {
  return (
    <Slide
      id="references"
      eyebrow="References & Further Reading"
      title="10. 참고문헌 (References)"
    >
      <div className="grid-2" style={{ gap: '16px', marginTop: '16px' }}>
        {REFERENCES.map((item, idx) => (
          <Card
            key={idx}
            style={{
              padding: '12px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#fff',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.74rem' }}>
                  {item.source}
                </span>
              </div>

              <h3 style={{ fontSize: '0.98rem', margin: '0 0 8px 0', color: 'var(--ink)' }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--ink)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                >
                  <span>{item.title}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>↗</span>
                </a>
              </h3>

              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 12px 0', lineHeight: 1.55 }}>
                {item.description}
              </p>

              <div style={{
                marginBottom: '12px',
                lineHeight: 1.2,
              }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--mono)',
                    color: 'var(--accent)',
                    wordBreak: 'break-all',
                    textDecoration: 'none',
                  }}
                >
                  {item.url}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {item.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="badge"
                  style={{ background: 'rgba(149, 95, 59, 0.08)', color: 'var(--accent)', fontSize: '0.72rem' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Slide>
  );
};
