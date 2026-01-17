'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const impactChains = [
  { id: 'chip-crisis', label: '#CHIP-CRISIS', nodes: 12, progress: 75, color: '#dc2626' },
  { id: 'arctic-drill', label: '#ARCTIC-DRILL', nodes: 8, progress: 40, color: '#3b82f6' },
  { id: 'election-data', label: '#ELECTION-DATA', nodes: 22, progress: 90, color: '#f59e0b' },
];

const menuItems = [
  { href: '/investigations', label: 'My Investigations', icon: '📁' },
  { href: '/watchlist', label: 'Watchlist', icon: '👁️' },
  { href: '/impact-map', label: 'Impact Map', icon: '🗺️' },
  { href: '/timeline', label: 'Master Timeline', icon: '📅' },
];

const nodeColors: Record<string, string> = {
  person: '#3b82f6',
  company: '#8b5cf6',
  location: '#22c55e',
  commodity: '#f59e0b',
  sector: '#ec4899',
  policy: '#06b6d4',
  event: '#ef4444',
  other: '#64748b'
};

import { getTrendingEntities, TrendingEntity } from '@/lib/actions/entities';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const [chains, setChains] = useState<TrendingEntity[]>([]);

  useEffect(() => {
    getTrendingEntities(3).then(setChains);
  }, []);

  return (
    <aside className="hidden lg:block w-80 border-l border-[var(--border)] bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] font-sans h-full shrink-0">
      <div className="p-6 sticky top-0">
        {/* Header */}
        <h3 className="section-title text-[var(--muted-foreground)] mb-6 border-b border-[var(--border)] pb-2">
          Active Impact Chains
        </h3>

        {/* Impact chains - using Real Entities */}
        <div className="space-y-6">
          {chains.length === 0 ? (
            <div className="text-xs text-[var(--muted-foreground)] italic">Loading trends...</div>
          ) : (
            chains.map((chain) => {
              const color = nodeColors[chain.type] || nodeColors.other;
              // Mock progress based on count (cap at 100%)
              const progress = Math.min((chain.articleCount || 0) * 20, 100);

              return (
                <Link
                  key={chain.id}
                  href={`/entity/${chain.id}`}
                  className="block group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-bold uppercase truncate max-w-[140px]"
                      style={{ color }}
                    >
                      #{chain.name.replace(/\s+/g, '-')}
                    </span>
                    <span className="text-[10px] text-[var(--muted-foreground)]">
                      {chain.articleCount} Articles
                    </span>
                  </div>
                  <div className="impact-bar">
                    <div
                      className="impact-bar-fill"
                      style={{ width: `${progress}%`, background: color }}
                    />
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-[var(--border)]" />

        {/* Navigation */}
        <h3 className="section-title text-[var(--muted-foreground)] mb-4">
          The Board
        </h3>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${pathname === item.href
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-[var(--muted-foreground)] hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Alert box */}
        <div className="mt-8 p-4 bg-slate-50 border border-[var(--border)] rounded">
          <h4 className="text-[10px] font-bold uppercase mb-2 text-[var(--muted-foreground)] tracking-wider">
            Investigative Alert
          </h4>
          <p className="text-xs text-[var(--foreground)] leading-relaxed">
            Major connection detected between "Sudan Mineral Rights" and "London Shell Companies".
          </p>
          <button className="mt-3 text-[10px] text-[var(--primary)] font-bold uppercase tracking-widest hover:underline">
            Analyze Bridge →
          </button>
        </div>

        {/* User section */}
        <div className="mt-8 pt-4 border-t border-[var(--border)]">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2 text-[var(--muted-foreground)] hover:text-slate-900 text-sm"
          >
            <span>👤</span>
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
