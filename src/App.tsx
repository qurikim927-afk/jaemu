import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  HelpCircle, 
  Trophy, 
  Award, 
  Sparkles
} from 'lucide-react';

// Import our modular sub-components
import ConceptExplorer from './components/ConceptExplorer';
import FlashcardDeck from './components/FlashcardDeck';
import MockExamEngine from './components/MockExamEngine';

type TabID = 'concepts' | 'flashcards' | 'exam';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabID>('concepts');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-950 font-sans flex flex-col" id="app-container">
      {/* Decorative Top Accent Banner */}
      <div className="bg-slate-900 text-slate-300 py-2.5 px-4 text-center text-xs font-mono font-medium border-b border-slate-800 flex items-center justify-center gap-1.5" id="top-announcement-banner">
        <Award className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        <span>회계 왕초보부터 투자자까지! 재무제표 3대 핵심 완성</span>
      </div>

      {/* Hero Header Area */}
      <header className="bg-white border-b border-gray-150/80 py-5 px-4 sm:py-8 sm:px-6 md:px-8" id="main-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="header-content-wrapper">
          <div id="app-title-block">
            <h1 className="text-xl sm:text-3xl font-sans font-bold tracking-tight text-slate-900 mt-1 flex items-center gap-1.5">
              재무제표 시험 마스터
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 shrink-0 animate-pulse" />
            </h1>
            <p className="text-[11px] sm:text-sm text-gray-500 mt-1 max-w-xl leading-relaxed">
              재무상태표(BS), 손익계산서(IS), 현금흐름표(CF)의 핵심 성격을 분석하고 암기 공식 및 감사의견 기준을 학습과 퀴즈로 정복하는 고효율 학습 앱입니다.
            </p>
          </div>
        </div>
      </header>

      {/* Main Tab Switcher and Controls */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 md:px-8 py-4 sm:py-6 flex-1 flex flex-col gap-4 sm:gap-6" id="app-content-body">
        {/* Navigation Tabs */}
        <div className="bg-white border border-gray-150 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl flex gap-1 shadow-sm" id="tab-navigation-bar">
          <button
            id="tab-btn-concepts"
            onClick={() => setActiveTab('concepts')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold transition-all ${
              activeTab === 'concepts' 
                ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>개념 학습</span>
          </button>

          <button
            id="tab-btn-flashcards"
            onClick={() => setActiveTab('flashcards')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold transition-all ${
              activeTab === 'flashcards' 
                ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>암기장</span>
          </button>

          <button
            id="tab-btn-exam"
            onClick={() => setActiveTab('exam')}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold transition-all ${
              activeTab === 'exam' 
                ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>모의고사</span>
          </button>
        </div>

        {/* Content Box with Fade Transitions */}
        <main className="flex-1 min-h-[450px]" id="tab-active-viewport">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full h-full"
              id={`tab-wrapper-${activeTab}`}
            >
              {activeTab === 'concepts' && <ConceptExplorer />}
              {activeTab === 'flashcards' && <FlashcardDeck />}
              {activeTab === 'exam' && <MockExamEngine />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Shared Footer block */}
      <footer className="bg-white border-t border-gray-150/80 py-6 px-4 text-center text-xs text-gray-400 mt-12" id="main-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4" id="footer-content-wrapper">
          <span>
            © 2026 재무제표 시험 마스터. All rights reserved. Created for optimal corporate accounting exam prep.
          </span>
          <div className="flex gap-4" id="footer-links">
            <span className="text-gray-300">|</span>
            <span className="font-mono text-[10px] text-teal-600 font-semibold uppercase tracking-wider">
              Ready to Ace Your Accounting Exam
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
