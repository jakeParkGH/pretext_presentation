import React from 'react'
import { SlideId, NAV_ITEMS } from '../../types/presentation'

interface TopNavProps {
  activeSlide: SlideId
  onSelect: (id: SlideId) => void
  onPrev: () => void
  onNext: () => void
}

export const TopNav: React.FC<TopNavProps> = ({
  activeSlide,
  onSelect,
  onPrev,
  onNext,
}) => {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(245, 241, 234, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--rule)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '52px',
        padding: '0 20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <a
          href="#cover"
          onClick={(e) => {
            e.preventDefault()
            onSelect('cover')
          }}
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 700,
            fontSize: '1.15rem',
            color: 'var(--accent)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          Pretext
        </a>
      </div>

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '4px 10px',
          scrollbarWidth: 'none',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSlide === item.id
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                onSelect(item.id)
              }}
              style={{
                fontSize: '0.8rem',
                color: isActive ? 'var(--accent)' : 'var(--muted)',
                textDecoration: 'none',
                padding: '5px 9px',
                borderRadius: '8px',
                fontWeight: isActive ? 600 : 500,
                background: isActive ? 'var(--accent-soft)' : 'transparent',
                border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                transition: 'all 0.15s ease',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            >
              {item.label}
            </a>
          )
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <button
          onClick={onPrev}
          title="이전 슬라이드 (← / PageUp)"
          style={{
            background: 'var(--panel)',
            border: '1px solid var(--rule)',
            color: 'var(--ink)',
            padding: '5px 10px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          ◀
        </button>
        <button
          onClick={onNext}
          title="다음 슬라이드 (→ / PageDown / Space)"
          style={{
            background: 'var(--panel)',
            border: '1px solid var(--rule)',
            color: 'var(--ink)',
            padding: '5px 10px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontFamily: 'var(--sans)',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          ▶
        </button>
      </div>
    </header>
  )
}
