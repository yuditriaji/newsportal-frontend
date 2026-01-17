'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function NewInvestigationPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setError('You must be logged in to create an investigation');
            setIsLoading(false);
            return;
        }

        const { data, error: insertError } = await supabase
            .from('investigations')
            .insert({
                title,
                description,
                owner_id: user.id,
                status: 'active',
                visibility: 'private',
            })
            .select('id')
            .single();

        if (insertError) {
            setError(insertError.message);
            setIsLoading(false);
            return;
        }

        router.push(`/investigations/${data.id}`);
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">New Investigation</h1>
            <p className="text-[var(--muted-foreground)] font-sans text-sm mb-8">
                Create a new case file to track connections between events
            </p>

            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-sans rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider font-sans text-[var(--muted-foreground)] mb-2">
                        Case Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Global Chip Shortage Investigation"
                        required
                        className="w-full px-4 py-3 border border-[var(--border)] bg-white text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-sans"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider font-sans text-[var(--muted-foreground)] mb-2">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of what you're investigating..."
                        rows={4}
                        className="w-full px-4 py-3 border border-[var(--border)] bg-white text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-sans resize-none"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={isLoading || !title.trim()}
                        className="px-6 py-3 bg-[var(--foreground)] text-white font-bold uppercase tracking-wider text-xs font-sans hover:bg-[var(--primary)] disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Creating...' : 'Create Investigation'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-[var(--border)] font-bold uppercase tracking-wider text-xs font-sans hover:bg-[var(--muted)] transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
