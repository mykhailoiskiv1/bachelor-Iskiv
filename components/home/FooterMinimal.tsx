import { Mail, Phone, MapPin } from 'lucide-react';

export default function FooterMinimal() {
  return (
    <footer className="bg-white text-[var(--color-text-secondary)] text-sm pt-20 pb-12 px-6 sm:px-10 border-t border-[var(--color-border)] relative overflow-hidden">

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-[var(--color-accent)]/5 to-white" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">

        <div className="flex flex-col items-center md:items-start gap-2">
          <h4 className="text-2xl font-light text-[var(--color-text-primary)] tracking-wide">DreamBuild</h4>
          <p className="text-xs text-[var(--color-text-secondary)]">Crafting better spaces, one detail at a time.</p>
        </div>

        <div className="flex flex-col items-center md:items-center gap-2">
          <h5 className="uppercase text-xs font-semibold tracking-wider text-[var(--color-text-primary)] mb-2">
            Our Focus
          </h5>
          <ul className="text-[var(--color-text-secondary)] space-y-1 text-sm">
            <li>✓ Precision & Quality</li>
            <li>✓ Honest Communication</li>
            <li>✓ Long-Term Durability</li>
            <li>✓ Client Satisfaction</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 items-center md:items-end">
          <h5 className="uppercase text-xs font-semibold tracking-wider text-[var(--color-text-primary)] mb-2">
            Contact
          </h5>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>+44 7000 000000</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>hello@dreambuild.com</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>London, UK</span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-[var(--color-text-secondary)] mt-16">
        © 2024 DreamBuild. All rights reserved.
      </div>
    </footer>
  );
}
