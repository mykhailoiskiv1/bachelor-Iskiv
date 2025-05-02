import { GalleryHorizontalEnd, Calculator, Newspaper } from 'lucide-react';
import Link from 'next/link';

const buttons = [
  { label: 'Gallery', href: '/gallery', icon: GalleryHorizontalEnd },
  { label: 'Calculator', href: '/calculator', icon: Calculator },
  { label: 'Blog', href: '/blog', icon: Newspaper },
];

export default function QuickAccessButtons() {
  return (
    <section className="bg-[var(--color-background)] py-12 border-y border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-light text-[var(--color-text-primary)] mb-8 tracking-tight">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {buttons.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group block bg-white/5 border border-[var(--color-border)] rounded-xl p-6 transition hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <Icon className="w-6 h-6 text-[var(--color-accent)] group-hover:scale-110 transition" />
                <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
