'use client'

import useSWR from 'swr'
import axios from 'axios'

type Warranty = {
  id: number
  projectName: string
  startDate: string
  durationMonths: number
}

type Certificate = {
  id: number
  title: string
  fileUrl: string
  issuedDate: string
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function DocumentsPage() {
  const { data: warranties } = useSWR<Warranty[]>('/api/client/warranties', fetcher)
  const { data: certificates } = useSWR<Certificate[]>('/api/client/certificates', fetcher)

  const calculateRemainingDays = (startDate: string, durationMonths: number) => {
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + durationMonths)
    const diffTime = endDate.getTime() - new Date().getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? `${diffDays} days left` : 'Expired'
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Certificates & Guarantees</h1>
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Your Guarantees</h2>
        {warranties && warranties.length > 0 ? (
          warranties.map(w => (
            <div key={w.id} className="border p-4 rounded mb-3">
              <p><strong>Project:</strong> {w.projectName}</p>
              <p><strong>Started:</strong> {new Date(w.startDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {calculateRemainingDays(w.startDate, w.durationMonths)}</p>
            </div>
          ))
        ) : (
          <p>No active guarantees found.</p>
        )}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Certificates</h2>
        {certificates && certificates.length > 0 ? (
          certificates.map(c => (
            <div key={c.id} className="border p-4 rounded mb-3 flex justify-between items-center">
              <div>
                <div>
                  <p><strong>{c.title}</strong></p>
                  <p className="text-sm text-gray-500">Issued: {new Date(c.issuedDate).toLocaleDateString()}</p>
                </div>
                <a href={c.fileUrl} target="_blank" className="text-blue-600 hover:underline">View PDF</a>
              </div>
            </div>
          ))
        ) : (
          <p>No certificates available.</p>
        )}
      </section>
    </div>
  )
}
