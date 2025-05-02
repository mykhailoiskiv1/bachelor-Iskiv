'use client'

import { useEffect, useState } from 'react'
import { Review } from '@/types/review'
import ReviewFormModal from '@/components/client/reviews/ReviewFormModal.tsx'

const REVIEWS_PER_PAGE = 3

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
  }, [])

  const refreshReviews = async () => {
    const res = await fetch('/api/reviews')
    const data = await res.json()
    setReviews(data)
  }

  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE
  const endIndex = startIndex + REVIEWS_PER_PAGE
  const currentReviews = reviews.slice(startIndex, endIndex)
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE)

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center">
          <h2 className="text-3xl font-light text-[var(--color-text-primary)] mb-2">
            What Our Clients Say
          </h2>
          <p className="text-[var(--color-text-secondary)] text-md">
            Still unsure? Read what our clients think about working with us.
          </p>

          <button
            className="mt-6 px-5 py-2 text-sm font-medium bg-[var(--color-button-bg)] text-[var(--color-button-text)] rounded-full hover:bg-[var(--color-button-hover-bg)] transition"
            onClick={() => setOpenModal(true)}
          >
            Leave a Review
          </button>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {currentReviews.map((review) => (
            <div key={review.id} className="relative pl-4 border-l border-[var(--color-border)]">
              <p className="text-lg font-medium text-[var(--color-text-primary)] mb-1">
                {review.clientName}
              </p>
              <p className="text-[var(--color-accent)] mb-2">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </p>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {review.content}
              </p>
              {review.companyReply && (
                <p className="text-sm text-[var(--color-text-secondary)] mt-3 italic">
                  Reply: {review.companyReply}
                </p>
              )}
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="text-sm text-[var(--color-accent)] hover:underline disabled:opacity-30"
            >
              ← Prev
            </button>
            <span className="text-sm text-[var(--color-text-secondary)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="text-sm text-[var(--color-accent)] hover:underline disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {openModal && (
        <ReviewFormModal
          onClose={() => {
            setOpenModal(false)
            refreshReviews()
          }}
        />
      )}
    </section>
  )
}
