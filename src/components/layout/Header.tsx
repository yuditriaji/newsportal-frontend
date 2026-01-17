'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// News categories from implementation plan with sub-categories
const menuSections = [
    {
        title: 'News',
        items: [
            { href: '/category/world', label: 'World' },
            { href: '/category/geopolitics', label: 'Geopolitics' },
            { href: '/category/business', label: 'Business' },
            { href: '/category/technology', label: 'Technology' },
            { href: '/category/politics', label: 'Politics' },
            { href: '/category/science', label: 'Science' },
        ]
    },
    {
        title: 'Investigate',
        items: [
            { href: '/impact-map', label: 'Impact Map' },
            { href: '/investigations', label: 'My Investigations' },
            { href: '/watchlist', label: 'Watchlist' },
        ]
    },
    {
        title: 'Regions',
        items: [
            { href: '/category/americas', label: 'Americas' },
            { href: '/category/europe', label: 'Europe' },
            { href: '/category/asia-pacific', label: 'Asia Pacific' },
            { href: '/category/middle-east', label: 'Middle East' },
            { href: '/category/africa', label: 'Africa' },
        ]
    },
    {
        title: 'Topics',
        items: [
            { href: '/category/climate', label: 'Climate & Environment' },
            { href: '/category/commodities', label: 'Commodities' },
            { href: '/category/defense', label: 'Defense & Security' },
            { href: '/category/fintech', label: 'Fintech & Crypto' },
        ]
    },
];

// Top navigation for desktop
const topNavItems = [
    { href: '/category/world', label: 'World' },
    { href: '/category/geopolitics', label: 'Geopolitics' },
    { href: '/category/business', label: 'Business' },
    { href: '/category/technology', label: 'Technology' },
    { href: '/category/politics', label: 'Politics' },
    { href: '/category/science', label: 'Science' },
];

export function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Get current date in editorial format
    const currentDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date());

    return (
        <>
            <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
                {/* Top bar */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
                    {/* Left: Menu + Date */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Hamburger Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-[var(--foreground)] hover:text-[var(--primary)] p-1"
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                        {/* Date - hidden on mobile */}
                        <div className="hidden md:block text-xs font-bold uppercase tracking-widest font-sans border-r border-[var(--border)] pr-6 text-[var(--muted-foreground)]">
                            {currentDate}
                        </div>
                    </div>

                    {/* Center: Masthead */}
                    <Link href="/" className="flex flex-col items-center group" onClick={() => setIsMenuOpen(false)}>
                        <h1 className="text-xl md:text-4xl font-black tracking-tighter italic leading-none text-[var(--foreground)]">
                            THE INVESTIGATION
                        </h1>
                        <span className="hidden md:block text-[10px] uppercase tracking-[0.4em] font-sans font-bold mt-1 text-[var(--muted-foreground)]">
                            Connecting Global Truths
                        </span>
                    </Link>

                    {/* Right: Search + Subscribe */}
                    <div className="flex items-center gap-3 md:gap-6">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-[var(--foreground)] hover:text-[var(--primary)] p-1"
                            aria-label="Search"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <Link
                            href="/register"
                            className="bg-[var(--foreground)] text-white px-3 md:px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider font-sans hover:bg-[var(--primary)] transition-colors"
                        >
                            Subscribe
                        </Link>
                    </div>
                </div>

                {/* Navigation - Desktop Only */}
                <nav className="hidden md:block border-t border-[var(--border)] bg-[var(--background)]">
                    <div className="max-w-7xl mx-auto px-6 py-3 flex justify-center gap-10">
                        {topNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link ${pathname === item.href || pathname.startsWith(item.href) ? 'active' : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </nav>
            </header>

            {/* Full-screen Menu Overlay (Inc.com style) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white overflow-y-auto">
                    {/* Close button area - top right */}
                    <div className="sticky top-0 bg-white border-b border-[var(--border)] z-10">
                        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                            <Link href="/" className="text-2xl font-black italic" onClick={() => setIsMenuOpen(false)}>
                                THE INVESTIGATION
                            </Link>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full"
                                aria-label="Close menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="border-b border-[var(--border)] bg-slate-50">
                        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search"
                                    className="w-full text-2xl md:text-4xl font-serif bg-transparent border-b-2 border-[var(--foreground)] pb-4 outline-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Menu Categories Grid */}
                    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                            {menuSections.map((section) => (
                                <div key={section.title}>
                                    <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-2 md:space-y-3">
                                        {section.items.map((item) => (
                                            <li key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="text-xs md:text-sm font-sans uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                                                >
                                                    {item.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="border-t border-[var(--border)] bg-slate-50">
                        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-sm font-sans text-[var(--muted-foreground)]">
                                Get the daily briefing on global impacts.
                            </p>
                            <Link
                                href="/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="bg-[var(--primary)] text-white px-6 py-3 text-sm font-bold uppercase tracking-wider font-sans hover:bg-red-700 transition-colors"
                            >
                                Subscribe Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
