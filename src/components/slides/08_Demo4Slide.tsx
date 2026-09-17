import React from 'react';
import { Slide } from '../common';
import { GridVirtualWidget } from '../../demos';

export const Demo4Slide: React.FC = () => {
  return (
    <Slide
      id="demo4"
      eyebrow="Demo 4 · Grid & Feed Layout Virtualization"
      title="7-4. 데모 4 : 가상 스크롤 레이아웃 캐싱"
      subtitle={
        <>
          현업 표준 가상화 라이브러리(<strong>@tanstack/react-virtual</strong>)에 Pretext 적용
        </>
      }
    >
      <GridVirtualWidget />
    </Slide>
  );
};
