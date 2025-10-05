
import React, { useState } from 'react';
import Header from './components/Header';
import CustomPromptSection from './components/CustomPromptSection';
import ProjectSummary from './components/ProjectSummary';
import Roadmap from './components/Roadmap';
import TaskDetailModal from './components/TaskDetailModal';
import { Task } from './types';
import { PROJECT_PHASES } from './constants';
import { generateGuidance } from './services/geminiService';
import LightbulbIcon from './components/icons/LightbulbIcon';
import PaperIcon from './components/icons/PaperIcon';
import LandingPage from './components/LandingPage';
import ArrowLeftIcon from './components/icons/ArrowLeftIcon';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [aiGuidance, setAiGuidance] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [view, setView] = useState<'main' | 'summary' | 'roadmap'>('main');

  const handleTaskSelect = async (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    setError('');
    setAiGuidance('');
    setIsLoading(true);

    try {
      const systemInstruction = `당신은 전문 AI 연구원이자 프로젝트 관리자입니다. 당신의 임무는 주어진 작업 설명의 사실적 및 논리적 모순을 분석하는 것입니다.
응답은 반드시 다음 세 가지 마크다운 섹션을 포함해야 합니다:
1.  **사실적 모순 분석**: [작업 설명의 사실적 모순을 분석합니다. 모순이 없다면 "모순이 발견되지 않았습니다."라고만 적습니다.]
2.  **논리적 모순 분석**: [작업 설명의 논리적 모순을 분석합니다. 모순이 없다면 "모순이 발견되지 않았습니다."라고만 적습니다.]
3.  **수정된 가이드**: [모순이 발견된 경우, 수정된 실행 가이드를 제공합니다. 모순이 없는 경우, 원래 작업에 대한 실행 가이드를 제공합니다.]`;
      const userPrompt = `작업: "${task.geminiPrompt}"`;
      const guidance = await generateGuidance(userPrompt, systemInstruction);
      setAiGuidance(guidance);
    } catch (err) {
      setError('AI 가이드를 가져오는데 실패했습니다. API 키를 확인하고 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setAiGuidance('');
    setError('');
  };

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
            <Roadmap phases={PROJECT_PHASES} onTaskSelect={handleTaskSelect} />
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
      {isModalOpen && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={closeModal}
          aiGuidance={aiGuidance}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default App;
