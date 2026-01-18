/**
 * Connection Graph Component
 * 
 * Simple visualization of entity connections for a story.
 * Uses a lightweight approach instead of ReactFlow to avoid build issues.
 */

'use client';

import Link from 'next/link';

interface Entity {
    id: string;
    name: string;
    type: string;
    role?: string;
}

interface Connection {
    id: string;
    source: Entity;
    target: Entity;
    relationship: string;
    label?: string;
    strength: number;
}

interface ConnectionGraphProps {
    entities: Entity[];
    connections: Connection[];
    className?: string;
}

const entityColors: Record<string, string> = {
    person: 'bg-blue-500',
    company: 'bg-purple-500',
    organization: 'bg-purple-500',
    location: 'bg-green-500',
    commodity: 'bg-amber-500',
    policy: 'bg-cyan-500',
    event: 'bg-red-500',
};

const entityIcons: Record<string, string> = {
    person: '👤',
    company: '🏢',
    organization: '🏛️',
    location: '📍',
    commodity: '📦',
    policy: '📜',
    event: '⚡',
};

export function ConnectionGraph({ entities, connections, className }: ConnectionGraphProps) {
    if (connections.length === 0) {
        return (
            <div className={`flex items-center justify-center bg-slate-50 rounded-lg p-6 ${className}`}>
                <p className="text-sm text-[var(--muted-foreground)]">No connections found</p>
            </div>
        );
    }

    return (
        <div className={`bg-slate-50 rounded-lg p-4 ${className}`}>
            <div className="space-y-3">
                {connections.map((connection) => (
                    <div
                        key={connection.id}
                        className="flex items-center gap-2 text-sm"
                    >
                        {/* Source entity */}
                        <Link
                            href={`/entity/${connection.source.id}`}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-white text-xs font-medium ${entityColors[connection.source.type] || 'bg-slate-500'
                                }`}
                        >
                            <span>{entityIcons[connection.source.type] || '•'}</span>
                            <span className="truncate max-w-[80px]">{connection.source.name}</span>
                        </Link>

                        {/* Relationship arrow */}
                        <div className="flex items-center gap-1 text-[var(--muted-foreground)]">
                            <span className="text-xs">→</span>
                            <span className="text-[10px] italic">
                                {connection.label || connection.relationship.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs">→</span>
                        </div>

                        {/* Target entity */}
                        <Link
                            href={`/entity/${connection.target.id}`}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-white text-xs font-medium ${entityColors[connection.target.type] || 'bg-slate-500'
                                }`}
                        >
                            <span>{entityIcons[connection.target.type] || '•'}</span>
                            <span className="truncate max-w-[80px]">{connection.target.name}</span>
                        </Link>

                        {/* Strength indicator */}
                        {connection.strength > 0.7 && (
                            <span className="ml-auto text-[10px] text-red-600 font-bold">
                                Strong
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
