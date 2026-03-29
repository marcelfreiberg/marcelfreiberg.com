"use client";

import { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import DraggableTerminalWindow from "@/components/draggable-terminal-window";
import { createWindowManager } from "@/terminal/window-manager";

type OpenWindow = {
  id: string;
  title: string;
};

const WINDOW_CONFIGS: Record<string, { title: string; className: string }> = {
  photo: {
    title: "photo.jpg",
    className: "w-[320px] h-[360px]",
  },
  projects: {
    title: "projects",
    className: "w-[400px] h-[300px]",
  },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const coarse =
        window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      const narrow = window.innerWidth < 640;
      setIsMobile(coarse || narrow);
    };
    check();
    window.addEventListener("resize", check);
    const mq = window.matchMedia("(pointer: coarse)");
    mq.addEventListener?.("change", check);
    return () => {
      window.removeEventListener("resize", check);
      mq.removeEventListener?.("change", check);
    };
  }, []);

  return isMobile;
}

export default function Home() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const isMobile = useIsMobile();
  const windowRefs = useRef<Map<string, { bringToFront(): void }>>(new Map());
  const pendingFocusRef = useRef<string | null>(null);

  const [wm] = useState(() =>
    createWindowManager(new Set(Object.keys(WINDOW_CONFIGS))),
  );

  useEffect(() => {
    return wm.subscribe((event) => {
      switch (event.type) {
        case "opened": {
          const config = WINDOW_CONFIGS[event.windowId];
          if (!config) return;
          pendingFocusRef.current = event.windowId;
          setOpenWindows((prev) => {
            if (prev.some((w) => w.id === event.windowId)) return prev;
            return [...prev, { id: event.windowId, title: config.title }];
          });
          break;
        }
        case "closed":
          setOpenWindows((prev) => prev.filter((w) => w.id !== event.windowId));
          break;
        case "focused":
          windowRefs.current.get(event.windowId)?.bringToFront();
          break;
      }
    });
  }, [wm]);

  useLayoutEffect(() => {
    if (pendingFocusRef.current) {
      windowRefs.current.get(pendingFocusRef.current)?.bringToFront();
      pendingFocusRef.current = null;
    }
  }, [openWindows]);

  const handleCloseWindow = useCallback((id: string) => {
    wm.close(id);
  }, [wm]);

  return (
    <div className="h-[calc(100vh-49px)] flex items-center justify-center px-6 py-8">
      <DraggableTerminalWindow
        title="marcel@freiberg: ~"
        className="w-full max-w-[640px] h-[480px] max-sm:max-w-full max-sm:h-auto max-sm:max-h-[75vh]"
      >
        {isMobile ? (
          <MobileTerminal />
        ) : (
          <GhosttyTerminal windowManager={wm} />
        )}
      </DraggableTerminalWindow>

      {openWindows.map((win) => {
        const config = WINDOW_CONFIGS[win.id];
        return (
          <DraggableTerminalWindow
            key={win.id}
            ref={(handle) => {
              if (handle) {
                windowRefs.current.set(win.id, handle);
              } else {
                windowRefs.current.delete(win.id);
              }
            }}
            title={win.title}
            className={config.className}
            onClose={() => handleCloseWindow(win.id)}
            zIndexBase={100}
          >
            <WindowContent id={win.id} />
          </DraggableTerminalWindow>
        );
      })}
    </div>
  );
}

function WindowContent({ id }: { id: string }) {
  switch (id) {
    case "photo":
      return <PhotoWindow />;
    case "projects":
      return <ProjectsWindow />;
    default:
      return null;
  }
}

// Lazy imports to keep bundle small
import dynamic from "next/dynamic";

const GhosttyTerminal = dynamic(
  () => import("@/terminal/ghostty-terminal"),
  { ssr: false }
);

const MobileTerminal = dynamic(
  () => import("@/terminal/mobile-terminal"),
  { ssr: false }
);

const PhotoWindow = dynamic(
  () => import("@/components/photo-window"),
  { ssr: false }
);

const ProjectsWindow = dynamic(
  () => import("@/components/projects-window"),
  { ssr: false }
);
