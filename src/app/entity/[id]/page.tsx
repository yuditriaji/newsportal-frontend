import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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

    // Get stories that mention this entity (through story_entities)
    const { data: storyEntities } = await supabase
        .from('story_entities')
        .select(`
            role,
            context,
            stories (
                id,
                title,
                slug,
                summary,
                hero_image_url,
                published_at,
                source_count
            )
        `)
        .eq('entity_id', id)
        .order('role', { ascending: true })
        .limit(20);

    const stories = (storyEntities || [])
        .map((se: any) => se.stories)
        .filter(Boolean);

    // Get articles through stories (story_entities -> story -> story_articles -> articles)
    const storyIds = stories.map((s: any) => s.id);
    let articles: any[] = [];

    if (storyIds.length > 0) {
        const { data: storyArticles } = await supabase
            .from('story_articles')
            .select(`
                articles (
                    id,
                    title,
                    excerpt,
                    url,
                    image_url,
                    published_at,
                    category,
                    sentiment,
                    news_sources ( name )
                )
            `)
            .in('story_id', storyIds)
            .limit(20);

        articles = (storyArticles || [])
            .map((sa: any) => ({
                ...sa.articles,
                news_sources: sa.articles?.news_sources
            }))
            .filter(Boolean);
    }

    // Get connected entities through entity_connections table
    const { data: outgoingConnections } = await supabase
        .from('entity_connections')
        .select(`
            id,
            relationship_type,
            relationship_label,
            strength,
            target_entity:entities!entity_connections_target_entity_id_fkey (
                id, name, type
            )
        `)
        .eq('source_entity_id', id)
        .limit(25);

    const { data: incomingConnections } = await supabase
        .from('entity_connections')
        .select(`
            id,
            relationship_type,
            relationship_label,
            strength,
            source_entity:entities!entity_connections_source_entity_id_fkey (
                id, name, type
            )
        `)
        .eq('target_entity_id', id)
        .limit(25);

    // Combine and deduplicate connections
    const connectionMap = new Map<string, { entity: any; relationship: string; strength: number }>();

    (outgoingConnections || []).forEach((c: any) => {
        if (c.target_entity) {
            connectionMap.set(c.target_entity.id, {
                entity: c.target_entity,
                relationship: c.relationship_label || c.relationship_type,
                strength: c.strength
            });
        }
    });

    (incomingConnections || []).forEach((c: any) => {
        if (c.source_entity && !connectionMap.has(c.source_entity.id)) {
            connectionMap.set(c.source_entity.id, {
                entity: c.source_entity,
                relationship: c.relationship_label || c.relationship_type,
                strength: c.strength
            });
        }
    });

    const connectedEntities = Array.from(connectionMap.values())
        .sort((a, b) => b.strength - a.strength);

    const typeColors: Record<string, string> = {
        person: 'bg-blue-100 text-blue-700',
        company: 'bg-purple-100 text-purple-700',
        organization: 'bg-purple-100 text-purple-700',
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
                        Featured in {stories.length} stories • Connected to {connectedEntities.length} entities
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-[var(--border)] font-bold uppercase tracking-wider text-xs font-sans hover:bg-[var(--muted)] transition-colors">
                        Add to Watchlist
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Main content - Stories */}
                <div className="col-span-8">
                    <h2 className="section-title section-divider">Related Stories</h2>
                    {stories.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-[var(--border)] rounded">
                            <p className="text-[var(--muted-foreground)] font-sans">
                                No stories found for this entity
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {stories.map((story: any) => (
                                <Link
                                    key={story.id}
                                    href={`/story/${story.slug}`}
                                    className="block p-4 border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-colors group"
                                >
                                    <div className="flex gap-4">
                                        {story.hero_image_url && (
                                            <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                                                <Image
                                                    src={story.hero_image_url}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg group-hover:text-[var(--primary)] line-clamp-2">
                                                {story.title}
                                            </h3>
                                            <p className="text-sm text-[var(--muted-foreground)] font-sans mt-1 line-clamp-2">
                                                {story.summary}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted-foreground)] font-sans">
                                                <span>{new Date(story.published_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{story.source_count} sources</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Source Articles */}
                    {articles.length > 0 && (
                        <div className="mt-10">
                            <h2 className="section-title section-divider">Source Articles</h2>
                            <div className="space-y-3">
                                {articles.slice(0, 10).map((article: any) => (
                                    <a
                                        key={article.id}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 border border-[var(--border)] rounded hover:border-[var(--primary)] transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-semibold text-[var(--primary)] uppercase">
                                                {article.news_sources?.name || 'Source'}
                                            </span>
                                            <h4 className="font-medium text-sm line-clamp-1 mt-0.5">
                                                {article.title}
                                            </h4>
                                        </div>
                                        <span className="text-xs text-[var(--muted-foreground)]">↗</span>
                                    </a>
                                ))}
                            </div>
                        </div>
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
                            {connectedEntities.map(({ entity: connEntity, relationship, strength }) => (
                                <Link
                                    key={connEntity.id}
                                    href={`/entity/${connEntity.id}`}
                                    className="block p-3 bg-[var(--muted)] rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm">{connEntity.name}</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${typeColors[connEntity.type] || 'bg-slate-100 text-slate-600'}`}>
                                            {connEntity.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-[var(--muted-foreground)] italic">
                                            {relationship}
                                        </span>
                                        <span className={`text-xs font-semibold ${strength >= 0.7 ? 'text-green-600' : strength >= 0.4 ? 'text-amber-600' : 'text-slate-600'}`}>
                                            {strength >= 0.7 ? 'Strong' : strength >= 0.4 ? 'Moderate' : 'Weak'}
                                        </span>
                                    </div>
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
