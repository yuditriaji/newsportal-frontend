/**
 * Story Detail Page
 * 
 * Full synthesized story with sections, source articles, entity connections, and impact predictions.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getStoryBySlug } from '@/lib/actions/stories';
import { ConnectionGraph } from '@/components/stories/ConnectionGraph';
import { ImpactSummary } from '@/components/stories/ImpactMeter';

export const dynamic = 'force-dynamic';

interface StoryPageProps {
    params: Promise<{ slug: string }>;
}

function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(dateString));
}

/**
 * Render content with inline citations linked to sources
 */
function SynthesizedContent({
    content,
    citations,
    articles
}: {
    content: string;
    citations: Array<{ source: string; article_id: string }>;
    articles: any[];
}) {
    // Simple rendering - just show the content with citation markers
    // In production, you'd parse and link citations properly
    return (
        <p className="text-lg leading-relaxed text-[var(--foreground)]">
            {content}
        </p>
    );
}

export default async function StoryPage({ params }: StoryPageProps) {
    const { slug } = await params;
    const story = await getStoryBySlug(slug);

    if (!story) {
        notFound();
    }

    return (
        <article className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm font-sans text-[var(--muted-foreground)] mb-6">
                <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
                <span className="mx-2">/</span>
                <span>Story</span>
            </nav>

            {/* Header */}
            <header className="mb-10">
                {/* Source badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    {story.articles.slice(0, 5).map((article, idx) => (
                        <span
                            key={idx}
                            className="text-xs font-semibold uppercase tracking-wide px-2 py-1 bg-slate-100 text-slate-600 rounded"
                        >
                            {article.source}
                        </span>
                    ))}
                    {story.source_count > 5 && (
                        <span className="text-xs text-[var(--muted-foreground)]">
                            +{story.source_count - 5} sources
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                    {story.title}
                </h1>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] font-sans">
                    <time>{formatDate(story.published_at)}</time>
                    <span>•</span>
                    <span>{story.source_count} sources</span>
                </div>
            </header>

            {/* Hero Image */}
            {story.hero_image_url && (
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-10">
                    <Image
                        src={story.hero_image_url}
                        alt={story.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main content */}
                <div className="lg:col-span-8">
                    {/* Summary */}
                    <div className="bg-slate-50 rounded-lg p-6 mb-8">
                        <p className="text-xl font-serif leading-relaxed">
                            {story.summary}
                        </p>
                    </div>

                    {/* Synthesis sections */}
                    {story.synthesis && story.synthesis.length > 0 ? (
                        story.synthesis.map((section, idx) => (
                            <section key={idx} className="mb-10">
                                <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-[var(--border)]">
                                    {section.title}
                                </h2>
                                <SynthesizedContent
                                    content={section.content}
                                    citations={section.citations}
                                    articles={story.articles}
                                />
                            </section>
                        ))
                    ) : (
                        <section className="mb-10">
                            <p className="text-lg leading-relaxed text-[var(--foreground)]">
                                {story.summary}
                            </p>
                        </section>
                    )}

                    {/* Source articles */}
                    <section className="border-t border-[var(--border)] pt-10 mt-10">
                        <h2 className="text-xl font-bold mb-6">Sources ({story.articles.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {story.articles.map((article, idx) => (
                                <a
                                    key={idx}
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 bg-white border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        {article.image_url && (
                                            <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                                                <Image
                                                    src={article.image_url}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-semibold text-[var(--primary)] uppercase">
                                                {article.source}
                                            </span>
                                            <h3 className="text-sm font-semibold leading-tight mt-1 group-hover:text-[var(--primary)] line-clamp-2">
                                                {article.title}
                                            </h3>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-4">
                    {/* Impact predictions */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
                            Predicted Impact
                        </h3>
                        <ImpactSummary impacts={story.impacts} />
                    </div>

                    {/* Entity connections */}
                    {story.connections.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
                                Connection Board
                            </h3>
                            <ConnectionGraph
                                entities={story.entities}
                                connections={story.connections}
                                className="h-72"
                            />
                        </div>
                    )}

                    {/* Related entities */}
                    {story.entities.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
                                Key Entities
                            </h3>
                            <div className="space-y-2">
                                {story.entities.map((entity, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/entity/${entity.id}`}
                                        className="flex items-center justify-between p-3 bg-white border border-[var(--border)] rounded hover:border-[var(--primary)] transition-colors"
                                    >
                                        <div>
                                            <span className="font-medium">{entity.name}</span>
                                            {entity.role === 'primary' && (
                                                <span className="ml-2 text-xs bg-[var(--primary)] text-white px-1.5 py-0.5 rounded">
                                                    Key
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-[var(--muted-foreground)] uppercase">
                                            {entity.type}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </article>
    );
}
