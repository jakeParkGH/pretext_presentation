import React from 'react';
import { Slide, Card } from '../common';
import { BasicMeasureWidget } from '../../demos';

export const Demo1Slide: React.FC = () => {
  return (
    <Slide
      id="demo1"
      eyebrow="Demo 1 · Cold/Hot Path Performance"
      title="7-1. 데모 1 : BasicMeasure — Cold/Hot Path 분리"
      subtitle={
        <>
          Pretext의 핵심은 <strong>2-Phase Engine</strong>입니다.
          비싼 전처리(<code>prepare</code>)는 텍스트 변경 시 딱 1회만 수행하고,
          리사이즈 루프에서는 순수 산술 연산(<code>layout</code>)만 0.0002ms(0.2µs)에 수행하여 120Hz 주사율을 완벽 방어합니다.
        </>
      }
    >
      <BasicMeasureWidget />
    </Slide>
  );
};
