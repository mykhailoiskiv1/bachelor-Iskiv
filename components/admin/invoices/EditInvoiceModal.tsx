'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

type Invoice = {
    id: number
    title: string
    projectName: string
    totalAmount: number
}

type Props = {
    invoice: Invoice
    onClose: () => void
    onUpdated: () => void
}

export default function EditInvoiceModal({ invoice, onClose, onUpdated }: Props) {
    const [form, setForm] = useState(invoice)
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: name === 'totalAmount' ? parseFloat(value) : value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await axios.put(`/api/admin/invoices/${invoice.id}`, form)
            toast.success('Invoice updated')
            onUpdated()
            onClose()
        } catch (err) {
            console.error(err)
            toast.error('Failed to update invoice')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative animate-fade-in-up space-y-5"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-center text-[var(--color-text-primary)]">
                    Edit Invoice
                </h2>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                        Invoice Title
                    </label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                        Project Name
                    </label>
                    <input
                        name="projectName"
                        value={form.projectName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                        Total Amount (£)
                    </label>
                    <input
                        name="totalAmount"
                        type="number"
                        value={form.totalAmount}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-button-hover-bg)] text-white py-2 rounded-full flex justify-center items-center gap-2 transition"
                >
                    {loading && <Loader2 className="animate-spin w-4 h-4" />}
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>

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
