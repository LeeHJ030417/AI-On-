
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
