'use client';

import { useState, useCallback } from 'react';
import {
    ReactFlow,
    Node,
    Edge,
    Controls,
    Background,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface ImpactWebProps {
    initialNodes?: Node[];
    initialEdges?: Edge[];
    onNodeClick?: (node: Node) => void;
}

// Custom node types
const nodeColors: Record<string, string> = {
    article: '#3b82f6',
    entity: '#a855f7',
    event: '#ef4444',
    investigation: '#22c55e',
};

export function ImpactWeb({ initialNodes = [], initialEdges = [], onNodeClick }: ImpactWebProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const handleNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            onNodeClick?.(node);
        },
        [onNodeClick]
    );

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                fitView
                attributionPosition="bottom-left"
                style={{ background: 'var(--card)' }}
            >
                <Controls
                    className="!bg-[var(--card)] !border-[var(--border)] !shadow-lg"
                    showInteractive={false}
                />
                <MiniMap
                    className="!bg-[var(--card)] !border-[var(--border)]"
                    nodeColor={(node) => nodeColors[node.type || 'article'] || '#64748b'}
                    maskColor="rgba(0, 0, 0, 0.8)"
                />
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="var(--border)"
                />
            </ReactFlow>
        </div>
    );
}

// Demo nodes and edges for placeholder
export const demoNodes: Node[] = [
    {
        id: '1',
        type: 'default',
        position: { x: 250, y: 0 },
        data: { label: '🌾 Russia-Ukraine Conflict' },
        style: { background: '#ef4444', color: 'white', border: 'none', borderRadius: 8 },
    },
    {
        id: '2',
        type: 'default',
        position: { x: 100, y: 100 },
        data: { label: '📦 Wheat Exports' },
        style: { background: '#f59e0b', color: 'white', border: 'none', borderRadius: 8 },
    },
    {
        id: '3',
        type: 'default',
        position: { x: 400, y: 100 },
        data: { label: '⛽ Gas Prices' },
        style: { background: '#f59e0b', color: 'white', border: 'none', borderRadius: 8 },
    },
    {
        id: '4',
        type: 'default',
        position: { x: 50, y: 200 },
        data: { label: '📈 Commodity Futures' },
        style: { background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8 },
    },
    {
        id: '5',
        type: 'default',
        position: { x: 200, y: 200 },
        data: { label: '🍞 Food Inflation' },
        style: { background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8 },
    },
    {
        id: '6',
        type: 'default',
        position: { x: 350, y: 200 },
        data: { label: '🏭 Energy Sector' },
        style: { background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8 },
    },
    {
        id: '7',
        type: 'default',
        position: { x: 500, y: 200 },
        data: { label: '🌍 EU Economy' },
        style: { background: '#a855f7', color: 'white', border: 'none', borderRadius: 8 },
    },
];

export const demoEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#ef4444' } },
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#ef4444' } },
    { id: 'e2-4', source: '2', target: '4', style: { stroke: '#f59e0b' } },
    { id: 'e2-5', source: '2', target: '5', style: { stroke: '#f59e0b' } },
    { id: 'e3-6', source: '3', target: '6', style: { stroke: '#f59e0b' } },
    { id: 'e3-7', source: '3', target: '7', style: { stroke: '#f59e0b' } },
    { id: 'e6-7', source: '6', target: '7', style: { stroke: '#3b82f6' } },
];
