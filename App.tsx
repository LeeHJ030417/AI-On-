
import React, { useState } from 'react';
import Header from './components/Header';
import CustomPromptSection from './components/CustomPromptSection';
import ProjectSummary from './components/ProjectSummary';
import Roadmap from './components/Roadmap';
import { PROJECT_PHASES } from './constants';
import LightbulbIcon from './components/icons/LightbulbIcon';
import PaperIcon from './components/icons/PaperIcon';
import LandingPage from './components/LandingPage';
import ArrowLeftIcon from './components/icons/ArrowLeftIcon';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [view, setView] = useState<'main' | 'summary' | 'roadmap'>('main');

  if (!isStarted) {
    return <LandingPage onStart={() => setIsStarted(true)} />;
  }

  const renderContent = () => {
    switch (view) {
      case 'summary':
        return (
          <div className="animate-fadeIn">
            <button
              onClick={() => setView('main')}
              className="inline-flex items-center space-x-2 text-left mb-6 px-4 py-2 bg-brand-surface rounded-lg hover:bg-brand-primary/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              aria-label="메인 화면으로 돌아가기"
            >
              <ArrowLeftIcon className="w-5 h-5 text-brand-primary" />
              <span className="font-semibold text-brand-text-main">뒤로가기</span>
            </button>
            <ProjectSummary />
          </div>
        );
      case 'roadmap':
        return (
          <div className="animate-fadeIn">
            <button
              onClick={() => setView('main')}
              className="inline-flex items-center space-x-2 text-left mb-6 px-4 py-2 bg-brand-surface rounded-lg hover:bg-brand-primary/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              aria-label="메인 화면으로 돌아가기"
            >
              <ArrowLeftIcon className="w-5 h-5 text-brand-primary" />
              <span className="font-semibold text-brand-text-main">뒤로가기</span>
            </button>
            <Roadmap phases={PROJECT_PHASES} />
          </div>
        );
      case 'main':
      default:
        return (
          <>
            <CustomPromptSection />
            <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setView('summary')}
                className="w-full text-left p-4 bg-brand-surface rounded-xl shadow-lg flex items-start space-x-4 hover:bg-brand-primary/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <div className="flex-shrink-0 bg-brand-primary/20 p-3 rounded-lg mt-1">
                  <LightbulbIcon className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-brand-primary">프로젝트 목표</h2>
                  <p className="text-brand-text-secondary mt-1">
                    클릭하여 목표를 확인합니다.
                  </p>
                </div>
              </button>
              <button
                onClick={() => setView('roadmap')}
                className="w-full text-left p-4 bg-brand-surface rounded-xl shadow-lg flex items-start space-x-4 hover:bg-brand-secondary/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              >
                <div className="flex-shrink-0 bg-brand-secondary/20 p-3 rounded-lg mt-1">
                  <PaperIcon className="w-6 h-6 text-brand-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-brand-secondary">프로젝트 로드맵</h2>
                  <p className="text-brand-text-secondary mt-1">
                    클릭하여 로드맵을 확인합니다.
                  </p>
                </div>
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <Header onGoHome={() => setIsStarted(false)} />
        <main className="mt-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
