import { createClient } from '@/lib/supabase/server';
import { ArticleGrid } from '@/components/articles/ArticleGrid';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

async function getArticles() {
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
    .order('published_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  // Transform to match Article interface
  return (articles || []).map((article: any) => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    url: article.url,
    image_url: article.image_url,
    published_at: article.published_at,
    category: article.category,
    sentiment: article.sentiment,
    sentiment_score: article.sentiment_score,
    news_sources: article.news_sources,
  }));
}

export default async function HomePage() {
  const articles = await getArticles();

  return (
    <div>
      {articles.length === 0 ? (
        <div className="py-16 text-center">
          <span className="text-6xl mb-6 block">📰</span>
          <h2 className="text-3xl font-bold mb-4">No Articles Yet</h2>
          <p className="text-[var(--muted-foreground)] font-sans mb-8 max-w-md mx-auto">
            The news ingestion pipeline hasn't run yet. Articles will appear here once the first batch is fetched.
          </p>
          <div className="text-sm font-sans text-[var(--muted-foreground)] bg-[var(--muted)] p-4 rounded max-w-lg mx-auto text-left">
            <p className="font-bold mb-2">To trigger ingestion:</p>
            <code className="block bg-slate-100 p-2 rounded text-xs">
              POST /api/ingest/all
            </code>
          </div>
        </div>
      ) : (
        <ArticleGrid articles={articles} layout="featured" />
      )}
    </div>
  );
}
