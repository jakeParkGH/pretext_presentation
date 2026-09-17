import React from 'react';
import { useSlideNav } from './hooks/useSlideNav';
import { TopNav } from './components/common';
import {
  IntroSlide,
  ProblemSlide,
  PipelineSlide,
  QueuingSlide,
  Demo1Slide,
  Demo2Slide,
  Demo3Slide,
  Demo4Slide,
  Demo5Slide,
  SummarySlide,
  QASlide,
} from './components/slides';

export const App: React.FC = () => {
  const { activeSlide, scrollToSlide, goNext, goPrev } = useSlideNav();

  return (
    <>
      <TopNav
        activeSlide={activeSlide}
        onSelect={scrollToSlide}
        onPrev={goPrev}
        onNext={goNext}
      />

      <main className="presentation">
        <IntroSlide />
        <ProblemSlide />
        <PipelineSlide />
        <QueuingSlide />
        <Demo1Slide />
        <Demo2Slide />
        <Demo3Slide />
        <Demo4Slide />
        <Demo5Slide />
        <SummarySlide />
        <QASlide />
      </main>

      <footer>
        <p>
          Pretext Architecture Deep-Dive Presentation · Designed with <strong>chenglou.me</strong> aesthetic.
          <br />
          Reference:{' '}
          <a href="https://github.com/chenglou/pretext" target="_blank" rel="noopener noreferrer">
            chenglou/pretext
          </a>{' '}
          · MIT License
        </p>
      </footer>
    </>
  );
};

export default App;
