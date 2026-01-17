import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getInvestigations(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('investigations')
        .select(`
      id,
      title,
      description,
      status,
      visibility,
      created_at,
      updated_at,
      investigation_articles (count)
    `)
        .eq('owner_id', userId)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching investigations:', error);
        return [];
    }

    return data || [];
}

export default async function InvestigationsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirect=/investigations');
    }

    const investigations = await getInvestigations(user.id);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Investigations</h1>
                    <p className="text-[var(--muted-foreground)] font-sans text-sm mt-1">
                        Track and connect the threads of your research
                    </p>
                </div>
                <Link
                    href="/investigations/new"
                    className="px-4 py-2 bg-[var(--primary)] text-white font-bold uppercase tracking-wider text-xs font-sans hover:opacity-90 transition-opacity"
                >
                    + New Investigation
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Active Cases', value: investigations.filter(i => i.status === 'active').length, icon: '📂' },
                    { label: 'Total Articles', value: investigations.reduce((acc, i) => acc + ((i.investigation_articles as any)?.[0]?.count || 0), 0), icon: '📰' },
                    { label: 'Archived', value: investigations.filter(i => i.status === 'archived').length, icon: '📦' },
                ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-[var(--card)] border border-[var(--border)] rounded">
                        <span className="text-2xl">{stat.icon}</span>
                        <div className="text-2xl font-bold mt-2">{stat.value}</div>
                        <div className="text-xs font-sans text-[var(--muted-foreground)] uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Investigations list */}
            {investigations.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[var(--border)] rounded">
                    <span className="text-6xl mb-4 block">🔍</span>
                    <h3 className="text-xl font-bold mb-2">No investigations yet</h3>
                    <p className="text-[var(--muted-foreground)] font-sans text-sm mb-6">
                        Start your first investigation to track connections between news events
                    </p>
                    <Link
                        href="/investigations/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--foreground)] text-white font-bold uppercase tracking-wider text-xs font-sans hover:bg-[var(--primary)] transition-colors"
                    >
                        Create Investigation
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {investigations.map((investigation) => (
                        <Link
                            key={investigation.id}
                            href={`/investigations/${investigation.id}`}
                            className="block p-6 bg-[var(--card)] border border-[var(--border)] rounded hover:border-[var(--primary)] transition-colors group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${investigation.status === 'active' ? 'bg-green-100 text-green-700' :
                                                investigation.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            {investigation.status}
                                        </span>
                                        <span className="text-[10px] font-sans text-[var(--muted-foreground)] uppercase tracking-wider">
                                            {investigation.visibility}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold group-hover:text-[var(--primary)] transition-colors">
                                        {investigation.title}
                                    </h3>
                                    {investigation.description && (
                                        <p className="text-sm text-[var(--muted-foreground)] font-sans mt-1 line-clamp-2">
                                            {investigation.description}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right text-xs font-sans text-[var(--muted-foreground)]">
                                    <div>{(investigation.investigation_articles as any)?.[0]?.count || 0} articles</div>
                                    <div className="mt-1">
                                        Updated {new Date(investigation.updated_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
