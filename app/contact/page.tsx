import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import FooterMinimal from '@/components/layout/FooterMinimal'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | Construction Company',
  description: 'Get in touch with our construction team. Call, email or visit our office in London.',
}

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2 text-center sm:text-left">Contact</h1>
        <p className="text-[var(--color-text-secondary)] mb-10 text-center sm:text-left">Let’s talk about your next project.</p>

        <div className="grid gap-10 sm:grid-cols-2">
          {/* Left: Info */}
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Book an Appointment</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Every project starts with a conversation. Reach out to us and we’ll guide you from idea to completion.
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              You can contact our team using the information on this page or simply stop by our office.
            </p>
          </div>

          {/* Right: Details */}
          <div className="space-y-6 text-sm">
            <div>
              <div className="flex items-center gap-2 text-[var(--color-accent)] font-medium uppercase tracking-wide text-xs mb-1">
                <MapPin size={16} />
                Location
              </div>
              <p className="text-[var(--color-text-secondary)]">123 Aldgate High St, London EC3N 1AG</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[var(--color-accent)] font-medium uppercase tracking-wide text-xs mb-1">
                <Clock size={16} />
                Office Hours
              </div>
              <p className="text-[var(--color-text-secondary)]">Monday – Friday<br />8AM – 6PM</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[var(--color-accent)] font-medium uppercase tracking-wide text-xs mb-1">
                <Mail size={16} />
                Email
              </div>
              <a href="mailto:info@dreambuild.uk" className="text-[var(--color-text-secondary)] hover:underline">
                info@dreambuild.uk
              </a>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[var(--color-accent)] font-medium uppercase tracking-wide text-xs mb-1">
                <Phone size={16} />
                Phone
              </div>
              <p className="text-[var(--color-text-secondary)]">0203 123 4567<br />07400 987654</p>
            </div>
          </div>
        </div>
      </main>

      <FooterMinimal />
    </>
  )
}
