import Link from 'next/link';

export default function Navigation() {
    return (
        <nav>
            <div className="max-w-3xl mx-auto px-6">
                <div className="flex items-center py-3">
                    <Link
                        href="/"
                        className="text-sm text-muted hover:text-accent transition-colors"
                    >
                        marcel@dev
                        <span className="animate-pulse text-accent">_</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
