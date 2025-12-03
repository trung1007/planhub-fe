"use client";

import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
    Background,
    Controls,
    addEdge,
    Node,
    Edge,
    Connection,
    NodeChange,
    EdgeChange,
    applyNodeChanges,
    applyEdgeChanges,
    OnConnect,
} from "reactflow";

import "reactflow/dist/style.css";

// =========================
// Types
// =========================
interface StatusItem {
    id: number;
    name: string;
    color: string;
    isInitial: boolean;
    isFinal: boolean;
}

interface TransitionItem {
    id: number;
    name: string;
    from: string | null; // From status name
    to: string;          // To status name
}

interface Props {
    listStatus: StatusItem[];
    listTransition: TransitionItem[];
}

const ActionWorkflowDiagram: React.FC<Props> = ({
    listStatus,
    listTransition,
}) => {

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    // ============================
    // Convert status → nodes
    // ============================
    const generateNodes = (): Node[] => {
        const gapX = 250;
        const startX = 100;
        const startY = 150;

        return listStatus.map((s, index) => ({
            id: String(s.id),
            position: {
                x: startX + index * gapX,
                y: startY,
            },
            data: { label: s.name },
            style: {
                background: s.color,
                padding: 10,
                borderRadius: 6,
                color: "#fff",
                border: s.isInitial || s.isFinal ? "3px solid #1c3d5a" : "1px solid #333",
                fontWeight: "bold",
            },
        }));
    };
    const generateEdges = (): Edge[] => {
        return listTransition
            .filter(t => t.to)
            .map((t) => {
                const fromNode = listStatus.find(s => s.name === t.from);
                const toNode = listStatus.find(s => s.name === t.to);

                if (!toNode) return null;

                return {
                    id: `e-${t.id}`,
                    source: fromNode ? String(fromNode.id) : "",
                    target: String(toNode.id),
                    label: t.name,
                    type: "smoothstep",
                };
            })
            .filter(Boolean) as Edge[];
    };

    // ============================
    // Update diagram when props change
    // ============================
    useEffect(() => {
        const newNodes = generateNodes();
        const newEdges = generateEdges();

        setNodes(newNodes);
        setEdges(newEdges);
        console.log("listStatus", listStatus);

    }, [listStatus, listTransition]);

    // ============================
    // Drag / Connect handlers
    // ============================
    const onNodesChange = useCallback(
        (changes: NodeChange[]) =>
            setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect: OnConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) =>
                addEdge({ ...connection, label: "Transition" }, eds)
            );
        },
        []
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        >
            <Controls />
            <Background color="#f2f2f2" gap={12} />
        </ReactFlow>
    );
};

export default ActionWorkflowDiagram;
