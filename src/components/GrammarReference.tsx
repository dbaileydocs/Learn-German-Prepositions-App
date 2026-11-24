const AKKUSATIV_PREPS = [
  { prep: 'durch', meaning: 'through', example: 'durch den Park' },
  { prep: 'für', meaning: 'for', example: 'für meine Schwester' },
  { prep: 'gegen', meaning: 'against, around', example: 'gegen den Plan' },
  { prep: 'ohne', meaning: 'without', example: 'ohne meinen Pass' },
  { prep: 'um', meaning: 'around, at', example: 'um den Tisch / um 8 Uhr' },
  { prep: 'bis', meaning: 'until, up to', example: 'bis nächsten Montag' },
  { prep: 'entlang', meaning: 'along', example: 'den Fluss entlang' },
];

const DATIV_PREPS = [
  { prep: 'aus', meaning: 'from, out of', example: 'aus der Küche' },
  { prep: 'außer', meaning: 'apart from', example: 'außer dem Chef' },
  { prep: 'bei', meaning: 'at, near, with', example: 'beim Arzt' },
  { prep: 'gegenüber', meaning: 'opposite', example: 'gegenüber dem Bahnhof' },
  { prep: 'mit', meaning: 'with, by', example: 'mit dem Fahrrad' },
  { prep: 'nach', meaning: 'after, to cities', example: 'nach dem Essen' },
  { prep: 'seit', meaning: 'since, for', example: 'seit einem Monat' },
  { prep: 'von', meaning: 'from, of, by', example: 'vom Bahnhof' },
  { prep: 'zu', meaning: 'to', example: 'zum Supermarkt / zur Post' },
];

const CONTRACTIONS = [
  { form: 'im', base: 'in + dem (Dat)' },
  { form: 'ins', base: 'in + das (Akk)' },
  { form: 'am', base: 'an + dem (Dat)' },
  { form: 'ans', base: 'an + das (Akk)' },
  { form: 'zum', base: 'zu + dem (Dat)' },
  { form: 'zur', base: 'zu + der (Dat)' },
  { form: 'beim', base: 'bei + dem (Dat)' },
  { form: 'vom', base: 'von + dem (Dat)' },
  { form: 'aufs', base: 'auf + das (Akk)' },
  { form: 'fürs', base: 'für + das (Akk)' },
  { form: 'durchs', base: 'durch + das (Akk)' },
  { form: 'ums', base: 'um + das (Akk)' },
];

