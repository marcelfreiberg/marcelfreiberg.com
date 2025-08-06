'use client'

import DraggableTerminalWindow from "@/components/DraggableTerminalWindow"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'

export default function ContactPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-neural-blue via-neural-pink to-neural-purple bg-clip-text text-transparent">
                Let&apos;s Connect
            </h1>
            <div className="flex flex-col lg:flex-row gap-6 justify-between">
                <DraggableTerminalWindow
                    title="contact_methods.json"
                    width="500px"
                >
                    <h3 className="text-xl font-bold text-neural-blue mb-4">Get In Touch</h3>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <FontAwesomeIcon
                                icon={faLinkedin}
                                className="text-neural-cyan w-5 h-5"
                            />
                            <Link href="https://www.linkedin.com/in/marcelfreiberg/" target="_blank" rel="noopener noreferrer">
                                <div className="text-neural-light">linkedin</div>
                                <div className="text-neural-gray text-sm">in/marcelfreiberg</div>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-3">
                            <FontAwesomeIcon
                                icon={faGithub}
                                className="text-neural-purple w-5 h-5"
                            />
                            <Link href="https://github.com/marcelfreiberg" target="_blank" rel="noopener noreferrer">
                                <div className="text-neural-light">github</div>
                                <div className="text-neural-gray text-sm">@marcelfreiberg</div>
                            </Link>
                        </div>
                    </div>
                </DraggableTerminalWindow>
                <DraggableTerminalWindow
                    title="send_message.py"
                    width="500px"
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
                            />
                        </div>

                        <button type="submit" className="neural-button w-full">
                            Send Message
                        </button>
                    </form>
                </DraggableTerminalWindow>
            </div>
        </div>
    )
}