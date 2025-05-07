'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Loader2, X } from 'lucide-react'

interface Client {
    id: string
    name: string
}

interface AddInvoiceModalProps {
    onClose: () => void
    onCreated: () => void
}

export default function AddInvoiceModal({ onClose, onCreated }: AddInvoiceModalProps) {
    const [clients, setClients] = useState<Client[]>([])
    const [form, setForm] = useState({
        clientId: '',
        title: '',
        projectName: '',
        totalAmount: '',
        file: null as File | null,
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        axios
            .get('/api/admin/clients/all')
            .then((res) => setClients(res.data))
            .catch(() => toast.error('Failed to fetch clients'))
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setForm((prev) => ({ ...prev, file }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.file) return toast.error('Please select a PDF file')
        setLoading(true)

        const formData = new FormData()
        formData.append('clientId', form.clientId)
        formData.append('title', form.title)
        formData.append('projectName', form.projectName)
        formData.append('totalAmount', form.totalAmount)
        formData.append('file', form.file)

        try {
            await axios.post('/api/admin/invoices/upload', formData)
            toast.success('Invoice created successfully!')
            onCreated()
            onClose()
        } catch (err) {
            console.error(err)
            toast.error('Failed to upload invoice.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative animate-fade-in-up space-y-4"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-center text-[var(--color-text-primary)]">Create Invoice</h2>

                <select
                    name="clientId"
                    value={form.clientId}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Invoice Title"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />

                <input
                    name="projectName"
                    value={form.projectName}
                    onChange={handleChange}
                    placeholder="Project Name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />

                <input
                    name="totalAmount"
                    value={form.totalAmount}
                    onChange={handleChange}
                    placeholder="Total Amount in GBP"
                    type="number"
                    min="0"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-accent)] file:text-white hover:file:bg-[var(--color-button-hover-bg)]"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-button-hover-bg)] text-white py-2 rounded-full flex justify-center items-center gap-2 transition"
                >
                    {loading && <Loader2 className="animate-spin w-4 h-4" />}
                    {loading ? 'Creating...' : 'Create Invoice'}
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
