'use client';

import { ImpactWeb, demoNodes, demoEdges } from '@/components/graph/ImpactWeb';

export default function ImpactMapPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--foreground)]">Impact Map</h1>
                    <p className="text-[var(--muted-foreground)]">
                        Visualize how events connect and cascade across sectors
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Sector filters */}
                    <div className="flex gap-1 p-1 bg-[var(--muted)] rounded-lg">
                        {['All', 'Economic', 'Geopolitical', 'Supply Chain'].map((filter, i) => (
                            <button
                                key={filter}
                                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${i === 0
                                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                                        : 'text-[var(--muted-foreground)] hover:bg-[var(--card)]'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    {/* Time range */}
                    <select className="px-3 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)]">
                        <option>Last 24 hours</option>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>All time</option>
                    </select>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                <span className="text-sm font-medium text-[var(--muted-foreground)]">Node Types:</span>
                {[
                    { label: 'Event', color: '#ef4444' },
                    { label: 'Commodity', color: '#f59e0b' },
                    { label: 'Impact', color: '#3b82f6' },
                    { label: 'Region', color: '#a855f7' },
                ].map((type) => (
                    <div key={type.label} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: type.color }}
                        />
                        <span className="text-sm text-[var(--foreground)]">{type.label}</span>
                    </div>
                ))}
                <div className="flex-1" />
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <span>🔴 Animated = Active connection</span>
                </div>
            </div>

            {/* Graph container */}
            <div className="h-[calc(100vh-280px)]">
                <ImpactWeb
                    initialNodes={demoNodes}
                    initialEdges={demoEdges}
                    onNodeClick={(node) => console.log('Clicked node:', node)}
                />
            </div>

            {/* Side panel placeholder */}
            <div className="fixed right-6 top-24 w-80 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xl">
                <h3 className="font-semibold text-[var(--foreground)] mb-3">
                    🌾 Russia-Ukraine Conflict
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    Ongoing conflict affecting global commodity markets and geopolitical relations.
                </p>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Impact Score</span>
                        <span className="font-medium text-[var(--destructive)]">High (8.5/10)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Connected Events</span>
                        <span className="font-medium text-[var(--foreground)]">15</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Downstream Effects</span>
                        <span className="font-medium text-[var(--foreground)]">42</span>
                    </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90">
                    Open Investigation
                </button>
            </div>
        </div>
    );
}
