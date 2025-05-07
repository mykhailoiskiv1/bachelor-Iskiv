'use client'

import { X, Download } from 'lucide-react'
import type { Invoice } from '@/types'

type Props = {
    invoice: Invoice
    onClose: () => void
}

export default function InvoiceDetailsModal({ invoice, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative animate-fade-in-up space-y-4">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] text-center">
                    Invoice Details
                </h2>

                <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                    <p><strong className="text-[var(--color-text-primary)]">Title:</strong> {invoice.title}</p>
                    <p><strong className="text-[var(--color-text-primary)]">Project:</strong> {invoice.projectName}</p>
                    <p><strong className="text-[var(--color-text-primary)]">Client:</strong> {invoice.client.name}</p>
                    <p><strong className="text-[var(--color-text-primary)]">Issued:</strong> {new Date(invoice.issuedDate).toLocaleDateString()}</p>
                    <p><strong className="text-[var(--color-text-primary)]">Amount:</strong> £{invoice.totalAmount.toFixed(2)}</p>
                </div>

                <div className="text-center pt-4">
                    <a
                        href={invoice.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-button-hover-bg)] text-sm"
                    >
                        <Download size={16} />
                        Download PDF
                    </a>
                </div>
            </div>

            <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    )
}
