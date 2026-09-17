import React from 'react';
import { Slide } from '../common';
import { GridVirtualWidget } from '../../demos';

export const Demo4Slide: React.FC = () => {
  return (
    <Slide
      id="demo4"
      eyebrow="Demo 4 · Grid & Feed Layout Virtualization"
      title="3-4. 데모 4 : 가상 스크롤 레이아웃 캐싱 (Zero Reflow 무한 피드)"
      subtitle={
        <>
          현업 표준 가상화 라이브러리(<strong>@tanstack/react-virtual</strong>)에 Pretext의 사전 계산 정밀 높이 배열(<code>Float64Array</code>)을 주입하여,
          DOM 동적 역측정(<code>measureElement</code>)을 100% 제거하고 <code>transform: translate3d</code>로 GPU 합성 레이어에 직행시키는 무한스크롤 피드입니다.
        </>
      }
    >
      <GridVirtualWidget />
    </Slide>
  );
};
