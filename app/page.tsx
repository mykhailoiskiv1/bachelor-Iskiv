'use client';

import { useState, FormEvent } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch("/api/generate", {
        method: "POST",   
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(data.result.trim());
      } else {
        console.error("API Error:", data.error);
        setResponse("Error: " + data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setResponse("Request failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-gray-950 bg-opacity-80 rounded-3xl shadow-xl p-8 border border-gray-800">
        <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          NextAI Interface
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask the future..."
            className="w-full rounded-lg bg-gray-800 border border-gray-700 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={5}
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity duration-300"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate 🚀"}
          </button>
        </form>
        {response && (
          <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-purple-500">
            <h2 className="text-xl font-semibold mb-2 text-purple-400">AI Response:</h2>
            <p className="whitespace-pre-line">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}