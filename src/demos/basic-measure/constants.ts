import type { CodeSnippet } from '../../components/common';

export const SAMPLE_TEXT = `웹 프론트엔드 개발에서 텍스트의 크기와 줄바꿈에 따른 높이를 계산하는 작업은 언제나 브라우저 렌더링 파이프라인의 심각한 병목이었습니다. 가상 스크롤, 메이슨리 그리드, AI 실시간 스트리밍 인터페이스 등에서는 요소가 화면에 나타나기 전 정확한 크기를 알아야 레이아웃 시프트(CLS)를 방지할 수 있습니다. Pretext는 DOM을 건드리지 않고 순수 수학 연산만으로 이를 마이크로초(µs) 단위에 해결합니다.`;

export const FONT = '16px "Pretendard", -apple-system, sans-serif';
export const LINE_HEIGHT = 26;
export const PADDING = 12;
export const BORDER = 1;
export const OVERHEAD_H = PADDING * 2 + BORDER * 2; // 26px (좌우 패딩 24px + 테두리 2px)
export const OVERHEAD_V = PADDING * 2 + BORDER * 2; // 26px (상하 패딩 24px + 테두리 2px)

export const BASIC_MEASURE_SNIPPETS: CodeSnippet[] = [
  {
    tabLabel: '📱 컴포넌트 사용 코드',
    filePath: 'src/demos/BasicMeasureDemo.tsx',
    code: `// -------------------------------------------------------------
// [Pretext 기본 해결 패턴: 2-Phase Engine]
// -------------------------------------------------------------
import { prepare, layout } from '@chenglou/pretext'

const FONT = '16px "Pretendard", -apple-system, sans-serif';
const LINE_HEIGHT = 26;

// [Phase 1: Cold Path - 1회성 전처리]
// 1. 유니코드 세그멘테이션 (단어/공백/글리프 분절)
// 2. OffscreenCanvas를 통해 단어별 너비 1회 측정 및 캐싱
// 3. 반환값: 불변 병렬 배열을 담은 불투명 핸들 (PreparedText)
// ⚠️ 주의: 리사이즈 루프 안에서 호출하면 안 되며, 텍스트가 바뀔 때만 실행!
const prepared = prepare(text, FONT);

// [Phase 2: Hot Path - 순수 산술 연산]
// 1. DOM Query 0회, Canvas 호출 0회, 문자열 조작 0회
// 2. 텍스트 가용 폭 = 컨테이너 폭 - 패딩(24px) - 테두리(2px)
// 3. 캐시된 세그먼트 너비 배열을 단순 누적 합산 (lineW += width)
// 4. 소요 시간: 약 0.0002ms (0.2µs) - 윈도우 리사이즈 루프에서도 120fps 유지!
const contentWidth = containerWidth - (PADDING * 2 + BORDER * 2);
const { height: textHeight, lineCount } = layout(prepared, contentWidth, LINE_HEIGHT);

// 5. CSS box-sizing: border-box 적용 요소의 전체 높이
const totalBoxHeight = textHeight + (PADDING * 2 + BORDER * 2);
`,
    explanation: 'prepare()는 텍스트가 바뀔 때만 1회 호출하고, layout()은 슬라이더 조작 시 0.0002ms의 순수 산술 연산만 수행합니다.',
  },
  {
    tabLabel: '🔬 라이브러리 내부 핵심 코드 (@chenglou/pretext)',
    filePath: 'pretext/src/layout.ts & measurement.ts',
    code: `// -------------------------------------------------------------
// [@chenglou/pretext 내부 핵심 최적화 소스코드 발췌]
// -------------------------------------------------------------
// [1. pretext/src/measurement.ts: OffscreenCanvas로 DOM Invalidation 원천 차단]
let measureContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;
const segmentWidthCaches = new Map<string, Map<string, number>>();

function createMeasureContext() {
  if (typeof OffscreenCanvas !== 'undefined') {
    measureContext = new OffscreenCanvas(1, 1).getContext('2d')!;
    return measureContext;
  }
  if (typeof document !== 'undefined') {
    measureContext = document.createElement('canvas').getContext('2d')!;
    return measureContext;
  }
  throw new Error('Text measurement requires OffscreenCanvas or a DOM canvas context.');
}

// [2. pretext/src/layout.ts: layout()의 초경량 Hot Path]
export function layout(prepared: PreparedText, maxWidth: number, lineHeight: number): LayoutResult {
  const lineCount = countLines(prepared, maxWidth);
  return { lineCount, height: lineCount * lineHeight };
}
`,
    explanation: 'OffscreenCanvas를 써서 DOM Tree Invalidation을 피하고, 2단계 Map 캐싱과 단순 누적 숫자 덧셈으로 극단적인 속도를 냅니다.',
  },
  {
    tabLabel: '🔠 CSS 줄바꿈 & UAX #14 에뮬레이션',
    filePath: 'pretext/src/analysis.ts & line-break.ts',
    code: `// -------------------------------------------------------------
// [@chenglou/pretext 내부: CSS white-space & UAX #14 에뮬레이션]
// 파일: pretext/src/analysis.ts & line-break.ts
// -------------------------------------------------------------
// 1. 세그먼트의 줄바꿈 특성을 나타내는 내부 모델 (SegmentBreakKind)
export type SegmentBreakKind =
  | 'text'              // 일반 단어 (줄바꿈 불가 단위)
  | 'space'             // 공백 문자 (CSS 줄 끝에서 너비 0으로 무시되는 후행 공백 대상)
  | 'tab'               // 탭 문자
  | 'mandatory-break'   // \\n 강제 개행
  | 'soft-hyphen'       // 소프트 하이픈
  | 'zero-width-space'; // 너비 없는 줄바꿈 가능 지점 (ZWSP)
`,
    explanation: 'Pretext는 브라우저 DOM 없이도 CSS white-space의 공백 병합, 줄 끝 후행 공백 무시, UAX #14 규칙을 100% 동일하게 에뮬레이션합니다.',
  },
];
