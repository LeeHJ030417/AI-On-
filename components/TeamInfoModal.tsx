import React from 'react';
import CloseIcon from './icons/CloseIcon';
import MouseIcon from './icons/MouseIcon';
import LinkIcon from './icons/LinkIcon';

interface TeamInfoModalProps {
  onClose: () => void;
}

const TeamInfoModal: React.FC<TeamInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-brand-surface w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
             <div className="flex-shrink-0 bg-brand-secondary/20 p-3 rounded-lg">
              <MouseIcon className="w-6 h-6 text-brand-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-text-main">팀 Dying Mouse(주근지) 소개</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary">
            <CloseIcon className="w-6 h-6 text-brand-text-secondary" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-brand-secondary mb-2">우리의 목표</h3>
            <p className="text-brand-text-secondary leading-relaxed">
              저희 'Dying Mouse(주근지)' 팀은 AI 기술의 가능성과 한계를 탐구하며, 더 신뢰할 수 있는 AI를 만들기 위해 모였습니다. AI가 생성하는 정보의 신뢰도를 높이고, 특히 '환각' 현상을 탐지하고 완화하는 기술에 집중하여 인공지능이 인간 사회에 긍정적으로 기여할 수 있도록 연구하고 개발합니다.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-brand-secondary mb-2">팀원 소개</h3>
            <div className="p-4 bg-gray-800/50 rounded-lg space-y-2">
              <p className="text-brand-text-secondary"><strong className="text-brand-text-main">학교:</strong> 아주대학교</p>
              <p className="text-brand-text-secondary"><strong className="text-brand-text-main">팀장:</strong> 지서현</p>
              <p className="text-brand-text-secondary"><strong className="text-brand-text-main">팀원 1:</strong> 이형주</p>
              <p className="text-brand-text-secondary"><strong className="text-brand-text-main">팀원 2:</strong> 박근찬</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700">
           <a
            href="https://www.notion.so/AI-265f8c09802481c6b8abfd1a3d4d0e92"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary"
          >
            <LinkIcon className="w-5 h-5" />
            <span>기본 아이디어를 담은 Notion 페이지 링크 바로가기</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamInfoModal;
