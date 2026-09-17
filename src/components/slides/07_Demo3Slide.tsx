import React from 'react';
import { Slide } from '../common';
import { StreamingWidget } from '../../demos';

export const Demo3Slide: React.FC = () => {
  return (
    <Slide
      id="demo3"
      eyebrow="Demo 3 · LLM Streaming & VSync Defense"
      title="3-3. 데모 3 : Streaming — LLM 토큰 스트리밍 & VSync 보호"
      subtitle={
        <>
          1초에 30~50개씩 쏟아지는 AI 토큰 스트리밍 환경에서 매번 <code>scrollHeight</code>를 읽어 하단 스크롤하면
          메인 스레드가 마비됩니다. Pretext는 계산된 높이로 직접 스크롤하여 VSync 예산(16.6ms)을 지킵니다.
        </>
      }
    >
      <StreamingWidget />
    </Slide>
  );
};
