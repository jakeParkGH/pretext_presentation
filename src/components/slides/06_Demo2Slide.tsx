import React from 'react';
import { Slide } from '../common';
import { AccordionWidget } from '../../demos';

export const Demo2Slide: React.FC = () => {
  return (
    <Slide
      id="demo2"
      eyebrow="Demo 2 · Zero-Reflow Height Transition"
      title="7-2. 데모 2 : Accordion — DOM 측정 없는 무결점 아코디언 (Zero Reflow Height Transition)"
      subtitle={
        <>
          CSS <code>height: auto</code>에는 transition이 동작하지 않습니다.
          <code>max-height: 1000px</code>의 먹통 딜레이와 <code>scrollHeight</code>의 강제 리플로우를
          Pretext의 1px 오차 없는 정확한 픽셀 높이 사전 산출로 완벽하게 해결합니다 (Finally Sane Accordion).
        </>
      }
    >
      <AccordionWidget />
    </Slide>
  );
};
