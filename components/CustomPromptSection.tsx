import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { ai } from '../services/geminiService';
import LightbulbIcon from './icons/LightbulbIcon';
import AiIcon from './icons/AiIcon';
import UserIcon from './icons/UserIcon';
import SendIcon from './icons/SendIcon';

interface Message {
  role: 'user' | 'model';
  content: string;
  isError?: boolean;
}

const CustomPromptSection: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const chatRef = useRef<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const systemInstruction = `당신은 전문 AI 연구원입니다. 당신의 임무는 주어진 사용자 질문의 사실적 및 논리적 모순을 분석하는 것입니다.
응답은 반드시 다음 세 가지 마크다운 섹션을 포함해야 합니다:
1.  **사실적 모순 분석**: [사용자 질문의 사실적 모순을 분석합니다. 모순이 없다면 "모순이 발견되지 않았습니다."라고만 적습니다.]
2.  **논리적 모순 분석**: [사용자 질문의 논리적 모순을 분석합니다. 모순이 없다면 "모순이 발견되지 않았습니다."라고만 적습니다.]
3.  **수정된 답변**: [모순이 발견된 경우, 수정된 정확한 답변을 제공합니다. 모순이 없는 경우, 원래 질문에 대한 정확한 답변을 제공합니다.]`;
      
    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
        topP: 0.95,
        topK: 64,
      },
    });
  }, []);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isLoading]);

  const handleSubmit = async () => {
    const chat = chatRef.current;
    if (!prompt.trim() || !chat || isLoading) return;

    const userMessage: Message = { role: 'user', content: prompt };
    setConversation((prev) => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: prompt });
      const modelMessage: Message = { role: 'model', content: response.text };
      setConversation((prev) => [...prev, modelMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        role: 'model',
        content: 'AI 답변을 가져오는데 실패했습니다. API 키를 확인하고 다시 시도해주세요.',
        isError: true,
      };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatGuidance = (text: string) => {
    return text
      .replace(/(\d+\.\s*)?\*\*사실적 모순 분석\*\*/g, '<div class="font-bold text-brand-text-main mt-4 mb-2">1. 사실적 모순 분석</div>')
      .replace(/(\d+\.\s*)?\*\*논리적 모순 분석\*\*/g, '<div class="font-bold text-brand-text-main mt-4 mb-2">2. 논리적 모순 분석</div>')
      .replace(/(\d+\.\s*)?\*\*수정된 답변\*\*/g, '<div class="font-bold text-brand-text-main mt-4 mb-2">3. 수정된 답변</div>')
      .replace(/(<\/div>):\s*/g, '$1 - ')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-text-main">$1</strong>')
      .replace(/(\r\n|\n)/g, '<br />');
  };

  return (
    <div className="my-8 p-6 bg-brand-surface rounded-xl shadow-lg flex flex-col max-h-[80vh]">
      <div className="flex-shrink-0">
        <div className="flex items-center space-x-3 mb-4">
          <LightbulbIcon className="w-6 h-6 text-brand-secondary" />
          <h2 className="text-2xl font-bold text-brand-primary">AI와 대화하기</h2>
        </div>
        <p className="text-brand-text-secondary mb-4">
          AI에게 질문하여 환각 현상을 테스트하고 답변의 모순을 분석해보세요.
        </p>
      </div>

      <div className="flex-grow overflow-y-auto pr-4 -mr-4 mb-4 space-y-6">
        {conversation.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="flex-shrink-0 bg-brand-primary/20 p-2 rounded-full mt-1">
                <AiIcon className="w-5 h-5 text-brand-primary" />
              </div>
            )}
            <div className={`w-auto max-w-xl rounded-lg px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-brand-primary/20 text-brand-text-main'
                  : msg.isError
                  ? 'bg-red-900/50 text-red-400'
                  : 'bg-gray-800/50 text-brand-text-secondary'
            }`}>
              {msg.role === 'user' ? (
                <p>{msg.content}</p>
              ) : (
                <div
                  className="prose prose-invert text-brand-text-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatGuidance(msg.content) }}
                />
              )}
            </div>
             {msg.role === 'user' && (
              <div className="flex-shrink-0 bg-brand-secondary/20 p-2 rounded-full mt-1">
                <UserIcon className="w-5 h-5 text-brand-secondary" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="flex-shrink-0 bg-brand-primary/20 p-2 rounded-full mt-1">
                <AiIcon className="w-5 h-5 text-brand-primary" />
              </div>
            <div className="w-auto max-w-xl rounded-lg px-4 py-3 bg-gray-800/50">
              <div className="flex items-center space-x-2 text-brand-text-secondary">
                 <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
                 <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={conversationEndRef} />
      </div>

      <div className="flex-shrink-0 flex items-center gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="AI에게 질문을 입력하세요. (ex: 나폴레옹은 독일 사람이니?)"
          className="flex-grow bg-white text-gray-900 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
          rows={2}
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt.trim()}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors self-stretch"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CustomPromptSection;