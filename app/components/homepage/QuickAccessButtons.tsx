import { GalleryHorizontalEnd, Calculator, Newspaper } from 'lucide-react';
import Link from 'next/link';

const buttons = [
  { label: 'Gallery', href: '/gallery', icon: GalleryHorizontalEnd },
  { label: 'Calculator', href: '/calculator', icon: Calculator },
  { label: 'Blog', href: '/blog', icon: Newspaper },
];

export default function QuickAccessButtons() {
  return (
    <section className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Quick Access</h2>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {buttons.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 px-4 py-2 bg-blue-600 text-white rounded-full justify-center hover:bg-blue-700 transition"
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
