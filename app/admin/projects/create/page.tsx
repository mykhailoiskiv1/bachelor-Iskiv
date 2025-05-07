'use client'

import ProjectForm from '@/components/admin/projects/ProjectForm'

export default function CreateProjectPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light tracking-tight text-[var(--color-text-primary)] mb-8">
        Create New Project
      </h1>
      <ProjectForm mode="create" />
    </main>
  )
}
