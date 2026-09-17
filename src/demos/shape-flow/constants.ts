import type { CodeSnippet } from '../../components/common';

export const ARTICLE_TEXT = `인공지능과 차세대 웹 플랫폼의 시대에는 실시간 인터랙션과 고밀도 정보의 유려한 시각화가 사용자 경험의 핵심 경쟁력이 됩니다. 그러나 기존 브라우저 CSS의 shape-outside나 float 속성은 매우 치명적인 한계가 있습니다. CSS float는 구조상 요소의 한쪽 면(오른쪽 또는 왼쪽)으로만 텍스트를 흘려보낼 수 있으며, 장애물 양쪽으로 텍스트를 동시에 채우는 양방향 래핑(Dual-Slot Wrapping)이 불가능합니다. 또한 사용자가 요소를 실시간으로 드래그하거나 위치가 바뀔 때마다 브라우저 내부 레이아웃 트리가 전면 무효화되어 심각한 프레임 드랍(Layout Thrashing)이 발생합니다.

반면 Pretext의 커서 기반 layoutNextLine() API와 기하학 슬롯 분할(Slot Carving) 알고리즘을 결합하면, 원형이나 다각형 등 어떤 복잡한 형상의 장애물이라도 라인별 사용 가능 슬롯(Interval)을 수식으로 도출하여 텍스트를 물 흐르듯 양쪽 모두에 완벽하게 채울 수 있습니다. 각 텍스트 라인 밴드마다 장애물이 가로막고 있는 수평 구간을 계산하여 좌측 슬롯과 우측 슬롯으로 쪼갠 뒤, 직전 슬롯에서 끝난 커서(cursor.end)를 다음 슬롯의 시작점으로 넘겨주는 것만으로 글의 흐름이 한 줄기 강물처럼 이어집니다.

DOM 측정이나 스타일 재계산이 전혀 개입하지 않는 순수 산술 연산이므로, 장애물 오브젝트를 마우스나 터치로 아무리 빠르게 드래그해도 항상 매끄러운 60fps로 실시간 리플로우(Reflow)를 유지합니다. 이것이 바로 잡지나 전문 에디토리얼 인쇄물에서나 볼 수 있었던 인터랙티브 셰이프 레이아웃을 웹에서 지연 없이 구현하는 Pretext만의 혁신적인 접근법입니다.`;

export const FONT = '15px "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
export const LINE_HEIGHT = 26;
export const CONTAINER_WIDTH = 580;
export const CONTAINER_HEIGHT = 418;

export const SHAPE_FLOW_SNIPPETS: CodeSnippet[] = [
  {
    tabLabel: '📱 컴포넌트 래핑 코드',
    filePath: 'src/demos/ShapeFlowDemo.tsx',
    code: `// [자유 형태 장애물 양방향 텍스트 래핑: Dual-Slot Obstacle Wrapping]
import {
  prepareWithSegments,   // layoutNextLine()에 필요한 세그먼트 정보 보존 전처리
  layoutNextLine,        // 커서(start)부터 slotWidth 안에 들어오는 한 줄을 반환
  type LayoutCursor,
} from '@chenglou/pretext';

const prepared = prepareWithSegments(articleText, FONT);
let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
let lineTop = 14;

while (lineTop + LINE_HEIGHT <= CONTAINER_HEIGHT) {
  const bandTop = lineTop;
  const bandBottom = lineTop + LINE_HEIGHT;

  const blocked = [];
  const circleInterval = circleIntervalForBand(obstacle.x, obstacle.y, obstacle.r, bandTop, bandBottom);
  if (circleInterval !== null) blocked.push(circleInterval);

  // 기본 너비에서 장애물 침범 구간을 빼내어 좌/우 가용 슬롯(Slots)으로 분할
  const slots = carveTextLineSlots({ left: 14, right: CONTAINER_WIDTH - 14 }, blocked);

  for (const slot of slots) {
    const slotWidth = slot.right - slot.left;
    let line = layoutNextLine(prepared, cursor, slotWidth);
    if (!line) {
      cursor = { segmentIndex: 0, graphemeIndex: 0 };
      line = layoutNextLine(prepared, cursor, slotWidth);
    }
    if (!line) continue;

    renderLine(line.text, slot.left, lineTop);
    // line.end 커서가 좌측 슬롯의 끝 지점 → 우측 슬롯의 시작 커서로 즉시 연결!
    cursor = line.end;
  }

  lineTop += LINE_HEIGHT;
}`,
    explanation:
      '각 줄마다 carveTextLineSlots()로 장애물 좌/우 슬롯을 구하고, 좌측 슬롯의 끝 커서(end)를 우측 슬롯의 시작 커서로 넘겨 텍스트 연속성을 유지하며 양쪽 모두 채웁니다.',
  },
];
