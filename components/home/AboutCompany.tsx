import { ShieldCheck, Hammer, Smile } from 'lucide-react';

const features = [
  {
    title: 'Trusted Professionals',
    description: 'Over 10 years of experience.',
    icon: ShieldCheck,
  },
  {
    title: 'High-Quality Work',
    description: 'We use premium materials.',
    icon: Hammer,
  },
  {
    title: 'Customer Satisfaction',
    description: 'Hundreds of happy clients.',
    icon: Smile,
  },
];

export default function AboutCompany() {
  return (
    <section className="bg-[var(--color-background)] py-24 px-6 sm:px-10 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-light tracking-tight text-[var(--color-text-primary)] mb-6">
          Crafting Spaces with Precision
        </h2>
        <p className="text-md text-[var(--color-text-secondary)] max-w-xl mx-auto mb-16 leading-relaxed">
          Our company blends modern design, durability, and client focus to deliver exceptional construction, electrical, and plumbing results.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-left">
          {features.map(({ title, description, icon: Icon }) => (
            <div key={title} className="group pl-5 relative">
              {/* Decorative vertical line */}
              <div className="absolute left-0 top-0 h-full w-[2px] bg-[var(--color-border)] group-hover:bg-[var(--color-accent)] transition-colors" />
              <Icon className="w-6 h-6 text-[var(--color-accent)] mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                {title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
