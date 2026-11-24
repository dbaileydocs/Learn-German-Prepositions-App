import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  RotateCcw,
  Shuffle,
  XCircle,
} from 'lucide-react';
import { ALL_PREPOSITIONS } from '../data/frames';
import type {
  ArticleOption,
  Question,
  QuizCategoryFilter,
  QuizOrder,
} from '../types/app';

const ARTICLE_CHOICES: { art: ArticleOption; keyNum: string }[] = [
  { art: 'der', keyNum: '1' },
  { art: 'die', keyNum: '2' },
  { art: 'das', keyNum: '3' },
  { art: 'den', keyNum: '4' },
  { art: 'dem', keyNum: '5' },
  { art: 'des', keyNum: '6' },
];

interface QuizPanelProps {
  activePool: Question[];
  currentIdx: number;
  category: QuizCategoryFilter;
  prep: string;
  order: QuizOrder;
  chosenAnswer: ArticleOption | null;
  onCategoryChange: (cat: QuizCategoryFilter) => void;
  onPrepChange: (prep: string) => void;
  onOrderChange: (order: QuizOrder) => void;
  onReshuffle: () => void;
  onSelectAnswer: (art: ArticleOption) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function QuizPanel({
  activePool,
  currentIdx,
  category,
  prep,
  order,
  chosenAnswer,
  onCategoryChange,
  onPrepChange,
  onOrderChange,
  onReshuffle,
  onSelectAnswer,
  onPrev,
  onNext,
}: QuizPanelProps) {
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = activePool[currentIdx] ?? null;
  const isAnswered = chosenAnswer !== null && currentQuestion !== null;
  const isCorrect = isAnswered && chosenAnswer === currentQuestion.answer;

  const progressPct =
    activePool.length > 0
      ? Math.round(((currentIdx + 1) / activePool.length) * 100)
      : 0;

  const handleNavigate = (direction: 'prev' | 'next') => {
    setShowHint(false);
    if (direction === 'prev') {
      onPrev();
    } else {
      onNext();
    }
  };

  const getCategoryLabel = (q: Question) => {
    if (q.cat === 'akk') return `Akkusativ · "${q.prep}"`;
    if (q.cat === 'dat') return `Dativ · "${q.prep}"`;
    return `Wechselpräposition · "${q.prep}"`;
  };

  const getCategoryToneClass = (q: Question) => {
    if (q.cat === 'akk') return 'text-[var(--info-ink)]';
    if (q.cat === 'dat') return 'text-[var(--accent-container-ink)]';
    return 'text-[var(--warm-ink)]';
  };

  return (
    <main
      aria-labelledby="quiz-heading"
      className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-[0_4px_18px_rgb(30_45_36/0.05)]"
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="quiz-heading"
          className="font-serif text-xl sm:text-2xl font-semibold text-[var(--ink-primary)]"
        >
          Article &amp; Case Quiz
        </h2>
        <span className="font-mono text-xs font-medium text-[var(--ink-secondary)] tabular-nums">
          Pool: {activePool.length.toLocaleString()}{' '}
          {activePool.length === 1 ? 'question' : 'questions'}
        </span>
      </div>

      {/* Filter & Order Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 border-b border-[var(--border-hairline)] pb-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-category"
            className="font-mono text-xs font-medium text-[var(--ink-secondary)]"
          >
            Case Category
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => {
              setShowHint(false);
              onCategoryChange(e.target.value as QuizCategoryFilter);
            }}
            className="min-h-[44px] w-full cursor-pointer rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2 text-sm font-semibold text-[var(--ink-primary)] transition-colors hover:border-[#8ba594]"
          >
            <option value="all">All Categories (1,000)</option>
            <option value="akk">Akkusativ Only (300)</option>
            <option value="dat">Dativ Only (350)</option>
            <option value="wech">Wechselpräpositionen (350)</option>
            <option value="mistakes">Review Mistakes</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-prep"
            className="font-mono text-xs font-medium text-[var(--ink-secondary)]"
          >
            Preposition
          </label>
          <select
            id="filter-prep"
            value={prep}
            onChange={(e) => {
              setShowHint(false);
              onPrepChange(e.target.value);
            }}
            className="min-h-[44px] w-full cursor-pointer rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2 text-sm font-semibold text-[var(--ink-primary)] transition-colors hover:border-[#8ba594]"
          >
            <option value="all">All Prepositions</option>
            {ALL_PREPOSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-order"
            className="font-mono text-xs font-medium text-[var(--ink-secondary)]"
          >
            Sequence Order
          </label>
          <select
            id="filter-order"
            value={order}
            onChange={(e) => {
              setShowHint(false);
              onOrderChange(e.target.value as QuizOrder);
            }}
            className="min-h-[44px] w-full cursor-pointer rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2 text-sm font-semibold text-[var(--ink-primary)] transition-colors hover:border-[#8ba594]"
          >
            <option value="shuffled">Shuffled Practice</option>
            <option value="sequential">Sequential (#1–1000)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowHint(false);
            onReshuffle();
          }}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface-tinted)] px-4 py-2 text-sm font-semibold text-[var(--ink-primary)] transition-colors duration-150 hover:bg-[var(--bg-surface-hover)] cursor-pointer"
        >
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          <span>New Shuffle</span>
        </button>
      </div>

      {/* Metadata & Progress */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-[var(--ink-secondary)] tabular-nums">
          {currentQuestion
            ? `Question ${currentIdx + 1} of ${activePool.length} (#${currentQuestion.id})`
            : 'No matching questions'}
        </span>
        {currentQuestion ? (
          <span className={`font-semibold ${getCategoryToneClass(currentQuestion)}`}>
            {getCategoryLabel(currentQuestion)}
          </span>
        ) : (
          <span className="text-[var(--ink-secondary)]">Empty filter</span>
        )}
      </div>

      <div
        className="mb-6 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-surface-tinted)]"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-[var(--accent-primary)] transition-[width] duration-200 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Prompt Stage */}
      <div className="mb-6 rounded-xl bg-[var(--bg-canvas)] px-5 py-8 text-center sm:px-8 sm:py-10">
        {currentQuestion ? (
          <>
            <p className="mb-3 font-serif text-2xl sm:text-[1.85rem] font-medium leading-snug text-[var(--ink-primary)]">
              {currentQuestion.beforeBlank}{' '}
              <span
                className={`mx-1 inline-block min-w-[3.5rem] rounded border-b-2 px-2.5 py-0.5 font-semibold transition-colors ${
                  !isAnswered
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-container)] text-[var(--accent-primary)]'
                    : isCorrect
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-container)] text-[var(--accent-container-ink)]'
                      : 'border-[var(--error-solid)] bg-[var(--error-container)] text-[var(--error-ink)]'
                }`}
              >
                {isAnswered ? currentQuestion.answer : '___'}
              </span>{' '}
              {currentQuestion.afterBlank}
            </p>
            <p className="text-base text-[var(--ink-secondary)]">
              {currentQuestion.en}
            </p>

            <div className="mt-5 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-secondary)] transition-colors hover:bg-[var(--bg-surface-tinted)] hover:text-[var(--ink-primary)] cursor-pointer"
              >
                {showHint ? (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{showHint ? 'Hide Noun Gender Hint' : 'Show Noun Gender Hint'}</span>
              </button>

              {showHint && (
                <p className="font-mono text-xs text-[var(--accent-primary)]">
                  Noun: {currentQuestion.nounDe} — {currentQuestion.genderLabel}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="py-4">
            <p className="mb-2 font-serif text-xl font-medium text-[var(--ink-primary)]">
              No mistakes to review right now.
            </p>
            <p className="text-sm text-[var(--ink-secondary)]">
              Switch back to &ldquo;All Categories&rdquo; or pick another preposition to continue practising.
            </p>
          </div>
        )}
      </div>

      {/* Article Choices */}
      <div
        role="group"
        aria-label="Choose the correct article"
        className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
      >
        {ARTICLE_CHOICES.map(({ art, keyNum }) => {
          const isTargetAnswer = currentQuestion?.answer === art;
          const isChosenWrong = isAnswered && chosenAnswer === art && !isCorrect;

          let buttonStyle =
            'border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--ink-primary)] hover:bg-[var(--bg-surface-tinted)] hover:-translate-y-0.5 shadow-[0_2px_10px_rgb(30_45_36/0.04)]';
          let keyStyle =
            'bg-[var(--bg-surface-tinted)] text-[var(--ink-secondary)]';

          if (isAnswered && isTargetAnswer) {
            buttonStyle =
              'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white';
            keyStyle =
              'bg-[var(--accent-primary-hover)] text-white';
          } else if (isChosenWrong) {
            buttonStyle =
              'border-[var(--error-solid)] bg-[var(--error-container)] text-[var(--error-ink)]';
            keyStyle =
              'bg-[var(--error-solid)] text-white';
          }

          return (
            <button
              key={art}
              type="button"
              disabled={!currentQuestion || isAnswered}
              onClick={() => onSelectAnswer(art)}
              className={`flex min-h-[56px] items-center justify-center gap-2.5 rounded-xl border px-4 py-3 font-serif text-xl font-semibold transition-all duration-150 disabled:cursor-default ${
                !currentQuestion ? 'opacity-50' : ''
              } ${!isAnswered && currentQuestion ? 'cursor-pointer' : ''} ${buttonStyle}`}
            >
              <span
                className={`rounded px-1.5 py-0.5 font-mono text-xs font-medium tabular-nums ${keyStyle}`}
              >
                {keyNum}
              </span>
              <span>{art}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {isAnswered && currentQuestion && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-6 rounded-xl border px-5 py-4 ${
            isCorrect
              ? 'border-[#a6d4b6] bg-[var(--accent-container)] text-[var(--accent-container-ink)]'
              : 'border-[#ebb2b0] bg-[var(--error-container)] text-[var(--error-ink)]'
          }`}
        >
          <div className="mb-1 flex items-center gap-2 font-serif text-lg font-semibold">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            )}
            <span>
              {isCorrect
                ? `Correct — "${currentQuestion.answer}" (${currentQuestion.caseName})`
                : `Not quite — the correct article is "${currentQuestion.answer}" (${currentQuestion.caseName}).`}
            </span>
          </div>
          <p className="text-sm leading-relaxed">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={!currentQuestion || currentIdx === 0}
          onClick={() => handleNavigate('prev')}
          className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface-tinted)] px-4 py-2 text-sm font-semibold text-[var(--ink-primary)] transition-colors hover:bg-[var(--bg-surface-hover)] disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Previous</span>
        </button>

        <span className="font-mono text-xs text-[var(--ink-secondary)]">
          Keys 1–6 select · Enter for next
        </span>

        <button
          type="button"
          disabled={!currentQuestion}
          onClick={() => handleNavigate('next')}
          className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-[var(--accent-primary)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-primary-hover)] disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
        >
          {currentQuestion && currentIdx >= activePool.length - 1 ? (
            <>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Restart Pool</span>
            </>
          ) : (
            <>
              <span>Next Question</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </main>
  );
}
