import { useState, useEffect, useCallback } from 'react'
import { SlideId, NAV_ITEMS } from '../types/presentation'

export function useSlideNav() {
  const [activeSlide, setActiveSlide] = useState<SlideId>('cover')

  const scrollToSlide = useCallback((id: SlideId) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setActiveSlide(id)
      window.history.replaceState(null, '', `#${id}`)
    }
  }, [])

  const scrollToIndex = useCallback((index: number) => {
    if (index >= 0 && index < NAV_ITEMS.length) {
      scrollToSlide(NAV_ITEMS[index].id)
    }
  }, [scrollToSlide])

  const getCurrentIndex = useCallback(() => {
    const scrollY = window.scrollY + 200
    for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
      const el = document.getElementById(NAV_ITEMS[i].id)
      if (el && el.offsetTop <= scrollY) {
        return i
      }
    }
    return 0
  }, [])

  const goNext = useCallback(() => {
    const curr = getCurrentIndex()
    if (curr < NAV_ITEMS.length - 1) {
      scrollToIndex(curr + 1)
    }
  }, [getCurrentIndex, scrollToIndex])

  const goPrev = useCallback(() => {
    const curr = getCurrentIndex()
    if (curr > 0) {
      scrollToIndex(curr - 1)
    }
  }, [getCurrentIndex, scrollToIndex])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 140
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].id)
        if (el && el.offsetTop <= scrollY) {
          setActiveSlide(NAV_ITEMS[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        goPrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev])

  return {
    activeSlide,
    scrollToSlide,
    goNext,
    goPrev,
  }
}
