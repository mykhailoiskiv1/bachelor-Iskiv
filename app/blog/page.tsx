'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import FooterMinimal from '@/components/layout/FooterMinimal'

interface BlogPost {
  id: string
  title: string
  category: string
  seoDescription?: string
  content: string
  slug: string
  imagePath: string
  createdAt?: string
}

export default function BlogPageWrapper() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetch('/api/public/blog')
      .then(res => res.json())
      .then(setPosts)
  }, [])

  const uniqueCategories = ['All', ...Array.from(new Set(posts.map(p => p.category)))]

  const filteredPosts = posts.filter(post => {
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.seoDescription?.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'All' || post.category === category
    return matchSearch && matchCategory
  })

  return (
    <>
      <Header />
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-20 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center">
            <h1 className="text-4xl font-light text-[var(--color-text-primary)]">Blog & Insights</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Practical renovation tips, company updates, and smart ideas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 border border-[var(--color-border)] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full sm:w-48 border border-[var(--color-border)] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-accent)]"
            >
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-24">
            {filteredPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block w-full"
              >
                <div
                  className={`flex flex-col lg:flex-row items-center gap-10 relative
                  ${index % 2 === 0 && index !== 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  {index !== 0 && (
                    <div className="absolute left-4 top-4 w-2/3 h-64 bg-[var(--color-accent)] opacity-5 blur-3xl rounded-xl -z-10 hidden lg:block" />
                  )}

                  <div className={`w-full lg:w-1/2 transform ${index !== 0 ? 'rotate-[-1deg] group-hover:rotate-0' : ''} transition-transform duration-300`}>
                    <div className="overflow-hidden rounded-2xl shadow-md">
                      <img
                        src={post.imagePath}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2 space-y-4 text-left">
                    <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-[var(--color-accent)] text-[var(--color-button-text)] rounded-md shadow-sm">
                      {post.category}
                    </span>
                    <h2 className={`text-${index === 0 ? '4xl' : '2xl'} font-semibold text-[var(--color-text-primary)] leading-tight group-hover:text-[var(--color-accent)] transition-colors`}>
                      {post.title}
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
                      {post.seoDescription?.slice(0, 180) ?? post.content.slice(0, 180)}...
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            {filteredPosts.length === 0 && (
              <p className="text-center text-sm text-[var(--color-text-secondary)] mt-10">
                No articles found.
              </p>
            )}
          </div>
        </div>
      </section>
      <FooterMinimal />
    </>
  )
}
