import { ShieldCheck, Hammer, Smile } from 'lucide-react';

const features = [
  { title: 'Trusted Professionals', description: 'Over 10 years of experience.', icon: ShieldCheck },
  { title: 'High-Quality Work', description: 'We use premium materials.', icon: Hammer },
  { title: 'Customer Satisfaction', description: 'Hundreds of happy clients.', icon: Smile },
];

export default function AboutCompany() {
  return (
    <section className="p-4 bg-gray-50 rounded-xl mx-2 my-6">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-700">About Our Company</h2>
      <p className="text-center text-gray-600 mb-6">
        We deliver top-notch construction, electrical, and plumbing services across the region.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-around">
        {features.map(({ title, description, icon: Icon }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon className="w-8 h-8 text-blue-600 shrink-0" />
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
