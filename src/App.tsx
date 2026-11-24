import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Layers, RotateCcw } from 'lucide-react';
import { FlashcardsPanel } from './components/FlashcardsPanel';
import { GrammarReference } from './components/GrammarReference';
import { QuizPanel } from './components/QuizPanel';
import { FLASHCARDS } from './data/flashcards';
import { ALL_QUESTIONS, seededShuffle } from './data/frames';
import type {
  AppState,
  ArticleOption,
  FlashcardFilter,
  FlashcardStatus,
  QuizCategoryFilter,
  QuizOrder,
  WorkspaceMode,
} from './types/app';

const STORAGE_KEY = 'deutsche_praepositionen_state_v1';

const DEFAULT_STATE: AppState = {
  mode: 'quiz',
  category: 'all',
  prep: 'all',
  order: 'shuffled',
  currentIdx: 0,
  shuffleSalt: 0,
  answeredIds: {},
  correctCount: 0,
  totalAnswered: 0,
  streak: 0,
  wrongIds: [],
  fcFilter: 'all',
  fcIndex: 0,
  fcShuffleSalt: 0,
  fcStatus: {},
};

function loadInitialState(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      answeredIds: parsed.answeredIds ?? {},
      wrongIds: Array.isArray(parsed.wrongIds) ? parsed.wrongIds : [],
      fcStatus: parsed.fcStatus ?? {},
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export default function App() {
  const [appState, setAppState] = useState<AppState>(loadInitialState);
  const [chosenAnswer, setChosenAnswer] = useState<ArticleOption | null>(null);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [appState]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const activePool = useMemo(() => {
    let filtered = ALL_QUESTIONS;

    if (appState.category === 'mistakes') {
      const wrongSet = new Set(appState.wrongIds);
      filtered = filtered.filter((q) => wrongSet.has(q.id));
    } else if (appState.category !== 'all') {
      filtered = filtered.filter((q) => q.cat === appState.category);
    }

    if (appState.prep !== 'all') {
      filtered = filtered.filter((q) => q.prep === appState.prep);
    }

    if (appState.order === 'sequential') {
      return filtered.slice().sort((a, b) => a.id - b.id);
    }
    return seededShuffle(filtered, 777 + appState.shuffleSalt);
  }, [appState.category, appState.prep, appState.order, appState.shuffleSalt, appState.wrongIds]);

  const safeCurrentIdx =
    activePool.length > 0 && appState.currentIdx < activePool.length
      ? appState.currentIdx
      : 0;

  const activeDeck = useMemo(() => {
    let deck = FLASHCARDS;
    if (appState.fcFilter === 'prep') {
      deck = FLASHCARDS.filter((c) => c.type === 'prep');
    } else if (appState.fcFilter === 'art') {
      deck = FLASHCARDS.filter((c) => c.type === 'art');
    } else if (appState.fcFilter === 'contr') {
      deck = FLASHCARDS.filter((c) => c.type === 'contr');
    } else if (appState.fcFilter === 'review') {
      deck = FLASHCARDS.filter((c) => appState.fcStatus[c.id] === 'review');
    }

    if (appState.fcShuffleSalt > 0) {
      deck = seededShuffle(deck, 505 + appState.fcShuffleSalt);
    }
    return deck;
  }, [appState.fcFilter, appState.fcShuffleSalt, appState.fcStatus]);

  const safeFcIndex =
    activeDeck.length > 0 && appState.fcIndex < activeDeck.length
      ? appState.fcIndex
      : 0;

  const accuracyPct =
    appState.totalAnswered > 0
      ? Math.round((appState.correctCount / appState.totalAnswered) * 100)
      : 0;
  const uniqueDone = Object.keys(appState.answeredIds).length;

  const handleSelectAnswer = useCallback(
    (chosen: ArticleOption) => {
      if (chosenAnswer !== null || activePool.length === 0) return;
      const q = activePool[safeCurrentIdx];
      if (!q) return;

      setChosenAnswer(chosen);
      const isCorrect = chosen === q.answer;

      setAppState((prev) => {
        const nextWrongIds = isCorrect
          ? prev.wrongIds.filter((id) => id !== q.id)
          : prev.wrongIds.includes(q.id)
            ? prev.wrongIds
            : [...prev.wrongIds, q.id];

        return {
          ...prev,
          totalAnswered: prev.totalAnswered + 1,
          answeredIds: {
            ...prev.answeredIds,
            [q.id]: isCorrect ? 'ok' : 'err',
          },
          correctCount: prev.correctCount + (isCorrect ? 1 : 0),
          streak: isCorrect ? prev.streak + 1 : 0,
          wrongIds: nextWrongIds,
        };
      });
    },
    [activePool, chosenAnswer, safeCurrentIdx],
  );

  const handleNextQuestion = useCallback(() => {
    if (activePool.length === 0) return;
    setChosenAnswer(null);
    setAppState((prev) => ({
      ...prev,
      currentIdx: safeCurrentIdx < activePool.length - 1 ? safeCurrentIdx + 1 : 0,
    }));
  }, [activePool.length, safeCurrentIdx]);

  const handlePrevQuestion = useCallback(() => {
    if (activePool.length === 0 || safeCurrentIdx <= 0) return;
    setChosenAnswer(null);
    setAppState((prev) => ({
      ...prev,
      currentIdx: safeCurrentIdx - 1,
    }));
  }, [activePool.length, safeCurrentIdx]);

  const handleCategoryChange = (category: QuizCategoryFilter) => {
    setChosenAnswer(null);
    setAppState((prev) => ({ ...prev, category, currentIdx: 0 }));
  };

  const handlePrepChange = (prep: string) => {
    setChosenAnswer(null);
    setAppState((prev) => ({ ...prev, prep, currentIdx: 0 }));
  };

  const handleOrderChange = (order: QuizOrder) => {
    setChosenAnswer(null);
    setAppState((prev) => ({ ...prev, order, currentIdx: 0 }));
  };

  const handleReshuffleQuiz = () => {
    setChosenAnswer(null);
    setAppState((prev) => ({
      ...prev,
      order: 'shuffled',
      shuffleSalt: prev.shuffleSalt + 1,
      currentIdx: 0,
    }));
  };

  const handleSwitchMode = (mode: WorkspaceMode) => {
    setIsFlashcardFlipped(false);
    setAppState((prev) => ({ ...prev, mode }));
  };

  const handleFlipFlashcard = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlashcardFlipped((prev) => !prev);
  }, [activeDeck.length]);

  const handleNextFlashcard = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlashcardFlipped(false);
    setAppState((prev) => ({
      ...prev,
      fcIndex: (safeFcIndex + 1) % activeDeck.length,
    }));
  }, [activeDeck.length, safeFcIndex]);

  const handlePrevFlashcard = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlashcardFlipped(false);
    setAppState((prev) => ({
      ...prev,
      fcIndex: (safeFcIndex - 1 + activeDeck.length) % activeDeck.length,
    }));
  }, [activeDeck.length, safeFcIndex]);

  const handleFilterFlashcards = (fcFilter: FlashcardFilter) => {
    setIsFlashcardFlipped(false);
    setAppState((prev) => ({ ...prev, fcFilter, fcIndex: 0 }));
  };

  const handleShuffleFlashcards = () => {
    setIsFlashcardFlipped(false);
    setAppState((prev) => ({
      ...prev,
      fcShuffleSalt: prev.fcShuffleSalt + 1,
      fcIndex: 0,
    }));
  };

  const handleMarkFlashcard = (status: FlashcardStatus) => {
    const card = activeDeck[safeFcIndex];
    if (!card) return;
    setIsFlashcardFlipped(false);
    setAppState((prev) => ({
      ...prev,
      fcStatus: { ...prev.fcStatus, [card.id]: status },
      fcIndex:
        activeDeck.length > 0 ? (safeFcIndex + 1) % activeDeck.length : 0,
    }));
  };

  const handleResetProgress = () => {
    if (!resetArmed) {
      setResetArmed(true);
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = window.setTimeout(() => {
        setResetArmed(false);
      }, 3500);
      return;
    }

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    setResetArmed(false);
    setChosenAnswer(null);
    setIsFlashcardFlipped(false);
    setAppState((prev) => ({
      ...DEFAULT_STATE,
      mode: prev.mode,
    }));
  };

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      const tag =
        ev.target instanceof HTMLElement ? ev.target.tagName.toLowerCase() : '';
      if (tag === 'select' || tag === 'input' || tag === 'textarea') return;

      if (appState.mode === 'quiz') {
        const keyMap: Record<string, ArticleOption> = {
          '1': 'der',
          '2': 'die',
          '3': 'das',
          '4': 'den',
          '5': 'dem',
          '6': 'des',
        };
        if (keyMap[ev.key]) {
          handleSelectAnswer(keyMap[ev.key]);
        } else if (ev.key === 'Enter' && chosenAnswer !== null) {
          ev.preventDefault();
          handleNextQuestion();
        }
      } else if (appState.mode === 'flashcards') {
        if (ev.key === ' ') {
          ev.preventDefault();
          handleFlipFlashcard();
        } else if (ev.key === 'ArrowRight') {
          handleNextFlashcard();
        } else if (ev.key === 'ArrowLeft') {
          handlePrevFlashcard();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    appState.mode,
    chosenAnswer,
    handleSelectAnswer,
    handleNextQuestion,
    handleFlipFlashcard,
    handleNextFlashcard,
    handlePrevFlashcard,
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--ink-primary)]">
      {/* Clean Single-Row Top Bar */}
      <header className="border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
          <a
            href="#top"
            className="font-serif text-lg font-semibold tracking-tight text-[var(--ink-primary)] whitespace-nowrap shrink-0"
          >
            Deutsche Präpositionen
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-semibold text-[var(--ink-secondary)]"
          >
            <a
              href="#practice-workspace"
              onClick={() => handleSwitchMode('quiz')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[var(--ink-primary)]"
            >
              Quiz Practice
            </a>
            <a
              href="#practice-workspace"
              onClick={() => handleSwitchMode('flashcards')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[var(--ink-primary)]"
            >
              Flashcards
            </a>
            <a
              href="#grammar-reference"
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[var(--ink-primary)]"
            >
              Grammar Guide
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleResetProgress}
              className={`inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                resetArmed
                  ? 'border-[var(--error-solid)] bg-[var(--error-container)] text-[var(--error-ink)]'
                  : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--ink-secondary)] hover:bg-[var(--bg-surface-tinted)] hover:text-[var(--ink-primary)]'
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{resetArmed ? 'Click again to reset' : 'Reset Progress'}</span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="top"
        className="mx-auto grid max-w-[1120px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:py-8"
      >
        {/* Overview Banner & KPI Strip */}
        <section
          aria-label="Practice overview"
          className="grid grid-cols-1 items-center gap-6 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-[0_4px_18px_rgb(30_45_36/0.05)] lg:grid-cols-[1.35fr_1fr]"
        >
          <div>
            <p className="mb-1.5 font-mono text-xs font-medium text-[var(--accent-primary)]">
              German Grammar Studio · A1–A2
            </p>
            <h1 className="mb-2 font-serif text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-[var(--ink-primary)] text-balance">
              Master German Prepositions &amp; Cases
            </h1>
            <p className="max-w-[60ch] text-sm sm:text-base text-[var(--ink-secondary)]">
              Practise 1,000 realistic sentences across Akkusativ, Dativ, and Wechselpräpositionen, drill case-hidden flashcards, and consult the full grammar guide below.
            </p>
          </div>

          <div
            aria-label="Practice statistics"
            className="grid grid-cols-3 gap-2.5 sm:gap-3"
          >
            <div className="rounded-xl border border-[#a6d4b6] bg-[var(--accent-container)] px-3 py-3.5 text-center text-[var(--accent-container-ink)]">
              <span className="mb-1 block font-mono text-xs font-medium">
                Accuracy
              </span>
              <span className="font-serif text-2xl sm:text-[1.7rem] font-semibold tabular-nums leading-none">
                {accuracyPct}%
              </span>
            </div>

            <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-tinted)] px-3 py-3.5 text-center">
              <span className="mb-1 block font-mono text-xs font-medium text-[var(--ink-secondary)]">
                Answered
              </span>
              <span className="font-serif text-xl sm:text-2xl font-semibold tabular-nums leading-none text-[var(--ink-primary)]">
                {uniqueDone} / {ALL_QUESTIONS.length}
              </span>
            </div>

            <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface-tinted)] px-3 py-3.5 text-center">
              <span className="mb-1 block font-mono text-xs font-medium text-[var(--ink-secondary)]">
                Streak
              </span>
              <span className="font-serif text-2xl sm:text-[1.7rem] font-semibold tabular-nums leading-none text-[var(--ink-primary)]">
                {appState.streak}
              </span>
            </div>
          </div>
        </section>

        {/* Workspace Mode Switcher */}
        <div
          id="practice-workspace"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-3 shadow-[0_4px_18px_rgb(30_45_36/0.04)]"
        >
          <div
            role="tablist"
            aria-label="Workspace mode"
            className="flex flex-wrap items-center gap-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={appState.mode === 'quiz'}
              onClick={() => handleSwitchMode('quiz')}
              className={`inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                appState.mode === 'quiz'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'border border-[var(--border-hairline)] bg-[var(--bg-surface-tinted)] text-[var(--ink-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>Quiz Practice (1,000)</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={appState.mode === 'flashcards'}
              onClick={() => handleSwitchMode('flashcards')}
              className={`inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                appState.mode === 'flashcards'
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'border border-[var(--border-hairline)] bg-[var(--bg-surface-tinted)] text-[var(--ink-primary)] hover:bg-[var(--bg-surface-hover)]'
              }`}
            >
              <Layers className="h-4 w-4" aria-hidden="true" />
              <span>Flashcards</span>
            </button>
          </div>

          <a
            href="#grammar-reference"
            className="inline-flex min-h-[40px] items-center whitespace-nowrap shrink-0 rounded-lg border border-[var(--border-hairline)] px-3.5 py-1.5 text-sm font-semibold text-[var(--ink-secondary)] transition-colors hover:bg-[var(--bg-surface-tinted)] hover:text-[var(--ink-primary)]"
          >
            Reference Guide ↓
          </a>
        </div>

        {/* Active Practice Panel */}
        {appState.mode === 'quiz' ? (
          <QuizPanel
            activePool={activePool}
            currentIdx={safeCurrentIdx}
            category={appState.category}
            prep={appState.prep}
            order={appState.order}
            chosenAnswer={chosenAnswer}
            onCategoryChange={handleCategoryChange}
            onPrepChange={handlePrepChange}
            onOrderChange={handleOrderChange}
            onReshuffle={handleReshuffleQuiz}
            onSelectAnswer={handleSelectAnswer}
            onPrev={handlePrevQuestion}
            onNext={handleNextQuestion}
          />
        ) : (
          <FlashcardsPanel
            activeDeck={activeDeck}
            fcIndex={safeFcIndex}
            fcFilter={appState.fcFilter}
            fcStatus={appState.fcStatus}
            isFlipped={isFlashcardFlipped}
            onFlip={handleFlipFlashcard}
            onFilterChange={handleFilterFlashcards}
            onShuffle={handleShuffleFlashcards}
            onPrev={handlePrevFlashcard}
            onNext={handleNextFlashcard}
            onMark={handleMarkFlashcard}
          />
        )}

        {/* Full Grammar Reference */}
        <GrammarReference />

        <footer className="pb-6 pt-2 text-center text-sm text-[var(--ink-secondary)]">
          Built from A1/A2 German grammar references (<em>Basic German</em>,{' '}
          <em>Schritte Übungsgrammatik</em>, and{' '}
          <em>Collins Easy Learning German Verbs</em>).
        </footer>
      </div>
    </div>
  );
}
