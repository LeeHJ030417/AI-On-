import React from 'react';

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
  tasks: Task[];
  icon: React.FC<{ className?: string }>;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  isError?: boolean;
}

export interface AnalysisResultData {
  tokens: string[];
  totalCombinations: number;
  hallucinatedCombinations: { combo: string[]; reason: string }[];
}

export interface AnalysisMessage {
  role: 'analysis';
  id: string; // To identify and update the message
  input: string; // The original text being analyzed
  results?: AnalysisResultData;
  error?: string;
  status: 'pending' | 'complete' | 'error';
}