export function GrammarReference() {
  return (
    <section
      id="grammar-reference"
      aria-labelledby="ref-heading"
      className="mt-2 space-y-6 border-t border-[var(--border-hairline)] pt-7"
    >
      <div>
        <p className="mb-1 font-mono text-xs font-medium text-[var(--accent-primary)]">
          Grammar Reference Guide
        </p>
        <h2
          id="ref-heading"
          className="font-serif text-2xl font-semibold text-[var(--ink-primary)]"
        >
          Complete Preposition &amp; Declension Reference
        </h2>
      </div>

      {/* Akkusativ & Dativ Side-by-Side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Akkusativ Card */}
        <article className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-[0_4px_18px_rgb(30_45_36/0.05)]">
          <p className="mb-1 font-mono text-xs font-medium text-[var(--info-ink)]">
            Direct Object · Wen oder was?
          </p>
          <h3 className="mb-4 font-serif text-xl font-semibold text-[var(--ink-primary)]">
            Akkusativ Prepositions
          </h3>

          <ul className="mb-5 divide-y divide-[var(--border-hairline)] text-sm">
            {AKKUSATIV_PREPS.map((item) => (
              <li
                key={item.prep}
                className="flex items-baseline justify-between gap-4 py-2"
              >
                <span className="font-bold text-[var(--accent-primary)]">
                  {item.prep}
                </span>
                <span className="text-right text-[var(--ink-secondary)]">
                  {item.meaning} (<em>{item.example}</em>)
                </span>
              </li>
            ))}
          </ul>

          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse text-left text-sm"
              aria-label="Akkusativ article endings"
            >
              <thead>
                <tr className="bg-[var(--bg-surface-tinted)] font-mono text-xs text-[var(--ink-secondary)]">
                  <th className="px-2.5 py-2 font-medium">Gender</th>
                  <th className="px-2.5 py-2 font-medium">Definite</th>
                  <th className="px-2.5 py-2 font-medium">Indefinite</th>
                  <th className="px-2.5 py-2 font-medium">Negative / Poss.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                <tr>
                  <td className="px-2.5 py-2">Masculine</td>
                  <td className="px-2.5 py-2 font-semibold">den</td>
                  <td className="px-2.5 py-2 font-semibold">einen</td>
                  <td className="px-2.5 py-2">keinen / meinen</td>
                </tr>
                <tr>
                  <td className="px-2.5 py-2">Feminine</td>
                  <td className="px-2.5 py-2 font-semibold">die</td>
                  <td className="px-2.5 py-2 font-semibold">eine</td>
                  <td className="px-2.5 py-2">keine / meine</td>
                </tr>
                <tr>
                  <td className="px-2.5 py-2">Neuter</td>
                  <td className="px-2.5 py-2 font-semibold">das</td>
                  <td className="px-2.5 py-2 font-semibold">ein</td>
                  <td className="px-2.5 py-2">kein / mein</td>
                </tr>
                <tr>
                  <td className="px-2.5 py-2">Plural</td>
                  <td className="px-2.5 py-2 font-semibold">die</td>
                  <td className="px-2.5 py-2">—</td>
                  <td className="px-2.5 py-2">keine / meine</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        {/* Dativ Card */}
        <article className="rounded-2xl border border-[#a6d4b6] bg-[var(--accent-container)] p-5 sm:p-6 text-[var(--accent-container-ink)] shadow-[0_4px_18px_rgb(30_45_36/0.05)]">
          <p className="mb-1 font-mono text-xs font-medium">
            Indirect Object · Wem?
          </p>
          <h3 className="mb-4 font-serif text-xl font-semibold">
            Dativ Prepositions
          </h3>

          <ul className="mb-5 divide-y divide-[#b8dec4] text-sm">
            {DATIV_PREPS.map((item) => (
              <li
                key={item.prep}
                className="flex items-baseline justify-between gap-4 py-2"
              >
                <span className="font-bold">{item.prep}</span>
                <span className="text-right">
                  {item.meaning} (<em>{item.example}</em>)
                </span>
              </li>
            ))}
          </ul>

          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse text-left text-sm"
              aria-label="Dativ article endings"
            >
              <thead>
                <tr className="bg-[var(--bg-surface)] font-mono text-xs text-[var(--ink-primary)]">
                  <th className="px-2.5 py-2 font-medium">Gender</th>
                  <th className="px-2.5 py-2 font-medium">Definite</th>
                  <th className="px-2.5 py-2 font-medium">Indefinite</th>
                  <th className="px-2.5 py-2 font-medium">Negative / Poss.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b8dec4]">
                <tr>
                  <td className="px-2.5 py-2">Masculine</td>
                  <td className="px-2.5 py-2 font-semibold">dem</td>
                  <td className="px-2.5 py-2 font-semibold">einem</td>
                  <td className="px-2.5 py-2">keinem / meinem</td>
                </tr>
                <tr>
                  <td className="px-2.5 py-2">Feminine</td>
                  <td className="px-2.5 py-2 font-semibold">der</td>
                  <td className="px-2.5 py-2 font-semibold">einer</td>
                  <td className="px-2.5 py-2">keiner / meiner</td>
                </tr>
                <tr>
                  <td className="px-2.5 py-2">Neuter</td>
                  <td className="px-2.5 py-2 font-semibold">dem</td>
                  <td className="px-2.5 py-2 font-semibold">einem</td>
                  <td className="px-2.5 py-2">keinem / meinem</td>
                </tr>
                <tr>
                  <td className="px-2.5 py-2">Plural</td>
                  <td className="px-2.5 py-2 font-semibold">den (+ -n)</td>
                  <td className="px-2.5 py-2">—</td>
                  <td className="px-2.5 py-2">keinen / meinen (+ -n)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      {/* Wechselpräpositionen & Contractions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-[0_4px_18px_rgb(30_45_36/0.05)]">
          <p className="mb-1 font-mono text-xs font-medium text-[var(--warm-ink)]">
            Two-Way Prepositions
          </p>
          <h3 className="mb-2 font-serif text-xl font-semibold text-[var(--ink-primary)]">
            Wechselpräpositionen
          </h3>
          <p className="mb-4 text-sm text-[var(--ink-secondary)]">
            The nine prepositions{' '}
            <strong className="text-[var(--ink-primary)]">
              an, auf, hinter, in, neben, über, unter, vor, zwischen
            </strong>{' '}
            take either Akkusativ or Dativ depending on whether the verb expresses direction or static position:
          </p>

          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse text-left text-sm"
              aria-label="Wechselpräpositionen rules"
            >
              <thead>
                <tr className="bg-[var(--bg-surface-tinted)] font-mono text-xs text-[var(--ink-secondary)]">
                  <th className="px-2.5 py-2 font-medium">Question</th>
                  <th className="px-2.5 py-2 font-medium">Case</th>
                  <th className="px-2.5 py-2 font-medium">Typical Verbs</th>
                  <th className="px-2.5 py-2 font-medium">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                <tr>
                  <td className="px-2.5 py-2.5 align-top">
                    <strong>Wohin?</strong>
                    <br />
                    <span className="text-xs text-[var(--ink-secondary)]">
                      Direction / motion
                    </span>
                  </td>
                  <td className="px-2.5 py-2.5 align-top font-semibold">
                    Akkusativ
                  </td>
                  <td className="px-2.5 py-2.5 align-top text-[var(--ink-secondary)]">
                    gehen, fahren, legen, stellen, setzen, hängen
                  </td>
                  <td className="px-2.5 py-2.5 align-top">
                    Ich lege das Buch auf <strong>den</strong> Tisch.
                  </td>
                </tr>
                <tr>
                  <td className="px-2.5 py-2.5 align-top">
                    <strong>Wo?</strong>
                    <br />
                    <span className="text-xs text-[var(--ink-secondary)]">
                      Location / position
                    </span>
                  </td>
                  <td className="px-2.5 py-2.5 align-top font-semibold">
                    Dativ
                  </td>
                  <td className="px-2.5 py-2.5 align-top text-[var(--ink-secondary)]">
                    sein, stehen, liegen, sitzen, hängen, wohnen
                  </td>
                  <td className="px-2.5 py-2.5 align-top">
                    Das Buch liegt auf <strong>dem</strong> Tisch.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-[0_4px_18px_rgb(30_45_36/0.05)]">
          <p className="mb-1 font-mono text-xs font-medium text-[var(--accent-primary)]">
            Everyday Contractions
          </p>
          <h3 className="mb-2 font-serif text-xl font-semibold text-[var(--ink-primary)]">
            Common Preposition + Article Contractions
          </h3>
          <p className="mb-4 text-sm text-[var(--ink-secondary)]">
            In written and spoken German, common prepositions frequently merge with{' '}
            <em>dem</em>, <em>der</em>, or <em>das</em>:
          </p>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {CONTRACTIONS.map((c) => (
              <div
                key={c.form}
                className="flex flex-col rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface-tinted)] px-3.5 py-2.5"
              >
                <strong className="font-serif text-base font-semibold text-[var(--accent-primary)]">
                  {c.form}
                </strong>
                <span className="font-mono text-xs text-[var(--ink-secondary)]">
                  {c.base}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
