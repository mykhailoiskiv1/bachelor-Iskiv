'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

type DeletedInvoice = {
    id: number
    title: string
    projectName: string
    deletedAt: string
}

type Props = {
    onRestored?: () => void
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function DeletedInvoicesList({ onRestored }: Props) {
    const { data: invoices, error, mutate: localMutate } = useSWR<DeletedInvoice[]>('/api/admin/invoices/deleted', fetcher)
    const [restoringId, setRestoringId] = useState<number | null>(null)

    const handleRestore = async (id: number) => {
        try {
            setRestoringId(id)
            await axios.patch(`/api/admin/invoices/${id}/restore`)
            localMutate()
            onRestored?.()
        } catch (err) {
            console.error('Failed to restore invoice:', err)
            alert('Failed to restore invoice.')
        } finally {
            setRestoringId(null)
        }
    }

    if (error) return <div className="text-red-500">Failed to load deleted invoices</div>
    if (!invoices) return <div>Loading...</div>

    return (
        <div className="mt-6">
            {invoices.length === 0 ? (
                <p className="text-gray-500">No deleted invoices.</p>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {invoices.map(invoice => (
                        <div
                            key={invoice.id}
                            className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{invoice.title}</h3>
                                <p className="text-sm text-gray-500">{invoice.projectName}</p>
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
    )
}
