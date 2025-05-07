'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'
import { RotateCcw, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface DeletedInvoicesModalProps {
    onClose: () => void
    onRestored: () => void
}

type Invoice = {
    id: number
    title: string
    projectName: string
    deletedAt: string
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function DeletedInvoicesModal({ onClose, onRestored }: DeletedInvoicesModalProps) {
    const { data: invoices = [], error, mutate } = useSWR<Invoice[]>('/api/admin/invoices/deleted', fetcher)
    const [restoringId, setRestoringId] = useState<number | null>(null)

    const handleRestore = async (id: number) => {
        try {
            setRestoringId(id)
            await axios.patch(`/api/admin/invoices/${id}/restore`)
            toast.success('Invoice restored')
            await mutate()
            onRestored()
        } catch (err) {
            console.error('Failed to restore invoice:', err)
            toast.error('Failed to restore invoice')
        } finally {
            setRestoringId(null)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4">
            <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4 text-red-600">Deleted Invoices</h2>

                {error && <p className="text-red-500">Failed to load deleted invoices</p>}
                {!invoices.length && <p className="text-gray-500">No deleted invoices.</p>}

                {invoices.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {invoices.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{invoice.title}</h3>
                                    <p className="text-sm text-gray-500">Project: {invoice.projectName}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Deleted at: {new Date(invoice.deletedAt).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => handleRestore(invoice.id)}
                                        disabled={restoringId === invoice.id}
                                        className="text-green-600 hover:text-green-700 flex items-center gap-1"
                                    >
                                        <RotateCcw size={16} className={restoringId === invoice.id ? 'animate-spin' : ''} />
                                        {restoringId === invoice.id ? 'Restoring...' : 'Restore'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
