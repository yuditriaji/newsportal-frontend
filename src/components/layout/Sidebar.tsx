'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/world', label: 'World', icon: '🌍' },
  { href: '/geopolitics', label: 'Geopolitics', icon: '🌐' },
  { href: '/business', label: 'Business', icon: '📊' },
  { href: '/technology', label: 'Technology', icon: '💻' },
  { href: '/politics', label: 'Politics', icon: '🏛️' },
  { href: '/science', label: 'Science', icon: '🔬' },
];

const userItems = [
  { href: '/watchlist', label: 'Watchlist', icon: '👁️' },
  { href: '/investigations', label: 'Investigations', icon: '🔍' },
  { href: '/impact-map', label: 'Impact Map', icon: '🗺️' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[var(--sidebar)] border-r border-[var(--border)]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-[var(--border)]">
        <span className="text-2xl">🔍</span>
        <span className="text-xl font-bold text-[var(--foreground)]">NewsPortal</span>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4">
        <div className="mb-2 px-3 text-xs font-semibold uppercase text-[var(--muted-foreground)]">
          Categories
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="my-4 border-t border-[var(--border)]" />

        <div className="mb-2 px-3 text-xs font-semibold uppercase text-[var(--muted-foreground)]">
          Your Space
        </div>
        <ul className="space-y-1">
          {userItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--border)] p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--accent)]"
        >
          <span>⚙️</span>
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
