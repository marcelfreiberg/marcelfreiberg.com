'use client'

import DraggableTerminalWindow from "@/components/DraggableTerminalWindow"
import Link from 'next/link'

const iconClass = "w-6 h-6"

const LinkedInIcon = () => (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="2" className="fill-neural-cyan/20 stroke-neural-cyan" strokeWidth="1.5" />
        <path
            d="M9 17V10M9 7V7.01M12.5 17V13.5C12.5 12.6716 13.1716 12 14 12C14.8284 12 15.5 12.6716 15.5 13.5V17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-neural-cyan"
        />
    </svg>
)

const GithubIcon = () => (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
            d="M12 2C7.029 2 3 6.032 3 11.012c0 3.984 2.586 7.356 6.18 8.553.45.084.615-.196.615-.435 0-.216-.009-.933-.013-1.69-2.514.548-3.046-1.068-3.046-1.068-.41-1.044-1-1.323-1-1.323-.817-.56.062-.549.062-.549.904.064 1.38.931 1.38.931.803 1.377 2.106.98 2.62.749.082-.584.315-.98.573-1.206-2.007-.23-4.116-1.01-4.116-4.49 0-.992.354-1.804.933-2.44-.093-.228-.405-1.152.088-2.401 0 0 .756-.242 2.475.932a8.465 8.465 0 0 1 2.255-.304 8.46 8.46 0 0 1 2.255.304c1.719-1.174 2.474-.932 2.474-.932.494 1.249.182 2.173.09 2.401.58.636.932 1.448.932 2.44 0 3.49-2.113 4.257-4.127 4.483.324.278.612.83.612 1.674 0 1.209-.01 2.187-.01 2.484 0 .241.162.522.62.434C18.416 18.364 21 14.994 21 11.012 21 6.032 16.971 2 12 2Z"
            className="fill-neural-purple"
        />
    </svg>
)

export default function ContactPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-neural-blue via-neural-pink to-neural-purple bg-clip-text text-transparent">
                Let&apos;s Connect
            </h1>
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center lg:items-start">
                <DraggableTerminalWindow
                    title="contact_methods.json"
                    width="100%"
                    className="w-full max-w-[500px]"
                >
                    <h3 className="text-xl font-bold text-neural-blue mb-4">Get In Touch</h3>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <LinkedInIcon />
                            <Link href="https://www.linkedin.com/in/marcelfreiberg/" target="_blank" rel="noopener noreferrer">
                                <div className="text-neural-light">linkedin</div>
                                <div className="text-neural-gray text-sm">in/marcelfreiberg</div>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-3">
                            <GithubIcon />
                            <Link href="https://github.com/marcelfreiberg" target="_blank" rel="noopener noreferrer">
                                <div className="text-neural-light">github</div>
                                <div className="text-neural-gray text-sm">@marcelfreiberg</div>
                            </Link>
                        </div>
                    </div>
                </DraggableTerminalWindow>
                <DraggableTerminalWindow
                    title="send_message.py"
                    width="100%"
                    className="w-full max-w-[500px]"
                >
                    <h3 className="text-xl font-bold text-neural-purple mb-4">Quick Message</h3>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-neural-gray text-sm mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="neural-input w-full"
                                placeholder="Your name"
                                required
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-neural-gray text-sm mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="neural-input w-full"
                                placeholder="your@email.com"
                                required
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-neural-gray text-sm mb-2">
                                Message
                            </label>
                            <textarea
                                name="message"
                                className="neural-input w-full h-32 resize-none"
                                placeholder="Tell me about your ML/CV project or research idea..."
                                required
                                disabled
                            />
                        </div>

                        <button type="submit" className="neural-button w-full" disabled>
                            Send Message
                        </button>
                    </form>
                </DraggableTerminalWindow>
            </div>
        </div>
    )
}