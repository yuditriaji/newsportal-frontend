'use client';

import { useState } from 'react';
import { ImpactGraph, ImpactGraphLegend } from '@/components/graph/ImpactGraph';

interface Entity {
    id: string;
    name: string;
    type: string;
    articleCount?: number;
}

interface Connection {
    source: string;
    target: string;
    weight?: number;
}

interface ImpactMapClientProps {
    entities: Entity[];
    connections: Connection[];
}

export function ImpactMapClient({ entities, connections }: ImpactMapClientProps) {
    const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
    const [filterType, setFilterType] = useState<string>('all');

    const filteredEntities = filterType === 'all'
        ? entities
        : entities.filter((e) => e.type === filterType);

    const filteredConnections = connections.filter(
        (c) =>
            filteredEntities.some((e) => e.id === c.source) &&
            filteredEntities.some((e) => e.id === c.target)
    );

    const entityTypes = ['all', ...new Set(entities.map((e) => e.type))];

    return (
        <div className="flex gap-6 h-full">
            {/* Main graph */}
            <div className="flex-1 flex flex-col gap-4">
                {/* Filters */}
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-wider font-sans text-[var(--muted-foreground)]">
                        Filter:
                    </span>
                    <div className="flex gap-2">
                        {entityTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider font-sans rounded transition-colors ${filterType === type
                                        ? 'bg-[var(--foreground)] text-white'
                                        : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-slate-200'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Graph */}
                <div className="flex-1">
                    <ImpactGraph
                        entities={filteredEntities}
                        connections={filteredConnections}
                        onNodeClick={setSelectedEntity}
                    />
                </div>

                {/* Legend */}
                <ImpactGraphLegend />
            </div>

            {/* Sidebar - Selected entity details */}
            {selectedEntity && (
                <div className="w-80 flex-shrink-0">
                    <div className="bg-white dark:bg-slate-800 border border-[var(--border)] rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${selectedEntity.type === 'person' ? 'bg-blue-100 text-blue-700' :
                                        selectedEntity.type === 'company' ? 'bg-purple-100 text-purple-700' :
                                            selectedEntity.type === 'location' ? 'bg-green-100 text-green-700' :
                                                selectedEntity.type === 'commodity' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-600'
                                    }`}>
                                    {selectedEntity.type}
                                </span>
                                <h3 className="text-xl font-bold mt-2">{selectedEntity.name}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedEntity(null)}
                                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="p-3 bg-[var(--muted)] rounded">
                                <div className="text-xs font-sans uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                                    Mentioned In
                                </div>
                                <div className="text-2xl font-bold">{selectedEntity.articleCount || 0} articles</div>
                            </div>

                            <div className="p-3 bg-[var(--muted)] rounded">
                                <div className="text-xs font-sans uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                                    Connections
                                </div>
                                <div className="text-2xl font-bold">
                                    {connections.filter(
                                        (c) => c.source === selectedEntity.id || c.target === selectedEntity.id
                                    ).length}
                                </div>
                            </div>

                            <a
                                href={`/entity/${selectedEntity.id}`}
                                className="block w-full px-4 py-2 bg-[var(--foreground)] text-white text-center font-bold uppercase tracking-wider text-xs font-sans hover:bg-[var(--primary)] transition-colors rounded"
                            >
                                View Entity →
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
