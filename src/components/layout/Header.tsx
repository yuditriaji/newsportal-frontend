'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// News categories from implementation plan with sub-categories
const menuSections = [
    {
        title: 'World',
        items: [
            { href: '/category/world', label: 'All World News' },
            { href: '/category/americas', label: 'Americas' },
            { href: '/category/europe', label: 'Europe' },
            { href: '/category/asia-pacific', label: 'Asia Pacific' },
            { href: '/category/middle-east', label: 'Middle East' },
            { href: '/category/africa', label: 'Africa' },
            { href: '/category/oceania', label: 'Oceania' },
        ]
    },
    {
        title: 'Geopolitics',
        items: [
            { href: '/category/geopolitics', label: 'All Geopolitics' },
            { href: '/category/conflicts', label: 'Conflicts & Wars' },
            { href: '/category/sanctions', label: 'Sanctions & Embargoes' },
            { href: '/category/international-relations', label: 'International Relations' },
            { href: '/category/alliances', label: 'Alliances & Treaties' },
            { href: '/category/trade-wars', label: 'Trade Wars' },
            { href: '/category/territorial-disputes', label: 'Territorial Disputes' },
        ]
    },
    {
        title: 'Business',
        items: [
            { href: '/category/business', label: 'All Business' },
            { href: '/category/markets', label: 'Markets' },
            { href: '/category/economy', label: 'Economy' },
            { href: '/category/trade', label: 'Trade' },
            { href: '/category/companies', label: 'Companies' },
            { href: '/category/commodities', label: 'Commodities' },
            { href: '/category/fintech', label: 'Crypto & Fintech' },
        ]
    },
    {
        title: 'Technology',
        items: [
            { href: '/category/technology', label: 'All Technology' },
            { href: '/category/big-tech', label: 'Big Tech' },
            { href: '/category/ai', label: 'AI & Machine Learning' },
            { href: '/category/cybersecurity', label: 'Cybersecurity' },
            { href: '/category/startups', label: 'Startups' },
            { href: '/category/consumer-tech', label: 'Consumer Tech' },
        ]
    },
    {
        title: 'Politics',
        items: [
            { href: '/category/politics', label: 'All Politics' },
            { href: '/category/government', label: 'Government' },
            { href: '/category/elections', label: 'Elections' },
            { href: '/category/policy', label: 'Policy' },
            { href: '/category/defense', label: 'Defense & Security' },
        ]
    },
    {
        title: 'Science',
        items: [
            { href: '/category/science', label: 'All Science' },
            { href: '/category/climate', label: 'Climate & Environment' },
            { href: '/category/energy-transition', label: 'Energy Transition' },
            { href: '/category/health', label: 'Health & Medicine' },
            { href: '/category/space', label: 'Space' },
            { href: '/category/research', label: 'Research' },
        ]
    },
    {
        title: 'Opinion',
        items: [
            { href: '/category/opinion', label: 'All Opinion' },
            { href: '/category/editorials', label: 'Editorials' },
            { href: '/category/analysis', label: 'Expert Analysis' },
            { href: '/category/fact-check', label: 'Fact Check' },
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
            <header className={`bg-white border-b border-[var(--border)] sticky top-0 ${isMenuOpen ? 'z-[60]' : 'z-50'}`}>
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
                {!isMenuOpen && (
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
                )}
            </header>

            {/* Full-screen Menu Overlay - Light Theme */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-[var(--background)] text-[var(--foreground)] overflow-y-auto"
                    style={{ top: '0' }}
                >
                    {/* Overlay Header */}
                    <div className="sticky top-0 bg-white border-b border-[var(--border)] z-10">
                        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
                            <Link
                                href="/"
                                className="text-2xl md:text-3xl font-black italic text-[var(--foreground)]"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                THE INVESTIGATION
                            </Link>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                aria-label="Close menu"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-slate-50 border-b border-[var(--border)]">
                        <div className="max-w-6xl mx-auto px-6 py-8">
                            <div className="relative">
                                <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search articles, entities, investigations..."
                                    className="w-full pl-12 text-2xl md:text-3xl font-serif bg-transparent border-b-2 border-[var(--border)] focus:border-[var(--primary)] pb-4 outline-none placeholder:text-[var(--muted-foreground)] text-[var(--foreground)]"
                                    autoFocus
                                />
                            </div>
                        </div>
                    </div>

                    {/* Menu Categories Grid */}
                    <div className="max-w-6xl mx-auto px-6 py-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
                            {menuSections.map((section) => (
                                <div key={section.title}>
                                    <h3 className="text-lg font-black uppercase tracking-wider text-[var(--primary)] mb-6">
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-4">
                                        {section.items.map((item) => (
                                            <li key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="text-sm font-sans text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:pl-2 transition-all block"
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

                    {/* Trending Section */}
                    <div className="border-t border-[var(--border)]">
                        <div className="max-w-6xl mx-auto px-6 py-10">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-6">Trending Now</h3>
                            <div className="flex flex-wrap gap-3">
                                {['Ukraine Conflict', 'AI Regulation', 'Climate Summit', 'Supply Chain', 'China Trade'].map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/search?q=${encodeURIComponent(tag)}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-sm font-sans text-[var(--foreground)] transition-colors"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="bg-[var(--primary)]">
                        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="text-xl font-bold text-white mb-1">Stay Informed</h4>
                                <p className="text-sm text-red-100">
                                    Get the daily briefing on global impacts delivered to your inbox.
                                </p>
                            </div>
                            <Link
                                href="/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="bg-white text-[var(--primary)] px-8 py-3 text-sm font-bold uppercase tracking-wider font-sans hover:bg-slate-100 transition-colors rounded"
                            >
                                Subscribe Free
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
