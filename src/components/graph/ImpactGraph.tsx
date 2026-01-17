'use client';

import { useCallback, useMemo } from 'react';
import {
    ReactFlow,
    Node,
    Edge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    MarkerType,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface Entity {
    id: string;
    name: string;
    type: string;
    articleCount?: number;
}

interface Connection {
    source: string;
    target: string;
    relationship?: string;
    weight?: number;
}

interface ImpactGraphProps {
    entities: Entity[];
    connections: Connection[];
    onNodeClick?: (entity: Entity) => void;
}

const nodeColors: Record<string, string> = {
    person: '#3b82f6',      // blue
    company: '#8b5cf6',     // purple
    location: '#22c55e',    // green
    commodity: '#f59e0b',   // amber
    sector: '#ec4899',      // pink
    policy: '#06b6d4',      // cyan
    event: '#ef4444',       // red
};

function createNodesFromEntities(entities: Entity[]): Node[] {
    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    return entities.map((entity, index) => {
        const angle = (2 * Math.PI * index) / entities.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        return {
            id: entity.id,
            position: { x, y },
            data: {
                label: entity.name,
                type: entity.type,
                articleCount: entity.articleCount || 0,
            },
            style: {
                background: nodeColors[entity.type] || '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
        };
    });
}

function createEdgesFromConnections(connections: Connection[]): Edge[] {
    return connections.map((conn, index) => ({
        id: `edge-${index}`,
        source: conn.source,
        target: conn.target,
        label: conn.relationship,
        type: 'smoothstep',
        animated: conn.weight && conn.weight > 0.7,
        style: {
            stroke: '#94a3b8',
            strokeWidth: Math.max(1, (conn.weight || 0.5) * 3),
        },
        labelStyle: {
            fontSize: '10px',
            fill: '#64748b',
        },
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#94a3b8',
        },
    }));
}

export function ImpactGraph({ entities, connections, onNodeClick }: ImpactGraphProps) {
    const initialNodes = useMemo(() => createNodesFromEntities(entities), [entities]);
    const initialEdges = useMemo(() => createEdgesFromConnections(connections), [connections]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        const entity = entities.find((e) => e.id === node.id);
        if (entity && onNodeClick) {
            onNodeClick(entity);
        }
    }, [entities, onNodeClick]);

    return (
        <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                fitView
                attributionPosition="bottom-left"
            >
                <Background color="#e2e8f0" gap={16} />
                <Controls
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
                <MiniMap
                    nodeColor={(node) => nodeColors[(node.data as any).type] || '#6b7280'}
                    className="bg-white dark:bg-slate-800"
                />
            </ReactFlow>
        </div>
    );
}

// Legend component
export function ImpactGraphLegend() {
    const types = [
        { type: 'person', label: 'Person' },
        { type: 'company', label: 'Company' },
        { type: 'location', label: 'Location' },
        { type: 'commodity', label: 'Commodity' },
        { type: 'sector', label: 'Sector' },
        { type: 'policy', label: 'Policy' },
        { type: 'event', label: 'Event' },
    ];

    return (
        <div className="flex flex-wrap gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-[var(--border)]">
            {types.map(({ type, label }) => (
                <div key={type} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: nodeColors[type] }}
                    />
                    <span className="text-xs font-sans text-[var(--muted-foreground)]">{label}</span>
                </div>
            ))}
        </div>
    );
}
