export interface StudySubConcept {
  id: string;
  title: string;
  bullets: string[];
  tips?: string[];
}

export interface StudyConcept {
  id: string;
  title: string;
  description: string;
  subConcepts: StudySubConcept[];
  icon: string;
}

export interface Flashcard {
  id: string;
  category: string;
  question: string;
  answer: string;
  formula?: string;
  explanation?: string;
}

export type QuestionCategory = 'basic' | 'income_statement' | 'balance_sheet' | 'ratios_audit';

export interface QuizQuestion {
  id: string;
  category: QuestionCategory;
  categoryLabel: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: '상' | '중' | '하';
}

export interface FinancialInputs {
  assets: number;
  currentAssets: number;
  quickAssets: number;
  liabilities: number;
  currentLiabilities: number;
  equity: number;
  revenue: number;
  cogs: number;
  sga: number;
  netIncome: number;
}
