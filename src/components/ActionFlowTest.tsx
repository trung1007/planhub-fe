"use client";

import { IssueStatus, statusColors } from "@/enums/issue.enum";
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
  // color: string;
  isInitial: boolean;
  isFinal: boolean;
}

interface TransitionItem {
  id: number;
  name: string;
  from: string | null; // From status name
  to: string; // To status name
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
    const gapX = 200;
    const baseY = 150;
    const midY = 300;
    const endY = 450;

    const statusColorMap: { [key: string]: string } = {
      todo: "#FF5733",
      in_progress: "#FFBD33",
      review: "#9C27B0",
      done: "#4CAF50",
      cancelled: "#F44336",
    };

    const sortedNodes = [
      ...listStatus.filter((s) => s.isInitial),
      ...listStatus.filter((s) => !s.isInitial && !s.isFinal),
      ...listStatus.filter((s) => s.isFinal),
    ];

    const position: [number, number][] = [];

    const total = sortedNodes.length;

    for (let i = 0; i < total; i++) {
      // Node đầu tiên
      if (i === 0) {
        position.push([0, baseY]);
        continue;
      }

      if (i === total - 1) {
        position.push([0, endY]);
        continue;
      }
      const middleIndex = i - 1; // bắt đầu từ 0

      let x = 0;

      if (middleIndex === 0) {
        x = 0;
      } else {
        const layer = Math.ceil(middleIndex / 2);
        x = middleIndex % 2 === 1 ? layer * gapX : -layer * gapX;
      }

      position.push([x, midY]);
    }

    const nodesArray = sortedNodes.map((s, index) => {
      const [x, y] = position[index]; 
      const nodeColor = statusColors[s.name as IssueStatus] || "#D3D3D3";

      return {
        id: String(s.id),
        position: {
          x,
          y,
        },
        data: { label: s.name.replace("_", " ").toLocaleUpperCase()},
        style: {
          background: nodeColor,
          padding: 10,
          borderRadius: 6,
          color: "#fff",
          border:
            s.isInitial || s.isFinal ? "3px solid #1c3d5a" : "1px solid #333",
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
      position: { x: 50, y: 0 },
      data: { label: "" },
      style: {
        background: "#808080",
        width: 50,
        height: 50,
        borderRadius: "50%",
        color: "#fff",
      },
    };


    const defaultFinalNode = {
      id: defaultFinalNodeId,
      position: {
        x: 50,
        y: 600,
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

    const initialNode = listStatus.find((s) => s.isInitial);
    const initialNodeId = initialNode ? String(initialNode.id) : null;

    // Tìm kiếm node có isFinal = true
    const finalNode = listStatus.find((s) => s.isFinal);
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
    generateNodes();
    const newEdges = generateEdges();
    setEdges(newEdges); // Cập nhật edges
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

  const onConnect: OnConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, label: "Transition" }, eds));
  }, []);

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
