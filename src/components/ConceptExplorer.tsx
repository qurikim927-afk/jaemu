import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STUDY_CONCEPTS } from '../data/accountingData';
import { 
  BookOpen, 
  TrendingUp, 
  Layers, 
  BarChart3, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  ArrowRight, 
  Sparkles,
  AlertTriangle,
  Mic
} from 'lucide-react';

export default function ConceptExplorer() {
  const [activeConceptId, setActiveConceptId] = useState<string>(STUDY_CONCEPTS[0].id);
  const [expandedSubId, setExpandedSubId] = useState<string | null>(STUDY_CONCEPTS[0].subConcepts[0].id);

  // Map icon strings to Lucide components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5" id="icon-book" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" id="icon-trend" />;
      case 'Layers': return <Layers className="w-5 h-5" id="icon-layers" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5" id="icon-barchart" />;
      default: return <BookOpen className="w-5 h-5" id="icon-default" />;
    }
  };

  const activeConcept = STUDY_CONCEPTS.find(c => c.id === activeConceptId) || STUDY_CONCEPTS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="concept-explorer-container">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-4 flex flex-col gap-3" id="concept-sidebar">
        <h3 className="text-xs font-mono tracking-wider text-gray-400 uppercase px-2 mb-1" id="sidebar-header">
          학습 단원 목록
        </h3>
        <div className="flex flex-col gap-2" id="sidebar-list">
          {STUDY_CONCEPTS.map((concept) => {
            const isActive = concept.id === activeConceptId;
            return (
              <button
                key={concept.id}
                id={`btn-concept-${concept.id}`}
                onClick={() => {
                  setActiveConceptId(concept.id);
                  setExpandedSubId(concept.subConcepts[0]?.id || null);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-3 relative ${
                  isActive 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10' 
                    : 'bg-white border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-slate-800 text-teal-400' : 'bg-gray-50 text-gray-500'}`}>
                  {getIcon(concept.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-sans font-semibold text-sm leading-tight mb-1">
                    {concept.title}
                  </h4>
                  <p className={`text-xs truncate ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                    {concept.description}
                  </p>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-400"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Concept Visual Box */}
        <div className="mt-4 p-5 rounded-2xl bg-teal-50/50 border border-teal-100/50 flex flex-col gap-3" id="visual-helper-box">
          <div className="flex items-center gap-2 text-teal-800" id="visual-helper-title">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Visual Quick Study</span>
          </div>
          {activeConceptId === 'intro' && (
            <div className="text-xs text-teal-900 flex flex-col gap-2">
              <p className="leading-relaxed"><strong>재무제표의 핵심 관계:</strong></p>
              <div className="bg-white/80 p-3 rounded-lg border border-teal-100 font-mono text-[11px] leading-tight flex flex-col gap-1">
                <div className="text-blue-600 font-semibold">1. 손익계산서 (당기순이익)</div>
                <div className="text-gray-400 px-2">↓ (누적 저장)</div>
                <div className="text-emerald-600 font-semibold">2. 재무상태표 (이익잉여금)</div>
              </div>
              <p className="text-[11px] text-teal-700 leading-normal">
                당기순이익은 매년 재무상태표 우측 하단의 이익잉여금 계정으로 쌓여 기업 체력을 튼튼하게 만듭니다.
              </p>
            </div>
          )}
          {activeConceptId === 'income' && (
            <div className="text-xs text-teal-900 flex flex-col gap-2">
              <p className="leading-relaxed"><strong>단계별 이익 산출 구조:</strong></p>
              <div className="bg-white/80 p-3 rounded-lg border border-teal-100 font-mono text-[11px] leading-tight flex flex-col gap-1.5">
                <div className="flex justify-between"><span>매출액</span></div>
                <div className="flex justify-between text-red-500"><span>- 매출원가</span></div>
                <div className="border-t border-gray-200 my-0.5"></div>
                <div className="flex justify-between font-semibold text-gray-700"><span>= 매출총이익</span></div>
                <div className="flex justify-between text-red-500"><span>- 판관비</span></div>
                <div className="border-t border-gray-200 my-0.5"></div>
                <div className="flex justify-between font-bold text-blue-600"><span>= 영업이익 (★핵심)</span></div>
              </div>
            </div>
          )}
          {activeConceptId === 'balance' && (
            <div className="text-xs text-teal-900 flex flex-col gap-2">
              <p className="leading-relaxed"><strong>재무상태표(BS) 대칭 구조:</strong></p>
              <div className="grid grid-cols-2 gap-1.5 bg-white/80 p-2.5 rounded-lg border border-teal-100 text-center font-mono text-[10px]">
                <div className="bg-blue-50 border border-blue-200 p-2 rounded">
                  <div className="font-semibold text-blue-700">차변 (왼쪽)</div>
                  <div className="text-gray-500 mt-1">자금 운용</div>
                  <div className="font-bold text-gray-800 mt-1.5">자산 (Asset)</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-2 rounded flex flex-col justify-between">
                  <div>
                    <div className="font-semibold text-emerald-700">대변 (오른쪽)</div>
                    <div className="text-gray-500 mt-1">자금 조달</div>
                  </div>
                  <div className="mt-1.5 border-t border-emerald-100 pt-1 text-gray-800">
                    <div className="font-bold text-orange-700">부채 (남의 돈)</div>
                    <div className="font-bold text-emerald-800">+ 자본 (내 돈)</div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-teal-700 text-center">자산 = 부채 + 자본 등식이 언제나 완벽히 일치합니다.</p>
            </div>
          )}
          {activeConceptId === 'analysis' && (
            <div className="text-xs text-teal-900 flex flex-col gap-2">
              <p className="leading-relaxed"><strong>안정성 / 수익성 황금비율:</strong></p>
              <div className="bg-white/80 p-2.5 rounded-lg border border-teal-100 font-mono text-[11px] leading-relaxed flex flex-col gap-1">
                <div>• <strong className="text-emerald-700">유동비율:</strong> 150~200% 이상 (안전)</div>
                <div>• <strong className="text-red-600">부채비율:</strong> 100~200% 이하 (안전)</div>
                <div>• <strong className="text-blue-700">ROE:</strong> 높을수록 주주 투자효율 극대화</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Study Panel */}
      <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm" id="study-panel">
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4" id="study-panel-header">
          <div>
            <span className="text-xs font-mono font-semibold text-teal-500 tracking-wider">Core Summary Note</span>
            <h2 className="text-xl sm:text-2xl font-sans font-bold text-gray-900 mt-1" id="active-concept-title">
              {activeConcept.title}
            </h2>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-mono px-3 py-1 rounded-full font-medium">
            Category ID: {activeConcept.id}
          </span>
        </div>

        <div className="flex flex-col gap-5" id="sub-concepts-list">
          {activeConcept.subConcepts.map((sub) => {
            const isExpanded = expandedSubId === sub.id;
            return (
              <div 
                key={sub.id} 
                id={`sub-concept-${sub.id}`}
                className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-300"
              >
                {/* Accordion Trigger */}
                <button
                  id={`btn-toggle-sub-${sub.id}`}
                  onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}
                  className={`w-full flex items-center justify-between p-5 text-left transition-colors ${
                    isExpanded ? 'bg-gray-50/80 text-slate-900' : 'bg-white text-gray-700 hover:bg-gray-50/50'
                  }`}
                >
                  <span className="font-sans font-bold text-[15px] sm:text-base flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                    {sub.title}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={`content-sub-${sub.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="p-5 border-t border-gray-100 bg-white flex flex-col gap-4">
                        <ul className="space-y-3.5 text-gray-600 text-[14px] leading-relaxed">
                          {sub.bullets.map((bullet, idx) => {
                            // Check for some highlighted concepts
                            const parts = bullet.split(':');
                            if (parts.length > 1) {
                              return (
                                <li key={idx} className="flex items-start gap-2.5">
                                  <ArrowRight className="w-4 h-4 text-teal-500 shrink-0 mt-1" />
                                  <span>
                                    <strong className="text-gray-900 font-semibold">{parts[0]}:</strong>
                                    {parts.slice(1).join(':')}
                                  </span>
                                </li>
                              );
                            }
                            return (
                              <li key={idx} className="flex items-start gap-2.5">
                                <ArrowRight className="w-4 h-4 text-teal-500 shrink-0 mt-1" />
                                <span>{bullet}</span>
                              </li>
                            );
                          })}
                        </ul>

                        {/* Special Tips Box */}
                        {sub.tips && sub.tips.map((tip, tIdx) => {
                          const isExamPoint = tip.includes('출제 포인트') || tip.includes('🚨') || tip.includes('시험');
                          const isLecturerQuote = tip.includes('강사의 한마디') || tip.includes('🎤') || tip.includes('비유');
                          
                          let bgClass = 'bg-amber-50/60 border-amber-100 text-amber-900';
                          let titleClass = 'text-amber-950';
                          let titleText = '암기 꿀팁';
                          let Icon = Lightbulb;
                          let iconClass = 'text-amber-500';

                          if (isExamPoint) {
                            bgClass = 'bg-rose-50/70 border-rose-100 text-rose-900 shadow-sm';
                            titleClass = 'text-rose-950';
                            titleText = '★ 시험 출제 유력 ★';
                            Icon = AlertTriangle;
                            iconClass = 'text-rose-500';
                          } else if (isLecturerQuote) {
                            bgClass = 'bg-violet-50/70 border-violet-100 text-violet-900';
                            titleClass = 'text-violet-950';
                            titleText = '강사의 핵심 비유 💡';
                            Icon = Mic;
                            iconClass = 'text-violet-500';
                          }

                          return (
                            <div 
                              key={tIdx} 
                              className={`mt-3 p-4 rounded-xl border flex gap-3 text-xs sm:text-[13px] leading-relaxed ${bgClass}`}
                            >
                              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} />
                              <div>
                                <strong className={`font-bold block mb-0.5 uppercase tracking-wide ${titleClass}`}>{titleText}</strong>
                                {tip}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer Guidance */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400" id="study-panel-footer">
          <span>* 본 요약본은 첨부된 재무제표 교육 리포트의 상세 본문을 기반으로 정성껏 요약되었습니다.</span>
          <span className="font-mono text-teal-500 font-semibold uppercase">Study Guide Active</span>
        </div>
      </div>
    </div>
  );
}
