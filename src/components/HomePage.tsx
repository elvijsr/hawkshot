import { useState } from "react";
import { Search, AlertCircle, Loader2 } from "lucide-react";
import type { AssessmentData } from "../utils/api";
import { assessProduct, type ApiError } from "../utils/api";

interface HomePageProps {
  onAssess: (assessment: AssessmentData, rawResponse?: unknown) => void;
}

export function HomePage({ onAssess }: HomePageProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssess = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const result = await assessProduct(input);
      // Get raw response from the result if available, otherwise use result itself
      const rawResponse = (result as any)._rawResponse || result;
      onAssess(result, rawResponse);
    } catch (err) {
      console.error("Assessment failed:", err);
      const apiError = err as ApiError;
      setError(
        apiError.message || 
        "Failed to assess product. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAssess();
    }
  };

  const examples = [
    { label: "Slack", value: "Slack" },
    { label: "Notion", value: "Notion" },
    { label: "GitHub Repo", value: "https://github.com/vercel/next.js" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-homepage-gradient p-4 w-full">
      <div className="w-full max-w-3xl space-y-4">
        <div className="mb-10 text-center gap-2">
          <div className="mb-5 inline-flex items-center gap-3 justify-center">
            <div className="text-2xl font-semibold">
              Evaluate the Safety of Any SaaS Product
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg relative overflow-hidden">
          <label htmlFor="product-input" className="mb-3 block text-sm font-medium text-gray-700">
            Product name or URL
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-opacity ${loading ? 'opacity-50' : ''}`} />
              <input
                id="product-input"
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null);
                }}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Slack, or https://github.com/vercel/next.js"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 disabled:cursor-wait"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleAssess}
              disabled={!input.trim() || loading}
              className="rounded-lg bg-black px-8 py-3 font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                "Shoot!"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-2 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Assessment Failed</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Try:</span>
            {examples.map((example) => (
              <button
                key={example.label}
                onClick={() => setInput(example.value)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {example.label}
              </button>
            ))}
          </div>
      </div>
    </div>
  );
}
