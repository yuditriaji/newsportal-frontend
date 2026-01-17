import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { Article } from '@/lib/api/client';

// Placeholder data for demo (replace with API call when backend connected)
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Russia-Ukraine Conflict Impacts Global Wheat Supply Chain',
    excerpt: 'The ongoing conflict has disrupted wheat exports from the Black Sea region, causing prices to surge globally...',
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
    published_at: new Date().toISOString(),
    category: 'Geopolitics',
    sentiment: 'negative',
    sentiment_score: -0.7,
    news_sources: { name: 'Reuters', credibility_score: 95, tier: 'premium' },
  },
  {
    id: '2',
    title: 'Federal Reserve Signals Potential Rate Pause Amid Inflation Concerns',
    excerpt: 'Fed Chair Powell indicated the central bank may hold rates steady as inflation shows signs of cooling...',
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    published_at: new Date(Date.now() - 3600000).toISOString(),
    category: 'Business',
    sentiment: 'neutral',
    sentiment_score: 0.1,
    news_sources: { name: 'Bloomberg', credibility_score: 92, tier: 'premium' },
  },
  {
    id: '3',
    title: 'Taiwan-China Tensions Rise Over Disputed Nickel-Rich Territory',
    excerpt: 'Escalating tensions in the South China Sea region threaten critical mineral supply chains for EV batteries...',
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800',
    published_at: new Date(Date.now() - 7200000).toISOString(),
    category: 'Geopolitics',
    sentiment: 'negative',
    sentiment_score: -0.8,
    news_sources: { name: 'AP News', credibility_score: 90, tier: 'premium' },
  },
  {
    id: '4',
    title: 'AI Breakthrough: New Model Achieves Human-Level Reasoning',
    excerpt: 'Researchers announce a significant advancement in artificial general intelligence capabilities...',
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    published_at: new Date(Date.now() - 10800000).toISOString(),
    category: 'Technology',
    sentiment: 'positive',
    sentiment_score: 0.9,
    news_sources: { name: 'TechCrunch', credibility_score: 78, tier: 'standard' },
  },
  {
    id: '5',
    title: 'Climate Summit Reaches Historic Carbon Reduction Agreement',
    excerpt: 'World leaders commit to accelerated emissions targets at the annual climate conference...',
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800',
    published_at: new Date(Date.now() - 14400000).toISOString(),
    category: 'Science',
    sentiment: 'positive',
    sentiment_score: 0.7,
    news_sources: { name: 'BBC', credibility_score: 88, tier: 'premium' },
  },
  {
    id: '6',
    title: 'Major Bank Reports Unexpected Quarterly Losses',
    excerpt: 'The financial institution cites exposure to commercial real estate as primary factor...',
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800',
    published_at: new Date(Date.now() - 18000000).toISOString(),
    category: 'Business',
    sentiment: 'negative',
    sentiment_score: -0.6,
    news_sources: { name: 'Financial Times', credibility_score: 94, tier: 'premium' },
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Today's Intelligence
        </h1>
        <p className="text-[var(--muted-foreground)]">
          AI-analyzed news with relationship mapping and impact insights
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Articles Today', value: '127', icon: '📰', change: '+12%' },
          { label: 'New Connections', value: '89', icon: '🔗', change: '+24%' },
          { label: 'Active Alerts', value: '5', icon: '🔔', change: '0' },
          { label: 'Investigations', value: '3', icon: '🔍', change: '+1' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs text-green-500 font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</div>
            <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Breaking news ticker */}
      <div className="bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-lg p-3 flex items-center gap-3">
        <span className="text-[var(--destructive)] font-bold text-xs uppercase tracking-wider">
          Breaking
        </span>
        <div className="flex-1 text-sm text-[var(--foreground)] overflow-hidden">
          <span className="animate-pulse">🔴</span> High-impact connection detected: Russia-Ukraine conflict linked to 15 downstream economic events...
        </div>
        <button className="text-xs text-[var(--primary)] font-medium hover:underline">
          Analyze
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-[var(--border)]">
        {['All', 'Trending', 'High Impact', 'Following', 'Saved'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${i === 0
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <ArticleGrid articles={mockArticles} showHero />
    </div>
  );
}
