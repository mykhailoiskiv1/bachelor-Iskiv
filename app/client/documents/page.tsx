'use client';

import useSWR from 'swr';
import axios from 'axios';
import { FileText, ShieldCheck } from 'lucide-react';

type Warranty = {
  id: number;
  projectName: string;
  startDate: string;
  durationMonths: number;
};

type Certificate = {
  id: number;
  title: string;
  fileUrl: string;
  issuedDate: string;
};

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function DocumentsPage() {
  const { data: warranties } = useSWR<Warranty[]>('/api/client/warranties', fetcher);
  const { data: certificates } = useSWR<Certificate[]>('/api/client/certificates', fetcher);

  const calculateRemainingDays = (startDate: string, durationMonths: number) => {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);
    const diffTime = endDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Expired';
  };

  return (
    <main className="bg-[var(--color-background)] text-[var(--color-text-primary)] px-6 py-24">
      <div className="max-w-4xl mx-auto space-y-24">
        <section>
          <header className="text-center mb-12">
            <ShieldCheck className="w-8 h-8 mx-auto text-[var(--color-accent)] mb-4" />
            <h2 className="text-3xl font-light tracking-tight">Your Guarantees</h2>
          </header>

          {warranties && warranties.length > 0 ? (
            <ul className="space-y-10">
              {warranties.map(w => (
                <li key={w.id} className="border-l-2 border-[var(--color-accent)] pl-6">
                  <h3 className="text-lg font-semibold mb-1">{w.projectName}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Started: {new Date(w.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Status: {calculateRemainingDays(w.startDate, w.durationMonths)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-[var(--color-text-secondary)]">No active guarantees found.</p>
          )}
        </section>

        <section>
          <header className="text-center mb-12">
            <FileText className="w-8 h-8 mx-auto text-[var(--color-accent)] mb-4" />
            <h2 className="text-3xl font-light tracking-tight">Your Certificates</h2>
          </header>

          {certificates && certificates.length > 0 ? (
            <ul className="space-y-10">
              {certificates.map(c => (
                <li key={c.id} className="border-l-2 border-[var(--color-accent)] pl-6">
                  <h3 className="text-lg font-semibold mb-1">{c.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Issued: {new Date(c.issuedDate).toLocaleDateString()}
                  </p>
                  <a
                    href={c.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm font-medium text-[var(--color-accent)] hover:underline"
                  >
                    View PDF →
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-[var(--color-text-secondary)]">No certificates available.</p>
          )}
        </section>
      </div>
    </main>
  );
}
