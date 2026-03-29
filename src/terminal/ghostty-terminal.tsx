"use client";

import { useEffect, useRef, useCallback } from "react";
import type { WindowManager } from "@/terminal/window-manager";

interface GhosttyTerminalProps {
  windowManager: WindowManager;
}

export default function GhosttyTerminal({ windowManager }: GhosttyTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<import("ghostty-web").Terminal | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const initTerminal = useCallback(async () => {
    if (termRef.current || !containerRef.current) return;

    const { init, Terminal, FitAddon } = await import("ghostty-web");
    await init();

    const term = new Terminal({
      fontSize: 14,
      fontFamily:
        '"JetBrains Mono", "Fira Code", Monaco, Menlo, "Courier New", monospace',
      cursorBlink: true,
      scrollback: 1000,
      convertEol: true,
      theme: {
        background: "#181818",
        foreground: "#e5e5e5",
        cursor: "#c9b99a",
        cursorAccent: "#181818",
        selectionBackground: "#c9b99a33",
        selectionForeground: "#e5e5e5",
        black: "#000000",
        red: "#ff5c57",
        green: "#5af78e",
        yellow: "#f3f99d",
        blue: "#57c7ff",
        magenta: "#ff6ac1",
        cyan: "#9aedfe",
        white: "#f1f1f0",
        brightBlack: "#686868",
        brightRed: "#ff5c57",
        brightGreen: "#5af78e",
        brightYellow: "#f3f99d",
        brightBlue: "#57c7ff",
        brightMagenta: "#ff6ac1",
        brightCyan: "#9aedfe",
        brightWhite: "#f1f1f0",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(containerRef.current);

    termRef.current = term;

    const { attachShell } = await import("@/terminal/shell");
    const shell = attachShell(term, windowManager);

    cleanupRef.current = () => {
      shell.dispose();
      resizeObserver.disconnect();
      term.dispose();
      termRef.current = null;
    };
  }, [windowManager]);

  useEffect(() => {
    initTerminal();
    return () => {
      cleanupRef.current?.();
    };
  }, [initTerminal]);

  return (
    <div
      ref={containerRef}
      className="ghostty-container"
      style={{ width: "100%", height: "100%", overflow: "hidden", background: "#181818", position: "relative" }}
    />
  );
}
