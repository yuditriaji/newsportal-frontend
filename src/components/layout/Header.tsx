'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    return (
        <header className="fixed top-0 left-64 right-0 z-30 h-16 bg-[var(--background)] border-b border-[var(--border)]">
            <div className="flex h-full items-center justify-between px-6">
                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <div
                        className={`relative flex items-center rounded-lg border ${isSearchFocused ? 'border-[var(--primary)]' : 'border-[var(--border)]'
                            } bg-[var(--card)] transition-colors`}
                    >
                        <span className="pl-4 text-[var(--muted-foreground)]">🔍</span>
                        <input
                            type="text"
                            placeholder="Search news, entities, investigations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="w-full bg-transparent px-3 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none"
                        />
                        <kbd className="hidden sm:inline-flex mr-3 px-2 py-1 text-xs bg-[var(--muted)] rounded text-[var(--muted-foreground)]">
                            ⌘K
                        </kbd>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-4">
                    {/* Alerts */}
                    <button className="relative p-2 rounded-lg hover:bg-[var(--accent)] text-[var(--muted-foreground)]">
                        <span className="text-xl">🔔</span>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--destructive)] rounded-full" />
                    </button>

                    {/* Theme toggle */}
                    <button
                        className="p-2 rounded-lg hover:bg-[var(--accent)] text-[var(--muted-foreground)]"
                        onClick={() => document.documentElement.classList.toggle('dark')}
                    >
                        <span className="text-xl">🌙</span>
                    </button>

                    {/* User menu */}
                    <Link
                        href="/login"
                        className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </header>
    );
}
