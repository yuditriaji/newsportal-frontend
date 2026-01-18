import { getStories } from '@/lib/actions/stories';
import { StoryGrid, Story } from '@/components/stories/StoryCard';
import { createClient } from '@/lib/supabase/server';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import Link from 'next/link';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

async function getLatestArticles() {
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
    .limit(6);

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

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
  const [stories, articles] = await Promise.all([
    getStories(10),
    getLatestArticles(),
  ]);

  return (
    <div className="space-y-16">
      {/* Main Stories Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Today's Briefings</h1>
            <p className="text-[var(--muted-foreground)] font-sans text-sm mt-1">
              AI-synthesized news from multiple sources
            </p>
          </div>
          {stories.length > 0 && (
            <span className="text-sm text-[var(--muted-foreground)] font-sans">
              {stories.length} stories • {stories.reduce((acc, s) => acc + s.source_count, 0)} sources
            </span>
          )}
        </div>

        {stories.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[var(--border)] rounded-lg">
            <span className="text-6xl mb-6 block">📰</span>
            <h2 className="text-2xl font-bold mb-4">No Stories Yet</h2>
            <p className="text-[var(--muted-foreground)] font-sans mb-6 max-w-md mx-auto">
              Stories are automatically created when multiple sources cover the same topic.
            </p>
            <div className="text-sm font-sans text-[var(--muted-foreground)] bg-slate-50 p-4 rounded max-w-lg mx-auto text-left">
              <p className="font-bold mb-2">To generate stories:</p>
              <code className="block bg-slate-100 p-2 rounded text-xs">
                POST /api/stories/cluster
              </code>
            </div>
          </div>
        ) : (
          <StoryGrid stories={stories as Story[]} layout="featured" />
        )}
      </section>

      {/* Latest Articles Section */}
      {articles.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6 border-t border-[var(--border)] pt-8">
            <h2 className="text-xl font-bold">Latest Articles</h2>
            <Link
              href="/category/world"
              className="text-sm text-[var(--primary)] font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>
          <ArticleGrid articles={articles} layout="grid" />
        </section>
      )}
    </div>
  );
}
