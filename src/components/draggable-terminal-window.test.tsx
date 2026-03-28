import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import DraggableTerminalWindow from './draggable-terminal-window'

// jsdom doesn't implement pointer capture
HTMLElement.prototype.setPointerCapture = () => { }
HTMLElement.prototype.releasePointerCapture = () => { }

describe('DraggableTerminalWindow', () => {
    afterEach(cleanup)

    it('moves the window when dragged by the title bar', () => {
        render(
            <DraggableTerminalWindow title="test">
                <p>content</p>
            </DraggableTerminalWindow>
        )

        const titleBar = screen.getByText('test').closest('div')!
        const window = titleBar.parentElement!

        // Stub getBoundingClientRect so the hook knows where the element starts
        window.getBoundingClientRect = () => ({
            left: 100, top: 100, right: 400, bottom: 300,
            width: 300, height: 200, x: 100, y: 100, toJSON() { },
        })

        fireEvent.pointerDown(titleBar, { clientX: 150, clientY: 120, pointerId: 1 })
        fireEvent.pointerMove(titleBar, { clientX: 250, clientY: 170, pointerId: 1 })

        expect(window.style.left).toBe('200px')  // 100 + (250 - 150)
        expect(window.style.top).toBe('150px')    // 100 + (170 - 120)

        fireEvent.pointerUp(titleBar, { clientX: 250, clientY: 170, pointerId: 1 })
    })

    it('raises z-index when clicked', () => {
        render(
            <DraggableTerminalWindow title="test" zIndexBase={10}>
                <p>content</p>
            </DraggableTerminalWindow>
        )

        const windowEl = screen.getByText('test').closest('div')!.parentElement!
        const initialZIndex = windowEl.style.zIndex

        fireEvent.click(windowEl)

        const newZIndex = Number(windowEl.style.zIndex)
        expect(newZIndex).toBeGreaterThan(Number(initialZIndex))
    })

    it('does not drag on touch devices', () => {
        // Simulate a coarse pointer (touch device)
        const original = window.matchMedia
        window.matchMedia = vi.fn((query: string) => ({
            matches: query === '(pointer: coarse)',
            media: query,
            onchange: null,
            addListener: () => { },
            removeListener: () => { },
            addEventListener: () => { },
            removeEventListener: () => { },
            dispatchEvent: () => false,
        }))

        render(
            <DraggableTerminalWindow title="test">
                <p>content</p>
            </DraggableTerminalWindow>
        )

        const titleBar = screen.getByText('test').closest('div')!
        const windowEl = titleBar.parentElement!

        windowEl.getBoundingClientRect = () => ({
            left: 100, top: 100, right: 400, bottom: 300,
            width: 300, height: 200, x: 100, y: 100, toJSON() { },
        })

        fireEvent.pointerDown(titleBar, { clientX: 150, clientY: 120, pointerId: 1 })
        fireEvent.pointerMove(titleBar, { clientX: 250, clientY: 170, pointerId: 1 })

        // Window should NOT have moved to fixed positioning
        expect(windowEl.style.position).not.toBe('fixed')

        window.matchMedia = original
    })
})
