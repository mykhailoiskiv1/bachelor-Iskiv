import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-[var(--color-header-bg)] text-[var(--color-text-primary)] py-32 px-6 border-b border-[var(--color-border)] relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-5 bg-gradient-to-br from-[var(--color-accent)] to-white pointer-events-none" />
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight leading-snug mb-6">
          Welcome to <span className="font-semibold">Dream Construction</span>
        </h1>
        <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10">
          Premium renovations, electrical installations, and plumbing — all under one roof.
        </p>
        <Link href="/cost-calculator">
          <button className="inline-block bg-[var(--color-button-bg)] text-[var(--color-button-text)] px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-[var(--color-button-hover-bg)] transition-all duration-300">
            Calculate Your Project
          </button>
        </Link>
      </div>
    </section>
  );
}
