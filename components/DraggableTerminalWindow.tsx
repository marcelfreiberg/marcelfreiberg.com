'use client'

import { useRef, useEffect, useState } from 'react'

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
    width = "100%",
    height = "100%",
    zIndexBase = 10
}: DraggableTerminalWindowProps) {
    const elementRef = useRef<HTMLDivElement>(null)
    const placeholderRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [zIndex, setZIndex] = useState(zIndexBase)

    const [startX, setStartX] = useState(0)
    const [startY, setStartY] = useState(0)
    const [initialLeft, setInitialLeft] = useState(0)
    const [initialTop, setInitialTop] = useState(0)

    const bringToFront = () => {
        const timeBasedZIndex = Date.now() % 1000000 + 10000 // Range: 10000-1010000
        setZIndex(timeBasedZIndex)
    }

    const handlePointerDown = (e: React.PointerEvent) => {
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
        if (!isDragging) return

        setIsDragging(false)

        e.currentTarget.releasePointerCapture(e.pointerId)
    }

    return (
        <>
            {/* Placeholder to maintain layout space during drag */}
            <div
                ref={placeholderRef}
                className={className}
                style={{
                    display: 'none',
                    width,
                    height
                }}
            />

            {/* Draggable Terminal Window */}
            <div
                ref={elementRef}
                className={`bg-neural-dark rounded-lg shadow-lg transition-shadow duration-200 ${isDragging ? 'shadow-2xl select-none' : 'shadow-lg'
                    } ${className}`}
                style={{ width, height, zIndex: isDragging ? zIndex + 1000 : zIndex }}
                onClick={bringToFront}
            >
                <div
                    className="bg-neural-darker rounded-t-lg px-4 py-3 border-b border-neural-gray/20 cursor-move select-none flex items-center justify-between"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                >
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-neural-gray text-sm font-mono">{title}</span>
                </div>

                <div className="p-4"> {children} </div>
            </div>
        </>
    )
}