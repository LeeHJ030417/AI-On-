import React from 'react';

// For Roadmap
export interface Task {
  id: string;
  title: string;
  description: string;
  geminiPrompt: string;
  icon: React.FC<{ className?: string }>;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  tasks: Task[];
}

export type AnalysisMode = 'fact' | 'logical' | 'hallucination' | 'graph';

// For CustomPromptSection chat messages
export type Message = UserMessage | BotMessage | AnalysisMessage | LarkMessage | KnowledgeGraphMessage;

export interface BaseMessage {
  id: string;
  usageMetadata?: { totalTokenCount: number };
}

export interface UserMessage extends BaseMessage {
  type: 'user';
  text: string;
}

export interface BotMessage extends BaseMessage {
  type: 'bot';
  text: string;
  sources?: { uri: string; title: string }[];
  isOutput?: boolean;
}

// For Hallucination Analysis
export interface HallucinationResult {
  tokens: string[];
  totalCombinations: number;
  hallucinatedCombinations: { combo: string[]; reason: string }[];
  allCombinations: string[][];
}

export interface AnalysisMessage extends BaseMessage {
  type: 'analysis';
  input: string;
  status: 'pending' | 'complete' | 'error';
  results?: HallucinationResult;
  error?: string;
}

// For Logical Analysis (LARK)
export type LarkStepName = '논리식 변환' | '모순 관계 확인' | '최종 결과';

export interface LarkStep {
  name: LarkStepName;
  status: 'pending' | 'complete' | 'error';
  error?: string;
}

export interface LarkResultData {
    logicExpressions: { sentence: string; expression: string }[];
    contradictionChecks: { expression_pair: [string, string]; is_contradictory: boolean; reason: string }[];
    finalResult: { contradiction_found: boolean; summary: string };
}

export interface LarkMessage extends BaseMessage {
  type: 'lark';
  input: string;
  status: 'pending' | 'complete' | 'error';
  steps: LarkStep[];
  results: Partial<LarkResultData>;
  error?: string;
}

// For Knowledge Graph
export interface Node {
  id: string;
  label: string;
}

export interface Edge {
  from: string;
  to: string;
  label: string;
}

export interface KnowledgeGraphResultData {
    nodes: Node[];
    edges: Edge[];
    summary: string;
}

export interface KnowledgeGraphMessage extends BaseMessage {
  type: 'knowledge_graph';
  input: string;
  status: 'pending' | 'complete' | 'error';
  results?: KnowledgeGraphResultData;
  error?: string;
}