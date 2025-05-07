'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useState, useMemo } from 'react'
import { Trash2, Download, Pencil, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import EditInvoiceModal from './EditInvoiceModal'
import InvoiceDetailsModal from './InvoiceDetailsModal'

type Invoice = {
    id: number
    title: string
    fileUrl: string
    issuedDate: string
    totalAmount: number
    projectName: string
    client: {
        id: string
        name: string
    }
}

type Client = {
    id: string
    name: string
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function InvoiceList() {
    const { data: invoices, error, mutate } = useSWR<Invoice[]>('/api/admin/invoices', fetcher)
    const { data: clients } = useSWR<Client[]>('/api/admin/clients/all', fetcher)

    const [search, setSearch] = useState('')
    const [clientFilter, setClientFilter] = useState('')
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'title'>('date')
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

    const sortedInvoices = useMemo(() => {
        const filtered = (invoices ?? []).filter(inv => {
            const matchSearch =
                inv.title.toLowerCase().includes(search.toLowerCase()) ||
                inv.projectName.toLowerCase().includes(search.toLowerCase()) ||
                new Date(inv.issuedDate).toLocaleDateString().includes(search)
            const matchClient = clientFilter ? inv.client?.id === clientFilter : true
            return matchSearch && matchClient
        })

        return filtered.sort((a, b) => {
            if (sortBy === 'amount') return b.totalAmount - a.totalAmount
            if (sortBy === 'title') return a.title.localeCompare(b.title)
            return new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
        })
    }, [invoices, search, clientFilter, sortBy])

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this invoice?')) return
        try {
            setDeletingId(id)
            await axios.patch(`/api/admin/invoices/${id}/delete`)
            toast.success('Invoice deleted')
            mutate()
        } catch {
            toast.error('Error deleting invoice')
        } finally {
            setDeletingId(null)
        }
    }

    if (error) return <p className="text-red-600">Failed to load invoices.</p>
    if (!invoices) {
        return (
            <>
                <div className="hidden sm:block space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse h-12 bg-gray-100 rounded-md" />
                    ))}
                </div>

                <div className="sm:hidden space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse space-y-2 border border-gray-200 bg-white p-4 rounded-xl shadow-sm">
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="h-3 bg-gray-200 rounded w-full" />
                            <div className="h-3 bg-gray-200 rounded w-4/5" />
                            <div className="flex gap-2 pt-2">
                                <div className="h-8 w-20 bg-gray-200 rounded" />
                                <div className="h-8 w-20 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )
    }


    return (
        <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search invoices..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:max-w-xs border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                />

                <select
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="w-full sm:max-w-xs border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                >
                    <option value="">All Clients</option>
                    {clients?.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'title')}
                    className="w-full sm:max-w-xs border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                    <option value="title">Sort by Title</option>
                </select>
            </div>
            <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium">
                        <tr>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2 hidden md:table-cell">Project</th>
                            <th className="px-4 py-2 hidden lg:table-cell">Issued</th>
                            <th className="px-4 py-2 hidden lg:table-cell">Amount</th>
                            <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedInvoices.map(invoice => (
                            <tr key={invoice.id} className="border-t hover:bg-gray-50 transition">
                                <td className="px-4 py-2 font-medium text-[var(--color-text-primary)]">{invoice.title}</td>
                                <td className="px-4 py-2 hidden md:table-cell text-[var(--color-text-secondary)]">{invoice.projectName}</td>
                                <td className="px-4 py-2 hidden lg:table-cell text-[var(--color-text-secondary)]">
                                    {new Date(invoice.issuedDate).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 hidden lg:table-cell text-[var(--color-text-secondary)]">
                                    £{invoice.totalAmount.toFixed(2)}
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <div className="flex justify-end gap-3">
                                        <a
                                            href={invoice.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[var(--color-accent)] hover:underline text-sm flex items-center gap-1"
                                        >
                                            <Download size={16} />
                                            Download
                                        </a>
                                        <button
                                            onClick={() => setSelectedInvoice(invoice)}
                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>
                                        <button
                                            onClick={() => setEditingInvoice(invoice)}
                                            className="text-yellow-600 hover:text-yellow-700 text-sm flex items-center gap-1"
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(invoice.id)}
                                            disabled={deletingId === invoice.id}
                                            className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                                        >
                                            <Trash2 size={16} className={deletingId === invoice.id ? 'animate-spin' : ''} />
                                            {deletingId === invoice.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden space-y-4">
                {sortedInvoices.map(invoice => (
                    <div key={invoice.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-2">
                        <div>
                            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                                {invoice.title}
                            </h3>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Issued: {new Date(invoice.issuedDate).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="text-sm text-[var(--color-text-secondary)] space-y-1">
                            <p><strong>Project:</strong> {invoice.projectName}</p>
                            <p><strong>Total:</strong> £{invoice.totalAmount.toFixed(2)}</p>
                            <p><strong>Client:</strong> {invoice.client.name}</p>
                        </div>

                        <div className="pt-3 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setEditingInvoice(invoice)}
                                    className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700"
                                >
                                    <Pencil size={16} />
                                    Edit
                                </button>
                            </div>
                            <div className="flex justify-between">
                                <a
                                    href={invoice.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-[var(--color-accent)] hover:underline"
                                >
                                    <Download size={16} />
                                    Download
                                </a>
                                <button
                                    onClick={() => handleDelete(invoice.id)}
                                    disabled={deletingId === invoice.id}
                                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                                >
                                    <Trash2 size={16} className={deletingId === invoice.id ? 'animate-spin' : ''} />
                                    {deletingId === invoice.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingInvoice && (
                <EditInvoiceModal
                    invoice={editingInvoice}
                    onClose={() => setEditingInvoice(null)}
                    onUpdated={mutate}
                />
            )}

            {selectedInvoice && (
                <InvoiceDetailsModal
                    invoice={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}
        </>
    )
}
