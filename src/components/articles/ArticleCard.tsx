import Link from 'next/link';
import { Article } from '@/lib/api/client';

interface ArticleCardProps {
    article: Article;
    variant?: 'hero' | 'large' | 'medium' | 'small';
}

export function ArticleCard({ article, variant = 'medium' }: ArticleCardProps) {
    const credibilityClass =
        (article.news_sources?.credibility_score || 50) > 70 ? 'credibility-high' :
            (article.news_sources?.credibility_score || 50) > 40 ? 'credibility-medium' :
                'credibility-low';

    // Hero variant - Full width featured article
    if (variant === 'hero') {
        return (
            <Link href={`/article/${article.id}`} className="group block">
                <article className="relative">
                    {/* Image */}
                    <div className="aspect-[16/9] overflow-hidden bg-slate-200 mb-6">
                        {article.image_url ? (
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl">
                        {article.category && (
                            <span className="category-label block mb-2">
                                {article.category}
                            </span>
                        )}
                        <h2 className="headline text-5xl mb-4 group-hover:underline underline-offset-4 decoration-1">
                            {article.title}
                        </h2>
                        {article.excerpt && (
                            <p className="lead-text text-xl mb-6">
                                {article.excerpt}
                            </p>
                        )}
                        <div className="meta-text flex items-center gap-4">
                            <span>By {article.news_sources?.name || 'Staff Reporter'}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    // Large variant - Secondary featured
    if (variant === 'large') {
        return (
            <Link href={`/article/${article.id}`} className="group block">
                <article className={`${credibilityClass}`}>
                    {article.image_url && (
                        <div className="aspect-video overflow-hidden bg-slate-100 mb-4">
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    )}
                    {article.category && (
                        <span className="category-label block mb-2">
                            {article.category}
                        </span>
                    )}
                    <h3 className="headline text-2xl mb-2 group-hover:text-[var(--primary)]">
                        {article.title}
                    </h3>
                    {article.excerpt && (
                        <p className="text-sm text-[var(--muted-foreground)] font-sans leading-relaxed mb-3 line-clamp-2">
                            {article.excerpt}
                        </p>
                    )}
                    <div className="meta-text">
                        {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                </article>
            </Link>
        );
    }

    // Small variant - Compact list item
    if (variant === 'small') {
        return (
            <Link href={`/article/${article.id}`} className="group block py-4 border-b border-[var(--border)] last:border-0">
                <article>
                    {article.category && (
                        <span className="category-label block mb-1">
                            {article.category}
                        </span>
                    )}
                    <h4 className="text-lg font-semibold leading-snug group-hover:text-[var(--primary)] transition-colors">
                        {article.title}
                    </h4>
                    <p className="meta-text mt-2">
                        {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ago
                    </p>
                </article>
            </Link>
        );
    }

    // Medium variant - Evidence card style (default)
    return (
        <Link href={`/article/${article.id}`} className="group block">
            <article className={`evidence-card p-6 ${credibilityClass}`}>
                {/* Evidence number */}
                <span className="text-[10px] font-bold font-sans uppercase text-[var(--muted-foreground)] mb-3 tracking-widest block">
                    Evidence #{article.id.slice(-4).toUpperCase()}
                </span>

                {/* Image */}
                {article.image_url && (
                    <div className="aspect-video mb-4 bg-slate-100 overflow-hidden">
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                )}

                {/* Title */}
                <h4 className="text-lg font-bold mb-3 leading-snug group-hover:text-[var(--primary)]">
                    {article.title}
                </h4>

                {/* Excerpt */}
                {article.excerpt && (
                    <p className="text-sm text-[var(--muted-foreground)] font-sans leading-relaxed mb-4 line-clamp-3">
                        {article.excerpt}
                    </p>
                )}

                {/* Footer */}
                <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center text-[10px] font-bold font-sans uppercase">
                    <span className="text-[var(--primary)]">
                        Connected to: {article.category || 'Global'}
                    </span>
                    <span className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)]">
                        →
                    </span>
                </div>
            </article>
        </Link>
    );
}
