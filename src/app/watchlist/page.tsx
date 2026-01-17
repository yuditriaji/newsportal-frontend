import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getWatchlist(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('watchlist')
        .select(`
      id,
      notify,
      created_at,
      entities (
        id,
        name,
        type
      )
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching watchlist:', error);
        return [];
    }

    return data || [];
}

export default async function WatchlistPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirect=/watchlist');
    }

    const watchlist = await getWatchlist(user.id);

    const typeColors: Record<string, string> = {
        person: 'bg-blue-100 text-blue-700',
        company: 'bg-purple-100 text-purple-700',
        location: 'bg-green-100 text-green-700',
        commodity: 'bg-amber-100 text-amber-700',
        sector: 'bg-pink-100 text-pink-700',
        policy: 'bg-cyan-100 text-cyan-700',
        event: 'bg-red-100 text-red-700',
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Watchlist</h1>
                <p className="text-[var(--muted-foreground)] font-sans text-sm mt-1">
                    Track entities and get alerts when they appear in news
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Tracked Entities', value: watchlist.length, icon: '👁️' },
                    { label: 'With Alerts', value: watchlist.filter(w => w.notify).length, icon: '🔔' },
                    { label: 'Entity Types', value: new Set(watchlist.map(w => (w.entities as any)?.type)).size, icon: '🏷️' },
                ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-[var(--muted)] rounded-lg">
                        <span className="text-2xl">{stat.icon}</span>
                        <div className="text-2xl font-bold mt-2">{stat.value}</div>
                        <div className="text-xs font-sans text-[var(--muted-foreground)] uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Watchlist items */}
            {watchlist.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-lg">
                    <span className="text-6xl mb-4 block">👁️</span>
                    <h3 className="text-xl font-bold mb-2">Your watchlist is empty</h3>
                    <p className="text-[var(--muted-foreground)] font-sans text-sm mb-6 max-w-md mx-auto">
                        Add entities from articles or the Impact Map to track them and receive alerts
                    </p>
                    <Link
                        href="/impact-map"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--foreground)] text-white font-bold uppercase tracking-wider text-xs font-sans hover:bg-[var(--primary)] transition-colors"
                    >
                        Browse Entities →
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {watchlist.map((item) => {
                        const entity = item.entities as any;
                        if (!entity) return null;

                        return (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg group"
                            >
                                <Link href={`/entity/${entity.id}`} className="flex items-center gap-4 flex-1">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${typeColors[entity.type] || 'bg-slate-100 text-slate-600'}`}>
                                        {entity.type}
                                    </span>
                                    <span className="font-bold group-hover:text-[var(--primary)] transition-colors">
                                        {entity.name}
                                    </span>
                                </Link>
                                <div className="flex items-center gap-4">
                                    <button
                                        className={`flex items-center gap-1 text-xs font-sans ${item.notify ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}
                                    >
                                        {item.notify ? '🔔' : '🔕'}
                                        <span>{item.notify ? 'Alerting' : 'Silent'}</span>
                                    </button>
                                    <span className="text-xs text-[var(--muted-foreground)] font-sans">
                                        Added {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                    <button className="opacity-0 group-hover:opacity-100 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all">
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
