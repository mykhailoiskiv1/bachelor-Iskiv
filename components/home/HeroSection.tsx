export default function HeroSection() {
    return (
      <section className="flex flex-col items-center text-center bg-gradient-to-b from-blue-500 to-blue-700 text-white p-6 rounded-b-3xl">
        <h1 className="text-3xl font-bold mb-4">Welcome to Dream Construction</h1>
        <p className="mb-6 max-w-xs">
          Quality renovations, electrical works, and plumbing — all in one place.
        </p>
        <button className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-full shadow-md hover:bg-gray-100 transition">
          Calculate Your Project
        </button>
      </section>
    );
  }
  