export default function BlogLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </section>
    )
  }