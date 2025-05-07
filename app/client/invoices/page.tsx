'use client';

import { useEffect, useState } from 'react';

type Invoice = {
  id: number;
  title: string;
  fileUrl: string;
  issuedDate: string;
  totalAmount: number;
  projectName: string;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetch('/api/client/invoices')
      .then(res => res.json())
      .then(data => setInvoices(data));
  }, []);

  return (
    <div className="px-6 py-24 max-w-4xl mx-auto text-[var(--color-text-primary)]">
      <h1 className="text-3xl font-semibold mb-8">Your Invoices</h1>
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <ul className="space-y-6">
          {invoices.map(invoice => (
            <li key={invoice.id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium">{invoice.title}</h2>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Project: {invoice.projectName}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Issued on {new Date(invoice.issuedDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Total Amount: £{invoice.totalAmount.toFixed(2)}
                  </p>
                </div>
                <a
                  href={invoice.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-accent)] hover:underline"
                >
                  Download PDF
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
