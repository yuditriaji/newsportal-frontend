import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { Article } from '@/lib/api/client';

// Professional news content for demo
const mockArticles: Article[] = [
  {
    id: 'inv-001',
    title: 'The Silicon Fracture: How Fragmented Supply Chains are Redrawing the Map of Global Power',
    excerpt: 'A six-month deep dive into the opaque networks of semiconductor manufacturing and the shadow alliances forming across the Pacific. Our investigation reveals critical dependencies that could reshape international relations.',
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    published_at: new Date().toISOString(),
    category: 'Exclusive Investigation',
    sentiment: 'neutral',
    news_sources: { name: 'The Investigation', credibility_score: 98, tier: 'premium' },
  },
  {
    id: 'inv-002',
    title: 'Nord Stream residual impacts: A winter of industrial uncertainty in Central Europe',
    excerpt: 'Energy markets continue to reel from infrastructure disruptions as manufacturers face unprecedented cost pressures.',
    url: '#',
    published_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    category: 'Energy Crisis',
    sentiment: 'negative',
    news_sources: { name: 'Reuters', credibility_score: 95, tier: 'premium' },
  },
  {
    id: 'inv-003',
    title: 'The Central Bank Digital Currency (CBDC) race intensifies as traditional trade settlements shift',
    excerpt: 'Major economies accelerate digital currency development amid growing concerns over dollar dominance.',
    url: '#',
    published_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    category: 'Digital Currency',
    sentiment: 'neutral',
    news_sources: { name: 'Financial Times', credibility_score: 94, tier: 'premium' },
  },
  {
    id: 'inv-004',
    title: "New 'Dark Fleet' routes detected in the Baltic Sea, circumventing primary oil price caps",
    excerpt: 'Satellite analysis reveals sophisticated evasion patterns in maritime shipping lanes.',
    url: '#',
    published_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    category: 'Sanctions',
    sentiment: 'negative',
    news_sources: { name: 'Bloomberg', credibility_score: 92, tier: 'premium' },
  },
  {
    id: 'inv-005',
    title: 'Diplomatic Stalemate: Unmarked aircraft movements tracked over sovereign waters',
    excerpt: 'Flight patterns coincide with trade talk collapse, raising questions about backdoor negotiations.',
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    published_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    category: 'Geopolitics',
    sentiment: 'negative',
    news_sources: { name: 'AP News', credibility_score: 90, tier: 'premium' },
  },
  {
    id: 'inv-006',
    title: "Market Fluctuations: Rare earth indices surge following 'Green Pact' legislative delay",
    excerpt: "14% price increase triggers supply chain reassessment across automotive and technology sectors.",
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    published_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    category: 'Markets',
    sentiment: 'neutral',
    news_sources: { name: 'CNBC', credibility_score: 85, tier: 'standard' },
  },
  {
    id: 'inv-007',
    title: 'Industrial Shift: Automotive manufacturing pivots toward domestic hubs',
    excerpt: 'Sea-lane insurance premiums double as companies reassess global production strategies.',
    url: '#',
    image_url: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80',
    published_at: new Date(Date.now() - 3600000 * 16).toISOString(),
    category: 'Supply Chain',
    sentiment: 'neutral',
    news_sources: { name: 'The Guardian', credibility_score: 88, tier: 'premium' },
  },
  {
    id: 'inv-008',
    title: 'Classified Clipping: Arctic exploration permits under investigation',
    excerpt: 'Internal memos suggest coordinated effort to fast-track drilling rights in disputed territories.',
    url: '#',
    published_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    category: 'Under Investigation',
    sentiment: 'neutral',
    news_sources: { name: 'BBC', credibility_score: 91, tier: 'premium' },
  },
];

export default function HomePage() {
  return (
    <ArticleGrid articles={mockArticles} layout="featured" />
  );
}
