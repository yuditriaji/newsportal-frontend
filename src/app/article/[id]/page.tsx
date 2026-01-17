import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface ArticlePageProps {
    params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: article, error } = await supabase
        .from('articles')
        .select(`
      *,
      news_sources (
        name,
        credibility_score,
        tier,
        logo_url
      ),
      article_entities (
        confidence,
        context,
        entities (
          id,
          name,
          type
        )
      )
    `)
        .eq('id', id)
        .single();

    if (error || !article) {
        notFound();
    }

    const entities = article.article_entities?.map((ae: any) => ({
        ...ae.entities,
        confidence: ae.confidence,
        context: ae.context,
    })) || [];

    const sentimentColor =
        article.sentiment === 'positive' ? 'text-green-600' :
            article.sentiment === 'negative' ? 'text-red-600' :
                'text-slate-500';

    return (
        <article className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[var(--muted-foreground)] mb-8">
                <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
                <span>/</span>
                {article.category && (
                    <>
                        <Link href={`/category/${article.category.toLowerCase()}`} className="hover:text-[var(--primary)]">
                            {article.category}
                        </Link>
                        <span>/</span>
                    </>
                )}
                <span className="text-[var(--foreground)]">Article</span>
            </nav>

            {/* Category label */}
            {article.category && (
                <span className="category-label block mb-4">{article.category}</span>
            )}

            {/* Title */}
            <h1 className="headline text-4xl md:text-5xl mb-6">
                {article.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 meta-text mb-8 pb-8 border-b border-[var(--border)]">
                {article.news_sources?.name && (
                    <span className="font-bold">{article.news_sources.name}</span>
                )}
                <span className="text-[var(--muted-foreground)]">
                    {new Date(article.published_at).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </span>
                {article.sentiment && (
                    <span className={`flex items-center gap-1 ${sentimentColor}`}>
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
                    </span>
                )}
            </div>

            {/* Featured Image */}
            {article.image_url && (
                <div className="aspect-[16/9] overflow-hidden bg-slate-100 mb-8">
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* AI Summary */}
            {article.summary && (
                <div className="bg-[var(--muted)] p-6 mb-8 border-l-4 border-[var(--primary)]">
                    <h3 className="text-xs font-bold uppercase tracking-wider font-sans mb-2 text-[var(--muted-foreground)]">
                        AI Summary
                    </h3>
                    <p className="lead-text text-lg">{article.summary}</p>
                </div>
            )}

            {/* Excerpt */}
            {article.excerpt && (
                <div className="prose prose-lg max-w-none mb-8">
                    <p className="text-xl leading-relaxed text-[var(--foreground)]">
                        {article.excerpt}
                    </p>
                </div>
            )}

            {/* Read Full Article */}
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded mb-8 text-center">
                <p className="text-sm text-[var(--muted-foreground)] font-sans mb-4">
                    This is an excerpt. Read the full article at the source.
                </p>
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--foreground)] text-white font-bold uppercase tracking-wider text-xs font-sans hover:bg-[var(--primary)] transition-colors"
                >
                    Read Full Article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>

            {/* Extracted Entities */}
            {entities.length > 0 && (
                <div className="border-t border-[var(--border)] pt-8 mb-8">
                    <h3 className="section-title section-divider">Connected Entities</h3>
                    <div className="flex flex-wrap gap-2">
                        {entities.map((entity: any) => (
                            <Link
                                key={entity.id}
                                href={`/entity/${entity.id}`}
                                className={`px-3 py-1.5 text-sm font-sans rounded-full border transition-colors hover:bg-[var(--muted)] ${entity.type === 'person' ? 'border-blue-300 text-blue-600' :
                                        entity.type === 'company' ? 'border-purple-300 text-purple-600' :
                                            entity.type === 'location' ? 'border-green-300 text-green-600' :
                                                entity.type === 'commodity' ? 'border-amber-300 text-amber-600' :
                                                    'border-slate-300 text-slate-600'
                                    }`}
                            >
                                {entity.name}
                                <span className="ml-1 opacity-60 text-xs capitalize">({entity.type})</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Source info */}
            {article.news_sources && (
                <div className="flex items-center gap-4 p-4 bg-[var(--muted)] rounded">
                    <div className="flex-1">
                        <p className="font-bold text-sm">{article.news_sources.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)] font-sans">
                            Credibility: {article.news_sources.credibility_score}/100 • {article.news_sources.tier} tier
                        </p>
                    </div>
                    <Link
                        href={`/source/${article.news_sources.name?.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] hover:underline font-sans"
                    >
                        View Source →
                    </Link>
                </div>
            )}
        </article>
    );
}
