import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FLASHCARDS } from '../data/accountingData';
import { 
  RotateCw, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Eye, 
  Sparkles, 
  Check, 
  X, 
  RotateCcw, 
  List, 
  Grid 
} from 'lucide-react';

export default function FlashcardDeck() {
  const [viewMode, setViewMode] = useState<'deck' | 'list'>('deck');
  
  // Card state tracking
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [needsReviewIds, setNeedsReviewIds] = useState<string[]>([]);

  // Derived arrays
  const activeDeck = FLASHCARDS;
  const currentCard = activeDeck[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
    }, 150);
  };

  const markMastered = (id: string) => {
    if (!masteredIds.includes(id)) {
      setMasteredIds((prev) => [...prev, id]);
    }
    // Remove from needsReview if it was there
    setNeedsReviewIds((prev) => prev.filter((item) => item !== id));
    handleNext();
  };

  const markNeedsReview = (id: string) => {
    if (!needsReviewIds.includes(id)) {
      setNeedsReviewIds((prev) => [...prev, id]);
    }
    // Remove from mastered if it was there
    setMasteredIds((prev) => prev.filter((item) => item !== id));
    handleNext();
  };

  const resetProgress = () => {
    setMasteredIds([]);
    setNeedsReviewIds([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const totalCards = activeDeck.length;
  const masteredCount = masteredIds.length;
  const reviewCount = needsReviewIds.length;
  const progressPercent = Math.round(((masteredCount) / totalCards) * 100);

  return (
    <div className="flex flex-col gap-6" id="flashcard-deck-root">
      {/* Deck Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl" id="deck-stats-header">
        <div id="deck-progress-summary">
          <h3 className="font-sans font-bold text-slate-900 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-500" />
            핵심 공식 & 계정 암기 플래시카드
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            카드를 뒤집어가며 시험에 반드시 출제되는 재무비율 공식과 키워드를 완전 정복하세요.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto" id="deck-view-toggles">
          <button
            id="btn-view-deck"
            onClick={() => setViewMode('deck')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'deck' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            <Grid className="w-4 h-4" />
            카드 학습
          </button>
          <button
            id="btn-view-list"
            onClick={() => setViewMode('list')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'list' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            <List className="w-4 h-4" />
            전체 목록 ({totalCards})
          </button>
        </div>
      </div>

      {viewMode === 'deck' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="deck-view-layout">
          {/* Card Frame and Controls */}
          <div className="lg:col-span-8 flex flex-col gap-6" id="deck-card-arena">
            {/* Real-time progress bar */}
            <div className="flex flex-col gap-1.5" id="deck-progress-bar-container">
              <div className="flex justify-between text-xs font-mono text-gray-500">
                <span>학습 진행률</span>
                <span className="font-bold text-teal-600">{masteredCount} / {totalCards} 마스터 ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-teal-500 rounded-full"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Flip Card Wrapper */}
            <div className="relative w-full aspect-[16/10] min-h-[280px] sm:min-h-[340px]" id="flashcard-interactive-wrapper">
              <AnimatePresence mode="wait">
                <motion.button
                  key={`${currentIndex}-${isFlipped}`}
                  id={`interactive-card-${currentCard.id}`}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`w-full h-full text-left p-6 sm:p-10 rounded-3xl border transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between relative cursor-pointer outline-none focus:ring-2 focus:ring-teal-400 ${
                    isFlipped 
                      ? 'bg-slate-900 border-slate-900 text-white' 
                      : 'bg-white border-gray-150 text-gray-900'
                  }`}
                >
                  {/* Card category tags */}
                  <div className="flex justify-between items-center w-full" id="card-top-row">
                    <span className={`text-[11px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md font-semibold ${
                      isFlipped ? 'bg-slate-800 text-teal-400' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {currentCard.category}
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      CARD {currentIndex + 1} / {totalCards}
                    </span>
                  </div>

                  {/* Question / Answer Core Content */}
                  <div className="my-6 flex-1 flex flex-col justify-center" id="card-body-content">
                    {!isFlipped ? (
                      <div className="flex flex-col gap-3" id="card-front-content">
                        <span className="text-xs font-mono font-bold text-teal-500 uppercase flex items-center gap-1">
                          <HelpCircle className="w-4 h-4" /> Question
                        </span>
                        <h2 className="text-lg sm:text-2xl font-sans font-bold leading-snug text-gray-900">
                          {currentCard.question}
                        </h2>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4" id="card-back-content">
                        <span className="text-xs font-mono font-bold text-teal-400 uppercase flex items-center gap-1">
                          <Eye className="w-4 h-4" /> Answer & Formula
                        </span>
                        <h2 className="text-base sm:text-xl font-sans font-bold leading-normal text-white">
                          {currentCard.answer}
                        </h2>
                        {currentCard.formula && (
                          <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700/60 font-mono text-teal-300 text-sm leading-relaxed" id="card-formula-box">
                            <span className="text-[10px] uppercase font-bold text-teal-500 block mb-1">공식 명세</span>
                            {currentCard.formula}
                          </div>
                        )}
                        {currentCard.explanation && (
                          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic border-l-2 border-teal-500 pl-3">
                            {currentCard.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom instruction bar */}
                  <div className="flex items-center gap-1.5 self-center text-xs text-gray-400 font-medium" id="card-flip-prompt">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>카드를 클릭하여 {isFlipped ? '질문 보기' : '정답 및 해설 보기'}</span>
                  </div>

                  {/* Status Indicator inside the card */}
                  {masteredIds.includes(currentCard.id) && (
                    <div className="absolute top-4 right-4 bg-teal-500 text-white rounded-full p-1" id="badge-mastered">
                      <Check className="w-4 h-4 stroke-[3px]" />
                    </div>
                  )}
                  {needsReviewIds.includes(currentCard.id) && (
                    <div className="absolute top-4 right-4 bg-rose-500 text-white rounded-full p-1" id="badge-needs-review">
                      <X className="w-4 h-4 stroke-[3px]" />
                    </div>
                  )}
                </motion.button>
              </AnimatePresence>
            </div>

            {/* Action Buttons under deck */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" id="deck-card-actions">
              <button
                id="btn-deck-prev"
                onClick={handlePrev}
                className="order-3 sm:order-1 col-span-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-sans font-semibold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                ← 이전 카드
              </button>

              <button
                id="btn-deck-needs-review"
                onClick={() => markNeedsReview(currentCard.id)}
                className="order-1 sm:order-2 col-span-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 font-sans font-semibold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                다시 공부하기
              </button>

              <button
                id="btn-deck-master"
                onClick={() => markMastered(currentCard.id)}
                className="order-2 sm:order-3 col-span-1 bg-teal-500 hover:bg-teal-600 text-white font-sans font-semibold py-3 px-4 rounded-xl text-xs transition-colors shadow-sm shadow-teal-500/10 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                완벽히 마스터!
              </button>

              <button
                id="btn-deck-next"
                onClick={handleNext}
                className="order-4 sm:order-4 col-span-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-sans font-semibold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                다음 카드 →
              </button>
            </div>
          </div>

          {/* Sidebar Stats and Lists */}
          <div className="lg:col-span-4 flex flex-col gap-4" id="deck-stats-sidebar">
            {/* Mastered & Review Summary Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4" id="learning-metrics-box">
              <h4 className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">
                학습 현황 통계
              </h4>
              <div className="grid grid-cols-2 gap-3" id="metrics-grid">
                <div className="bg-teal-50/60 border border-teal-100 p-4 rounded-xl flex flex-col gap-0.5">
                  <span className="text-[11px] font-sans font-medium text-teal-800">마스터 완료</span>
                  <span className="text-2xl font-mono font-bold text-teal-600">{masteredCount}</span>
                </div>
                <div className="bg-rose-50/60 border border-rose-100 p-4 rounded-xl flex flex-col gap-0.5">
                  <span className="text-[11px] font-sans font-medium text-rose-800">복습 필요</span>
                  <span className="text-2xl font-mono font-bold text-rose-600">{reviewCount}</span>
                </div>
              </div>

              {/* Progress Reset Button */}
              {(masteredCount > 0 || reviewCount > 0) && (
                <button
                  id="btn-reset-deck-progress"
                  onClick={resetProgress}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border border-dashed border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-700 text-gray-500 transition-all duration-250"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  학습 진도 리셋하기
                </button>
              )}
            </div>

            {/* Quick List Reference */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 flex-1 flex flex-col" id="cards-quick-nav">
              <h4 className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase mb-3">
                카드 퀵 셀렉트
              </h4>
              <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[220px] pr-1" id="quick-cards-scroll">
                {activeDeck.map((card, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isMastered = masteredIds.includes(card.id);
                  const isReview = needsReviewIds.includes(card.id);

                  return (
                    <button
                      key={card.id}
                      id={`btn-quick-card-${card.id}`}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsFlipped(false);
                      }}
                      className={`w-full text-left text-xs p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                        isCurrent 
                          ? 'bg-slate-900 border-slate-900 text-white font-semibold' 
                          : 'bg-white border-gray-50 text-gray-600 hover:bg-gray-50 hover:border-gray-150'
                      }`}
                    >
                      <span className="truncate flex-1 pr-2">
                        {idx + 1}. {card.question}
                      </span>
                      {isMastered && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                      {isReview && <HelpCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Entire Flashcards list view for quick scan */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="cards-list-layout">
          {activeDeck.map((card, idx) => {
            const isMastered = masteredIds.includes(card.id);
            const isReview = needsReviewIds.includes(card.id);

            return (
              <div 
                key={card.id} 
                id={`card-list-item-${card.id}`}
                className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col gap-4 relative"
              >
                <div className="flex justify-between items-center" id={`card-list-top-${card.id}`}>
                  <span className="text-[10px] font-mono tracking-wide uppercase px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {card.category}
                  </span>
                  <span className="text-xs font-mono text-gray-400"># {idx + 1}</span>
                </div>

                <div className="flex flex-col gap-2" id={`card-list-text-${card.id}`}>
                  <h4 className="font-sans font-bold text-sm text-gray-900 leading-snug">
                    Q. {card.question}
                  </h4>
                  <p className="font-sans font-semibold text-xs text-teal-600 leading-normal mt-1 bg-teal-50/40 p-3 rounded-lg border border-teal-100/30">
                    A. {card.answer}
                  </p>
                  {card.formula && (
                    <div className="bg-slate-50 p-2.5 rounded-lg font-mono text-[11px] text-slate-700 border border-slate-100">
                      {card.formula}
                    </div>
                  )}
                  {card.explanation && (
                    <p className="text-[11px] text-gray-500 leading-relaxed italic">
                      💡 {card.explanation}
                    </p>
                  )}
                </div>

                {/* Study status badges inside list item */}
                <div className="flex justify-end gap-1.5 mt-2 border-t border-gray-50 pt-3" id={`card-list-status-row-${card.id}`}>
                  <button
                    id={`btn-list-mark-review-${card.id}`}
                    onClick={() => markNeedsReview(card.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                      isReview 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    복습 필요
                  </button>
                  <button
                    id={`btn-list-mark-master-${card.id}`}
                    onClick={() => markMastered(card.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                      isMastered 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    마스터 완료
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
