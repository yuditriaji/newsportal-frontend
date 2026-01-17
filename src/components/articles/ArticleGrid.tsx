import { Article } from '@/lib/api/client';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
    articles: Article[];
    variant?: 'default' | 'compact';
    showHero?: boolean;
}

export function ArticleGrid({ articles, variant = 'default', showHero = false }: ArticleGridProps) {
    if (articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-4xl mb-4">📰</span>
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">No articles found</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                    Try adjusting your filters or check back later
                </p>
            </div>
        );
    }

    if (showHero && articles.length > 0) {
        const [heroArticle, ...restArticles] = articles;
        return (
            <div className="space-y-6">
                {/* Hero article */}
                <ArticleCard article={heroArticle} variant="hero" />

                {/* Remaining articles in grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} variant={variant} />
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <div className="space-y-2">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
                <ArticleCard key={article.id} article={article} variant={variant} />
            ))}
        </div>
    );
}
