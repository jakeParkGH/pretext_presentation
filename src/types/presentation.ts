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
  | 'qa';

export interface NavItem {
  id: SlideId;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'cover', label: '1-1. Intro' },
  { id: 'background', label: '1-2. 배경' },
  { id: 'problem', label: '1-3. Problem' },
  { id: 'pipeline', label: '2-1. Pipeline' },
  { id: 'queuing', label: '2-2. VSync & Thrashing' },
  { id: 'resolve', label: '2-3. Resolve' },
  { id: 'demo1', label: '3-1. BasicMeasure' },
  { id: 'demo2', label: '3-2. Accordion' },
  { id: 'demo3', label: '3-3. Streaming' },
  { id: 'demo4', label: '3-4. 가상스크롤' },
  { id: 'demo5', label: '3-5. ShapeFlow' },
  { id: 'summary', label: '4. 정리' },
  { id: 'qa', label: '5. Q&A' },
];
