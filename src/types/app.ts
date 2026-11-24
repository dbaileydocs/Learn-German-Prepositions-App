export type Gender = 'm' | 'f' | 'n' | 'p';

export type CaseCategory = 'akk' | 'dat' | 'wech';

export type FrameCategory = 'akk' | 'dat' | 'wech_akk' | 'wech_dat';

export type ArticleOption = 'der' | 'die' | 'das' | 'den' | 'dem' | 'des';

export type QuizCategoryFilter = 'all' | 'akk' | 'dat' | 'wech' | 'mistakes';

export type QuizOrder = 'shuffled' | 'sequential';

export type WorkspaceMode = 'quiz' | 'flashcards';

export type FlashcardType = 'prep' | 'art' | 'contr';

export type FlashcardFilter = 'all' | 'prep' | 'art' | 'contr' | 'review';

export type FlashcardStatus = 'mastered' | 'review';

export interface NounEntry {
  de: string;
  en: string;
  g: Gender;
  datPl?: string;
}

export interface SentenceFrame {
  cat: FrameCategory;
  prep: string;
  why: string;
  subjs: [string, string][];
  midDe: string;
  midEn: string;
  endDe: string;
  nouns: string[];
}

export interface Question {
  id: number;
  cat: CaseCategory;
  subCat: FrameCategory;
  caseName: 'Akkusativ' | 'Dativ';
  prep: string;
  beforeBlank: string;
  afterBlank: string;
  en: string;
  answer: ArticleOption;
  nounDe: string;
  genderLabel: string;
  explanation: string;
}

export interface Flashcard {
  id: string;
  type: FlashcardType;
  frontTag: string;
  term: string;
  prompt: string;
  backCase: string;
  answer: string;
  detail: string;
  example: string;
}

export interface AppState {
  mode: WorkspaceMode;
  category: QuizCategoryFilter;
  prep: string;
  order: QuizOrder;
  currentIdx: number;
  shuffleSalt: number;
  answeredIds: Record<number, 'ok' | 'err'>;
  correctCount: number;
  totalAnswered: number;
  streak: number;
  wrongIds: number[];
  fcFilter: FlashcardFilter;
  fcIndex: number;
  fcShuffleSalt: number;
  fcStatus: Record<string, FlashcardStatus>;
}
