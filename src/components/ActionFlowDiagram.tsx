"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
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

// ==============================
// Custom Node Components
// ==============================

const initialNodes: Node[] = [
    {
        id: "1",
        position: { x: 150, y: 100 },
        data: { label: "To Do" },
        style: { background: "#ffc000", padding: 10, borderRadius: 6 },
    },
    {
        id: "2",
        position: { x: 300, y: 200 },
        data: { label: "In Progress" },
        style: { background: "#5392f9", padding: 10, borderRadius: 6, color: "white" },
    },
    {
        id: "3",
        position: { x: 450, y: 300 },
        data: { label: "Completed" },
        style: { background: "#00af50", padding: 10, borderRadius: 6, color: "white" },
    },
];

const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", label: "Start" },
    { id: "e2-3", source: "2", target: "3", label: "Finish" },
];



const ActionWorkflowDiagram = () => {
    // Drag nodes
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect: OnConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) => addEdge({ ...connection, label: "Transition" }, eds));
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
            {/* <MiniMap /> */}
            <Controls />
            <Background color="#eee" gap={12} />
        </ReactFlow>
    );
};

export default ActionWorkflowDiagram;
