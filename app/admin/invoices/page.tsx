'use client'

import { useState } from 'react'
import AddInvoiceModal from '@/components/admin/invoices/AddInvoiceModal'
import DeletedInvoicesModal from '@/components/admin/invoices/DeletedInvoicesModal'
import InvoiceList from '@/components/admin/invoices/InvoiceList'
import { Plus, Trash2 } from 'lucide-react'
import { mutate } from 'swr'


export default function AdminInvoicesPage() {
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDeletedModal, setShowDeletedModal] = useState(false)

    const refreshInvoices = () => mutate('/api/admin/invoices')

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h1 className="text-3xl font-light tracking-tight text-[var(--color-text-primary)] text-center sm:text-left">
                    Manage Invoices
                </h1>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                    <button
                        onClick={() => setShowDeletedModal(true)}
                        className="flex items-center gap-2 border border-red-500 text-red-600 hover:bg-red-50 px-4 py-2 rounded-full text-sm transition"
                    >
                        <Trash2 size={16} />
                        Show Deleted
                    </button>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-button-hover-bg)] text-white px-4 py-2 rounded-full text-sm shadow"
                    >
                        <Plus size={16} />
                        Add Invoice
                    </button>
                </div>
            </div>

            <InvoiceList />

            {showAddModal && (
                <AddInvoiceModal
                    onClose={() => setShowAddModal(false)}
                    onCreated={refreshInvoices}
                />
            )}

            {showDeletedModal && (
                <DeletedInvoicesModal
                    onClose={() => setShowDeletedModal(false)}
                    onRestored={refreshInvoices}
                />
            )}
        </div>
    )
}
