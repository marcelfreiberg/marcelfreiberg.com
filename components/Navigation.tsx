'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
    href: string;
    label: string;
}

const navItems: NavItem[] = [
    { href: '/', label: '/home' },
    { href: '/contact', label: '/contact' },
];

export default function Navigation() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((v) => !v);
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="border-b">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-4 relative">
                    <Link
                        href="/"
                        className="text-neural-light font-bold text-lg hover:text-neural-blue transition-colors relative group"
                        onClick={closeMenu}
                    >
                        <span className="relative z-10 bg-gradient-to-r from-neural-blue via-neural-purple to-neural-pink bg-clip-text text-transparent">marcel@dev.local</span>
                        <span className="absolute -right-1 top-0 animate-pulse text-neural-cyan">_</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition-colors hover:text-neural-blue ${pathname === item.href
                                    ? 'text-neural-blue'
                                    : 'text-neural-light/70'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                        className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-neural-light/80 hover:text-neural-blue hover:bg-neural-darker/50 focus:outline-none focus:ring-2 focus:ring-neural-blue/50"
                        onClick={toggleMenu}
                    >
                        {/* Icon */}
                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                        >
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            )}
                        </svg>
                    </button>

                    {/* Mobile dropdown overlay (positioned relative to header row) */}
                    {isOpen && (
                        <>
                            {/* Backdrop to capture outside clicks */}
                            <div className="fixed inset-0 z-40 lg:hidden" onClick={closeMenu} />

                            <div
                                id="mobile-menu"
                                className="lg:hidden absolute z-50 right-0 top-full mt-2 w-56 max-w-[calc(100vw-2rem)]"
                            >
                                <div className="rounded-lg border border-neural-border/60 bg-neural-darker/90 backdrop-blur-md shadow-xl">
                                    <div className="flex flex-col py-2">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`px-4 py-2 transition-colors hover:text-neural-blue ${pathname === item.href
                                                    ? 'text-neural-blue'
                                                    : 'text-neural-light/80'
                                                    }`}
                                                onClick={closeMenu}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}