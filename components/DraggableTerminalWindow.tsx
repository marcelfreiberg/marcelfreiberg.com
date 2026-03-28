'use client'

import { useEffect, useRef, useState } from 'react'

interface DraggableTerminalWindowProps {
    children: React.ReactNode;
    title: string;
    className?: string;
    width?: string;
    height?: string;
    zIndexBase?: number;
}

export default function DraggableTerminalWindow({
    children,
    title,
    className = "",
    width = "auto",
    height = "auto",
    zIndexBase = 10
}: DraggableTerminalWindowProps) {
    const elementRef = useRef<HTMLDivElement>(null)
    const placeholderRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [zIndex, setZIndex] = useState(zIndexBase)
    const [dragEnabled, setDragEnabled] = useState(true)

    const [startX, setStartX] = useState(0)
    const [startY, setStartY] = useState(0)
    const [initialLeft, setInitialLeft] = useState(0)
    const [initialTop, setInitialTop] = useState(0)

    const bringToFront = () => {
        const timeBasedZIndex = Date.now() % 1000000 + 10000
        setZIndex(timeBasedZIndex)
    }

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

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

        const element = elementRef.current
        const placeholder = placeholderRef.current

        if (!element || !placeholder) return

        e.currentTarget.setPointerCapture(e.pointerId)

        const rect = element.getBoundingClientRect()

        setStartX(e.clientX)
        setStartY(e.clientY)

        placeholder.style.width = rect.width + 'px'
        placeholder.style.height = rect.height + 'px'
        placeholder.style.display = 'block'

        element.style.position = 'fixed'
        element.style.top = rect.top + 'px'
        element.style.left = rect.left + 'px'
        element.style.transform = 'none'
        element.style.width = rect.width + 'px'

        setInitialLeft(rect.left)
        setInitialTop(rect.top)
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragEnabled) return
        e.preventDefault()
        if (!isDragging) return

        const element = elementRef.current
        if (!element) return

        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY

        const newLeft = initialLeft + deltaX
        const newTop = initialTop + deltaY

        element.style.left = newLeft + 'px'
        element.style.top = newTop + 'px'
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!dragEnabled) return
        if (!isDragging) return

        setIsDragging(false)

        e.currentTarget.releasePointerCapture(e.pointerId)
    }

    return (
        <>
            <div
                ref={placeholderRef}
                className={className}
                style={{
                    display: 'none',
                    width,
                    height
                }}
            />

            <div
                ref={elementRef}
                className={`bg-surface border border-border rounded-xl overflow-hidden transition-shadow duration-200 flex flex-col ${isDragging ? 'select-none shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]' : 'shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)]'
                    } ${className}`}
                style={{ width, height, zIndex: isDragging ? zIndex + 1000 : zIndex }}
                onClick={bringToFront}
            >
                <div
                    className={`bg-bg px-4 py-3 border-b border-border ${dragEnabled ? 'cursor-move' : 'cursor-default'} select-none flex items-center justify-between`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                >
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[#ff5f57] rounded-full"></div>
                        <div className="w-3 h-3 bg-[#febc2e] rounded-full"></div>
                        <div className="w-3 h-3 bg-[#28c840] rounded-full"></div>
                    </div>
                    <span className="text-muted text-xs font-mono">{title}</span>
                </div>

                <div className="p-5 flex-1 overflow-auto"> {children} </div>
            </div>
        </>
    )
}
