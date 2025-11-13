import React from 'react';
import { Task } from '../types';
import CloseIcon from './icons/CloseIcon';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  aiGuidance: string;
  isLoading: boolean;
  error: string;
  usageMetadata?: { totalTokenCount: number };
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, aiGuidance, isLoading, error, usageMetadata }) => {
  const TaskIcon = task.icon;

  const renderGuidance = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center space-x-2 text-brand-text-secondary">
          <div className="w-4 h-4 border-2 border-t-transparent border-brand-primary rounded-full animate-spin"></div>
          <span>AI 가이드 생성 중...</span>
        </div>
      );
    }
    if (error) {
      return <div className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>;
    }
    
    const formattedGuidance = aiGuidance
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-text-main">$1</strong>')
      .replace(/(\r\n|\n)/g, '<br />');

    return <div className="prose prose-invert text-brand-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedGuidance }}></div>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-brand-surface w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 bg-brand-primary/20 p-3 rounded-lg">
              <TaskIcon className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-text-main">{task.title}</h2>
              <p className="text-sm text-brand-text-secondary">{task.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary">
            <CloseIcon className="w-6 h-6 text-brand-text-secondary" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold text-brand-secondary">AI 기반 가이드</h3>
             {usageMetadata && (
                <div className="text-xs text-gray-400 bg-gray-900/50 px-3 py-1 rounded-md">
                    Tokens: {usageMetadata.totalTokenCount}
                </div>
            )}
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg min-h-[100px]">
             {renderGuidance()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;