"use client";

import { useState } from "react";
import Image from "next/image";
import DraggableTerminalWindow from "@/components/DraggableTerminalWindow";

export default function Home() {
    const [ready, setReady] = useState(false);

    return (
        <div className={`max-w-6xl mx-auto px-4 py-8 space-y-8 lg:space-y-12 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
            <section>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-neural-blue via-neural-pink to-neural-purple bg-clip-text text-transparent">
                            Marcel<br />Freiberg
                        </h1>
                        <div className="text-xl md:text-2xl text-neural-gray">
                            Machine Learning & Computer Vision Engineer
                        </div>
                    </div>
                </div>
            </section>
            {/* Responsive terminal layout */}
            <section className="space-y-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6 items-start">
                    <DraggableTerminalWindow title="profile.py" width="100%" className="order-2 lg:order-1 w-full max-w-[530px]">
                        <div className="bg-neural-darker/80 border border-neural-border/40 rounded-lg p-4 font-mono text-sm text-neural-light/80 overflow-x-auto">
                            <span className="text-neural-purple">class</span> <span className="text-neural-cyan">MLEngineer</span><span className="text-neural-light">:</span>
                            <br />
                            <div className="pl-4 space-y-1 mt-2">
                                <div><span className="text-neural-blue">def</span> <span className="text-neural-cyan">__init__</span><span className="text-neural-light">(self):</span></div>
                                <div className="pl-4 space-y-1">
                                    <div><span className="text-neural-light">self.name = </span><span className="text-data-green">&quot;Marcel Freiberg&quot;</span></div>
                                    <div><span className="text-neural-light">self.specialization = [</span></div>
                                    <div className="pl-4">
                                        <div><span className="text-data-green">&quot;Deep Learning&quot;</span><span className="text-neural-light">,</span></div>
                                        <div><span className="text-data-green">&quot;Computer Vision&quot;</span><span className="text-neural-light">,</span></div>
                                        <div><span className="text-data-green">&quot;Neural Networks&quot;</span><span className="text-neural-light">,</span></div>
                                        <div><span className="text-data-green">&quot;MLOps&quot;</span></div>
                                    </div>
                                    <div><span className="text-neural-light">]</span></div>
                                    <div><span className="text-neural-light">self.status = </span><span className="text-data-green">&quot;Training models &amp; solving problems&quot;</span></div>
                                </div>
                            </div>
                        </div>
                    </DraggableTerminalWindow>

                    <DraggableTerminalWindow title="profile_img.jpg" className="order-1 lg:order-2 self-center lg:self-auto">
                        <Image
                            src="https://mex7bxttci42tmsd.public.blob.vercel-storage.com/SKP_0981-quadrat.jpg"
                            alt="Marcel Freiberg"
                            width={250}
                            height={250}
                            priority={true}
                            onLoad={() => setReady(true)}
                            className="rounded-lg mx-auto"
                        />
                    </DraggableTerminalWindow>
                </div>
            </section>
        </div>
    )
}
