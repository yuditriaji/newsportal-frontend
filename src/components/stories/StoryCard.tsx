/**
 * StoryCard Component
 * 
 * Displays a synthesized story card with source logos, summary, and impact indicators.
 * Used on homepage and category pages.
 */

import Link from 'next/link';
import Image from 'next/image';

export interface Story {
    id: string;
    title: string;
    slug: string;
    summary: string;
    hero_image_url?: string;
    source_count: number;
    published_at: string;
    sources?: Array<{ name: string; logo_url?: string }>;
    impacts?: Array<{
        sector: string;
        type: 'positive' | 'negative' | 'neutral' | 'uncertain';
        severity: number;
    }>;
}

interface StoryCardProps {
    story: Story;
    variant?: 'hero' | 'medium' | 'compact';
}

const sectorIcons: Record<string, string> = {
    economic: '📊',
    geopolitical: '🌐',
    political: '🏛️',
    social: '👥',
    technological: '💻',
    supply_chain: '🚚',
    ecological: '🌍',
};

const impactColors: Record<string, string> = {
    positive: 'bg-green-100 text-green-800',
    negative: 'bg-red-100 text-red-800',
    neutral: 'bg-slate-100 text-slate-800',
    uncertain: 'bg-amber-100 text-amber-800',
};

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
}

export function StoryCard({ story, variant = 'medium' }: StoryCardProps) {
    const isHero = variant === 'hero';
    const isCompact = variant === 'compact';

    return (
        <article className={`group ${isHero ? 'col-span-full' : ''}`}>
            <Link href={`/story/${story.slug}`} className="block">
                {/* Image */}
                {story.hero_image_url && !isCompact && (
                    <div className={`relative overflow-hidden rounded-lg mb-4 ${isHero ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                        <Image
                            src={story.hero_image_url}
                            alt={story.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    </div>
                )}

                {/* Source badges */}
                <div className="flex items-center gap-2 mb-3">
                    {story.sources?.slice(0, 3).map((source, idx) => (
                        <span
                            key={idx}
                            className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 bg-slate-100 text-slate-600 rounded"
                        >
                            {source.name}
                        </span>
                    ))}
                    {story.source_count > 3 && (
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                            +{story.source_count - 3} more
                        </span>
                    )}
                </div>

                {/* Title */}
                <h2 className={`font-bold leading-tight mb-2 group-hover:text-[var(--primary)] transition-colors ${isHero ? 'text-3xl md:text-4xl' : isCompact ? 'text-base' : 'text-xl'
                    }`}>
                    {story.title}
                </h2>

                {/* Summary */}
                {!isCompact && (
                    <p className={`text-[var(--muted-foreground)] font-sans leading-relaxed mb-4 ${isHero ? 'text-lg' : 'text-sm'
                        }`}>
                        {story.summary}
                    </p>
                )}

                {/* Footer: Time + Impact badges */}
                <div className="flex items-center justify-between">
                    <time className="text-xs text-[var(--muted-foreground)] font-sans">
                        {formatTimeAgo(story.published_at)}
                    </time>

                    {story.impacts && story.impacts.length > 0 && (
                        <div className="flex gap-1">
                            {story.impacts.slice(0, 2).map((impact, idx) => (
                                <span
                                    key={idx}
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${impactColors[impact.type]}`}
                                >
                                    {sectorIcons[impact.sector]} {impact.sector}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>
        </article>
    );
}

/**
 * StoryGrid Component
 * 
 * Displays a grid of story cards with optional hero layout.
 */
interface StoryGridProps {
    stories: Story[];
    layout?: 'featured' | 'grid';
}

export function StoryGrid({ stories, layout = 'grid' }: StoryGridProps) {
    if (stories.length === 0) {
        return (
            <div className="py-16 text-center border border-dashed border-[var(--border)] rounded-lg">
                <span className="text-6xl mb-4 block">📰</span>
                <h3 className="text-2xl font-bold mb-2">No Stories Yet</h3>
                <p className="text-[var(--muted-foreground)] font-sans text-sm max-w-md mx-auto">
                    Stories are automatically generated when multiple sources cover the same topic.
                    Check back soon for synthesized news briefings.
                </p>
            </div>
        );
    }

    if (layout === 'featured' && stories.length > 0) {
        const [hero, ...rest] = stories;

        return (
            <div className="space-y-12">
                {/* Hero story */}
                <StoryCard story={hero} variant="hero" />

                {/* Grid of remaining stories */}
                {rest.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rest.map(story => (
                            <StoryCard key={story.id} story={story} variant="medium" />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map(story => (
                <StoryCard key={story.id} story={story} variant="medium" />
            ))}
        </div>
    );
}
