import React from 'react';
import type { PreparedFeedCard } from '../types';
import { CARD_PADDING, LINE_HEIGHT } from '../constants';

interface FeedCardItemProps {
  item: PreparedFeedCard;
  virtualIndex: number;
  virtualRowKey: React.Key;
  virtualRowSize: number;
  virtualRowStart: number;
  useTransform: boolean;
  usePretextEstimate: boolean;
  isMeasuredFlashing: boolean;
  effectiveFeedWidth: number;
  measureRef?: (node: HTMLElement | null) => void;
}

export const FeedCardItem: React.FC<FeedCardItemProps> = ({
  item,
  virtualIndex,
  virtualRowKey,
  virtualRowSize,
  virtualRowStart,
  useTransform,
  usePretextEstimate,
  isMeasuredFlashing,
  effectiveFeedWidth,
  measureRef,
}) => {
  const textWidth = Math.max(80, effectiveFeedWidth - CARD_PADDING * 2 - 2);
  const imageHeight = Math.round(textWidth / item.aspectRatio);

  return (
    <div
      key={virtualRowKey}
      data-index={virtualIndex}
      ref={measureRef}
      data-card-id={item.id}
      className="feed-card-wrapper"
      style={{
        position: 'absolute',
        top: !useTransform ? `${virtualRowStart}px` : 0,
        left: 0,
        width: '100%',
        height: usePretextEstimate ? `${virtualRowSize}px` : undefined,
        transform: useTransform ? `translate3d(0, ${virtualRowStart}px, 0)` : undefined,
        paddingBottom: '16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        className={`feed-card-inner ${isMeasuredFlashing ? 'flash-red' : ''}`}
        style={{
          background: 'var(--panel)',
          border: `1px solid ${!usePretextEstimate ? 'var(--red-border)' : 'var(--rule)'}`,
          borderRadius: '10px',
          padding: `${CARD_PADDING}px`,
          boxShadow: '0 2px 8px rgba(54,40,23,0.03)',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s ease',
        }}
      >
        {/* [1. 상단 인덱스 바] height: 24px, marginBottom: 10px */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '24px',
            marginBottom: '10px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: usePretextEstimate ? 'var(--green-bg)' : 'var(--red-bg)',
              border: `1px solid ${usePretextEstimate ? 'var(--green-border)' : 'var(--red-border)'}`,
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: usePretextEstimate ? 'var(--green)' : 'var(--red)',
                fontFamily: 'var(--mono)',
              }}
            >
              Card #{item.id}
            </span>
            <span style={{ opacity: 0.4, color: 'var(--muted)' }}>|</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--muted)',
                fontFamily: 'var(--mono)',
              }}
            >
              Index: {virtualIndex}
            </span>
          </div>

          {!usePretextEstimate && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--red)',
                background: 'var(--red-bg)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--red-border)',
              }}
            >
              ⚠️ DOM 역측정 대상
            </span>
          )}
        </div>

        {/* [2. 카드 헤더] height: 44px, marginBottom: 12px */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '44px',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: item.avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px',
                color: '#fff',
              }}
            >
              {item.author[0]}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                {item.author}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                {item.handle}
              </div>
            </div>
          </div>

          <span
            style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '12px',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              fontWeight: 600,
              border: '1px solid var(--accent-border)',
            }}
          >
            비율 {item.aspectRatio === 1 ? '1:1' : item.aspectRatio > 1 ? '16:9' : '2:3'}
          </span>
        </div>

        {/* [3. 이미지 영역] height: imageHeight, marginBottom: 12px */}
        <div
          style={{
            width: '100%',
            height: `${imageHeight}px`,
            flexShrink: 0,
            background: item.gradient,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.9)',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)',
            }}
          >
            🖼️ 이미지 영역 ({textWidth} × {imageHeight}px)
          </span>
          <span
            style={{
              position: 'absolute',
              bottom: '6px',
              right: '8px',
              fontSize: '10px',
              background: 'rgba(0,0,0,0.6)',
              padding: '2px 6px',
              borderRadius: '4px',
              color: '#eee',
            }}
          >
            Aspect: {item.aspectRatio.toFixed(2)}
          </span>
        </div>

        {/* [4. 가변 프롬프트 텍스트] marginBottom: 12px */}
        <div style={{ marginBottom: '12px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: 'var(--accent)',
              marginBottom: '4px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            PROMPT
          </div>
          <div
            style={{
              fontSize: '16px',
              lineHeight: `${LINE_HEIGHT}px`,
              fontFamily: 'Pretendard, -apple-system, sans-serif',
              color: 'var(--ink)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
            }}
          >
            {item.prompt}
          </div>
        </div>

        {/* [5. 카드 푸터] height: 36px, paddingTop: 8px */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '36px',
            fontSize: '12px',
            color: 'var(--muted)',
            borderTop: '1px solid var(--rule-light)',
            paddingTop: '8px',
            boxSizing: 'border-box',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>#{item.category}</span>
          <span>❤️ {item.likes} likes</span>
        </div>
      </div>
    </div>
  );
};
