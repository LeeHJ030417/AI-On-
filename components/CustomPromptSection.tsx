
import React, { useState, useRef, useEffect } from 'react';
import { Message, AnalysisMessage, LarkMessage, KnowledgeGraphMessage, LarkStepName, LarkStep, UserMessage, BotMessage, AnalysisMode } from '../types';
import { checkMultipleContradictions, runLogicExtraction, findContradictionsInList, generateKnowledgeGraph, getAiClient } from '../services/geminiService';
import { tokenizeKoreanText, generateCombinations } from '../utils/analyzer';
import { Chat } from "@google/genai";
import UserIcon from './icons/UserIcon';
import AiTextIcon from './icons/AiTextIcon';
import SendIcon from './icons/SendIcon';
import AnalysisResult from './AnalysisResult';
import LarkResult from './LarkResult';
import KnowledgeGraphResult from './KnowledgeGraphResult';
import GlobeIcon from './icons/GlobeIcon';
import CheckIcon from './icons/CheckIcon';
import LarkIcon from './icons/LarkIcon';
import AnalysisIcon from './icons/AnalysisIcon';
import NetworkIcon from './icons/NetworkIcon';

interface CustomPromptSectionProps {
  model: string;
  temperature: number;
  topP: number;
  textSize: number;
}

const modeColors: Record<AnalysisMode, { active: string; inactive: string; ring: string }> = {
  fact: { // Yellow
    active: 'bg-yellow-500 text-black',
    inactive: 'bg-gray-700/50 text-yellow-400 hover:bg-yellow-500/20',
    ring: 'focus:ring-yellow-500'
  },
  logical: { // Green
    active: 'bg-green-500 text-white',
    inactive: 'bg-gray-700/50 text-green-400 hover:bg-green-500/20',
    ring: 'focus:ring-green-500'
  },
  hallucination: { // Blue
    active: 'bg-blue-500 text-white',
    inactive: 'bg-gray-700/50 text-blue-400 hover:bg-blue-500/20',
    ring: 'focus:ring-blue-500'
  },
  graph: { // Purple
    active: 'bg-purple-500 text-white',
    inactive: 'bg-gray-700/50 text-purple-400 hover:bg-purple-500/20',
    ring: 'focus:ring-purple-500'
  }
};

