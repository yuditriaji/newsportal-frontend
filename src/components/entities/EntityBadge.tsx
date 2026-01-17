import Link from 'next/link';
import { Entity } from '@/lib/api/client';

interface EntityBadgeProps {
    entity: Entity;
    showType?: boolean;
    size?: 'sm' | 'md';
}

const typeIcons: Record<string, string> = {
    person: '👤',
    company: '🏢',
    location: '📍',
    commodity: '📦',
    sector: '📊',
    policy: '📜',
    event: '📅',
};

const typeColors: Record<string, string> = {
    person: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    company: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    location: 'bg-green-500/20 text-green-400 border-green-500/30',
    commodity: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    sector: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    policy: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    event: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function EntityBadge({ entity, showType = true, size = 'md' }: EntityBadgeProps) {
    const icon = typeIcons[entity.type] || '🏷️';
    const colors = typeColors[entity.type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

    const sizeClasses = size === 'sm'
        ? 'px-2 py-0.5 text-xs gap-1'
        : 'px-3 py-1 text-sm gap-1.5';

    return (
        <Link
            href={`/entity/${entity.id}`}
            className={`inline-flex items-center rounded-full border transition-opacity hover:opacity-80 ${colors} ${sizeClasses}`}
        >
            <span>{icon}</span>
            <span className="font-medium">{entity.name}</span>
            {showType && size === 'md' && (
                <span className="text-xs opacity-60 capitalize">({entity.type})</span>
            )}
        </Link>
    );
}

interface EntityListProps {
    entities: Entity[];
    maxDisplay?: number;
}

export function EntityList({ entities, maxDisplay = 5 }: EntityListProps) {
    const displayEntities = entities.slice(0, maxDisplay);
    const remaining = entities.length - maxDisplay;

    return (
        <div className="flex flex-wrap gap-2">
            {displayEntities.map((entity) => (
                <EntityBadge key={entity.id} entity={entity} size="sm" showType={false} />
            ))}
            {remaining > 0 && (
                <span className="px-2 py-0.5 text-xs text-[var(--muted-foreground)] bg-[var(--muted)] rounded-full">
                    +{remaining} more
                </span>
            )}
        </div>
    );
}
