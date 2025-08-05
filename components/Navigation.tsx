'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
    href: string;
    label: string;
}

const navItems: NavItem[] = [
    { href: '/', label: '/home' },
    { href: '/blog', label: '/blog' },
    { href: '/contact', label: '/contact' },
];

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="border-b border-terminal-green/30 bg-terminal-dark/90">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link
                        href="/"
                        className="text-neural-light font-bold text-lg hover:text-neural-blue transition-colors relative group"
                    >
                        <span className="relative z-10 bg-gradient-to-r from-neural-blue via-neural-purple to-neural-pink bg-clip-text text-transparent">marcel@dev.local</span>
                        <span className="absolute -right-1 top-0 animate-pulse text-neural-cyan">_</span>
                    </Link>

                    <div className="flex space-x-6">
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
                </div>
            </div>
        </nav>
    );
}