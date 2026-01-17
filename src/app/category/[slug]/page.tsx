import { createClient } from '@/lib/supabase/server';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

const categoryMeta: Record<string, { title: string; description: string }> = {
    geopolitics: {
        title: 'Geopolitics',
        description: 'International relations, diplomacy, and global power dynamics',
    },
    business: {
        title: 'Business',
        description: 'Corporate news, markets, and economic developments',
    },
    technology: {
        title: 'Technology',
        description: 'Tech industry, innovation, and digital transformation',
    },
    politics: {
        title: 'Politics',
        description: 'Government policies, elections, and political movements',
    },
    science: {
        title: 'Science',
        description: 'Research breakthroughs, discoveries, and scientific advancement',
    },
    world: {
        title: 'World',
        description: 'Global news and international events',
    },
    markets: {
        title: 'Markets',
        description: 'Financial markets, stocks, and investment news',
    },
    energy: {
        title: 'Energy',
        description: 'Oil, gas, renewables, and energy policy',
    },
};

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const meta = categoryMeta[slug.toLowerCase()];

    if (!meta) {
        notFound();
    }

    const supabase = await createClient();

    const { data: articles, error } = await supabase
        .from('articles')
        .select(`
      id,
      title,
      excerpt,
      url,
      image_url,
      published_at,
      category,
      sentiment,
      sentiment_score,
      news_sources (
        name,
        credibility_score,
        tier
      )
    `)
        .ilike('category', meta.title)
        .order('published_at', { ascending: false })
        .limit(30);

    if (error) {
        console.error('Error fetching articles:', error);
    }

    const formattedArticles = (articles || []).map((article: any) => ({
        ...article,
        news_sources: article.news_sources,
    }));

    return (
        <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-[var(--muted-foreground)] mb-6">
                <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
                <span>/</span>
                <span className="text-[var(--foreground)]">{meta.title}</span>
            </nav>

            {/* Header */}
            <div className="mb-8 pb-8 border-b border-[var(--border)]">
                <h1 className="text-4xl font-bold mb-2">{meta.title}</h1>
                <p className="text-[var(--muted-foreground)] font-sans">
                    {meta.description}
                </p>
            </div>

            {/* Articles */}
            {formattedArticles.length === 0 ? (
                <div className="text-center py-16">
                    <span className="text-6xl mb-4 block">📰</span>
                    <h2 className="text-2xl font-bold mb-2">No articles yet</h2>
                    <p className="text-[var(--muted-foreground)] font-sans">
                        Articles in this category will appear once ingested
                    </p>
                </div>
            ) : (
                <ArticleGrid articles={formattedArticles} layout="grid" />
            )}
        </div>
    );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps) {
    const { slug } = await params;
    const meta = categoryMeta[slug.toLowerCase()];

    if (!meta) {
        return { title: 'Category Not Found' };
    }

    return {
        title: `${meta.title} - The Investigation`,
        description: meta.description,
    };
}
