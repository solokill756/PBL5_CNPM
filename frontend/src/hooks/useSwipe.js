import { useEffect, useRef, useState } from "react"

export function useSwipe(handlers, options = {}) {
  const { threshold = 50, preventDefault = true } = options
  const ref = useRef(null)
  const [touchStart, setTouchStart] = useState(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      setTouchStart({ x: touch.clientX, y: touch.clientY })
    }

    const handleTouchMove = (e) => {
      if (preventDefault) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e) => {
      if (!touchStart) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStart.x
      const deltaY = touch.clientY - touchStart.y

      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // Determine if the swipe was horizontal or vertical
      if (absX > absY && absX > threshold) {
        if (deltaX > 0 && handlers.onSwipeRight) handlers.onSwipeRight()
        else if (deltaX < 0 && handlers.onSwipeLeft) handlers.onSwipeLeft()
      } else if (absY > absX && absY > threshold) {
        if (deltaY > 0 && handlers.onSwipeDown) handlers.onSwipeDown()
        else if (deltaY < 0 && handlers.onSwipeUp) handlers.onSwipeUp()
      }

      setTouchStart(null)
    }

    el.addEventListener("touchstart", handleTouchStart)
    el.addEventListener("touchmove", handleTouchMove, { passive: !preventDefault })
    el.addEventListener("touchend", handleTouchEnd)

    return () => {
      el.removeEventListener("touchstart", handleTouchStart)
      el.removeEventListener("touchmove", handleTouchMove)
      el.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handlers, touchStart, threshold, preventDefault])

  return ref
}
