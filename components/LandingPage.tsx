import React from 'react';
import AiTextIcon from './icons/AiTextIcon';
import PlayIcon from './icons/PlayIcon';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center relative overflow-hidden p-4">
      <h1
        className="absolute inset-0 flex items-center justify-center text-[18vw] md:text-[20rem] font-black text-gray-500/5 select-none -z-0"
        aria-hidden="true"
      >
        AI-On
      </h1>

      <div className="text-center z-10 animate-fadeIn">
        <div className="bg-brand-primary p-4 rounded-xl inline-block mb-6">
          <AiTextIcon className="w-12 h-12" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-brand-text-main tracking-tight">AI-On<span className="text-brand-primary">(알온)</span></h1>
        <p className="text-xl text-brand-text-secondary mt-4 max-w-2xl mx-auto">
          AI 환각 탐지 모델 구축 단계를 설명하는 대화형 LLM 프로젝트입니다.
        </p>
        <div className="mt-10">
          <button
            onClick={onStart}
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-primary text-white font-bold rounded-lg text-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-primary/50"
          >
            <PlayIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-180" />
            <span>시작하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;