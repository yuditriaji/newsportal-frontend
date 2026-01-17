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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-80 bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] z-40 transform translate-x-[calc(100%-48px)] hover:translate-x-0 transition-transform duration-500 shadow-2xl font-sans">
      <div className="flex h-full">
        {/* Tab indicator */}
        <div className="w-12 bg-slate-900 flex flex-col items-center py-6 gap-8 border-l border-slate-800">
          <div className="rotate-90 origin-center translate-y-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
              Impact Chains
            </span>
          </div>
          <div className="mt-auto mb-4">
            <svg className="w-5 h-5 text-[var(--primary)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <h3 className="section-title text-slate-400 mb-6 border-b border-slate-800 pb-2">
            Active Impact Chains
          </h3>

          {/* Impact chains */}
          <div className="space-y-6">
            {impactChains.map((chain) => (
              <Link
                key={chain.id}
                href={`/chain/${chain.id}`}
                className="block group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: chain.color }}
                  >
                    {chain.label}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {chain.nodes} Connected Nodes
                  </span>
                </div>
                <div className="impact-bar">
                  <div
                    className="impact-bar-fill"
                    style={{ width: `${chain.progress}%`, background: chain.color }}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-slate-800" />

          {/* Navigation */}
          <h3 className="section-title text-slate-400 mb-4">
            The Board
          </h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${pathname === item.href
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Alert box */}
          <div className="mt-8 p-4 bg-slate-900 border border-slate-800 rounded">
            <h4 className="text-[10px] font-bold uppercase mb-2 text-slate-400 tracking-wider">
              Investigative Alert
            </h4>
            <p className="text-xs text-slate-100 leading-relaxed">
              Major connection detected between "Sudan Mineral Rights" and "London Shell Companies".
            </p>
            <button className="mt-3 text-[10px] text-[var(--primary)] font-bold uppercase tracking-widest hover:underline">
              Analyze Bridge →
            </button>
          </div>

          {/* User section */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white text-sm"
            >
              <span>👤</span>
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
