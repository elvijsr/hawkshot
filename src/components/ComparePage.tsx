import { useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { LoadingState } from "./LoadingState";
import { AssessmentCard } from "./AssessmentCard";
import type { AssessmentData } from "../utils/mockApi";

interface ComparePageProps {
  onBack: () => void;
}

export function ComparePage({ onBack }: ComparePageProps) {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [loading, setLoading] = useState(false);
  const [assessmentA, setAssessmentA] = useState<AssessmentData | null>(null);
  const [assessmentB, setAssessmentB] = useState<AssessmentData | null>(null);

  const handleCompare = async () => {
    if (!inputA.trim() || !inputB.trim()) return;

    setLoading(true);
    setAssessmentA(null);
    setAssessmentB(null);

    const { assessProduct } = await import("../utils/mockApi");

    try {
      const [resultA, resultB] = await Promise.all([
        assessProduct(inputA),
        assessProduct(inputB),
      ]);
      setAssessmentA(resultA);
      setAssessmentB(resultB);
    } catch (error) {
      console.error("Comparison failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAssessmentA(null);
    setAssessmentB(null);
    setInputA("");
    setInputB("");
  };

  const showResults = assessmentA && assessmentB;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="mb-8 text-center">
          <h1 className="mb-4 text-gray-900">Compare Products</h1>
          <p className="text-gray-600">
            Compare trust scores and security features of two products side-by-side
          </p>
        </div>

        {/* Input Section */}
        {!showResults && (
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="product-a" className="mb-2 block text-sm text-gray-700">
                  Product A
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="product-a"
                    type="text"
                    value={inputA}
                    onChange={(e) => setInputA(e.target.value)}
                    placeholder="e.g., Slack"
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="product-b" className="mb-2 block text-sm text-gray-700">
                  Product B
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="product-b"
                    type="text"
                    value={inputB}
                    onChange={(e) => setInputB(e.target.value)}
                    placeholder="e.g., Notion"
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCompare}
              disabled={!inputA.trim() || !inputB.trim() || loading}
              className="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Comparing..." : "Compare Products"}
            </button>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Quick compare:</span>
              <button
                onClick={() => {
                  setInputA("Slack");
                  setInputB("Notion");
                }}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
              >
                Slack vs Notion
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <LoadingState message="Comparing products..." />
          </div>
        )}

        {/* Results */}
        {showResults && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-gray-900">Comparison Results</h2>
              <button
                onClick={handleReset}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
              >
                New Comparison
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <AssessmentCard assessment={assessmentA} />
              <AssessmentCard assessment={assessmentB} />
            </div>

            {/* Comparison Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-gray-900">Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <span className="text-gray-700">Higher Trust Score</span>
                  <span className="text-gray-900">
                    {assessmentA.trust_score > assessmentB.trust_score
                      ? assessmentA.app_name
                      : assessmentB.trust_score > assessmentA.trust_score
                      ? assessmentB.app_name
                      : "Tied"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <span className="text-gray-700">Higher Confidence</span>
                  <span className="text-gray-900">
                    {assessmentA.confidence > assessmentB.confidence
                      ? assessmentA.app_name
                      : assessmentB.confidence > assessmentA.confidence
                      ? assessmentB.app_name
                      : "Tied"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <span className="text-gray-700">Better Evidence Coverage</span>
                  <span className="text-gray-900">
                    {assessmentA.evidence_coverage > assessmentB.evidence_coverage
                      ? assessmentA.app_name
                      : assessmentB.evidence_coverage > assessmentA.evidence_coverage
                      ? assessmentB.app_name
                      : "Tied"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
