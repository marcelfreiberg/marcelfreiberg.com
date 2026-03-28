"use client";

import DraggableTerminalWindow from "@/components/draggable-terminal-window";

export default function Home() {
    return (
        <div className="h-[calc(100vh-49px)] flex items-center justify-center px-6 py-8">
            <DraggableTerminalWindow title="marcel@freiberg: ~" className="w-full max-w-[640px] h-[480px] max-sm:max-w-full max-sm:h-auto max-sm:max-h-[75vh]">
                <div className="font-mono text-sm space-y-3">
                    <div>
                        <span className="text-muted">$</span>{" "}
                        <span className="text-text">whoami</span>
                    </div>
                    <div className="text-accent">
                        Marcel Freiberg — ML & Computer Vision Engineer
                    </div>

                    <div className="mt-2">
                        <span className="text-muted">$</span>{" "}
                        <span className="text-text">cat skills.txt</span>
                    </div>
                    <div className="text-text/70 leading-relaxed">
                        Deep Learning, Computer Vision, Neural Networks, MLOps
                    </div>

                    <div className="mt-2">
                        <span className="text-muted">$</span>{" "}
                        <span className="text-text">status</span>
                    </div>
                    <div className="text-accent">
                        Training models & solving problems
                    </div>

                    <div className="mt-2">
                        <span className="text-muted">$</span>{" "}
                        <span className="animate-pulse text-accent">_</span>
                    </div>
                </div>
            </DraggableTerminalWindow>
        </div>
    );
}
