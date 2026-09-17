export type SlideId =
  | 'cover'
  | 'background'
  | 'problem'
  | 'pipeline'
  | 'queuing'
  | 'resolve'
  | 'demo1'
  | 'demo2'
  | 'demo3'
  | 'demo4'
  | 'demo5'
  | 'summary'
  | 'qa'
  | 'references';

export interface NavItem {
  id: SlideId;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'cover', label: '1. Intro' },
  { id: 'background', label: '2. 배경' },
  { id: 'problem', label: '3. Problem' },
  { id: 'pipeline', label: '4. Pipeline' },
  { id: 'queuing', label: '5. VSync & Thrashing' },
  { id: 'resolve', label: '6. Resolve' },
  { id: 'demo1', label: '7-1. BasicMeasure' },
  { id: 'demo2', label: '7-2. Accordion' },
  { id: 'demo3', label: '7-3. Streaming' },
  { id: 'demo4', label: '7-4. 가상스크롤' },
  { id: 'demo5', label: '7-5. ShapeFlow' },
  { id: 'summary', label: '8. 정리' },
  { id: 'qa', label: '9. Q&A' },
  { id: 'references', label: '10. 참고문헌' },
];
