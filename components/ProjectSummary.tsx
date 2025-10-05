import React from 'react';

const ProjectSummary: React.FC = () => {
  return (
    <div className="my-8 p-6 bg-brand-surface rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-brand-primary mb-3">프로젝트 목표</h2>
      <p className="text-brand-text-secondary leading-relaxed">
        이 프로젝트는 AI 환각 탐지 모델 <strong className="text-brand-text-main">AI-On(알온)</strong>을 개발하는 것을 목표로 합니다.
        주요 목표는 사용자 질문의 모호함이 AI 환각의 근본적이고, 어쩌면 극복 불가능한 원인이라는 가설을 탐구하고 증명하는 것입니다.
        구글의 AI 모델을 활용하고 실시간 지식 검색 시스템과 통합하여, 환각 발생률을 정량화하는 도구를 구축하고 AI 안전성 및 신뢰성 분야에 귀중한 통찰력을 제공하고자 합니다.
      </p>
    </div>
  );
};

export default ProjectSummary;