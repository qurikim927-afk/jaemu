import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUIZ_QUESTIONS } from '../data/accountingData';
import { QuizQuestion, QuestionCategory } from '../types';
import { 
  Trophy, 
  HelpCircle, 
  Check, 
  X, 
  ArrowRight, 
  Sparkles, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  BookOpen 
} from 'lucide-react';

export default function MockExamEngine() {
  // Config state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [examMode, setExamMode] = useState<'study' | 'real'>('study');
  const [isExamStarted, setIsExamStarted] = useState<boolean>(false);
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);

  // Active exam questions
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // User answers
  // key: question ID, value: selected option index
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  // In study mode: tracks if the current question has been submitted for immediate check
  const [isCurrentAnswerChecked, setIsCurrentAnswerChecked] = useState<boolean>(false);

  // Stats
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00');

  // Timer loop
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isExamStarted && !isExamFinished) {
      const start = Date.now();
      setStartTime(start);
      intervalId = setInterval(() => {
        const diff = Date.now() - start;
        const mins = Math.floor(diff / 60000).toString().padStart(2, '0');
        const secs = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setElapsedTime(`${mins}:${secs}`);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isExamStarted, isExamFinished]);

  // Start the exam
  const startExam = () => {
    let filtered = [...QUIZ_QUESTIONS];
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }
    
    // In real mode, let's shuffle them slightly or take up to 15 questions to simulate a mock exam
    if (examMode === 'real') {
      filtered = filtered.sort(() => Math.random() - 0.5).slice(0, 15);
    } else {
      // In study mode, take them all in default order
      filtered = filtered.sort((a, b) => a.id.localeCompare(b.id));
    }

    setQuestions(filtered);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsCurrentAnswerChecked(false);
    setIsExamStarted(true);
    setIsExamFinished(false);
  };

  // Select an option
  const selectOption = (optionIndex: number) => {
    if (isExamFinished) return;
    if (examMode === 'study' && isCurrentAnswerChecked) return; // Locked once checked in study mode

    const currentQuestion = questions[currentIndex];
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  // Study Mode: Click "정답 확인" (Check Answer)
  const handleCheckAnswer = () => {
    setIsCurrentAnswerChecked(true);
  };

  // Next Question
  const handleNextQuestion = () => {
    setIsCurrentAnswerChecked(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Last question completed in study mode or clicked finish
      finishExam();
    }
  };

  // Submit/Finish Exam
  const finishExam = () => {
    setIsExamFinished(true);
  };

  // Exit Exam without finishing
  const exitExam = () => {
    setIsExamStarted(false);
    setIsExamFinished(false);
    setCurrentIndex(0);
    setUserAnswers({});
  };

  // Calculation parameters
  const currentQuestion = questions[currentIndex];
  const isAnswerSelected = currentQuestion ? userAnswers[currentQuestion.id] !== undefined : false;
  const selectedAnswerIndex = currentQuestion ? userAnswers[currentQuestion.id] : -1;

  // Final Results breakdown
  const calculateScoreStats = () => {
    let correctCount = 0;
    const categoryStats: Record<string, { total: number; correct: number; label: string }> = {
      'basic': { total: 0, correct: 0, label: '재무제표 기초' },
      'income_statement': { total: 0, correct: 0, label: '손익계산서' },
      'balance_sheet': { total: 0, correct: 0, label: '재무상태표 세부' },
      'ratios_audit': { total: 0, correct: 0, label: '재무비율 & 감사' }
    };

    questions.forEach(q => {
      const isCorrect = userAnswers[q.id] === q.correctAnswerIndex;
      if (isCorrect) correctCount++;

      // Update category metrics
      if (categoryStats[q.category]) {
        categoryStats[q.category].total++;
        if (isCorrect) {
          categoryStats[q.category].correct++;
        }
      }
    });

    const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    return { correctCount, totalCount: questions.length, scorePercent, categoryStats };
  };

  const stats = calculateScoreStats();

  return (
    <div className="flex flex-col gap-6" id="mock-exam-root">
      {!isExamStarted ? (
        /* SETUP PAGE */
        <div className="max-w-3xl mx-auto w-full bg-white border border-gray-100 p-8 sm:p-10 rounded-3xl shadow-sm text-center flex flex-col items-center gap-8" id="exam-setup-panel">
          <div className="bg-slate-950 p-4 rounded-3xl text-white shadow-xl shadow-slate-900/15" id="exam-badge-icon">
            <Trophy className="w-10 h-10 text-teal-400" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-teal-500 uppercase tracking-wider">Financial Statement Exam Simulator</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-gray-900 mt-2">
              실전 대비 모의고사 및 단원별 퀴즈
            </h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto mt-3 leading-relaxed">
              재무상태표의 차/대변 원리, 손익계산서 구조, 법정 이익준비금 산출 한도, 4대 핵심 재무비율 계산과 외부 감사 기준 요건을 완벽히 준비하세요!
            </p>
          </div>

          <div className="w-full border-y border-gray-100 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left" id="exam-config-fields">
            {/* Category selection */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-mono font-bold text-gray-400 uppercase">출제 단원 설정</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'all', label: '전체 단원 모의고사 (25문항)' },
                  { id: 'basic', label: '1단원: 재무제표의 이해와 활용' },
                  { id: 'income_statement', label: '2단원: 손익계산서와 현금구조' },
                  { id: 'balance_sheet', label: '3단원: 재무상태표 세부 과목' },
                  { id: 'ratios_audit', label: '4단원: 현금흐름, 감사의견 및 재무비율' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    id={`btn-select-cat-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                      selectedCategory === cat.id 
                        ? 'bg-slate-950 border-slate-950 text-white shadow-sm' 
                        : 'bg-gray-50 border-gray-150 text-gray-700 hover:bg-gray-100/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Mode selection */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-mono font-bold text-gray-400 uppercase">시험 방식 선택</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="btn-mode-study"
                    onClick={() => setExamMode('study')}
                    className={`p-4 rounded-xl border text-center transition-all flex flex-col gap-2 items-center ${
                      examMode === 'study' 
                        ? 'bg-teal-50 border-teal-300 text-teal-900 shadow-sm' 
                        : 'bg-gray-50 border-gray-150 text-gray-600 hover:bg-gray-100/50'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 text-teal-600" />
                    <div>
                      <div className="text-xs sm:text-sm font-bold">학습 모드 (추천)</div>
                      <div className="text-[10px] text-gray-400 mt-1">정답 즉시 확인 & 해설 제공</div>
                    </div>
                  </button>

                  <button
                    id="btn-mode-real"
                    onClick={() => setExamMode('real')}
                    className={`p-4 rounded-xl border text-center transition-all flex flex-col gap-2 items-center ${
                      examMode === 'real' 
                        ? 'bg-teal-50 border-teal-300 text-teal-900 shadow-sm' 
                        : 'bg-gray-50 border-gray-150 text-gray-600 hover:bg-gray-100/50'
                    }`}
                  >
                    <Trophy className="w-5 h-5 text-teal-600" />
                    <div>
                      <div className="text-xs sm:text-sm font-bold">실전 모의고사</div>
                      <div className="text-[10px] text-gray-400 mt-1">임의 15문항 • 최종 성적표 제공</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quick Instructions info panel */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3 text-xs text-gray-500 leading-normal">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-700 block mb-0.5">합격 합격 팁</strong>
                  실전 모의고사는 <strong>60점 이상</strong> 득점 시 합격 처리됩니다. 학습 모드로 오답 개념을 완벽하게 파악한 후 도전해 보세요!
                </div>
              </div>
            </div>
          </div>

          <button
            id="btn-start-exam"
            onClick={startExam}
            className="w-full sm:w-64 bg-slate-950 hover:bg-slate-800 text-white font-sans font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg shadow-slate-950/15 flex items-center justify-center gap-2 text-base"
          >
            <Play className="w-5 h-5 text-teal-400 fill-teal-400" />
            시험 시작하기
          </button>
        </div>
      ) : isExamFinished ? (
        /* EXAM SCORECARD PAGE */
        <div className="max-w-3xl mx-auto w-full bg-white border border-gray-100 p-8 sm:p-10 rounded-3xl shadow-sm flex flex-col gap-8" id="exam-scorecard-panel">
          <div className="text-center flex flex-col items-center gap-4" id="scorecard-header">
            <span className="text-xs font-mono font-bold text-teal-500 uppercase tracking-wider">Your Performance Report</span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-gray-900">
              {examMode === 'real' ? '실전 모의고사 채점 결과' : '퀴즈 학습 완료 성적표'}
            </h2>
            
            {/* Massive Score Gauge */}
            <div className="relative mt-4 flex flex-col items-center justify-center" id="scorecard-donut">
              <div className="w-36 h-36 rounded-full border-[10px] border-slate-100 flex flex-col items-center justify-center bg-slate-50/50">
                <span className="text-3xl font-mono font-bold text-slate-900">{stats.scorePercent}점</span>
                <span className="text-[10px] text-gray-400 mt-1">{stats.correctCount} / {stats.totalCount} 정답</span>
              </div>
              <div className="mt-4">
                {stats.scorePercent >= 60 ? (
                  <span className="px-4 py-1.5 bg-teal-100 text-teal-800 text-xs font-bold rounded-full border border-teal-200">
                    🎉 최종 합격 (안정적 통과!)
                  </span>
                ) : (
                  <span className="px-4 py-1.5 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-200">
                    ⚠️ 불합격 (개념 재복습 권장)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Category-by-category Performance breakdown */}
          <div className="border border-gray-100 rounded-2xl p-6 flex flex-col gap-4" id="scorecard-breakdown">
            <h3 className="font-sans font-bold text-gray-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-500" />
              단원별 상세 분석 리포트
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="breakdown-grid">
              {Object.entries(stats.categoryStats).map(([key, item]) => {
                const percent = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
                let evaluation = '출제 없음';
                let colorClass = 'bg-gray-400';
                
                if (item.total > 0) {
                  if (percent >= 80) {
                    evaluation = '최우수 (마스터)';
                    colorClass = 'bg-teal-500';
                  } else if (percent >= 60) {
                    evaluation = '보통 (안정)';
                    colorClass = 'bg-amber-500';
                  } else {
                    evaluation = '주의 (오답 보완 필요)';
                    colorClass = 'bg-rose-500';
                  }
                }

                return (
                  <div key={key} className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-700">{item.label}</span>
                      <span className="text-slate-900">{item.correct} / {item.total} 맞힘 ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400">단원 성취도 등급</span>
                      <span className={`font-semibold ${percent >= 60 ? 'text-teal-600' : 'text-rose-600'}`}>{evaluation}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* List of Answer Logs to review mistakes */}
          <div className="flex flex-col gap-4" id="scorecard-mistakes-section">
            <h3 className="font-sans font-bold text-gray-900 text-sm">
              전체 문항 풀이 상세 피드백
            </h3>
            
            <div className="flex flex-col gap-3" id="scorecard-q-logs">
              {questions.map((q, idx) => {
                const selectedIdx = userAnswers[q.id];
                const isCorrect = selectedIdx === q.correctAnswerIndex;
                
                return (
                  <div 
                    key={q.id} 
                    id={`review-item-${q.id}`}
                    className={`border p-5 rounded-2xl flex flex-col gap-3 transition-colors ${
                      isCorrect 
                        ? 'border-emerald-100 bg-emerald-50/20' 
                        : 'border-rose-100 bg-rose-50/20'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-xs font-bold text-gray-500">
                        {idx + 1}번 문항 ({q.categoryLabel})
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isCorrect ? '정답' : '오답'}
                      </span>
                    </div>

                    <h4 className="font-sans font-semibold text-sm sm:text-base text-gray-900">
                      Q. {q.question}
                    </h4>

                    {/* Show what user selected vs what was correct */}
                    <div className="text-xs flex flex-col gap-1 text-gray-600 mt-1">
                      <div>• 나의 답변: <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                        {selectedIdx !== undefined ? `${selectedIdx + 1}번) ${q.options[selectedIdx]}` : '미선택'}
                      </span></div>
                      {!isCorrect && (
                        <div>• 실제 정답: <span className="text-emerald-700 font-bold">
                          {q.correctAnswerIndex + 1}번) {q.options[q.correctAnswerIndex]}
                        </span></div>
                      )}
                    </div>

                    {/* Detailed Explanation */}
                    <div className="mt-2 p-3.5 rounded-xl bg-white border border-gray-150/50 text-xs text-gray-500 leading-relaxed">
                      <strong className="block text-slate-800 font-bold mb-1">상세 해설 & 피드백:</strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scorecard Control Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100" id="scorecard-controls">
            <button
              id="btn-scorecard-restart"
              onClick={startExam}
              className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-sans font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              오답 초기화 후 재도전하기
            </button>
            <button
              id="btn-scorecard-exit"
              onClick={exitExam}
              className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-sans font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center"
            >
              단원 선택 화면으로 돌아가기
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE EXAM RUNNING PAGE */
        <div className="max-w-3xl mx-auto w-full bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-6" id="exam-running-panel">
          {/* Active progress tracking bar */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4" id="exam-hud">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono font-bold text-teal-600 tracking-wider uppercase">
                {examMode === 'real' ? '실전 모의고사 수검 중' : '단원별 집중 문제풀이'}
              </span>
              <span className="text-xs text-gray-400">
                Category: {currentQuestion.categoryLabel}
              </span>
            </div>

            <div className="flex items-center gap-4 shrink-0 font-mono text-sm" id="hud-stats">
              <span className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg text-xs font-semibold text-gray-600">
                ⏱️ 소요 시간 {elapsedTime}
              </span>
              <span className="bg-teal-50 border border-teal-100 px-3 py-1 rounded-lg text-xs font-bold text-teal-800">
                문항 {currentIndex + 1} / {questions.length}
              </span>
            </div>
          </div>

          {/* Master Progress Indicator Bar */}
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden" id="hud-progressbar">
            <div 
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Text Card */}
          <div className="flex flex-col gap-3 py-4" id="current-question-card">
            <div className="flex gap-1.5 items-center">
              <span className="text-xs bg-gray-100 text-gray-600 font-mono px-2 py-0.5 rounded font-bold">
                난이도 {currentQuestion.difficulty}
              </span>
              <span className="text-xs bg-teal-50 text-teal-700 font-sans px-2 py-0.5 rounded font-bold">
                {currentQuestion.categoryLabel}
              </span>
            </div>
            <h2 className="text-[15px] sm:text-lg font-sans font-bold leading-relaxed text-gray-900 mt-1">
              {currentIndex + 1}. {currentQuestion.question}
            </h2>
          </div>

          {/* Option list */}
          <div className="flex flex-col gap-2.5" id="current-options-list">
            {currentQuestion.options.map((opt, oIdx) => {
              const isSelected = selectedAnswerIndex === oIdx;
              
              // In study mode: styling changes once submitted
              let optionClass = 'bg-white border-gray-150 text-gray-800 hover:bg-slate-50';
              let badgeElement = null;

              if (isSelected) {
                optionClass = 'bg-slate-900 border-slate-900 text-white shadow-sm font-semibold';
              }

              if (examMode === 'study' && isCurrentAnswerChecked) {
                const isCorrectOption = oIdx === currentQuestion.correctAnswerIndex;
                if (isCorrectOption) {
                  // highlight in green
                  optionClass = 'bg-emerald-500 border-emerald-500 text-white font-bold';
                  badgeElement = <Check className="w-4 h-4 text-white shrink-0 stroke-[3px]" />;
                } else if (isSelected) {
                  // highlight in red
                  optionClass = 'bg-rose-500 border-rose-500 text-white font-bold';
                  badgeElement = <X className="w-4 h-4 text-white shrink-0 stroke-[3px]" />;
                } else {
                  optionClass = 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed';
                }
              }

              return (
                <button
                  key={oIdx}
                  id={`btn-option-${currentIndex}-${oIdx}`}
                  onClick={() => selectOption(oIdx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-[13px] leading-normal flex items-center justify-between gap-3 transition-all ${optionClass}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono font-bold shrink-0 opacity-70">({oIdx + 1})</span>
                    <span>{opt}</span>
                  </div>
                  {badgeElement}
                </button>
              );
            })}
          </div>

          {/* Study Mode Instant Feedback Explanation Card */}
          {examMode === 'study' && isCurrentAnswerChecked && (
            <motion.div 
              id="study-explanation-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border flex flex-col gap-2.5 ${
                selectedAnswerIndex === currentQuestion.correctAnswerIndex 
                  ? 'border-emerald-100 bg-emerald-50/10' 
                  : 'border-rose-100 bg-rose-50/10'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                {selectedAnswerIndex === currentQuestion.correctAnswerIndex ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> 축하합니다! 정답입니다.
                  </span>
                ) : (
                  <span className="text-rose-700 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> 틀렸습니다. 다시 한번 점검해 보세요!
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                <strong className="block text-slate-800 font-bold mb-1">상세 해설 및 교육 가이드:</strong>
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}

          {/* Control Bar */}
          <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-4" id="exam-hud-controls">
            <button
              id="btn-exit-exam-early"
              onClick={exitExam}
              className="text-xs text-gray-400 hover:text-red-500 font-semibold flex items-center gap-1 bg-none border-none cursor-pointer"
            >
              나가기 (포기)
            </button>

            <div className="flex gap-2" id="navigation-btn-group">
              {/* Check answer button in study mode */}
              {examMode === 'study' && !isCurrentAnswerChecked && (
                <button
                  id="btn-quiz-check"
                  onClick={handleCheckAnswer}
                  disabled={!isAnswerSelected}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isAnswerSelected 
                      ? 'bg-slate-900 text-white hover:bg-slate-850' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  정답 확인
                </button>
              )}

              {/* Show Next button */}
              {(examMode === 'real' || isCurrentAnswerChecked) && (
                <button
                  id="btn-quiz-next"
                  onClick={handleNextQuestion}
                  disabled={examMode === 'real' && !isAnswerSelected}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                    (examMode === 'real' && !isAnswerSelected) 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-teal-500 text-white hover:bg-teal-600 shadow-teal-500/10'
                  }`}
                >
                  {currentIndex === questions.length - 1 ? '채점하고 끝내기' : '다음 문제'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
