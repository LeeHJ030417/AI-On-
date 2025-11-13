
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
import { Task } from './types';
import TaskDetailModal from './components/TaskDetailModal';
import { generateGuidance } from './services/geminiService';


const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [view, setView] = useState<'main' | 'summary' | 'roadmap'>('main');
  const [temperature, setTemperature] = useState<number>(0.3);
  const [topP, setTopP] = useState<number>(0.95);
  const [textSize, setTextSize] = useState<number>(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [aiGuidance, setAiGuidance] = useState('');
  const [isLoadingGuidance, setIsLoadingGuidance] = useState(false);
  const [guidanceError, setGuidanceError] = useState('');
  const [guidanceUsage, setGuidanceUsage] = useState<{totalTokenCount: number} | undefined>(undefined);
  const [model, setModel] = useState<'gemini-2.5-flash' | 'gemini-2.5-pro'>('gemini-2.5-flash');

  const handleTaskClick = async (task: Task) => {
    setSelectedTask(task);
    setIsLoadingGuidance(true);
    setGuidanceError('');
    setAiGuidance('');
    setGuidanceUsage(undefined);

    try {
      const { text, usageMetadata } = await generateGuidance(task.geminiPrompt, undefined, model, temperature, topP);
      setAiGuidance(text);
      if(usageMetadata && typeof usageMetadata.totalTokenCount === 'number') {
        setGuidanceUsage({ totalTokenCount: usageMetadata.totalTokenCount });
      }
    } catch (error) {
      setGuidanceError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsLoadingGuidance(false);
    }
  };


  if (!isStarted) {
    return <LandingPage onStart={() => setIsStarted(true)} />;
  }

  const renderLeftPanelContent = () => {
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
            <Roadmap phases={PROJECT_PHASES} onTaskClick={handleTaskClick} />
          </div>
        );
      case 'main':
      default:
        return (
          <div className="space-y-6 animate-fadeIn">
            {/* AI Model Settings Panel */}
            <div className="p-4 bg-brand-surface rounded-xl shadow-inner">
                <h3 className="text-lg font-semibold text-brand-text-main mb-3">AI 모델 설정</h3>
                <div className="grid grid-cols-1 gap-y-4">
                  <div>
                      <label className="text-sm font-medium text-brand-text-secondary mb-2 block">모델 선택</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setModel('gemini-2.5-flash')}
                          className={`px-4 py-2 text-sm font-bold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface ${model === 'gemini-2.5-flash' ? 'bg-brand-primary text-white focus:ring-brand-primary' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500'}`}
                        >
                          Flash (빠름)
                        </button>
                        <button
                          onClick={() => setModel('gemini-2.5-pro')}
                          className={`px-4 py-2 text-sm font-bold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface ${model === 'gemini-2.5-pro' ? 'bg-brand-secondary text-white focus:ring-brand-secondary' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500'}`}
                        >
                          Pro (고성능)
                        </button>
                      </div>
                       <p className="text-xs text-gray-400 mt-2">
                        {model === 'gemini-2.5-flash'
                          ? '빠른 응답과 비용 효율성에 최적화된 모델입니다.'
                          : '복잡한 추론과 분석에 더 뛰어난 성능을 보이는 모델입니다.'}
                      </p>
                  </div>
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

            {/* Display Settings Panel */}
            <div className="p-4 bg-brand-surface rounded-xl shadow-inner">
                <h3 className="text-lg font-semibold text-brand-text-main mb-3">디스플레이 설정</h3>
                <div>
                    <label htmlFor="textSize" className="flex justify-between text-sm font-medium text-brand-text-secondary mb-1">
                    <span>텍스트 크기 조절</span>
                    <span className="font-bold text-brand-text-main">{textSize > 0 ? '+' : ''}{textSize}</span>
                    </label>
                    <input
                    id="textSize"
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={textSize}
                    onChange={(e) => setTextSize(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    aria-label="텍스트 크기 조절"
                    />
                    <p className="text-xs text-gray-400 mt-1">대화창의 텍스트 크기를 조절합니다.</p>
                </div>
            </div>
            
            {/* Project Navigation Buttons */}
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
        );
    }
  };

  return (
    <div className="h-screen bg-brand-bg font-sans p-4 sm:p-6 lg:p-8 animate-fadeIn">
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          aiGuidance={aiGuidance}
          isLoading={isLoadingGuidance}
          error={guidanceError}
          usageMetadata={guidanceUsage}
        />
      )}
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <Header onGoHome={() => setIsStarted(false)} />
        <main className="mt-8 flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
          {/* Left Panel */}
          <div className="overflow-y-auto pr-2">
            {renderLeftPanelContent()}
          </div>
          
          {/* Right Panel */}
          <div className="flex flex-col min-h-0">
            <CustomPromptSection model={model} temperature={temperature} topP={topP} textSize={textSize} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
