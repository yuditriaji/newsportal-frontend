import { Article } from '@/lib/api/client';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
    articles: Article[];
    layout?: 'featured' | 'grid' | 'list';
}

export function ArticleGrid({ articles, layout = 'featured' }: ArticleGridProps) {
    if (articles.length === 0) {
        return (
            <div className="py-16 text-center border border-dashed border-[var(--border)] rounded">
                <span className="text-4xl mb-4 block">📰</span>
                <h3 className="text-xl font-bold mb-2">No articles found</h3>
                <p className="text-[var(--muted-foreground)] font-sans text-sm">
                    Check back later for new investigations
                </p>
            </div>
        );
    }

    // Featured layout - Hero + sidebar
    if (layout === 'featured' && articles.length > 0) {
        const [hero, ...rest] = articles;
        const sidebarArticles = rest.slice(0, 3);
        const gridArticles = rest.slice(3);

        return (
            <div className="space-y-12">
                {/* Hero + Latest section */}
                <section className="grid grid-cols-12 gap-8">
                    {/* Hero */}
                    <div className="col-span-12 lg:col-span-8">
                        <ArticleCard article={hero} variant="hero" />
                    </div>

                    {/* Latest sidebar */}
                    <div className="col-span-12 lg:col-span-4 border-l border-[var(--border)] pl-8">
                        <h3 className="section-title section-divider">
                            Latest Nodes
                        </h3>
                        <div className="divide-y divide-[var(--border)]">
                            {sidebarArticles.map((article) => (
                                <ArticleCard key={article.id} article={article} variant="small" />
                            ))}
                        </div>
                        <button className="mt-6 w-full py-3 border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest font-sans hover:bg-[var(--muted)] transition-colors">
                            View All Investigations
                        </button>
                    </div>
                </section>

                {/* Evidence grid */}
                {gridArticles.length > 0 && (
                    <section className="border-t border-[var(--border)] pt-12">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold">Live Impact Map</h2>
                                <p className="text-[var(--muted-foreground)] font-sans text-sm mt-1">
                                    Real-time visualization of interconnected events
                                </p>
                            </div>
                            <span className="live-indicator text-[10px] font-bold font-sans uppercase tracking-wider text-[var(--primary)]">
                                Live Sync Active
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {gridArticles.map((article) => (
                                <ArticleCard key={article.id} article={article} variant="medium" />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        );
    }

    // Grid layout - Evidence cards
    if (layout === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="medium" />
                ))}
            </div>
        );
    }

    // List layout - Compact
    return (
        <div className="divide-y divide-[var(--border)]">
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="small" />
            ))}
        </div>
    );
}
