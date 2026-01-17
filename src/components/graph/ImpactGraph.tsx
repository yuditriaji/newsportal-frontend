'use client';

import { useCallback, useEffect, useMemo } from 'react';
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
    ReactFlowProvider,
    useReactFlow,
} from '@xyflow/react';
import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    forceCollide
} from 'd3-force';
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

// Simulation Wrapper to access ReactFlow instance
function Simulation({ entities, connections, setNodes, setEdges }: {
    entities: Entity[],
    connections: Connection[],
    setNodes: any,
    setEdges: any
}) {
    const { fitView } = useReactFlow();

    useEffect(() => {
        const nodes = entities.map((e) => ({
            x: Math.random() * 800,
            y: Math.random() * 600,
            ...e
        }));

        const links = connections.map((c) => ({
            source: c.source,
            target: c.target,
            weight: c.weight || 1
        }));

        const simulation = forceSimulation(nodes as any)
            .force('link', forceLink(links).id((d: any) => d.id).distance(150))
            .force('charge', forceManyBody().strength(-500))
            .force('center', forceCenter(400, 300))
            .force('collide', forceCollide().radius(60));

        simulation.on('tick', () => {
            const flowNodes: Node[] = nodes.map((node: any) => ({
                id: node.id,
                position: { x: node.x, y: node.y },
                data: {
                    label: node.name,
                    type: node.type,
                    articleCount: node.articleCount || 0,
                },
                style: {
                    background: nodeColors[node.type] || '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    width: 'auto',
                },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
            }));

            setNodes(flowNodes);
        });

        const flowEdges: Edge[] = connections.map((conn, index) => ({
            id: `edge-${index}`,
            source: conn.source,
            target: conn.target,
            label: conn.relationship,
            type: 'default',
            animated: Boolean(conn.weight && conn.weight > 0.7),
            style: {
                stroke: '#94a3b8',
                strokeWidth: Math.max(2, (conn.weight || 0.5) * 4),
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

        setEdges(flowEdges);

        return () => {
            simulation.stop();
        };
    }, [entities, connections, setNodes, setEdges]);

    // Fit view after initial simulation settles slightly
    useEffect(() => {
        const timer = setTimeout(() => {
            fitView({ padding: 0.2, duration: 1000 });
        }, 500);
        return () => clearTimeout(timer);
    }, [fitView, entities]);

    return null;
}

export function ImpactGraph({ entities, connections, onNodeClick }: ImpactGraphProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        const entity = entities.find((e) => e.id === node.id);
        if (entity && onNodeClick) {
            onNodeClick(entity);
        }
    }, [entities, onNodeClick]);

    return (
        <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-[var(--border)]">
            <ReactFlowProvider>
                <div className="w-full h-full">
                    <Simulation
                        entities={entities}
                        connections={connections}
                        setNodes={setNodes}
                        setEdges={setEdges}
                    />
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={handleNodeClick}
                        fitView
                        attributionPosition="bottom-left"
                    >
                        <Background color="#94a3b8" gap={20} size={1} />
                        <Controls className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
                        <MiniMap
                            nodeColor={(node) => nodeColors[(node.data as any).type] || '#6b7280'}
                            className="bg-white dark:bg-slate-800"
                        />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
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
