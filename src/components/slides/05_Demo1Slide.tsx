import React from 'react';
import { Slide, Card } from '../common';
import { BasicMeasureWidget } from '../../demos';

export const Demo1Slide: React.FC = () => {
  return (
    <Slide
      id="demo1"
      eyebrow="Demo 1 · Cold/Hot Path Performance"
      title="3-1. 데모 1 : BasicMeasure — Cold/Hot Path 분리 성능 측정"
      subtitle={
        <>
          Pretext의 핵심은 <strong>2-Phase Engine</strong>입니다.
          비싼 전처리(<code>prepare</code>)는 텍스트 변경 시 딱 1회만 수행하고,
          리사이즈 루프에서는 순수 산술 연산(<code>layout</code>)만 0.0002ms(0.2µs)에 수행하여 120Hz 주사율을 완벽 방어합니다.
        </>
      }
    >
      <div className="grid-2" style={{ marginBottom: '20px' }}>
        <Card style={{ borderColor: '#d97706' }}>
          <span className="badge" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#92400e' }}>
            Cold Path · 텍스트 변경 시 1회
          </span>
          <h3 style={{ marginTop: '8px', color: '#92400e' }}>prepare(text, font)</h3>
          <ul style={{ fontSize: '0.86rem', color: 'var(--muted)', paddingLeft: '16px', lineHeight: 1.65 }}>
            <li>
              <code>Intl.Segmenter</code> 유니코드 단어/공백 분절
            </li>
            <li>
              <code>OffscreenCanvas.measureText()</code> 1회 측정
            </li>
            <li>
              <code>Float64Array</code>(너비) 불변 캐시 핸들 반환
            </li>
          </ul>
        </Card>

        <Card variant="good">
          <span className="badge green">Hot Path · 너비 변경 시 무한 호출</span>
          <h3 style={{ marginTop: '8px', color: 'var(--green)' }}>layout(prepared, width, lineH)</h3>
          <ul style={{ fontSize: '0.86rem', color: 'var(--muted)', paddingLeft: '16px', lineHeight: 1.65 }}>
            <li>DOM 접근 0회 · Canvas 호출 0회 · 문자열 할당 0회</li>
            <li>
              순수 숫자 비교 누적 산술 ➔ <strong>~0.2µs 초고속</strong>
            </li>
            <li>너비를 아무리 거칠게 흔들어도 프레임 드랍 0</li>
          </ul>
        </Card>
      </div>

      <BasicMeasureWidget />
    </Slide>
  );
};
