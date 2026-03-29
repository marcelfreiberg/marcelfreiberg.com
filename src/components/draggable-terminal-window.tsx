'use client'

import { forwardRef, useImperativeHandle } from 'react'
import { useDraggableWindow } from '@/hooks/use-draggable-window'

interface DraggableTerminalWindowProps {
    children: React.ReactNode;
    title: string;
    className?: string;
    zIndexBase?: number;
    onClose?: () => void;
}

export interface DraggableTerminalWindowHandle {
    bringToFront(): void;
}

const DraggableTerminalWindow = forwardRef<DraggableTerminalWindowHandle, DraggableTerminalWindowProps>(
  function DraggableTerminalWindow({
    children,
    title,
    className = "",
    zIndexBase = 10,
    onClose,
  }, ref) {
    const {
        elementRef,
        placeholderRef,
        handleProps,
        zIndex,
        isDragging,
        dragEnabled,
        bringToFront,
    } = useDraggableWindow({ zIndexBase })

    useImperativeHandle(ref, () => ({ bringToFront }));

    return (
        <>
            <div
                ref={placeholderRef}
                className={className}
                style={{ display: 'none' }}
            />

            <div
                ref={elementRef}
                className={`bg-surface border border-border rounded-lg overflow-hidden transition-shadow duration-200 flex flex-col ${isDragging ? 'select-none shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]' : 'shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)]'
                    } ${className}`}
                style={{ zIndex: isDragging ? zIndex + 1000 : zIndex }}
                onClick={bringToFront}
            >
                <div
                    className={`bg-bg px-4 py-2 border-b border-border ${dragEnabled ? 'cursor-move' : 'cursor-default'} select-none flex items-center justify-between`}
                    {...handleProps}
                >
                    <div className="flex items-center space-x-2">
                        {onClose ? (
                            <button
                                className="w-3 h-3 bg-[#ff5f57] rounded-full hover:brightness-110 cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); onClose(); }}
                                aria-label="Close window"
                            />
                        ) : (
                            <div className="w-3 h-3 bg-[#ff5f57] rounded-full" />
                        )}
                        <div className="w-3 h-3 bg-[#febc2e] rounded-full"></div>
                        <div className="w-3 h-3 bg-[#28c840] rounded-full"></div>
                    </div>
                    <span className="text-muted text-xs font-mono">{title}</span>
                </div>

                <div className="flex-1 overflow-hidden"> {children} </div>
            </div>
        </>
    )
  }
);

export default DraggableTerminalWindow;
