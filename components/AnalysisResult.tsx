import React, { useState } from 'react';
import { AnalysisMessage } from '../types';
import AnalysisIcon from './icons/AnalysisIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface AnalysisResultProps {
  message: AnalysisMessage;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ message }) => {
  const [showAllCombinations, setShowAllCombinations] = useState(false);
  const [showContradictions, setShowContradictions] = useState(false);

  if (message.status === 'pending') {
    return (
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 bg-brand-secondary/20 p-2 rounded-full mt-1">
          <AnalysisIcon className="w-5 h-5 text-brand-secondary" />
        </div>
        <div className="w-auto max-w-xl rounded-lg px-4 py-3 bg-gray-800/50">
          <div className="flex items-center space-x-2 text-brand-text-secondary">
            <div className="w-4 h-4 border-2 border-t-transparent border-brand-secondary rounded-full animate-spin"></div>
            <span>Analyzing hallucination rate for "{message.input}"...</span>
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
            <p className="font-bold">Analysis Error</p>
            <p>{message.error || 'An unknown error occurred.'}</p>
        </div>
        </div>
    );
  }

  const { tokens, totalCombinations, hallucinatedCombinations, allCombinations } = message.results;
  const hallucinationRate = totalCombinations > 0 ? (hallucinatedCombinations.length / totalCombinations) * 100 : 0;

  return (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 bg-brand-secondary/20 p-2 rounded-full mt-1">
            <AnalysisIcon className="w-5 h-5 text-brand-secondary" />
        </div>
        <div className="w-auto max-w-2xl rounded-lg p-4 bg-gray-800/50 text-brand-text-secondary w-full">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-lg text-brand-text-main">서비스 출력: 환각 분석</h3>
                    <p className="border-l-4 border-brand-secondary pl-3 py-1 bg-brand-secondary/10 rounded-r-md mt-2">
                        "<span className="font-semibold text-brand-text-main">{message.input}</span>"
                    </p>
                </div>
                 {message.usageMetadata && (
                    <div className="text-xs text-gray-400 bg-gray-900/50 px-3 py-1 rounded-md flex-shrink-0">
                        Tokens: {message.usageMetadata.totalTokenCount}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                    <p className="text-sm">Hallucination Rate</p>
                    <p className={`text-3xl font-bold ${hallucinationRate > 20 ? 'text-red-400' : 'text-green-400'}`}>{hallucinationRate.toFixed(1)}%</p>
                </div>
                 <div className="bg-gray-900/50 p-3 rounded-lg text-center">
                    <p className="text-sm">Combinations Tested</p>
                    <p className="text-3xl font-bold text-brand-text-main">{totalCombinations}</p>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="font-semibold text-brand-text-main mb-2">Tokens Analyzed</h4>
                <div className="flex flex-wrap gap-2">
                    {tokens.map((token, i) => (
                        <span key={i} className="px-2 py-1 bg-brand-primary/20 text-brand-primary text-sm font-mono rounded-md">{token}</span>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                 {hallucinatedCombinations.length === 0 ? (
                    <>
                        <h4 className="font-semibold text-brand-text-main mb-2">Contradictions Found (0)</h4>
                        <div className="flex items-center gap-2 text-green-400 bg-green-900/50 p-3 rounded-lg">
                            <CheckCircleIcon className="w-5 h-5"/>
                            <p>No apparent contradictions were found in the analyzed combinations.</p>
                        </div>
                    </>
                 ) : (
                    <>
                        <button
                            onClick={() => setShowContradictions(!showContradictions)}
                            className="flex w-full justify-between items-center text-left font-semibold text-brand-text-main mb-2 focus:outline-none hover:text-brand-primary transition-colors"
                            aria-expanded={showContradictions}
                        >
                            <span>Contradictions Found ({hallucinatedCombinations.length})</span>
                            <ChevronDownIcon className={`w-5 h-5 text-brand-text-secondary transition-transform duration-300 ${showContradictions ? 'transform rotate-180' : ''}`} />
                        </button>
                        {showContradictions && (
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 animate-fadeIn">
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
                    </>
                 )}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <button
                onClick={() => setShowAllCombinations(!showAllCombinations)}
                className="flex w-full justify-between items-center text-left text-sm font-medium text-brand-text-secondary hover:text-brand-text-main transition-colors focus:outline-none"
                aria-expanded={showAllCombinations}
              >
                <span>{showAllCombinations ? 'Hide All Combinations' : `View All Combinations (${totalCombinations})`}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${showAllCombinations ? 'transform rotate-180' : ''}`} />
              </button>

              {showAllCombinations && allCombinations && (
                <div className="mt-3 p-3 bg-gray-900/50 rounded-lg max-h-48 overflow-y-auto text-xs font-mono text-gray-400 animate-fadeIn">
                  <div className="flex flex-col gap-1">
                    {allCombinations.map((combo, index) => (
                      <div key={index}>
                        • [{combo.join(', ')}]
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>
    </div>
  );
};

export default AnalysisResult;