'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/', label: 'Global Impacts' },
    { href: '/geopolitics', label: 'Geopolitics' },
    { href: '/trade', label: 'Trade Routes' },
    { href: '/technology', label: 'Technology' },
    { href: '/archive', label: 'Archives' },
];

export function Header() {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Get current date in editorial format
    const currentDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date());

    return (
        <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
            {/* Top bar */}
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                {/* Left: Menu + Date */}
                <div className="flex items-center gap-6">
                    <button className="text-[var(--foreground)] hover:text-[var(--primary)]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="text-xs font-bold uppercase tracking-widest font-sans border-r border-[var(--border)] pr-6 text-[var(--muted-foreground)]">
                        {currentDate}
                    </div>
                </div>

                {/* Center: Masthead */}
                <Link href="/" className="flex flex-col items-center group">
                    <h1 className="text-4xl font-black tracking-tighter italic leading-none text-[var(--foreground)]">
                        THE INVESTIGATION
                    </h1>
                    <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold mt-1 text-[var(--muted-foreground)]">
                        Connecting Global Truths
                    </span>
                </Link>

                {/* Right: Search + Subscribe */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="text-[var(--foreground)] hover:text-[var(--primary)]"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <Link
                        href="/register"
                        className="bg-[var(--foreground)] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider font-sans hover:bg-[var(--primary)] transition-colors"
                    >
                        Subscribe
                    </Link>
                </div>
            </div>

            {/* Navigation */}
            <nav className="border-t border-[var(--border)] bg-[var(--background)]">
                <div className="max-w-7xl mx-auto px-6 py-3 flex justify-center gap-10">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Search overlay */}
            {isSearchOpen && (
                <div className="absolute inset-x-0 top-full bg-white border-b border-[var(--border)] shadow-lg p-6">
                    <div className="max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search investigations, entities, events..."
                            autoFocus
                            className="w-full text-2xl font-serif border-b-2 border-[var(--foreground)] pb-4 bg-transparent outline-none placeholder:text-[var(--muted-foreground)]"
                        />
                        <div className="flex gap-4 mt-4 text-xs font-sans font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                            <span>Recent:</span>
                            <button className="hover:text-[var(--primary)]">Chip Shortage</button>
                            <button className="hover:text-[var(--primary)]">Ukraine Conflict</button>
                            <button className="hover:text-[var(--primary)]">Supply Chain</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
