"use client";

import { useState, useCallback, useEffect } from "react";
import DraggableTerminalWindow from "@/components/draggable-terminal-window";
import type { WindowCommand } from "@/terminal/types";

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

  const handleWindowCommand = useCallback((cmd: WindowCommand) => {
    setOpenWindows((prev) => {
      if (prev.some((w) => w.id === cmd.windowId)) return prev;
      const config = WINDOW_CONFIGS[cmd.windowId];
      if (!config) return prev;
      return [...prev, { id: cmd.windowId, title: config.title }];
    });
  }, []);

  const handleCloseWindow = useCallback((id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  return (
    <div className="h-[calc(100vh-49px)] flex items-center justify-center px-6 py-8">
      <DraggableTerminalWindow
        title="marcel@freiberg: ~"
        className="w-full max-w-[640px] h-[480px] max-sm:max-w-full max-sm:h-auto max-sm:max-h-[75vh]"
      >
        {isMobile ? (
          <MobileTerminal />
        ) : (
          <GhosttyTerminal onWindowCommand={handleWindowCommand} />
        )}
      </DraggableTerminalWindow>

      {openWindows.map((win) => {
        const config = WINDOW_CONFIGS[win.id];
        return (
          <DraggableTerminalWindow
            key={win.id}
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
