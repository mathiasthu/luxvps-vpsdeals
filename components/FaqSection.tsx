interface FaqSectionProps {
  entries: { q: string; a: string }[];
  heading?: string;
  className?: string;
}

/**
 * Visible FAQ. Always render this alongside the FAQPage JSON-LD built from the same
 * entries — Google ignores FAQ markup whose answers aren't on the page.
 */
export default function FaqSection({
  entries,
  heading = 'Frequently Asked Questions',
  className = '',
}: FaqSectionProps) {
  if (entries.length === 0) return null;

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-5">{heading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((entry) => (
          <details
            key={entry.q}
            className="group bg-brand-card border border-brand-border rounded-xl px-5 py-4 open:border-brand-border-light transition-colors"
          >
            <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-brand-text font-semibold text-sm">
              <h3 className="font-semibold">{entry.q}</h3>
              <svg
                className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-muted transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="text-brand-muted text-sm leading-relaxed mt-3">{entry.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
