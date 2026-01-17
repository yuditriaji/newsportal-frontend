import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

interface InvestigationPageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function InvestigationWorkspacePage({ params }: InvestigationPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirect=/investigations/' + id);
    }

    const { data: investigation, error } = await supabase
        .from('investigations')
        .select(`
      *,
      investigation_articles (
        id,
        notes,
        added_at,
        articles (
          id,
          title,
          excerpt,
          image_url,
          published_at,
          category,
          sentiment
        )
      )
    `)
        .eq('id', id)
        .single();

    if (error || !investigation) {
        notFound();
    }

    // Check ownership
    if (investigation.owner_id !== user.id && investigation.visibility !== 'public') {
        notFound();
    }

    const articles = investigation.investigation_articles?.map((ia: any) => ({
        ...ia.articles,
        notes: ia.notes,
        added_at: ia.added_at,
    })) || [];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-8 pb-8 border-b border-[var(--border)]">
                <div className="flex-1">
                    <Link
                        href="/investigations"
                        className="text-xs font-sans uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--primary)] mb-2 inline-block"
                    >
                        ← Back to Investigations
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${investigation.status === 'active' ? 'bg-green-100 text-green-700' :
                                investigation.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-slate-100 text-slate-600'
                            }`}>
                            {investigation.status}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{investigation.title}</h1>
                    {investigation.description && (
                        <p className="text-[var(--muted-foreground)] font-sans">
                            {investigation.description}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-[var(--border)] font-bold uppercase tracking-wider text-xs font-sans hover:bg-[var(--muted)] transition-colors">
                        Share
                    </button>
                    <button className="px-4 py-2 bg-[var(--primary)] text-white font-bold uppercase tracking-wider text-xs font-sans hover:opacity-90 transition-opacity">
                        + Add Article
                    </button>
                </div>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-12 gap-8">
                {/* Main content - Articles */}
                <div className="col-span-8">
                    <h2 className="section-title section-divider">Evidence Board</h2>

                    {articles.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-[var(--border)] rounded">
                            <span className="text-4xl mb-4 block">📰</span>
                            <h3 className="text-lg font-bold mb-2">No articles yet</h3>
                            <p className="text-sm text-[var(--muted-foreground)] font-sans mb-4">
                                Add articles from the news feed to start building your case
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] font-bold uppercase tracking-wider text-xs font-sans hover:bg-[var(--muted)] transition-colors"
                            >
                                Browse News →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {articles.map((article: any) => (
                                <div key={article.id} className="p-4 bg-[var(--card)] border border-[var(--border)] rounded group">
                                    <div className="flex gap-4">
                                        {article.image_url && (
                                            <div className="w-24 h-24 flex-shrink-0 bg-slate-100 rounded overflow-hidden">
                                                <img src={article.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {article.category && (
                                                    <span className="category-label">{article.category}</span>
                                                )}
                                                {article.sentiment && (
                                                    <span className={`text-xs ${article.sentiment === 'positive' ? 'text-green-600' :
                                                            article.sentiment === 'negative' ? 'text-red-600' :
                                                                'text-slate-500'
                                                        }`}>
                                                        ● {article.sentiment}
                                                    </span>
                                                )}
                                            </div>
                                            <Link href={`/article/${article.id}`} className="font-bold hover:text-[var(--primary)]">
                                                {article.title}
                                            </Link>
                                            <p className="text-xs text-[var(--muted-foreground)] font-sans mt-1">
                                                Added {new Date(article.added_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-opacity">
                                            ✕
                                        </button>
                                    </div>
                                    {article.notes && (
                                        <div className="mt-3 pt-3 border-t border-[var(--border)]">
                                            <p className="text-sm text-[var(--muted-foreground)] italic font-sans">
                                                📝 {article.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="col-span-4">
                    <h2 className="section-title section-divider">Case Details</h2>

                    <div className="space-y-4">
                        <div className="p-4 bg-[var(--muted)] rounded">
                            <div className="text-xs font-sans uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                                Articles
                            </div>
                            <div className="text-2xl font-bold">{articles.length}</div>
                        </div>

                        <div className="p-4 bg-[var(--muted)] rounded">
                            <div className="text-xs font-sans uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                                Created
                            </div>
                            <div className="text-sm font-sans">
                                {new Date(investigation.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>

                        <div className="p-4 bg-[var(--muted)] rounded">
                            <div className="text-xs font-sans uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                                Last Updated
                            </div>
                            <div className="text-sm font-sans">
                                {new Date(investigation.updated_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="section-title section-divider">Actions</h2>
                        <div className="space-y-2">
                            <button className="w-full px-4 py-2 border border-[var(--border)] text-left font-sans text-sm hover:bg-[var(--muted)] transition-colors rounded">
                                📊 View Impact Map
                            </button>
                            <button className="w-full px-4 py-2 border border-[var(--border)] text-left font-sans text-sm hover:bg-[var(--muted)] transition-colors rounded">
                                📤 Export PDF
                            </button>
                            <button className="w-full px-4 py-2 border border-[var(--border)] text-left font-sans text-sm hover:bg-[var(--muted)] transition-colors rounded">
                                📦 Archive Case
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
