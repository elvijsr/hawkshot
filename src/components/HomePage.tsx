import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import type { AssessmentData } from "../utils/mockApi";

interface HomePageProps {
  onAssess: (assessment: AssessmentData) => void;
}

export function HomePage({ onAssess }: HomePageProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssess = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const { assessProduct } = await import("../utils/mockApi");
    
    try {
      const result = await assessProduct(input);
      onAssess(result);
    } catch (error) {
      console.error("Assessment failed:", error);
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
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700">
            <Sparkles className="h-4 w-4" />
            Evidence-Based Security Assessment
          </div>
          <h1 className="mb-4 text-gray-900">
            Evaluate the Safety of Any SaaS Product
          </h1>
          <p className="text-gray-600">
            Get comprehensive trust scores based on vendor reputation, vulnerabilities,
            compliance, and security controls.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <label htmlFor="product-input" className="mb-2 block text-sm text-gray-700">
            Product Name or GitHub URL
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="product-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Slack, or https://github.com/vercel/next.js"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleAssess}
              disabled={!input.trim() || loading}
              className="rounded-lg bg-blue-600 px-8 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Assessing..." : "Assess"}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Try:</span>
            {examples.map((example) => (
              <button
                key={example.label}
                onClick={() => setInput(example.value)}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="mb-2 text-2xl">🔍</div>
            <h3 className="mb-2 text-gray-900">Deep Analysis</h3>
            <p className="text-sm text-gray-600">
              Comprehensive evaluation of security posture, compliance, and risk factors
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="mb-2 text-2xl">📊</div>
            <h3 className="mb-2 text-gray-900">Evidence-Based</h3>
            <p className="text-sm text-gray-600">
              Scores derived from public data, CVEs, incidents, and compliance certifications
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="mb-2 text-2xl">⚡</div>
            <h3 className="mb-2 text-gray-900">Instant Results</h3>
            <p className="text-sm text-gray-600">
              Get detailed security assessments and trust scores in seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
