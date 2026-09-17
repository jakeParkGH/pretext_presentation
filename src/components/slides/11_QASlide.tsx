import React from 'react';
import { Slide, HudChip } from '../common';

export const QASlide: React.FC = () => {
  return (
    <Slide
      id="qa"
      style={{ textAlign: 'center', alignItems: 'center' }}
      title={<h1 style={{ fontSize: 'clamp(3rem, 7vw, 4.5rem)', marginBottom: '12px' }}>Q &amp; A</h1>}
      subtitle={
        <span style={{ textAlign: 'center', maxWidth: '600px', display: 'inline-block' }}>
          경청해 주셔서 감사합니다.
          <br />
          질문이나 의견이 있으시면 편하게 말씀해 주세요!
        </span>
      }
    >
      {/* 마지막에 GitHub 링크 */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
      </div>
    </Slide>
  );
};
