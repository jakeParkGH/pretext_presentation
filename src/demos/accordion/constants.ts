import type { AccordionSection } from './types';
import type { CodeSnippet } from '../../components/common';

export const SECTIONS: AccordionSection[] = [
  {
    id: 'shipping',
    title: 'Section 1: 제품 릴리스와 신중한 서술',
    tag: 'Release',
    text:
      'Mina cut the release note to three crisp lines, then realized the support caveat still needed one more sentence before it could ship without surprises. 제품 출시 전 예외 조항과 지원 브라우저 범위를 명확히 명시하지 않으면 사용자의 신뢰를 잃을 수 있습니다.',
  },
  {
    id: 'ops',
    title: 'Section 2: 장애 대응 체크리스트 표준화',
    tag: 'Operations',
    text:
      'The handoff doc now reads like a proper morning checklist instead of a diary entry. Restart the worker, verify the queue drains, and only then mark the incident quiet. If the backlog grows again, page the same owner instead of opening a new thread. 운영 환경의 복잡도를 낮추는 최고의 방법은 프로세스의 명문화입니다.',
  },
  {
    id: 'research',
    title: 'Section 3: 가상 스크롤 렌더링 병목 해결',
    tag: 'Architecture',
    text:
      'We learned the hard way that a giant native scroll range can dominate everything else. The bug looked like DOM churn, then like pooling, then like rendering pressure, until the repros were stripped down enough to show the real limit. That changed the fix completely: simplify the DOM, keep virtualization honest, and stop hiding the worst-case path behind caches that only make the common frame look cheaper.',
  },
  {
    id: 'mixed',
    title: 'Section 4: 다국어(CJK, 아랍어 RTL) & 이모지 래핑',
    tag: 'Multilingual',
    text:
      'AGI 春天到了. بدأت الرحلة 🚀 and the long URL is https://example.com/reports/q3?lang=ar&mode=full. Nora wrote “please keep 10\u202F000 rows visible,” Mina replied “trans\u00ADatlantic labels are still weird.” 복잡한 유니코드 합자 및 양방향 텍스트에서도 1px의 오차 없이 정확한 줄바꿈 높이를 산출합니다.',
  },
];

export const FONT = '15px "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
export const LINE_HEIGHT = 24;
export const INNER_PADDING_X = 20;
export const INNER_PADDING_TOP = 4;
export const INNER_PADDING_BOTTOM = 18;
export const PADDING_Y = INNER_PADDING_TOP + INNER_PADDING_BOTTOM; // 22px

export const ACCORDION_SNIPPETS: CodeSnippet[] = [
  {
    tabLabel: '📱 컴포넌트 구현 코드',
    filePath: 'src/demos/AccordionDemo.tsx',
    code: `import React, { useState, useMemo } from 'react';
import { prepare, layout, type PreparedText } from '@chenglou/pretext';

const FONT = '15px "Pretendard", sans-serif';
const LINE_HEIGHT = 24;
const PADDING_Y = 22; // 상하 내부 여백

export function Accordion({ sections, containerWidth }) {
  const [openId, setOpenId] = useState<string | null>(sections[0].id);

  // 1. [Cold Path]: 텍스트 변경 시 1회만 prepare() 호출
  const preparedMap = useMemo(() => {
    const map = new Map<string, PreparedText>();
    sections.forEach(s => map.set(s.id, prepare(s.text, FONT)));
    return map;
  }, [sections]);

  // 2. [Hot Path]: 너비 변경 시 순수 산술식으로 각 섹션 목표 높이 사전 계산 (~0.2µs)
  const heightsMap = useMemo(() => {
    const textWidth = containerWidth - 42; // 테두리 및 좌우 패딩 차감
    const map = new Map<string, number>();
    sections.forEach(s => {
      const { height } = layout(preparedMap.get(s.id)!, textWidth, LINE_HEIGHT);
      map.set(s.id, Math.ceil(height + PADDING_Y));
    });
    return map;
  }, [preparedMap, containerWidth]);

  return (
    <div className="accordion-stack">
      {sections.map(section => {
        const isOpen = openId === section.id;
        const targetHeight = heightsMap.get(section.id) ?? 0;

        return (
          <div key={section.id} className="accordion-item">
            <button
              className="accordion-toggle"
              onClick={() => setOpenId(isOpen ? null : section.id)}
            >
              <span>{section.title}</span>
              <span>{isOpen ? '▼' : '▶'}</span>
            </button>

            {/* ⚡ DOM scrollHeight 측정 없이 순수 산술 높이로 100% 매끄러운 CSS transition 실행 */}
            <div
              className="accordion-body"
              style={{
                height: isOpen ? \`\${targetHeight}px\` : '0px',
                overflow: 'clip',
                transition: 'height 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div className="accordion-inner">
                <p>{section.text}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}`,
    explanation:
      'CSS height: auto는 transition이 되지 않아 보통 scrollHeight를 읽거나 max-height 트릭을 씁니다. Pretext를 쓰면 DOM 조회 0회로 정확한 타겟 높이를 마이크로초 단위에 계산해 완벽한 CSS height transition을 구현합니다.',
  },
  {
    tabLabel: '🔬 공식 라이브러리 데모 원리',
    filePath: 'pretext/pages/demos/accordion.ts',
    code: `// [공식 pretext/pages/demos/accordion.ts 아키텍처 발췌]
import { layout, prepare, type PreparedText } from '@chenglou/pretext';

function renderAccordion(items, contentWidth, lineHeight, paddingY, openItemId) {
  // 1. DOM의 렌더 트리를 읽지 않고, 순수 메모리 상에서 모든 패널의 정밀 높이 배열 도출
  const panelHeights: number[] = [];
  for (let i = 0; i < items.length; i++) {
    const metrics = layout(preparedCache.items[i]!, contentWidth, lineHeight);
    panelHeights.push(Math.ceil(metrics.height + paddingY));
  }

  // 2. 브라우저 렌더러에게 즉시 목표 픽셀 높이 주입 -> 하드웨어 가속 트랜지션 실행
  for (let i = 0; i < items.length; i++) {
    const expanded = openItemId === items[i].id;
    const body = domCache.items[i].body;
    body.style.height = expanded ? \`\${panelHeights[i]}px\` : '0px';
  }
}`,
    explanation:
      '공식 pretext 아코디언 데모는 폰트와 스타일을 파악한 후, 렌더 루프(rAF) 안에서 layout()만으로 모든 패널 높이를 구합니다. 브라우저의 레이아웃 무효화 큐를 건드리지 않으므로 프레임 드랍이 전혀 없습니다.',
  },
];
