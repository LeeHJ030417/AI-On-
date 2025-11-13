import React from 'react';
import { LarkMessage, LarkStep } from '../types';
import LarkIcon from './icons/LarkIcon';
import BracketsIcon from './icons/BracketsIcon';
import AnalysisIcon from './icons/AnalysisIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';

interface LarkResultProps {
  message: LarkMessage;
}

const StatusSpinner: React.FC<{ status: LarkStep['status'] }> = ({ status }) => {
  if (status === 'complete') return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
  if (status === 'error') return <XCircleIcon className="w-5 h-5 text-red-400" />;
  return <div className="w-5 h-5 border-2 border-t-transparent border-green-500 rounded-full animate-spin"></div>;
};

const LarkStepCard: React.FC<{ step: LarkStep; icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ step, icon, title, children }) => {
  return (
    <div className="bg-gray-900/50 p-4 rounded-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0">{icon}</div>
        <h4 className="font-semibold text-brand-text-main flex-grow">{title}</h4>
        <StatusSpinner status={step.status} />
      </div>
      {step.status !== 'pending' && (
        <div className="pl-8 text-sm animate-fadeIn">
          {step.status === 'error' ? <p className="text-red-400">{step.error || '알 수 없는 오류가 발생했습니다.'}</p> : children}
        </div>
      )}
    </div>
  );
};

const LarkResult: React.FC<LarkResultProps> = ({ message }) => {
  const getStep = (name: LarkStep['name']) => message.steps.find(s => s.name === name)!;

  const logicStep = getStep('논리식 변환');
  const contradictionStep = getStep('모순 관계 확인');
  const finalStep = getStep('최종 결과');

  return (
    <div className="flex items-start gap-3 w-full">
      <div className="flex-shrink-0 bg-green-600/20 p-2 rounded-full mt-1">
        <LarkIcon className="w-5 h-5 text-green-400" />
      </div>
      <div className="w-auto max-w-3xl rounded-lg p-4 bg-gray-800/50 text-brand-text-secondary flex-grow">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="font-bold text-lg text-brand-text-main">서비스 출력: 논리 분석</h3>
                <p className="border-l-4 border-green-500 pl-3 py-1 bg-green-900/20 rounded-r-md mt-2">
                    "<span className="font-semibold text-brand-text-main">{message.input}</span>"
                </p>
            </div>
            {message.usageMetadata && (
                <div className="text-xs text-gray-400 bg-gray-900/50 px-3 py-1 rounded-md flex-shrink-0">
                    Tokens: {message.usageMetadata.totalTokenCount}
                </div>
            )}
        </div>

        {message.status === 'error' && (
             <div className="flex items-center gap-2 text-red-400 bg-red-900/50 p-3 rounded-lg mb-4">
                <XCircleIcon className="w-5 h-5"/>
                <p><strong>오류:</strong> {message.error}</p>
            </div>
        )}

        <div className="space-y-3">
          <LarkStepCard step={logicStep} icon={<BracketsIcon className="w-5 h-5 text-brand-primary" />} title="단계 1 & 2: 논리식 변환">
            {message.results.logicExpressions && (
              <div className="space-y-2">
                {message.results.logicExpressions.map((item, i) => (
                  <div key={i} className="grid grid-cols-[auto,1fr] gap-x-2 items-start">
                    <span className="text-gray-400">{item.sentence}</span>
                    <span className="font-mono text-cyan-300 bg-gray-900 px-2 py-1 rounded">
                      {item.expression}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </LarkStepCard>

          <LarkStepCard step={contradictionStep} icon={<AnalysisIcon className="w-5 h-5 text-brand-secondary" />} title="단계 3: 모순 관계 확인">
             {message.results.contradictionChecks && (
              <div className="space-y-2">
                {message.results.contradictionChecks.map((check, i) => (
                   <div key={i} className={`p-2 rounded-md ${check.is_contradictory ? 'bg-red-900/50' : 'bg-green-900/30'}`}>
                      <div className="flex items-center gap-2 font-mono text-sm">
                        {check.is_contradictory 
                          ? <XCircleIcon className="w-4 h-4 text-red-400 flex-shrink-0" /> 
                          : <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />}
                        <span className={check.is_contradictory ? 'text-red-300' : 'text-green-300'}>
                          {`[${check.expression_pair[0]}] ↔ [${check.expression_pair[1]}]`}
                        </span>
                      </div>
                      {check.is_contradictory && <p className="text-red-300 text-xs mt-1 pl-6">{check.reason}</p>}
                   </div>
                ))}
              </div>
            )}
          </LarkStepCard>
        </div>

        {message.status === 'complete' && message.results.finalResult && (
          <div className="mt-4 p-4 bg-gray-900/50 border-l-4 border-green-500 rounded-r-lg animate-fadeIn">
            <div className="flex items-center gap-3 mb-2">
              <LarkIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
              <h4 className="font-bold text-lg text-green-300">단계 4: 최종 결과</h4>
            </div>
            <div className="pl-9 flex items-center gap-4">
              <p className={`text-2xl font-bold ${message.results.finalResult.contradiction_found ? 'text-red-400' : 'text-green-400'}`}>
                {message.results.finalResult.contradiction_found ? '모순 발견 (True)' : '모순 없음 (False)'}
              </p>
              <p className="text-brand-text-main text-base">
                {message.results.finalResult.summary}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LarkResult;