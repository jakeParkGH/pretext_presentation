import type { CodeSnippet } from '../../components/common';

export const STREAMING_SOURCE = [
  '안녕하세요! ',
  'Pretext를 ',
  '활용한 ',
  'LLM ',
  '토큰 ',
  '스트리밍 ',
  '최적화 ',
  '데모입니다. ',
  '일반적인 ',
  'AI ',
  '챗봇 ',
  '구현에서는 ',
  '새로운 ',
  '토큰이 ',
  '들어올 ',
  '때마다 ',
  'scrollTop = ',
  'scrollHeight를 ',
  '호출하여 ',
  '최하단으로 ',
  '자동 ',
  '스크롤합니다. ',
  '하지만 ',
  '토큰이 ',
  '추가된 ',
  '직후 ',
  'scrollHeight를 ',
  '읽는 ',
  '순간, ',
  '브라우저는 ',
  'VSync를 ',
  '기다리지 ',
  '못하고 ',
  '그자리에서 ',
  '강제 ',
  '동기 ',
  '레이아웃(Forced Layout)을 ',
  '일으킵니다. ',
  '1초에 ',
  '수십 개의 ',
  '토큰이 ',
  '들어오면 ',
  '메인 ',
  '스레드가 ',
  '완전히 ',
  '잠식되어 ',
  '심각한 ',
  '프레임 ',
  '드랍(Jank)이 ',
  '발생합니다. ',
  'Pretext는 ',
  'DOM을 ',
  '읽지 ',
  '않고도 ',
  '정확한 ',
  '누적 ',
  '높이를 ',
  '마이크로초 ',
  '단위로 ',
  '사전 ',
  '계산할 ',
  '수 ',
  '있습니다! 🚀',
];

export const FONT = '15px "Pretendard", -apple-system, sans-serif';
export const LINE_HEIGHT = 24;

export const STREAMING_SNIPPETS: CodeSnippet[] = [
  {
    tabLabel: '📱 스트리밍 스크롤 최적화 코드',
    filePath: 'src/demos/StreamingDemo.tsx',
    code: `// ------------------------------------------------------------------
// [LLM 스트리밍 시 강제 동기 리플로우 방지 패턴]
// ------------------------------------------------------------------

// ❌ 안티패턴: 토큰 수신 시마다 DOM 측정 강제
function onTokenReceivedNaive(token) {
  messageElement.textContent += token; // 1. DOM 변경 (Dirty Flag 세팅)
  
  // 💥 2. 즉시 높이 읽기 -> 브라우저가 VSync 대기 큐를 강제 플러시하여 Hard Reflow 발생!
  container.scrollTop = container.scrollHeight; 
}

// ------------------------------------------------------------------
// ⚡ Pretext 최적화 패턴: 순수 산술 연산 높이 추적
// ------------------------------------------------------------------
import { prepare, layout } from '@chenglou/pretext';

let accumulatedText = "";

function onTokenReceivedPretext(token, containerWidth) {
  accumulatedText += token;
  
  // 1. 순수 연산으로 현재 누적 높이 계산 (DOM Query 없음!)
  const prepared = prepare(accumulatedText, FONT);
  const { height } = layout(prepared, containerWidth, LINE_HEIGHT);
  
  // 2. 브라우저 VSync 턴에 맞춰 rAF로 안전하게 스크롤만 지시
  requestAnimationFrame(() => {
    container.scrollTop = height;
  });
}
`,
    explanation:
      '새 토큰을 수신할 때마다 scrollHeight를 직접 읽으면 브라우저의 VSync 대기 큐를 강제 플러시(Hard Reflow)합니다. Pretext의 layout()을 사용하면 DOM을 전혀 건드리지 않고 순수 산술 연산만으로 누적 높이를 도출하여 VSync 타이밍에 안전하게 스크롤을 반영할 수 있습니다.',
  },
  {
    tabLabel: '🔬 라이브러리 내부 핵심 동작 원리 (@chenglou/pretext)',
    filePath: 'pretext/src/layout.ts & line-break.ts',
    code: `// ============================================================================
// [@chenglou/pretext/src/layout.ts & line-break.ts]
// LLM 스트리밍에서 DOM Dirty Bit 플러시 없이 높이를 0.0002ms에 계산하는 원리
// ============================================================================

export function layout(
  prepared: PreparedText,
  maxWidth: number,
  lineHeight: number
): LayoutResult {
  const lineCount = countLines(prepared, maxWidth);
  return {
    lineCount,
    height: lineCount * lineHeight, // 📐 순수 CPU 정수/부동소수점 곱셈 연산!
  };
}

function countLines(prepared: PreparedText, maxWidth: number): number {
  const { widths, kinds } = prepared as any; // PreparedCore
  if (widths.length === 0) return 0;

  let lineCount = 0;
  let lineW = 0;

  for (let i = 0; i < widths.length; i++) {
    const w: number = widths[i];
    const kind: string = kinds[i];

    if (kind === 'mandatory-break') { lineCount++; lineW = 0; continue; }
    if (lineW + w > maxWidth && lineW > 0) {
      lineCount++;
      lineW = w;
    } else {
      lineW += w;
    }
  }

  if (lineW > 0) lineCount++;
  return lineCount;
}
`,
    explanation:
      'layout()은 DOM을 전혀 건드리지 않고 캐시된 폭 배열을 바탕으로 countPreparedLines()를 실행하여 O(N) 산술 연산으로 높이(lineCount * lineHeight)를 도출합니다. DOM Dirty bit 플러시를 완벽히 우회하므로 60/120fps를 안정적으로 방어합니다.',
  },
  {
    tabLabel: '⚡ 초당 50+ 토큰과 VSync 8.3ms 예산 보호',
    filePath: 'Chromium Rendering Pipeline & VSync Budget',
    code: `// ------------------------------------------------------------------
// [초당 50+ 토큰 고속 스트리밍과 VSync 8.3ms 프레임 예산 보호]
// ------------------------------------------------------------------

class FastStreamingScroller {
  private targetScrollTop = 0;
  private rafScheduled = false;

  onChunk(accumulatedText: string, containerWidth: number) {
    // 1. 순수 JS 산술 연산으로 높이 계산 (~0.0002ms) -> 프레임 예산의 0.002%만 사용!
    const prepared = prepare(accumulatedText, FONT);
    const { height } = layout(prepared, containerWidth, LINE_HEIGHT);
    this.targetScrollTop = height;

    // 2. 브라우저 VSync 틱에 맞춰 1프레임당 단 1번만 실제 스크롤 반영
    if (!this.rafScheduled) {
      this.rafScheduled = true;
      requestAnimationFrame(() => {
        container.scrollTop = this.targetScrollTop;
        this.rafScheduled = false;
      });
    }
  }
}
`,
    explanation:
      '초당 수십 개 토큰이 쏟아지는 고속 LLM 환경에서 DOM scrollHeight 호출을 전면 제거하고 requestAnimationFrame과 Pretext 높이 산출을 결합하여 메인 스레드 잠식을 차단합니다.',
  },
];
