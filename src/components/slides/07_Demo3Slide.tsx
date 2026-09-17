import React from 'react';
import { Slide } from '../common';
import { StreamingWidget } from '../../demos';

export const Demo3Slide: React.FC = () => {
  return (
    <Slide
      id="demo3"
      eyebrow="Demo 3 · LLM Streaming & VSync Defense"
      title="7-3. 데모 3 : Streaming — LLM 토큰 스트리밍 & VSync 보호"
      subtitle={
        <>
          AI 토큰 스트리밍 환경에서 매번 <code>scrollHeight</code>를 읽어 하단 스크롤하면
          메인 스레드가 마비됩니다. Pretext는 계산된 높이로 직접 스크롤하여 VSync 예산(16.6ms)을 지킵니다. (*Write ➔ Read ➔ Write**가 아니라 **Write ➔ Write**로 구현)
        </>
      }
    >
      <StreamingWidget />
    </Slide>
  );
};
