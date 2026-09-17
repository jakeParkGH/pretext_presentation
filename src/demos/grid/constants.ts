import type { CodeSnippet } from '../../components/common';

export const FONT = '16px "Pretendard", -apple-system, sans-serif';
export const LINE_HEIGHT = 24;
export const CARD_PADDING = 16;
export const FIXED_OVERHEAD = 220;

export const GRID_SNIPPETS: CodeSnippet[] = [
  {
    tabLabel: 'TanStack + Pretext 연동',
    filePath: 'src/demos/TanStackFeedDemo.tsx',
    code: `// 1. [Cold Path]: 텍스트 변경 시 1회만 prepare() 호출
const prepared = prepare(text, '16px Pretendard, sans-serif', {
  whiteSpace: 'pre-wrap',
  wordBreak: 'keep-all',
});

// 2. [Hot Path]: 컨테이너 너비 변경 시 순수 산술 연산으로 전체 높이 배열 사전 생성 (0.02ms)
const precalculatedHeights = useMemo(() => {
  const textWidth = feedWidth - PADDING_HORIZ;
  return items.map(item => {
    const imageHeight = Math.round(textWidth / item.aspectRatio);
    const { height: textHeight } = layout(item.preparedPrompt, textWidth, 24);
    return FIXED_OVERHEAD + imageHeight + textHeight;
  });
}, [items, feedWidth]);

// 3. [TanStack Virtual 설정]: DOM 역측정(measureElement)을 아예 제거!
const rowVirtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => scrollContainerRef.current,
  estimateSize: (index) => precalculatedHeights[index] ?? 500,
  overscan: 5,
});

// 4. [JSX 렌더링]: 완성된 물리적 Y 좌표를 transform으로 GPU에 직행 주입
{rowVirtualizer.getVirtualItems().map(virtualRow => (
  <div
    key={virtualRow.key}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: \`\${virtualRow.size}px\`,
      transform: \`translate3d(0, \${virtualRow.start}px, 0)\`,
    }}
  >
    <FeedCard card={items[virtualRow.index]} />
  </div>
))}`,
    explanation:
      '동적 높이 가상화에서 가장 큰 병목은 DOM을 그린 후 offsetHeight를 역측정하는 것입니다. Pretext의 사전 계산 높이를 estimateSize에 그대로 주입하면 measureElement 자체가 불필요해져 연쇄 동기 리플로우(Layout Thrashing)가 원천 차단됩니다.',
  },
  {
    tabLabel: 'GPU 합성 직행 (Transform vs Top)',
    filePath: 'RenderingNG / Chromium Compositor Architecture',
    code: `/* ❌ 안티패턴: top / margin-top 사용 시 */
.virtual-item-legacy {
  position: absolute;
  top: 1450px; /* ⚠️ 속성 변경 시 브라우저 메인 스레드의 Layout -> Paint 파이프라인 강제 실행 */
  left: 0;
}

/* ✅ 최적화 패턴: transform: translate3d 사용 시 */
.virtual-item-optimized {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate3d(0, 1450px, 0); /* 🚀 GPU 메모리 좌표 이동 합성(Composite) */
  will-change: transform;
}`,
    explanation:
      'top 속성을 변경하면 브라우저 렌더러는 레이아웃을 재계산하고 다시 칠해야 합니다. 반면 transform: translate3d()는 이미 래스터화된 레이어를 GPU 메모리 상에서 좌표만 이동시키는 하드웨어 가속 합성 단계로 직행합니다.',
  },
  {
    tabLabel: '미드저니 방식 높이 산술식',
    filePath: 'pages/demos/masonry/index.ts 인용',
    code: `/**
 * 미드저니식 카드 피드 전체 높이 계산의 3단 구조
 * 
 * 전체 높이 = 이미지 높이(0ms) + 프롬프트 높이(0.0002ms) + 고정 UI 오버헤드(0ms)
 */

// 1. 이미지는 원래 순수 수학으로 나옴 (API 메타데이터 활용)
const imageHeight = Math.round(cardWidth / item.aspectRatio);

// 2. 고정 UI는 개발자가 지정한 고정 픽셀 상수 (인덱스바, 패딩, 아바타, 액션 버튼 등)
const fixedUiHeight = 24 + 10 + 44 + 12 + 12 + 16 + 4 + 12 + 36 + (16 * 2) + 2 + 16; // = 220px

// 3. [유일한 난제였던 지점] 텍스트 높이 -> Pretext가 DOM 없이 순수 숫자로 해결!
//    '16px Pretendard, sans-serif' + { whiteSpace: 'pre-wrap', wordBreak: 'keep-all' }
const { height: promptHeight, lineCount } = layout(item.preparedPrompt, textWidth, 24);

// 4. 최종 카드 전체 높이 도출 (DOM 렌더링 전 100% 확정)
const totalCardHeight = fixedUiHeight + imageHeight + promptHeight;

// 💡 1,000장의 카드 전체 높이를 1ms 안에 자바스크립트 힙 메모리 상에서 완벽히 도출!`,
    explanation:
      '이미지 비율과 UI 여백은 원래 브라우저 없이도 즉시 알 수 있었습니다. 유일하게 DOM 없이는 알 수 없었던 프롬프트 텍스트의 줄바꿈 높이를 Pretext가 순수 숫자로 풀어줌으로써, 개발자가 카드 전체 크기를 100% 자바스크립트 수학식으로 완성할 수 있습니다.',
  },
];
