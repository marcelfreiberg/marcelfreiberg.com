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
        black: "#0e0e0e",
        red: "#ff5f57",
        green: "#28c840",
        yellow: "#febc2e",
        blue: "#7aa2f7",
        magenta: "#bb9af7",
        cyan: "#7dcfff",
        white: "#e5e5e5",
        brightBlack: "#737373",
        brightRed: "#ff5f57",
        brightGreen: "#28c840",
        brightYellow: "#febc2e",
        brightBlue: "#7aa2f7",
        brightMagenta: "#bb9af7",
        brightCyan: "#7dcfff",
        brightWhite: "#ffffff",
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
