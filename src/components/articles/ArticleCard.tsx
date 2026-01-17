import Link from 'next/link';
import { Article } from '@/lib/api/client';

interface ArticleCardProps {
    article: Article;
    variant?: 'default' | 'compact' | 'hero';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
    const sentimentClass = article.sentiment
        ? `sentiment-${article.sentiment}`
        : '';

    const credibilityClass =
        (article.news_sources?.credibility_score || 50) > 70 ? 'credibility-high' :
            (article.news_sources?.credibility_score || 50) > 40 ? 'credibility-medium' :
                'credibility-low';

    if (variant === 'hero') {
        return (
            <Link href={`/article/${article.id}`} className="group block">
                <article className={`relative overflow-hidden rounded-xl bg-[var(--card)] ${credibilityClass}`}>
                    {article.image_url && (
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-2 mb-2">
                            {article.category && (
                                <span className="px-2 py-1 text-xs font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded">
                                    {article.category}
                                </span>
                            )}
                            {article.sentiment && (
                                <span className={`text-xs font-medium ${sentimentClass}`}>
                                    {article.sentiment === 'positive' ? '📈' : article.sentiment === 'negative' ? '📉' : '➖'}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[var(--primary)]">
                            {article.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                            <span>{article.news_sources?.name}</span>
                            <span>•</span>
                            <time>{new Date(article.published_at).toLocaleDateString()}</time>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    if (variant === 'compact') {
        return (
            <Link href={`/article/${article.id}`} className="group block">
                <article className={`flex gap-4 p-3 rounded-lg hover:bg-[var(--accent)] ${credibilityClass}`}>
                    {article.image_url && (
                        <img
                            src={article.image_url}
                            alt=""
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[var(--foreground)] line-clamp-2 group-hover:text-[var(--primary)]">
                            {article.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[var(--muted-foreground)]">
                            <span>{article.news_sources?.name}</span>
                            <span>•</span>
                            <time>{new Date(article.published_at).toLocaleDateString()}</time>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    // Default variant
    return (
        <Link href={`/article/${article.id}`} className="group block">
            <article className={`rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors ${credibilityClass}`}>
                {article.image_url && (
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        {article.category && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded">
                                {article.category}
                            </span>
                        )}
                        {article.sentiment && (
                            <span className={`text-xs ${sentimentClass}`}>
                                {article.sentiment === 'positive' ? '📈 Positive' :
                                    article.sentiment === 'negative' ? '📉 Negative' : '➖ Neutral'}
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--card-foreground)] line-clamp-2 mb-2 group-hover:text-[var(--primary)]">
                        {article.title}
                    </h3>
                    {article.excerpt && (
                        <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
                            {article.excerpt}
                        </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{article.news_sources?.name}</span>
                            {article.news_sources?.credibility_score && (
                                <span className="px-1.5 py-0.5 bg-[var(--muted)] rounded text-[10px]">
                                    {article.news_sources.credibility_score}% credible
                                </span>
                            )}
                        </div>
                        <time>{new Date(article.published_at).toLocaleDateString()}</time>
                    </div>
                </div>
            </article>
        </Link>
    );
}
