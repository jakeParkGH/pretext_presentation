import React from 'react';
import { Slide, Card } from '../common';

export const IntroSlide: React.FC = () => {
  return (
    <Slide
      id="cover"
      eyebrow="Interactive Presentation · Rendering Optimization"
      title={
        <h1>
          Pretext 라이브러리와<br />Reflow(Layout) 최적화 알아보기
        </h1>
      }
      subtitle={`FE 챕터 기술발표 • 2026. 09. 17. (금)`}
    >
      <div style={{ marginTop: '144px', fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center' }}>
        Author: jake.ui · Based on <code>@chenglou/pretext</code>
      </div>
    </Slide>
  );
};
