import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArticleGrid } from '@/components/articles/ArticleGrid';

interface EntityPageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EntityPage({ params }: EntityPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Get entity details
    const { data: entity, error } = await supabase
        .from('entities')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !entity) {
        notFound();
    }

    // Get related articles
    const { data: articleEntities } = await supabase
        .from('article_entities')
        .select(`
      confidence,
      context,
      articles (
        id,
        title,
        excerpt,
        url,
        image_url,
        published_at,
        category,
        sentiment
      )
    `)
        .eq('entity_id', id)
        .order('confidence', { ascending: false })
        .limit(20);

    const articles = (articleEntities || [])
        .map((ae: any) => ae.articles)
        .filter(Boolean);

    // Get connected entities (co-occurring in same articles)
    const articleIds = articles.map((a: any) => a.id);
    let connectedEntities: any[] = [];

    if (articleIds.length > 0) {
        const { data: connections } = await supabase
            .from('article_entities')
            .select(`
        entity_id,
        entities (
          id,
          name,
          type
        )
      `)
            .in('article_id', articleIds)
            .neq('entity_id', id)
            .limit(50);

        // Count occurrences and deduplicate
        const entityCounts: Record<string, { entity: any; count: number }> = {};
        (connections || []).forEach((c: any) => {
            if (c.entities) {
                const key = c.entities.id;
                if (!entityCounts[key]) {
                    entityCounts[key] = { entity: c.entities, count: 0 };
                }
                entityCounts[key].count++;
            }
        });

        connectedEntities = Object.values(entityCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }

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
        <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[var(--muted-foreground)] mb-6">
                <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
                <span>/</span>
                <Link href="/impact-map" className="hover:text-[var(--primary)]">Entities</Link>
                <span>/</span>
                <span className="text-[var(--foreground)]">{entity.name}</span>
            </nav>

            {/* Header */}
            <div className="flex items-start gap-6 mb-8 pb-8 border-b border-[var(--border)]">
                <div className="flex-1">
                    <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${typeColors[entity.type] || 'bg-slate-100 text-slate-600'}`}>
                        {entity.type}
                    </span>
                    <h1 className="text-4xl font-bold mt-3">{entity.name}</h1>
                    <p className="text-[var(--muted-foreground)] font-sans mt-2">
                        Mentioned in {articles.length} articles • Connected to {connectedEntities.length} entities
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-[var(--border)] font-bold uppercase tracking-wider text-xs font-sans hover:bg-[var(--muted)] transition-colors">
                        Add to Watchlist
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Main content - Articles */}
                <div className="col-span-8">
                    <h2 className="section-title section-divider">Related Articles</h2>
                    {articles.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-[var(--border)] rounded">
                            <p className="text-[var(--muted-foreground)] font-sans">
                                No articles found for this entity
                            </p>
                        </div>
                    ) : (
                        <ArticleGrid articles={articles} layout="list" />
                    )}
                </div>

                {/* Sidebar - Connected entities */}
                <div className="col-span-4">
                    <h2 className="section-title section-divider">Connected Entities</h2>
                    {connectedEntities.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-[var(--border)] rounded">
                            <p className="text-sm text-[var(--muted-foreground)] font-sans">
                                No connections found
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {connectedEntities.map(({ entity: connEntity, count }) => (
                                <Link
                                    key={connEntity.id}
                                    href={`/entity/${connEntity.id}`}
                                    className="flex items-center justify-between p-3 bg-[var(--muted)] rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <div>
                                        <span className="font-bold text-sm">{connEntity.name}</span>
                                        <span className={`ml-2 text-[10px] font-bold uppercase tracking-wider ${typeColors[connEntity.type]?.replace('bg-', 'text-').replace('-100', '-600') || 'text-slate-500'}`}>
                                            {connEntity.type}
                                        </span>
                                    </div>
                                    <span className="text-xs text-[var(--muted-foreground)] font-sans">
                                        {count} shared
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-8">
                        <Link
                            href="/impact-map"
                            className="block w-full px-4 py-3 bg-[var(--foreground)] text-white text-center font-bold uppercase tracking-wider text-xs font-sans hover:bg-[var(--primary)] transition-colors"
                        >
                            View on Impact Map
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
