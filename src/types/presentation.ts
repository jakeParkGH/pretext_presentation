export type SlideId =
  | 'cover'
  | 'problem'
  | 'pipeline'
  | 'queuing'
  | 'demo1'
  | 'demo2'
  | 'demo3'
  | 'demo4'
  | 'demo5'
  | 'summary'
  | 'qa'

export interface NavItem {
  id: SlideId
  label: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'cover', label: '1. Intro' },
  { id: 'problem', label: '2. Problem' },
  { id: 'pipeline', label: '2-1. Pipeline' },
  { id: 'queuing', label: '2-2. VSync & Thrashing' },
  { id: 'demo1', label: '3-1. BasicMeasure' },
  { id: 'demo2', label: '3-2. Accordion' },
  { id: 'demo3', label: '3-3. Streaming' },
  { id: 'demo4', label: '3-4 가상스크롤' },
  { id: 'demo5', label: '3-5. ShapeFlow' },
  { id: 'summary', label: '4. 정리' },
  { id: 'qa', label: '5. Q&A' },
]
