
import React, { useState } from 'react';
import { Phase, Task } from '../types';
import PhaseCard from './PhaseCard';

interface RoadmapProps {
  phases: Phase[];
  onTaskSelect: (task: Task) => void;
}

const Roadmap: React.FC<RoadmapProps> = ({ phases, onTaskSelect }) => {
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);

  const handlePhaseToggle = (phaseId: string) => {
    setExpandedPhaseId(prevId => (prevId === phaseId ? null : phaseId));
  };

  return (
    <div className="relative pl-8 md:pl-10">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-surface rounded-full md:left-2"></div>
      <h2 className="text-3xl font-bold text-brand-text-main mb-8">프로젝트 로드맵</h2>
      <div className="space-y-12">
        {phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            onTaskSelect={onTaskSelect}
            isExpanded={expandedPhaseId === phase.id}
            onToggle={() => handlePhaseToggle(phase.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
