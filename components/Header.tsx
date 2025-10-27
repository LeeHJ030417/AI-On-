
import React from 'react';
import TeamInfoModal from './TeamInfoModal';
import UsersIcon from './icons/UsersIcon';
import AiTextIcon from './icons/AiTextIcon';
import HomeIcon from './icons/HomeIcon';

interface HeaderProps {
  onGoHome: () => void;
  view: 'main' | 'summary' | 'roadmap';
  temperature: number;
  setTemperature: (value: number) => void;
  topP: number;
  setTopP: (value: number) => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome, view, temperature, setTemperature, topP, setTopP }) => {
  const [isTeamModalOpen, setIsTeamModalOpen] = React.useState(false);

  return (
    <>
      <header className="border-b-2 border-brand-primary pb-4">
        <div className="flex items-center space-x-4">
          <div className="bg-brand-primary p-3 rounded-lg flex items-center justify-center">
            <AiTextIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-text-main tracking-tight">AI-On(알온)</h1>
            <p className="text-lg text-brand-text-secondary mt-1">AI 환각 탐지 모델 프로젝트</p>
          </div>
        </div>
        
        {view === 'main' && (
          <div className="mt-6 p-4 bg-brand-surface rounded-xl shadow-inner animate-fadeIn">
            <h3 className="text-lg font-semibold text-brand-text-main mb-3">AI 모델 설정</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label htmlFor="temperature" className="flex justify-between text-sm font-medium text-brand-text-secondary mb-1">
                  <span>Temperature</span>
                  <span className="font-bold text-brand-text-main">{temperature.toFixed(2)}</span>
                </label>
                <input
                  id="temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  aria-label="Temperature 설정"
                />
                <p className="text-xs text-gray-400 mt-1">답변의 무작위성 (낮을수록 일관적)</p>
              </div>
              <div>
                <label htmlFor="topP" className="flex justify-between text-sm font-medium text-brand-text-secondary mb-1">
                  <span>Top-P</span>
                  <span className="font-bold text-brand-text-main">{topP.toFixed(2)}</span>
                </label>
                <input
                  id="topP"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                  aria-label="Top-P 설정"
                />
                <p className="text-xs text-gray-400 mt-1">다음 단어 선택 후보의 범위</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-brand-text-secondary"><span className="font-semibold text-brand-text-main">팀:</span> Dying Mouse(주근지)</p>
          <div className="flex items-center space-x-2">
            <button
              onClick={onGoHome}
              className="flex items-center space-x-2 text-left px-3 py-2 bg-brand-primary/20 rounded-lg hover:bg-brand-primary/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              aria-label="처음으로 돌아가기"
            >
              <HomeIcon className="w-5 h-5 text-brand-primary" />
              <span className="font-semibold text-brand-text-main">처음으로</span>
            </button>
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="flex items-center space-x-2 text-left px-3 py-2 bg-brand-secondary/20 rounded-lg hover:bg-brand-secondary/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              aria-label="팀 소개 보기"
            >
              <UsersIcon className="w-5 h-5 text-brand-secondary" />
              <span className="font-semibold text-brand-text-main">팀 소개</span>
            </button>
          </div>
        </div>
      </header>
      
      {isTeamModalOpen && <TeamInfoModal onClose={() => setIsTeamModalOpen(false)} />}
    </>
  );
};

export default Header;
