import React from 'react';
import { KnowledgeGraphMessage, Node, Edge } from '../types';
import NetworkIcon from './icons/NetworkIcon';
import XCircleIcon from './icons/XCircleIcon';

interface KnowledgeGraphResultProps {
  message: KnowledgeGraphMessage;
}

// Simple circular layout algorithm
const getGraphLayout = (nodes: Node[], width: number, height: number) => {
  const nodeMap = new Map<string, { x: number; y: number; node: Node }>();
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return nodeMap;
  }

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40; // 40px padding

  nodes.forEach((node, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    nodeMap.set(node.id, { x, y, node });
  });

  return nodeMap;
};

const KnowledgeGraphResult: React.FC<KnowledgeGraphResultProps> = ({ message }) => {
  if (message.status === 'pending') {
    return (
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 bg-purple-600/20 p-2 rounded-full mt-1">
          <NetworkIcon className="w-5 h-5 text-purple-400" />
        </div>
        <div className="w-auto max-w-xl rounded-lg px-4 py-3 bg-gray-800/50">
          <div className="flex items-center space-x-2 text-brand-text-secondary">
            <div className="w-4 h-4 border-2 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
            <span>Generating Knowledge Graph for "{message.input}"...</span>
          </div>
        </div>
      </div>
    );
  }

  if (message.status === 'error' || !message.results) {
    return (
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 bg-red-900/50 p-2 rounded-full mt-1">
          <NetworkIcon className="w-5 h-5 text-red-400" />
        </div>
        <div className="w-auto max-w-xl rounded-lg px-4 py-3 bg-red-900/50 text-red-400">
          <p className="font-bold">Knowledge Graph Error</p>
          <p>{message.error || 'An unknown error occurred.'}</p>
        </div>
      </div>
    );
  }

  const { nodes, edges, summary } = message.results;
  // Add safety checks to prevent crashes if API returns non-array values
  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const safeEdges = Array.isArray(edges) ? edges : [];
  const nodeMap = getGraphLayout(safeNodes, 500, 300);

  return (
    <div className="flex items-start gap-3 w-full">
      <div className="flex-shrink-0 bg-purple-600/20 p-2 rounded-full mt-1">
        <NetworkIcon className="w-5 h-5 text-purple-400" />
      </div>
      <div className="w-auto max-w-3xl rounded-lg p-4 bg-gray-800/50 text-brand-text-secondary flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-brand-text-main">서비스 출력: 지식 그래프 분석</h3>
             <p className="border-l-4 border-purple-500 pl-3 py-1 bg-purple-900/20 rounded-r-md mt-2">
                "<span className="font-semibold text-brand-text-main">{message.input}</span>"
            </p>
          </div>
           {message.usageMetadata && (
            <div className="text-xs text-gray-400 bg-gray-900/50 px-3 py-1 rounded-md flex-shrink-0">
              Tokens: {message.usageMetadata.totalTokenCount}
            </div>
          )}
        </div>
        
        <div className="w-full h-[300px] bg-gray-900/50 rounded-lg my-4 overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 500 300">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
              </marker>
            </defs>
            
            {/* Render Edges */}
            {safeEdges.map((edge, i) => {
              const fromNode = nodeMap.get(edge.from);
              const toNode = nodeMap.get(edge.to);
              if (!fromNode || !toNode) return null;

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              return (
                <g key={`edge-${i}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#6b7280"
                    strokeWidth="1.5"
                    markerEnd="url(#arrowhead)"
                  />
                  <text x={midX} y={midY - 5} fill="#a0aec0" fontSize="10" textAnchor="middle">
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Render Nodes */}
            {Array.from(nodeMap.values()).map(({ x, y, node }) => (
              <g key={`node-${node.id}`} transform={`translate(${x}, ${y})`}>
                <circle cx="0" cy="0" r="8" fill="#a78bfa" />
                <text
                  x="0"
                  y="20"
                  fill="#f3f4f6"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
        
        <div>
            <h4 className="font-semibold text-brand-text-main mb-2">AI 분석 요약</h4>
            <div className="p-3 bg-gray-900/50 rounded-lg text-sm leading-relaxed">
              {summary || "요약 정보가 없습니다."}
            </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphResult;