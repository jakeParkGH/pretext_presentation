import React from 'react';
import { Slide } from '../common';
import { ShapeFlowWidget } from '../../demos';

export const Demo5Slide: React.FC = () => {
  return (
    <Slide
      id="demo5"
      eyebrow="Demo 5 · Interactive Obstacle Wrapping"
      title="7-5. 데모 5 : ShapeFlow — 자유 형태 장애물 텍스트 래핑 (60fps 커서 라우팅)"
      subtitle={
        <>
          CSS <code>float</code>이나 <code>shape-outside</code>는 장애물의 한쪽 면으로만 텍스트를 흘립니다.
          Pretext의 <code>layoutNextLine()</code> 커서 라우팅과 슬롯 분할(Slot Carving)로
          원형 장애물 양쪽으로 갈라져 흐르는 완벽한 60fps 양방향 래핑을 실현합니다.
        </>
      }
    >
      <ShapeFlowWidget />
    </Slide>
  );
};
