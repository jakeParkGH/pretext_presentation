import React from 'react';
import { Slide, Card, Callout } from '../common';

export const ResolveSlide: React.FC = () => {
  return (
    <Slide
      id="resolve"
      eyebrow="Solution & Core Engine"
      title="6. 해결: Zero-DOM 산술 레이아웃과 2-Phase 엔진"
    >

      {/* 3. 하단: 🎯 핵심 성과 Callout */}
      <Callout variant="good" title="🎯 Pretext 핵심 성과">
        <div style={{ fontSize: '0.88rem', fontFamily: 'var(--mono)', color: 'var(--ink)' }}>
          레이아웃 쓰레싱 발생을 피해 수많은 가변 높이 피드 → DOM 레이아웃 0회 성능 개선 성공!
        </div>
      </Callout>

      {/* 2. 중단: 핵심 엔진 prepare() & layout() 카드 + 키워드 소개 */}
      <div className="grid-2" style={{ margin: '14px 0 18px' }}>
        {/* prepare() 카드 */}
        <Card style={{ background: '#fff', borderTop: '4px solid var(--accent)', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--ink)', margin: 0 }}>
              핵심 API ①:
              <code style={{ fontSize: '1.15rem', color: 'var(--ink)', margin: 0 }}>prepare(text, font, options)</code>
            </h3>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0 12px' }}>
            <span className="badge accent">#ColdPath</span>
            <span className="badge accent">#1회측정</span>
            <span className="badge accent">#OffscreenCanvas</span>
            <span className="badge accent">#IntlSegmenter</span>
            <span className="badge accent">#2단계캐싱</span>
            <span className="badge accent">#너비비의존적</span>
          </div>

          <div style={{ fontSize: '0.84rem', fontFamily: 'var(--mono)', color: 'var(--ink)', lineHeight: 1.55 }}>
            <div>① <strong>너비 비의존</strong>: maxWidth 무관 1회 사전 계산 (Cold Path)</div>
            <div>② <strong>공백 정규화</strong>: CSS white-space 공백 병합 & 치환</div>
            <div>③ <strong>유니코드 분절</strong>: Intl.Segmenter · UAX #14 · CJK 결합</div>
            <div>④ <strong>1×1 캔버스</strong>: OffscreenCanvas 싱글톤 메모리 측정 (0 DOM)</div>
            <div>⑤ <strong>2계층 캐싱</strong>: Font × Segment 전역 해시맵 ($O(1)$)</div>
            <div>⑥ <strong>엔진 결함 보정</strong>: macOS 이모지 팽창(-2~4px) & 커닝 보정</div>
            <div>⑦ <strong>오버플로 대비</strong>: breakableFitAdvances 사전 적재 (Opaque 반환)</div>
          </div>
        </Card>

        {/* layout() 카드 */}
        <Card style={{ background: '#fff', borderTop: '4px solid var(--green)', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--ink)', margin: 0 }}>
              핵심 API ②:
              <code style={{ fontSize: '1.15rem', color: 'var(--ink)', margin: 0 }}>layout(prepared, maxWidth, lineHeight)</code>
            </h3>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0 12px' }}>
            <span className="badge green">#HotPath</span>
            <span className="badge green">#순수산술연산</span>
            <span className="badge green">#0.2µs(0.0002ms)</span>
            <span className="badge green">#ZeroReflow</span>
            <span className="badge green">#0Canvas</span>
            <span className="badge green">#0DOM</span>
          </div>

          <div style={{ fontSize: '0.84rem', fontFamily: 'var(--mono)', color: 'var(--ink)', lineHeight: 1.55 }}>
            <div>① <strong>초극단 Hot Path</strong>: 매 프레임 반복 호출 (회당 약 0.2µs)</div>
            <div>② <strong>Zero-DOM</strong>: DOM 접근 0회 · Layout Thrashing 0%</div>
            <div>③ <strong>Zero-Canvas</strong>: measureText() 0회 (Context 미호출)</div>
            <div>④ <strong>Zero-Alloc</strong>: 문자열 연산 0회 · 루프 내 GC 할당 0개</div>
            <div>⑤ <strong>순수 산술 누적</strong>: lineW += w 및 fitLimit 오차 비교</div>
            <div>⑥ <strong>CSS 스펙 충실</strong>: Trailing Whitespace Hanging (공백 매달기)</div>
            <div>⑦ <strong>백트래킹 & 폴백</strong>: 직전 공백 롤백 · Grapheme 즉각 분절</div>
          </div>
        </Card>
      </div>

      {/* 4. 하단: 💡 참고 (PrepareOptions & pretext/rich-inline) */}
      <Callout
        style={{ marginTop: '16px', background: '#fff', borderLeft: '4px solid var(--accent)' }}
        title="💡 참고: prepare() 옵션 규격 & 다중 prepare(Rich Inline) 대응"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginTop: '8px' }}>
          {/* ① PrepareOptions 타입 */}
          <div style={{ background: '#fcfaf7', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--rule)' }}>
            <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '8px', fontSize: '0.86rem' }}>
              ① <code>PrepareOptions</code> 옵션 인터페이스
            </div>
            <pre
              className="hide-scrollbar"
              style={{
                margin: 0,
                padding: '10px 12px',
                background: '#1e1a17',
                color: '#ede6dd',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontFamily: 'var(--mono)',
                lineHeight: 1.55,
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              <code>
                <span className="kw">type</span> <span className="tp">PrepareOptions</span> = &#123;{'\n'}
                {'  '}<span className="prop">whiteSpace</span>?: <span className="str">'normal'</span> | <span className="str">'pre-wrap'</span>,  <span className="cm">// 공백 병합 여부 (기본값: 'normal')</span>{'\n'}
                {'  '}<span className="prop">wordBreak</span>?: <span className="str">'normal'</span> | <span className="str">'keep-all'</span>,   <span className="cm">// 한국어 CJK 단어 줄바꿈 유지 여부</span>{'\n'}
                {'  '}<span className="prop">letterSpacing</span>?: <span className="tp">number</span>               <span className="cm">// 자간 픽셀 값 (예: 0.5, -0.2)</span>{'\n'}
                &#125;
              </code>
            </pre>
          </div>

          {/* ② 다중 prepare 대응 */}
          <div style={{ background: '#fcfaf7', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--rule)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '8px', fontSize: '0.86rem' }}>
                ② 다중 prepare 구조 대응 (복합 인라인)
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.84rem', color: 'var(--ink)', lineHeight: 1.6 }}>
                한 문장 안에 서로 다른 폰트·두께(<code>&lt;b&gt;</code>)나 인라인 뱃지, 멘션 칩 등이 혼합된 <strong>다중 prepare</strong>는 <strong><code>pretext/rich-inline</code></strong> 패키지로 대응합니다.
              </p>
              <div style={{ fontSize: '0.80rem', fontFamily: 'var(--mono)', color: 'var(--muted)', background: '#fff', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--rule)', lineHeight: 1.5 }}>
                <div>• <code>prepareRichInline(items)</code>: 복합 인라인 세그먼트 병렬 측정</div>
                <div>• <code>walkRichInlineLines()</code>: 혼합 인라인 순수 산술 줄바꿈 연산</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
              <span className="badge accent">#pretext/rich-inline</span>
              <span className="badge green">#다중prepare</span>
              <span className="badge" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>#AtomicBox(뱃지·아이콘)</span>
            </div>
          </div>
        </div>
      </Callout>
    </Slide>
  );
};
