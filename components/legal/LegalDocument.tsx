import type { ReactNode } from "react";

export interface LegalSection {
  title: string;
  body: ReactNode;
}

interface LegalDocumentProps {
  eyebrow: string;
  /** First word of the headline (rendered solid). */
  titleLead: string;
  /** Second word (rendered as a red outlined accent). */
  titleAccent: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
}

/**
 * Shared shell for the legal pages (Privacy Policy, Terms of Service).
 * Title band + numbered, readable sections — matches the site's
 * typographic, black-and-red aesthetic.
 */
export function LegalDocument({
  eyebrow,
  titleLead,
  titleAccent,
  intro,
  lastUpdated,
  sections,
}: LegalDocumentProps) {
  return (
    <article className="max-w-screen-2xl mx-auto px-6 lg:px-12">
      {/* Title band */}
      <header className="border-b border-border pt-16 pb-10">
        <span className="chip">
          <span className="inline-block h-1.5 w-1.5 bg-primary" />
          {eyebrow}
        </span>
        <h1
          className="mt-5 text-foreground uppercase leading-[0.86] tracking-[-0.03em]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(44px, 8vw, 92px)" }}
        >
          {titleLead}{" "}
          <span style={{ color: "transparent", WebkitTextStroke: "1.5px var(--primary)" }}>
            {titleAccent}
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground text-[15px] leading-relaxed">{intro}</p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Last updated: {lastUpdated}
        </p>
      </header>

      {/* Body */}
      <div className="max-w-3xl py-14 space-y-12">
        {sections.map(({ title, body }, i) => (
          <section key={title} className="space-y-4 scroll-mt-24">
            <h2
              className="flex items-baseline gap-3 text-foreground uppercase"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(19px, 2.2vw, 25px)", letterSpacing: "-0.01em" }}
            >
              <span className="font-mono text-sm text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              {title}
            </h2>
            <div className="text-muted-foreground text-[15px] leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
              {body}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
