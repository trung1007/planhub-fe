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
        const gapY = 100;
        const startX = 0;
        const startY = 250;
        const gapX = 300;

        const sortedNodes = [
            ...listStatus.filter(s => s.isInitial),
            ...listStatus.filter(s => !s.isInitial && !s.isFinal),
            ...listStatus.filter(s => s.isFinal),
        ];


        const position: [number, number][] = [];


        // Cập nhật vị trí cho các node
        for (let i = 0; i < sortedNodes.length; i++) {
            let x = startX;
            let y = startY + i * gapY; // Khoảng cách giữa các node


            if (i === 0) {
                x = startX;
                y = startY;
            }

            else if (i === sortedNodes.length - 1) {
                x = startX;
                y = startY + 2 * gapY;
            }

            else {
                x = startX + (i - 1) * gapX;
                y = startY + gapY;
            }


            // Lưu vị trí vào mảng position
            position.push([x, y]);
        }


        // Tính toán vị trí cho từng node dựa trên mảng `position`
        const nodesArray = sortedNodes.map((s, index) => {
            const [x, y] = position[index]; // Lấy vị trí từ mảng `position`

            return {
                id: String(s.id),
                position: {
                    x, // Vị trí x được tính toán cho node từ mảng position
                    y, // Vị trí y cho node từ mảng position
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
            };
        });

        return nodesArray;
    };




    const generateEdges = (): Edge[] => {
        const defaultInitNodeId = "startNode";
        const defaultFinalNodeId = "endNode";
        const defaultInitialNode = {
            id: defaultInitNodeId,
            position: { x: 50, y: 150 },
            data: { label: "" },
            style: {
                background: "#808080",
                width: 50,
                height: 50,
                borderRadius: "50%",
                color: "#fff",
            },
        };

        const nodesWithEdges = listStatus.filter(s =>
            listTransition.some(t => t.from === s.name || t.to === s.name)
        );

        const defaultFinalNode = {
            id: defaultFinalNodeId,
            position: {
                x: 50,
                y: 250 + (nodesWithEdges.length) * 100
            },
            data: { label: "" },
            style: {
                background: "#808080",
                width: 50,
                height: 50,
                borderRadius: "50%",
                color: "#fff",
            },
        };

        const initialNode = listStatus.find(s => s.isInitial);
        const initialNodeId = initialNode ? String(initialNode.id) : null;

        // Tìm kiếm node có isFinal = true
        const finalNode = listStatus.find(s => s.isFinal);
        const finalNodeId = finalNode ? String(finalNode.id) : null;

        const nodesArray = [...generateNodes()];

        if (initialNodeId) {
            nodesArray.push(defaultInitialNode);
        }

        if (finalNodeId) {
            nodesArray.push(defaultFinalNode);
        }

        const edgesArray = listTransition
            .map((t) => {
                const fromNode = listStatus.find((s) => s.name === t.from);
                const toNode = listStatus.find((s) => s.name === t.to);


                if (!toNode) return null;

                // Nếu không có 'from', thì kết nối từ node mặc định hoặc từ node đầu tiên
                const source = fromNode ? String(fromNode.id) : initialNodeId;
                const target = String(toNode.id);

                return {
                    id: `e-${t.id}`,
                    source,
                    target,
                    label: t.name,
                    type: "smoothstep",
                };
            })
            .filter(Boolean) as Edge[];

        // Kết nối defaultInitialNode với node có isInitial = true
        if (initialNodeId && initialNodeId !== defaultInitNodeId) {
            edgesArray.push({
                id: `e-default-to-initial`,
                source: defaultInitNodeId,
                target: initialNodeId,
                label: "Create",
                type: "smoothstep",
            });
        }

        if (finalNodeId && finalNodeId !== defaultFinalNodeId) {
            edgesArray.push({
                id: `e-default-to-final`,
                source: finalNodeId,
                target: defaultFinalNodeId,
                label: "Finish",
                type: "smoothstep",
            });
        }

        setNodes(nodesArray);
        return edgesArray;
    };



    // ============================
    // Update diagram when props change
    // ============================
    useEffect(() => {
        generateNodes()
        const newEdges = generateEdges();
        setEdges(newEdges);  // Cập nhật edges
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
