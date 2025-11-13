
import React from 'react';
import { Phase, Task } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface PhaseCardProps {
  phase: Phase;
  isExpanded: boolean;
  onToggle: () => void;
  onTaskClick: (task: Task) => void;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, isExpanded, onToggle, onTaskClick }) => {
  const { title, description, tasks, icon: PhaseIcon } = phase;

  return (
    <div className="relative">
      <div className="absolute -left-12 top-0 h-10 w-10 bg-brand-primary rounded-full flex items-center justify-center ring-8 ring-brand-bg md:-left-14">
        <PhaseIcon className="w-5 h-5 text-white" />
      </div>
      <div className="bg-brand-surface p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <button
          onClick={onToggle}
          className="w-full flex justify-between items-center text-left focus:outline-none"
          aria-expanded={isExpanded}
        >
          <h3 className="text-xl font-bold text-brand-primary">{title}</h3>
          <ChevronDownIcon className={`w-6 h-6 text-brand-text-secondary transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="mt-4">
            <p className="text-brand-text-secondary mb-6">{description}</p>
            <div className="space-y-4">
              {tasks.map((task) => {
                const TaskIcon = task.icon;
                return (
                  <button
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="w-full text-left p-4 bg-gray-800/50 rounded-lg flex items-center space-x-4 hover:bg-gray-800 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 bg-brand-secondary/20 p-2 rounded-md">
                      <TaskIcon className="w-5 h-5 text-brand-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-text-main">{task.title}</p>
                      <p className="text-sm text-brand-text-secondary">{task.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseCard;