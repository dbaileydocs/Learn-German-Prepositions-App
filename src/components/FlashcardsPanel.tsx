import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  RotateCw,
  Shuffle,
} from 'lucide-react';
import { FLASHCARDS } from '../data/flashcards';
import type {
  Flashcard,
  FlashcardFilter,
  FlashcardStatus,
} from '../types/app';

const DECK_FILTERS: { id: FlashcardFilter; label: string }[] = [
  { id: 'all', label: 'All Cards' },
  { id: 'prep', label: 'Prepositions' },
  { id: 'art', label: 'Articles & Pronouns' },
  { id: 'contr', label: 'Contractions' },
  { id: 'review', label: 'Needs Review' },
];

interface FlashcardsPanelProps {
  activeDeck: Flashcard[];
  fcIndex: number;
  fcFilter: FlashcardFilter;
  fcStatus: Record<string, FlashcardStatus>;
  isFlipped: boolean;
  onFlip: () => void;
  onFilterChange: (filter: FlashcardFilter) => void;
  onShuffle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onMark: (status: FlashcardStatus) => void;
}

export function FlashcardsPanel({
  activeDeck,
  fcIndex,
  fcFilter,
  fcStatus,
  isFlipped,
  onFlip,
  onFilterChange,
  onShuffle,
  onPrev,
  onNext,
  onMark,
}: FlashcardsPanelProps) {
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const masteredTotal = Object.values(fcStatus).filter(
    (v) => v === 'mastered',
  ).length;

  const card = activeDeck[fcIndex] ?? null;
  const countText =
    activeDeck.length > 0
      ? `Card ${fcIndex + 1} of ${activeDeck.length}`
      : '0 cards';

  const statusVal = card ? fcStatus[card.id] : undefined;
  const statusLabel =
    statusVal === 'mastered'
      ? 'Mastered'
      : statusVal === 'review'
        ? 'Needs Review'
        : 'Unreviewed';

  const handleMark = (nextStatus: FlashcardStatus) => {
    if (!card) return;
    setLiveAnnouncement(
      nextStatus === 'mastered'
        ? `Marked "${card.term}" as mastered.`
        : `Marked "${card.term}" for review.`,
    );
    onMark(nextStatus);
  };

  return (
    <section
      aria-labelledby="fc-heading"
      className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-[0_4px_18px_rgb(30_45_36/0.05)]"
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="fc-heading"
          className="font-serif text-xl sm:text-2xl font-semibold text-[var(--ink-primary)]"
        >
          Active-Recall Flashcards
        </h2>
        <span className="font-mono text-xs font-medium text-[var(--accent-primary)] tabular-nums">
          {masteredTotal} / {FLASHCARDS.length} mastered
        </span>
      </div>

      <p className="mb-5 max-w-3xl text-sm text-[var(--ink-secondary)]">
        Case names stay hidden on the front of every card so you test your recall before flipping. Covers every Akkusativ and Dativ preposition, article form, pronoun, and contraction.
      </p>

      {/* Deck Filter Segmented Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter flashcard deck"
          className="flex flex-wrap items-center gap-1.5 rounded-xl bg-[var(--bg-surface-tinted)] p-1"
        >
          {DECK_FILTERS.map((f) => {
            const active = fcFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onFilterChange(f.id)}
                className={`min-h-[38px] whitespace-nowrap shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                  active
                    ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                    : 'text-[var(--ink-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--ink-primary)]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onShuffle}
          className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink-primary)] transition-colors hover:bg-[var(--bg-surface-tinted)] cursor-pointer"
        >
          <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Shuffle Deck</span>
        </button>
      </div>

      {/* 3D Flip Card Stage */}
      <div className="perspective-1200 mb-6">
        <button
          type="button"
          onClick={onFlip}
          disabled={!card}
          aria-label={
            card
              ? `Flip flashcard for ${card.term}`
              : 'No cards in current filter'
          }
          className={`preserve-3d relative min-h-[300px] sm:min-h-[290px] w-full text-left transition-transform duration-300 ease-in-out ${
            card ? 'cursor-pointer' : 'cursor-default'
          } ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front Face (Case names intentionally hidden) */}
          <div className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-canvas)] p-5 sm:p-8 shadow-[0_4px_16px_rgb(30_45_36/0.05)]">
            <div className="flex items-center justify-between gap-2 font-mono text-xs text-[var(--ink-secondary)]">
              <span className="font-semibold text-[var(--accent-primary)]">
                {card ? card.frontTag : 'Empty'}
              </span>
              <span className="tabular-nums">{countText}</span>
            </div>

            <div className="py-4 text-center">
              <p className="mb-2 font-serif text-2xl sm:text-4xl font-semibold leading-tight text-[var(--ink-primary)]">
                {card ? card.term : 'No cards marked for review'}
              </p>
              <p className="mx-auto max-w-xl text-sm sm:text-base text-[var(--ink-secondary)]">
                {card
                  ? card.prompt
                  : 'Select "All Cards" above or mark challenging cards with "Mark for Review".'}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 font-mono text-xs text-[var(--ink-secondary)]">
              <span className="inline-flex items-center gap-1.5">
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Click card or press Space to flip</span>
              </span>
              <span>{card ? statusLabel : ''}</span>
            </div>
          </div>

          {/* Back Face */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-2xl border border-[#a6d4b6] bg-[var(--accent-container)] p-5 sm:p-8 text-[var(--accent-container-ink)] shadow-[0_4px_16px_rgb(30_45_36/0.06)]">
            <div className="flex items-center justify-between gap-2 font-mono text-xs">
              <span className="font-semibold">
                {card ? card.backCase : ''}
              </span>
              <span className="tabular-nums">{countText}</span>
            </div>

            <div className="py-3 text-center">
              <p className="mb-2 font-serif text-2xl sm:text-3xl font-semibold leading-tight">
                {card ? card.answer : ''}
              </p>
              <p className="mx-auto max-w-xl text-sm sm:text-base">
                {card ? card.detail : ''}
              </p>
              {card && (
                <div className="mt-4 inline-block rounded-lg bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--ink-primary)]">
                  {card.example}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 font-mono text-xs">
              <span>Click card to flip back</span>
              <span>{card ? statusLabel : ''}</span>
            </div>
          </div>
        </button>
      </div>

      {/* Live region for screen-reader status feedback */}
      <div className="sr-only" role="status" aria-live="polite">
        {liveAnnouncement}
      </div>

      {/* Navigation & Mastery Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!card}
            onClick={onPrev}
            className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface-tinted)] px-4 py-2 text-sm font-semibold text-[var(--ink-primary)] transition-colors hover:bg-[var(--bg-surface-hover)] disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Previous</span>
          </button>
          <button
            type="button"
            disabled={!card}
            onClick={onNext}
            className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface-tinted)] px-4 py-2 text-sm font-semibold text-[var(--ink-primary)] transition-colors hover:bg-[var(--bg-surface-hover)] disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!card}
            onClick={() => handleMark('review')}
            className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-semibold text-[var(--ink-primary)] transition-colors hover:bg-[var(--bg-surface-tinted)] disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
          >
            <Bookmark className="h-4 w-4" aria-hidden="true" />
            <span>Mark for Review</span>
          </button>
          <button
            type="button"
            disabled={!card}
            onClick={() => handleMark('mastered')}
            className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-primary-hover)] disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            <span>Got It</span>
          </button>
        </div>
      </div>
    </section>
  );
}
