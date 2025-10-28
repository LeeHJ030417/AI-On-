import React from 'react';
import { AnalysisMessage } from '../types';
import AnalysisIcon from './icons/AnalysisIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';

interface AnalysisResultProps {
  message: AnalysisMessage;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ message }) => {
  if (message.status === 'pending') {
    return (
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 bg-brand-secondary/20 p-2 rounded-full mt-1">
          <AnalysisIcon className="w-5 h-5 text-brand-secondary" />
        </div>
        <div className="w-auto max-w-xl rounded-lg px-4 py-3 bg-gray-800/50">
          <div className="flex items-center space-x-2 text-brand-text-secondary">
            <div className="w-4 h-4 border-2 border-t-transparent border-brand-secondary rounded-full animate-spin"></div>
            <span>"{message.input}" 문장에 대한 환각률을 분석하는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  if (message.status === 'error' || !message.results) {
    return (
        <div className="flex items-start gap-3">
        <div className="flex-shrink-0 bg-red-900/50 p-2 rounded-full mt-1">
            <AnalysisIcon className="w-5 h-5 text-red-400" />
        </div>
        <div className="w-auto max-w-xl rounded-lg px-4 py-3 bg-red-900/50 text-red-400">
            <p className="font-bold">분석 오류</p>
            <p>{message.error || '알 수 없는 오류가 발생했습니다.'}</p>
        </div>
        </div>
    );
  }

  const { tokens, totalCombinations, hallucinatedCombinations } = message.results;
  const hallucinationRate = totalCombinations > 0 ? (hallucinatedCombinations.length / totalCombinations) * 100 : 0;

  return (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 bg-brand-secondary/20 p-2 rounded-full mt-1">
            <AnalysisIcon className="w-5 h-5 text-brand-secondary" />
        </div>
        <div className="w-auto max-w-2xl rounded-lg p-4 bg-gray-800/50 text-brand-text-secondary w-full">
            <h3 className="font-bold text-lg text-brand-text-main mb-2">환각률 분석 결과</h3>
            <p className="border-l-4 border-brand-secondary pl-3 py-1 bg-brand-secondary/10 rounded-r-md mb-4">
                "<span className="font-semibold text-brand-text-main">{message.input}</span>"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                    <p className="text-sm">환각률</p>
                    <p className={`text-3xl font-bold ${hallucinationRate > 20 ? 'text-red-400' : 'text-green-400'}`}>{hallucinationRate.toFixed(1)}%</p>
                </div>
                 <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                    <p className="text-sm">테스트된 조합</p>
                    <p className="text-3xl font-bold text-brand-text-main">{totalCombinations}</p>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="font-semibold text-brand-text-main mb-2">분석된 토큰</h4>
                <div className="flex flex-wrap gap-2">
                    {tokens.map((token, i) => (
                        <span key={i} className="px-2 py-1 bg-brand-primary/20 text-brand-primary text-sm font-mono rounded-md">{token}</span>
                    ))}
                </div>
            </div>

            <div>
                 <h4 className="font-semibold text-brand-text-main mb-2">발견된 모순 ({hallucinatedCombinations.length}개)</h4>
                 {hallucinatedCombinations.length === 0 ? (
                    <div className="flex items-center gap-2 text-green-400 bg-green-900/50 p-3 rounded-lg">
                        <CheckCircleIcon className="w-5 h-5"/>
                        <p>분석된 조합에서 명백한 모순이 발견되지 않았습니다.</p>
                    </div>
                 ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {hallucinatedCombinations.map((item, i) => (
                            <div key={i} className="bg-red-900/50 p-3 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex-shrink-0">
                                        <XCircleIcon className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap gap-2 font-mono text-sm mb-2">
                                            {item.combo.map((c, j) => <span key={j} className="px-2 py-1 bg-red-400/20 text-red-300 rounded-md">{c}</span>)}
                                        </div>
                                        <p className="text-red-300 text-sm">{item.reason}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 )}
            </div>
        </div>
    </div>
  );
};

export default AnalysisResult;
