'use client';

import { useState, useEffect } from 'react';
import { addArticleToInvestigation } from '@/lib/actions/investigations';
import { createClient } from '@/lib/supabase/client';

interface AddToInvestigationModalProps {
    articleId: string;
    articleTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

interface Investigation {
    id: string;
    title: string;
    status: string;
}

export function AddToInvestigationModal({
    articleId,
    articleTitle,
    isOpen,
    onClose
}: AddToInvestigationModalProps) {
    const [investigations, setInvestigations] = useState<Investigation[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadInvestigations();
        }
    }, [isOpen]);

    async function loadInvestigations() {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
            .from('investigations')
            .select('id, title, status')
            .eq('owner_id', user.id)
            .eq('status', 'active')
            .order('updated_at', { ascending: false });

        setInvestigations(data || []);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedId) return;

        setIsLoading(true);
        setError(null);

        const result = await addArticleToInvestigation(articleId, selectedId, notes);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                    <h2 className="font-bold text-lg">Add to Investigation</h2>
                    <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                        ✕
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Article preview */}
                    <div className="p-3 bg-[var(--muted)] rounded text-sm">
                        <span className="text-[var(--muted-foreground)]">Adding:</span>{' '}
                        <span className="font-medium">{articleTitle}</span>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                            {error}
                        </div>
                    )}

                    {/* Investigation select */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider font-sans text-[var(--muted-foreground)] mb-2">
                            Select Investigation
                        </label>
                        {investigations.length === 0 ? (
                            <div className="p-4 text-center border border-dashed border-[var(--border)] rounded">
                                <p className="text-sm text-[var(--muted-foreground)]">No active investigations</p>
                                <a href="/investigations/new" className="text-[var(--primary)] text-sm hover:underline">
                                    Create one →
                                </a>
                            </div>
                        ) : (
                            <select
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                                className="w-full px-4 py-2.5 border border-[var(--border)] bg-white dark:bg-slate-900 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-sans text-sm"
                                required
                            >
                                <option value="">Choose an investigation...</option>
                                {investigations.map((inv) => (
                                    <option key={inv.id} value={inv.id}>{inv.title}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider font-sans text-[var(--muted-foreground)] mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Why is this article relevant?"
                            rows={3}
                            className="w-full px-4 py-2.5 border border-[var(--border)] bg-white dark:bg-slate-900 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-sans text-sm resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-[var(--border)] font-bold uppercase tracking-wider text-xs font-sans hover:bg-[var(--muted)] transition-colors rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !selectedId || investigations.length === 0}
                            className="px-4 py-2 bg-[var(--primary)] text-white font-bold uppercase tracking-wider text-xs font-sans hover:opacity-90 disabled:opacity-50 transition-opacity rounded"
                        >
                            {isLoading ? 'Adding...' : 'Add to Investigation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
