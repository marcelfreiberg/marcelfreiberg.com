'use client'

import { useEffect, useRef, useState } from 'react'

interface UseDraggableWindowOptions {
    zIndexBase?: number;
    onDragStart?: () => void;
    onDragEnd?: () => void;
}

interface UseDraggableWindowReturn {
    elementRef: React.RefObject<HTMLDivElement | null>;
    placeholderRef: React.RefObject<HTMLDivElement | null>;
    handleProps: {
        onPointerDown: (e: React.PointerEvent) => void;
        onPointerMove: (e: React.PointerEvent) => void;
        onPointerUp: (e: React.PointerEvent) => void;
    };
    zIndex: number;
    isDragging: boolean;
    dragEnabled: boolean;
    bringToFront: () => void;
}

export function useDraggableWindow(options?: UseDraggableWindowOptions): UseDraggableWindowReturn {
    const { zIndexBase = 10, onDragStart, onDragEnd } = options ?? {}

    const elementRef = useRef<HTMLDivElement>(null)
    const placeholderRef = useRef<HTMLDivElement>(null)

    const [isDragging, setIsDragging] = useState(false)
    const [zIndex, setZIndex] = useState(zIndexBase)
    const [dragEnabled, setDragEnabled] = useState(true)

    // Drag coordinates stored as refs to avoid re-renders during drag
    const startX = useRef(0)
    const startY = useRef(0)
    const initialLeft = useRef(0)
    const initialTop = useRef(0)

    const bringToFront = () => {
        setZIndex(Date.now() % 1000000 + 10000)
    }

    // Touch detection
    useEffect(() => {
        if (typeof window === 'undefined') return

        const computeIsTouch = () => {
            const hasTouchPoints = navigator.maxTouchPoints && navigator.maxTouchPoints > 0
            const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches
            return hasTouchPoints || coarsePointer
        }

        const updateDragEnabled = () => {
            setDragEnabled(!computeIsTouch())
        }

        updateDragEnabled()

        const mediaQuery = window.matchMedia('(pointer: coarse)')
        mediaQuery.addEventListener?.('change', updateDragEnabled)
        window.addEventListener('resize', updateDragEnabled)

        return () => {
            mediaQuery.removeEventListener?.('change', updateDragEnabled)
            window.removeEventListener('resize', updateDragEnabled)
        }
    }, [])

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!dragEnabled) return
        e.preventDefault()
        setIsDragging(true)
        bringToFront()
        onDragStart?.()

        const element = elementRef.current
        const placeholder = placeholderRef.current
        if (!element || !placeholder) return

        e.currentTarget.setPointerCapture(e.pointerId)

        const rect = element.getBoundingClientRect()

        startX.current = e.clientX
        startY.current = e.clientY
        initialLeft.current = rect.left
        initialTop.current = rect.top

        placeholder.style.width = rect.width + 'px'
        placeholder.style.height = rect.height + 'px'
        placeholder.style.display = 'block'

        element.style.position = 'fixed'
        element.style.top = rect.top + 'px'
        element.style.left = rect.left + 'px'
        element.style.transform = 'none'
        element.style.width = rect.width + 'px'
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragEnabled || !isDragging) return

        if (e.buttons === 0) {
            setIsDragging(false)
            onDragEnd?.()
            return
        }

        e.preventDefault()

        const element = elementRef.current
        if (!element) return

        const newLeft = initialLeft.current + (e.clientX - startX.current)
        const newTop = initialTop.current + (e.clientY - startY.current)

        const titleBarHeight = 40
        const minVisibleX = 100

        const clampedLeft = Math.max(-element.offsetWidth + minVisibleX, Math.min(newLeft, window.innerWidth - minVisibleX))
        const clampedTop = Math.max(0, Math.min(newTop, window.innerHeight - titleBarHeight))

        element.style.left = clampedLeft + 'px'
        element.style.top = clampedTop + 'px'
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!dragEnabled || !isDragging) return
        setIsDragging(false)
        onDragEnd?.()
        e.currentTarget.releasePointerCapture(e.pointerId)
    }

    return {
        elementRef,
        placeholderRef,
        handleProps: {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
        },
        zIndex,
        isDragging,
        dragEnabled,
        bringToFront,
    }
}
