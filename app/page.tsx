import Image from "next/image";
import DraggableTerminalWindow from "@/components/DraggableTerminalWindow";

export default function Home() {
    return (
        <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 space-y-12">
                <section>
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-bold gradient-text">
                                Marcel Freiberg
                            </h1>
                            <div className="text-xl md:text-2xl text-neural-gray">
                                Machine Learning & Computer Vision Engineer
                            </div>
                        </div>
                    </div>
                </section>
                {/* Responsive terminal layout */}
                <section className="space-y-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <DraggableTerminalWindow
                            title="profile.py"
                            className="flex-1"
                            width="100%"
                            height="300px"
                        >
                            <div className="font-mono text-sm text-neural-gray space-y-2">
                                <p className="text-green-400">$ npm run dev</p>
                                <p>  ▲ Next.js 14.0.0</p>
                                <p>  - Local:        http://localhost:3000</p>
                                <p>  - Network:      http://192.168.1.100:3000</p>
                                <p className="text-blue-400">✓ Ready in 2.1s</p>
                            </div>
                        </DraggableTerminalWindow>

                        <DraggableTerminalWindow
                            title="profile_img.jpg"
                            className=""
                            width="auto"
                            height="auto"
                        >
                            <Image
                                src="/SKP_0981-quadrat.jpg"
                                alt="Marcel Freiberg"
                                width={250}
                                height={250}
                                priority={true}
                                className="rounded-lg"
                            />
                        </DraggableTerminalWindow>
                    </div>
                </section>
            </div>
        </div>
    )
}