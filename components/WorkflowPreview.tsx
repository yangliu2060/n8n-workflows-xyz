"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { WorkflowDefinition } from "@/types/workflow";

interface WorkflowPreviewProps {
  workflow: WorkflowDefinition;
  className?: string;
}

// 节点类型到颜色的映射
function getNodeColor(nodeType: string): string {
  if (nodeType.includes("Trigger")) return "#ff6b6b";
  if (nodeType.includes("openAi") || nodeType.includes("langchain")) return "#4ecdc4";
  if (nodeType.includes("httpRequest")) return "#45b7d1";
  if (nodeType.includes("set")) return "#96ceb4";
  if (nodeType.includes("code")) return "#dda0dd";
  if (nodeType.includes("googleSheets")) return "#98d8c8";
  if (nodeType.includes("telegram")) return "#0088cc";
  if (nodeType.includes("stickyNote")) return "#ffeaa7";
  return "#6c5ce7";
}

// 获取简短的节点类型名称
function getShortTypeName(nodeType: string): string {
  const parts = nodeType.split(".");
  return parts[parts.length - 1] || nodeType;
}

export function WorkflowPreview({ workflow, className = "" }: WorkflowPreviewProps) {
  // 转换 n8n 节点为 React Flow 节点
  const { nodes, edges } = useMemo(() => {
    if (!workflow?.nodes || !Array.isArray(workflow.nodes)) {
      return { nodes: [], edges: [] };
    }

    // 过滤掉 stickyNote 节点和无效节点
    const filteredNodes = workflow.nodes.filter(
      (node) => node && node.type && !node.type.includes("stickyNote") && node.position
    );

    // 创建节点名称到 ID 的映射
    const nameToId: Record<string, string> = {};
    filteredNodes.forEach((node) => {
      if (node.name && node.id) {
        nameToId[node.name] = node.id;
      }
    });

    // 转换节点
    const flowNodes: Node[] = filteredNodes
      .filter((node) => node.id && node.position && Array.isArray(node.position))
      .map((node) => ({
        id: node.id,
        position: {
          x: node.position[0] || 0,
          y: node.position[1] || 0
        },
        data: {
          label: node.name || "Unknown",
        },
        style: {
          background: getNodeColor(node.type || ""),
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px 15px",
          fontSize: "12px",
          fontWeight: 500,
          maxWidth: "150px",
          textAlign: "center" as const,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      }));

    // 转换连接
    const flowEdges: Edge[] = [];
    const connections = workflow.connections || {};

    Object.entries(connections).forEach(([sourceName, outputs]) => {
      const sourceId = nameToId[sourceName];
      if (!sourceId || !outputs) return;

      // 处理两种连接格式:
      // 1. { main: [[...]] } - 标准格式
      // 2. [[...]] - 简化格式
      let connectionArrays: any[][];

      if (Array.isArray(outputs)) {
        // 简化格式: 直接是数组
        connectionArrays = outputs;
      } else if (typeof outputs === 'object' && outputs.main) {
        // 标准格式: { main: [[...]] }
        connectionArrays = outputs.main;
      } else if (typeof outputs === 'object') {
        // 其他格式: 遍历所有键
        Object.values(outputs).forEach((connArrays: any) => {
          if (!Array.isArray(connArrays)) return;
          connArrays.forEach((connArray: any[], outputIndex: number) => {
            if (!Array.isArray(connArray)) return;
            connArray.forEach((conn: any, connIndex: number) => {
              if (!conn?.node) return;
              const targetId = nameToId[conn.node];
              if (!targetId) return;

              flowEdges.push({
                id: `${sourceId}-${outputIndex}-${targetId}-${connIndex}`,
                source: sourceId,
                target: targetId,
                type: "smoothstep",
                animated: true,
                style: { stroke: "#64748b", strokeWidth: 2 },
              });
            });
          });
        });
        return;
      } else {
        return;
      }

      // 处理连接数组
      connectionArrays.forEach((connArray, outputIndex) => {
        if (!Array.isArray(connArray)) return;
        connArray.forEach((conn: any, connIndex) => {
          if (!conn?.node) return;
          const targetId = nameToId[conn.node];
          if (!targetId) return;

          flowEdges.push({
            id: `${sourceId}-${outputIndex}-${targetId}-${connIndex}`,
            source: sourceId,
            target: targetId,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#64748b", strokeWidth: 2 },
          });
        });
      });
    });

    return { nodes: flowNodes, edges: flowEdges };
  }, [workflow]);

  const [flowNodes] = useNodesState(nodes);
  const [flowEdges] = useEdgesState(edges);

  if (nodes.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 bg-muted rounded-lg ${className}`}>
        <p className="text-muted-foreground">无法加载工作流预览</p>
      </div>
    );
  }

  return (
    <div className={`h-96 rounded-lg border bg-background ${className}`}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={true}
        panOnScroll={true}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background color="#e2e8f0" gap={16} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => node.style?.background as string || "#6c5ce7"}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}
