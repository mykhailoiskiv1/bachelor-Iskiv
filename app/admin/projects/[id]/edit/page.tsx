'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import ProjectForm from '@/components/admin/projects/ProjectForm'
import type { Project } from '@/types/project'

export default function EditProjectPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [initialData, setInitialData] = useState<Project | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/admin/projects/${id}`)
        setInitialData(res.data)
      } catch (err) {
        console.error(err)
        setError('Failed to load project data.')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {loading && (
        <p className="text-center text-gray-500 text-sm">Loading project...</p>
      )}

      {!loading && error && (
        <p className="text-center text-red-600 text-sm">{error}</p>
      )}

      {!loading && !error && initialData && (
        <ProjectForm
          mode="edit"
          projectId={Number(id)}
          initialData={initialData}
        />
      )}
    </main>
  )
}
