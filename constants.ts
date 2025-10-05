import { Phase } from './types';
import FoundationIcon from './components/icons/FoundationIcon';
import DataIcon from './components/icons/DataIcon';
import AiIcon from './components/icons/AiIcon';
import ExperimentIcon from './components/icons/ExperimentIcon';
import PaperIcon from './components/icons/PaperIcon';
import LightbulbIcon from './components/icons/LightbulbIcon';
import CodeIcon from './components/icons/CodeIcon';

export const PROJECT_PHASES: Phase[] = [
  {
    id: 'phase-1',
    title: '1단계: 프로젝트 기반 및 아이디어 구체화',
    description: '핵심 개념을 정립하고, 기존 연구를 검토하며, 프로젝트의 기본 틀을 설정합니다.',
    icon: FoundationIcon,
    tasks: [
      {
        id: '1-1',
        title: '핵심 문제 정의',
        description: '모호한 사용자 질문으로 인해 발생하는 AI 환각 문제를 명확히 정의합니다.',
        geminiPrompt: 'Provide a detailed breakdown of how ambiguous user questions can lead to AI hallucinations in Large Language Models. Include examples and cite key concepts.',
        icon: LightbulbIcon,
      },
      {
        id: '1-2',
        title: '주요 문헌 검토',
        description: "'Selectively Answering Ambiguous Questions (2023)' 논문을 비롯한 관련 연구를 분석합니다.",
        geminiPrompt: 'Summarize the main findings and methodology of the paper "Selectively Answering Ambiguous Questions (2023)". Explain its relevance to building a hallucination detection system.',
        icon: PaperIcon,
      },
      {
        id: '1-3',
        title: '가설 수립',
        description: '질문의 내재적 모호함으로 인해 환각을 완전히 억제하는 것의 어려움을 증명하는 핵심 가설을 개발합니다.',
        geminiPrompt: 'Help me formulate a strong, testable scientific hypothesis about the relationship between question ambiguity and the rate of AI hallucinations. The goal is to prove that complete suppression is unfeasible.',
        icon: LightbulbIcon,
      },
    ],
  },
  {
    id: 'phase-2',
    title: '2단계: 데이터 및 모델 준비',
    description: '기반 모델을 선정하고, 개발 환경을 구축하며, 훈련에 필요한 데이터셋을 준비합니다.',
    icon: DataIcon,
    tasks: [
      {
        id: '2-1',
        title: '기반 LLM 선정',
        description: "탐지기 모델의 기반으로 Google의 Gemini 모델을 선택합니다.",
        geminiPrompt: 'List the pros and cons of using Google\'s Gemini model for a task focused on fact-checking and hallucination detection. What are some key considerations for this model choice?',
        icon: AiIcon,
      },
      {
        id: '2-2',
        title: '개발 인프라 구축',
        description: '모델 훈련 및 실험을 위해 GPU를 지원하는 Google Colab 환경을 설정합니다.',
        geminiPrompt: 'Provide a step-by-step guide to setting up a Python environment in Google Colab for using the Gemini API, including installing necessary libraries and managing API keys.',
        icon: CodeIcon,
      },
      {
        id: '2-3',
        title: '모호한 질문 데이터셋 생성',
        description: '질문 데이터셋을 생성하고, 모호성 수준을 상/중/하로 분류합니다.',
        geminiPrompt: 'Generate a sample dataset of 15 questions for testing an LLM. 5 should be highly ambiguous, 5 moderately ambiguous, and 5 unambiguous. For each, explain the source of ambiguity.',
        icon: DataIcon,
      },
    ],
  },
  {
    id: 'phase-3',
    title: '3단계: "AI-On" 탐지기 개발',
    description: '기반 모델을 활용하고 외부 지식 소스를 통합하여 핵심 탐지 시스템을 구축합니다.',
    icon: AiIcon,
    tasks: [
      {
        id: '3-1',
        title: 'Gemini를 탐지기로 활용',
        description: '다른 LLM이 생성한 텍스트에서 환각을 식별하고 표시하도록 Gemini 모델을 활용합니다.',
        geminiPrompt: 'Outline a detailed strategy for using the Gemini API to act as a hallucination detector. What kind of prompt engineering techniques would be effective? How would you structure the input and expected output?',
        icon: AiIcon,
      },
      {
        id: '3-2',
        title: '지식 검색 모듈 개발',
        description: '실시간 외부 사실 검증을 위해 Wikipedia 및 Google 검색 API를 통합합니다.',
        geminiPrompt: 'Provide Python code examples for fetching and parsing data from the Wikipedia API and the Google Search API (using a library like `google-api-python-client`). The goal is to retrieve text snippets relevant to a given claim.',
        icon: CodeIcon,
      },
      {
        id: '3-3',
        title: 'FAISS를 이용한 벡터 검색 구현',
        description: '생성된 텍스트와 검색된 지식 간의 효율적인 의미적 유사성 검색을 위해 FAISS를 사용합니다.',
        geminiPrompt: 'Explain how to use FAISS (Facebook AI Similarity Search) to build a simple semantic search system. Provide a Python example that encodes sentences into vectors (using a sentence-transformer) and then uses FAISS to find the most similar sentences for a new query.',
        icon: CodeIcon,
      },
    ],
  },
  {
    id: 'phase-4',
    title: '4단계: 실험 및 분석',
    description: '가설을 검증하고 AI-On 모델의 성능을 체계적으로 평가하기 위해 통제된 실험을 실행합니다.',
    icon: ExperimentIcon,
    tasks: [
      {
        id: '4-1',
        title: '테스트 실행',
        description: '모호한 질문 데이터셋을 범용 LLM에 체계적으로 입력하고, AI-On 탐지기로 응답을 분석합니다.',
        geminiPrompt: 'Design an experimental protocol to test the "AI-On" hallucination detector. Describe the steps, from inputting a question to getting a final hallucination score. What variables should be controlled?',
        icon: ExperimentIcon,
      },
      {
        id: '4-2',
        title: '평가 지표 적용',
        description: '사실성 검증, 요약 평가, 원자적 주장 검증과 같은 지표를 사용하여 환각 수준을 정량화합니다.',
        geminiPrompt: 'Explain three common evaluation metrics for fact-checking and hallucination detection in LLMs: Precision, Recall, and F1-score. How would you apply them to the "AI-On" project?',
        icon: ExperimentIcon,
      },
      {
        id: '4-3',
        title: '데이터 수집 및 시각화',
        description: '질문 모호성과 측정된 환각 발생률 간의 관계를 차트로 만들고 분석합니다.',
        geminiPrompt: 'Suggest three different types of charts (e.g., bar chart, scatter plot, confusion matrix) to visualize the results of the Al-On experiment. For each chart, explain what insights it would provide.',
        icon: DataIcon,
      },
    ],
  },
  {
    id: 'phase-5',
    title: '5단계: 종합 및 결론',
    description: '결과를 분석하고, 발견한 내용을 문서화하며, 최종 프로젝트 보고서 및 발표를 준비합니다.',
    icon: PaperIcon,
    tasks: [
      {
        id: '5-1',
        title: '결과 분석 및 해석',
        description: '모든 실험 데이터를 종합하여 프로젝트의 핵심 가설을 공식적으로 검증하거나 반증합니다.',
        geminiPrompt: 'Based on a hypothetical experiment where higher question ambiguity correlates with a 40% increase in detected hallucinations, write a concise conclusion for a research paper.',
        icon: ExperimentIcon,
      },
      {
        id: '5-2',
        title: '결과 문서화',
        description: '프로젝트의 방법론, 결과, 결론을 상세히 기술한 최종 종합 보고서 또는 학술 논문을 작성합니다.',
        geminiPrompt: 'Provide a standard outline for a computer science research paper. List the key sections (Abstract, Introduction, Related Work, Methodology, Results, Conclusion, etc.) and give a one-sentence description of each.',
        icon: PaperIcon,
      },
      {
        id: '5-3',
        title: '향후 연구 계획',
        description: '프로젝트 결과를 바탕으로 향후 연구를 위한 잠재적인 다음 단계와 방향을 제안합니다.',
        geminiPrompt: 'Based on the "AI-On" project, suggest three potential directions for future research. For example, testing with different models, improving the detector, or exploring other causes of hallucination.',
        icon: LightbulbIcon,
      },
    ],
  },
];