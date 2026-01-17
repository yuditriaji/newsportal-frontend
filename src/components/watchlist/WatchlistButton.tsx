'use client';

import { useState } from 'react';
import { addToWatchlist, removeFromWatchlist } from '@/lib/actions/investigations';

interface WatchlistButtonProps {
    entityId: string;
    entityName: string;
    isWatched?: boolean;
}

export function WatchlistButton({ entityId, entityName, isWatched = false }: WatchlistButtonProps) {
    const [watched, setWatched] = useState(isWatched);
    const [isLoading, setIsLoading] = useState(false);

    async function handleClick() {
        setIsLoading(true);

        if (watched) {
            const result = await removeFromWatchlist(entityId);
            if (!result.error) {
                setWatched(false);
            }
        } else {
            const result = await addToWatchlist(entityId);
            if (!result.error) {
                setWatched(true);
            }
        }

        setIsLoading(false);
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 font-bold uppercase tracking-wider text-xs font-sans transition-colors rounded ${watched
                    ? 'bg-[var(--primary)] text-white hover:opacity-90'
                    : 'border border-[var(--border)] hover:bg-[var(--muted)]'
                } disabled:opacity-50`}
        >
            {isLoading ? (
                '...'
            ) : watched ? (
                <>
                    <span>👁️</span>
                    Watching
                </>
            ) : (
                <>
                    <span>👁️</span>
                    Add to Watchlist
                </>
            )}
        </button>
    );
}