const CustomPromptSection: React.FC<CustomPromptSectionProps> = ({ model, temperature, topP, textSize }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AnalysisMode>('fact');
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
      setMessages([
        {
          id: 'initial-bot-message',
          type: 'bot',
          text: "안녕하세요! AI-On(알온) 프로젝트 데모에 오신 것을 환영합니다.\n\n상단의 버튼으로 분석 모드를 선택한 후, 아래 입력창에 텍스트를 입력하여 AI의 사실, 논리, 환각, 지식 구조를 분석해 보세요."
        }
      ]);
  }, []);

  useEffect(() => {
    if (mode === 'fact') {
      const ai = getAiClient();
      const newChat = ai.chats.create({
        model: model,
        config: {
          temperature,
          topP,
          systemInstruction: "당신은 사실 확인 전문가입니다. 당신의 역할은 실시간 웹 검색을 활용하여 사용자가 제공한 텍스트의 사실적 정확성을 분석하는 것입니다.\n- **간결하게 답변하세요**: 사용자의 질문에만 직접적으로 답변하고, 요청하지 않은 부가 정보는 제공하지 마세요.\n- **정보를 찾을 수 없는 경우**: 만약 웹 검색을 통해 관련 정보를 찾을 수 없다면, '관련 정보를 찾을 수 없습니다.'라고 명확하게 답변해주세요.\n- **신뢰할 수 있는 출처만 사용하세요**: 답변은 공신력 있는 출처(주요 언론사, 학술 자료, 공식 기관 등)에 기반해야 합니다. 나무위키(namu.wiki)와 같이 신뢰도가 낮은 사용자 생성 콘텐츠는 출처로 사용하거나 답변에 포함하지 마세요.\n- **모든 답변은 한국어로 작성해주세요**.",
          tools: [{ googleSearch: {} }],
        },
      });
      setChat(newChat);
    } else {
      setChat(null);
    }
  }, [mode, model, temperature, topP]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const textToProcess = input;
    const userMessage: UserMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: textToProcess,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        switch (mode) {
            case 'fact':
                await handleFactAnalysis(textToProcess);
                break;
            case 'hallucination':
                await handleHallucinationAnalysis(textToProcess);
                break;
            case 'logical':
                await handleLogicalAnalysis(textToProcess);
                break;
            case 'graph':
                await handleKnowledgeGraphAnalysis(textToProcess);
                break;
        }
    } catch (error) {
        const botMessage: BotMessage = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            text: `오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
        };
        setMessages(prev => [...prev, botMessage]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleFactAnalysis = async (textToProcess: string) => {
    if (!chat) {
        setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', text: '채팅 세션이 초기화되지 않았습니다. 잠시 후 다시 시도해주세요.' }]);
        return;
    }

    const botMessageId = (Date.now() + 1).toString();
    const pendingBotMessage: BotMessage = {
        id: botMessageId,
        type: 'bot',
        text: '답변 생성 중...',
        isOutput: true,
    };
    setMessages(prev => [...prev, pendingBotMessage]);

    try {
        const stream = await chat.sendMessageStream({ message: textToProcess });
        let botResponse = '';
        let sources: { uri: string; title: string }[] = [];

        for await (const chunk of stream) {
            const chunkText = chunk.text;
            if (chunkText) {
                botResponse += chunkText;
            }
            
            const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (Array.isArray(groundingChunks)) {
                const newSources = groundingChunks
                    .map(c => c.web)
                    .filter(web => web && web.uri && web.title)
                    .map(web => ({ uri: web.uri!, title: web.title! }));
                
                // Avoid duplicates
                newSources.forEach(ns => {
                    if (!sources.some(s => s.uri === ns.uri)) {
                        sources.push(ns);
                    }
                });
            }
            
            setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, type: 'bot', text: botResponse, sources: [...sources], isOutput: true } : m));
        }
    } catch (error) {
         setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, type: 'bot', text: `사실 분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`, isOutput: false } : m));
    }
  };

  const handleHallucinationAnalysis = async (textToAnalyze: string) => {
    const analysisId = (Date.now() + 1).toString();

    const pendingMessage: AnalysisMessage = {
      id: analysisId,
      type: 'analysis',
      input: textToAnalyze,
      status: 'pending',
    };
    setMessages(prev => [...prev, pendingMessage]);

    try {
        const tokens = tokenizeKoreanText(textToAnalyze);
        const combinations = generateCombinations(tokens);
        const combinationTexts = combinations.map(c => c.join(' '));

        if(combinationTexts.length === 0) {
            throw new Error("분석할 조합을 생성할 수 없습니다. 입력이 너무 짧습니다.");
        }

        const BATCH_SIZE = 20;
        let allContradictionResults: any[] = [];
        let totalTokenCount = 0;

        for (let i = 0; i < combinationTexts.length; i += BATCH_SIZE) {
            const batch = combinationTexts.slice(i, i + BATCH_SIZE);
            const { results, usageMetadata } = await checkMultipleContradictions(batch, model, temperature, topP);
            allContradictionResults = [...allContradictionResults, ...results];
            totalTokenCount += usageMetadata?.totalTokenCount || 0;
            if (i + BATCH_SIZE < combinationTexts.length) {
                await new Promise(resolve => setTimeout(resolve, 4100)); // Rate limit
            }
        }
        
        const hallucinatedCombinations = allContradictionResults
            .filter(r => r.isContradiction)
            .map(r => ({
                combo: r.text.split(' '),
                reason: r.reason
            }));

        const finalMessage: AnalysisMessage = {
            id: analysisId,
            type: 'analysis',
            input: textToAnalyze,
            status: 'complete',
            results: {
                tokens,
                totalCombinations: combinations.length,
                hallucinatedCombinations,
                allCombinations: combinations
            },
            usageMetadata: { totalTokenCount }
        };
        setMessages(prev => prev.map(m => m.id === analysisId ? finalMessage : m));

    } catch (error) {
        const errorMessage: AnalysisMessage = {
            id: analysisId,
            type: 'analysis',
            input: textToAnalyze,
            status: 'error',
            error: error instanceof Error ? error.message : "분석 중 알 수 없는 오류 발생"
        };
        setMessages(prev => prev.map(m => m.id === analysisId ? errorMessage : m));
    }
  };

  const handleLogicalAnalysis = async (textToAnalyze: string) => {
    const larkId = (Date.now() + 1).toString();
    let totalTokens = 0;

    const initialSteps: LarkStep[] = [
        { name: '논리식 변환', status: 'pending' },
        { name: '모순 관계 확인', status: 'pending' },
        { name: '최종 결과', status: 'pending' },
    ];
    
    const pendingMessage: LarkMessage = {
        id: larkId,
        type: 'lark',
        input: textToAnalyze,
        status: 'pending',
        steps: initialSteps,
        results: {},
    };
    setMessages(prev => [...prev, pendingMessage]);

    const updateStep = (stepName: LarkStepName, status: 'complete' | 'error', error?: string) => {
        setMessages(prev => prev.map(m => {
            if (m.id === larkId && m.type === 'lark') {
                return {
                    ...m,
                    steps: m.steps.map(s => s.name === stepName ? { ...s, status, error } : s)
                };
            }
            return m;
        }));
    };

    try {
        const { result: logicResult, usageMetadata: logicUsage } = await runLogicExtraction(textToAnalyze, model, temperature, topP);
        totalTokens += logicUsage?.totalTokenCount || 0;
        updateStep('논리식 변환', 'complete');
        setMessages(prev => prev.map(m => m.id === larkId && m.type === 'lark' ? { ...m, results: { ...m.results, logicExpressions: logicResult } } : m));

        const expressions = logicResult.map(item => item.expression);
        if (expressions.length < 2) {
             updateStep('모순 관계 확인', 'complete');
             const finalResultData = {
                contradictionChecks: [],
                finalResult: {
                    contradiction_found: false,
                    summary: "모순을 비교하기에 논리식이 충분하지 않습니다 (최소 2개 필요).",
                }
            };
            setMessages(prev => prev.map(m => m.id === larkId && m.type === 'lark' ? { ...m, results: { ...m.results, ...finalResultData }, usageMetadata: { totalTokenCount: totalTokens } } : m));
        } else {
            const { result: contradictionResult, usageMetadata: contradictionUsage } = await findContradictionsInList(expressions, model, temperature, topP);
            totalTokens += contradictionUsage?.totalTokenCount || 0;
            updateStep('모순 관계 확인', 'complete');
            
            const contradictionsFound = contradictionResult.filter(c => c.is_contradictory);
            const finalSummary = contradictionsFound.length > 0
                ? `총 ${contradictionsFound.length}개의 모순 관계가 발견되었습니다.`
                : "분석된 표현식 간에 명백한 모순이 발견되지 않았습니다.";
            
            const finalResultData = {
                contradictionChecks: contradictionResult,
                finalResult: {
                    contradiction_found: contradictionsFound.length > 0,
                    summary: finalSummary,
                }
            };

            setMessages(prev => prev.map(m => {
                if (m.id === larkId && m.type === 'lark') {
                    return {
                        ...m,
                        results: { ...m.results, ...finalResultData },
                        usageMetadata: { totalTokenCount: totalTokens }
                    };
                }
                return m;
            }));
        }
        
        updateStep('최종 결과', 'complete');
        setMessages(prev => prev.map(m => m.id === larkId ? { ...m, status: 'complete' } : m));

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "논리 분석 중 알 수 없는 오류 발생";
        setMessages(prev => prev.map(m => m.id === larkId && m.type === 'lark' ? { ...m, status: 'error', error: errorMessage, steps: m.steps.map(s => s.status === 'pending' ? { ...s, status: 'error', error: '이전 단계 실패' } : s) } : m));
    }
  };
  
  const handleKnowledgeGraphAnalysis = async (textToAnalyze: string) => {
    const graphId = (Date.now() + 1).toString();

    const pendingMessage: KnowledgeGraphMessage = {
      id: graphId,
      type: 'knowledge_graph',
      input: textToAnalyze,
      status: 'pending',
    };
    setMessages(prev => [...prev, pendingMessage]);

    try {
        const { result, usageMetadata } = await generateKnowledgeGraph(textToAnalyze, model, temperature, topP);
        // FIX: Ensure `usageMetadata` conforms to the expected type (`{ totalTokenCount: number } | undefined`).
        // The API response may have `totalTokenCount` as optional.
        const finalMessage: KnowledgeGraphMessage = {
            id: graphId,
            type: 'knowledge_graph',
            input: textToAnalyze,
            status: 'complete',
            results: result,
            usageMetadata: (usageMetadata && typeof usageMetadata.totalTokenCount === 'number')
                ? { totalTokenCount: usageMetadata.totalTokenCount }
                : undefined,
        };
        setMessages(prev => prev.map(m => m.id === graphId ? finalMessage : m));
    } catch(error) {
        const errorMessage: KnowledgeGraphMessage = {
            id: graphId,
            type: 'knowledge_graph',
            input: textToAnalyze,
            status: 'error',
            error: error instanceof Error ? error.message : "지식 그래프 생성 중 알 수 없는 오류 발생"
        };
        setMessages(prev => prev.map(m => m.id === graphId ? errorMessage : m));
    }
  };

  const renderMessage = (message: Message) => {
    switch(message.type) {
      case 'user':
        return (
            <div key={message.id} className="flex items-start gap-3 justify-end animate-fadeIn">
                <div className="w-auto max-w-xl rounded-lg px-4 py-3 bg-brand-primary text-white">
                    <p>{message.text}</p>
                </div>
                <div className="flex-shrink-0 bg-gray-700 p-2 rounded-full mt-1">
                    <UserIcon className="w-5 h-5 text-gray-300" />
                </div>
            </div>
        );
      case 'bot':
         return (
            <div key={message.id} className="flex items-start gap-3 animate-fadeIn">
                <div className="flex-shrink-0 bg-brand-surface p-2 rounded-full mt-1">
                    <AiTextIcon className="w-5 h-5" />
                </div>
                <div className="w-auto max-w-2xl rounded-lg p-4 bg-brand-surface">
                    {message.isOutput && (
                        <h3 className="font-bold text-lg text-brand-text-main mb-2">서비스 출력: 사실 분석</h3>
                    )}
                    <p className="text-brand-text-main whitespace-pre-wrap">{message.text}</p>
                    {message.sources && message.sources.length > 0 && (
                        <div className="mt-4 border-t border-gray-600 pt-3">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-brand-text-secondary mb-2">
                                <GlobeIcon className="w-4 h-4" />
                                <span>참고 자료</span>
                            </h4>
                            <ul className="space-y-1 text-xs">
                                {message.sources.map((source, i) => (
                                <li key={i} className="truncate">
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    {`[${i+1}] ${source.title}`}
                                    </a>
                                </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
      case 'analysis':
        return <AnalysisResult key={message.id} message={message} />;
      case 'lark':
        return <LarkResult key={message.id} message={message} />;
      case 'knowledge_graph':
        return <KnowledgeGraphResult key={message.id} message={message} />;
      default:
        return null;
    }
  };
  
  const placeholders: Record<AnalysisMode, string> = {
    fact: '실시간 웹 검색을 통해 사실을 분석할 텍스트를 입력하세요...',
    logical: '논리적 모순을 분석할 텍스트를 입력하세요...',
    hallucination: '환각 현상을 분석할 텍스트를 입력하세요...',
    graph: '지식 그래프를 생성할 텍스트를 입력하세요...'
  };

  const modeButtons: { mode: AnalysisMode; label: string; icon: React.FC<{className?: string}> }[] = [
    { mode: 'fact', label: '사실 분석', icon: CheckIcon },
    { mode: 'logical', label: '논리 분석', icon: LarkIcon },
    { mode: 'hallucination', label: '환각 분석', icon: AnalysisIcon },
    { mode: 'graph', label: '지식 그래프 분석', icon: NetworkIcon },
  ];

  return (
    <div className="bg-brand-surface rounded-xl shadow-inner h-full flex flex-col p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {modeButtons.map(({ mode: btnMode, label, icon: Icon }) => {
            const colors = modeColors[btnMode];
            return (
                <button
                    key={btnMode}
                    onClick={() => setMode(btnMode)}
                    className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface ${
                        mode === btnMode ? colors.active : colors.inactive
                    } ${colors.ring}`}
                >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                </button>
            )
        })}
      </div>
      <div className="flex-grow overflow-y-auto pr-2 space-y-6" style={{fontSize: `${16 + textSize}px`}}>
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[mode]}
            className="w-full bg-gray-800 rounded-lg p-4 pr-16 text-brand-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none transition-all duration-200"
            rows={2}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-brand-primary text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-primary"
            aria-label="Send message"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SendIcon className="w-6 h-6" />
            )}
          </button>
        </form>
        <div className="text-xs text-gray-500 mt-2 flex justify-between items-center px-1">
          <span>Shift+Enter로 줄바꿈을 할 수 있습니다.</span>
          <span className="font-medium">{input.length} 자</span>
        </div>
      </div>
    </div>
  );
};

export default CustomPromptSection;