import { useState, useEffect } from "react";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { TrustScoreDial } from "./TrustScoreDial";
import { RiskLabel } from "./RiskLabel";
import { compareProducts, type CompareTool, type ApiError } from "../utils/api";

interface ComparePageProps {
  category: string;
  onBack: () => void;
  onSelectTool: (tool: CompareTool) => void;
}

export function ComparePage({ category, onBack, onSelectTool }: ComparePageProps) {
  const [tools, setTools] = useState<CompareTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompareData = async () => {
      if (!category) {
        setError("No category provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await compareProducts(category);
        setTools(results);
      } catch (err) {
        console.error("Comparison failed:", err);
        const apiError = err as ApiError;
        setError(
          apiError.message ||
            "Failed to load comparison. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompareData();
  }, [category]);

  const getToolName = (tool: CompareTool): string => {
    return tool.app_name || tool.product || tool.vendor_name || tool.name || "Unknown Tool";
  };

  const getVendorName = (tool: CompareTool): string => {
    return tool.vendor_name || tool.vendor || "";
  };

  const getRiskLabel = (score: number): string => {
    if (score >= 70) return "Lower Risk";
    if (score >= 40) return "Medium Risk";
    return "High Risk";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-gray-600">Loading comparison...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="rounded-xl border border-red-200 bg-red-50 p-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold text-red-900">Comparison Failed</h2>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="p-4">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Compare Tools: {category}</h1>
            <p className="text-gray-600">
              <span className="font-semibold">{tools.length} previously searched</span>{" "}
              {tools.length === 1 ? "tool" : "tools"} found in this category
            </p>
          </div>

          {tools.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <p className="text-gray-600">No tools found in this category.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool, index) => {
                const toolName = getToolName(tool);
                const vendorName = getVendorName(tool);
                const trustScore = tool.trust_score ?? 0;
                const riskLabel = tool.risk_label || getRiskLabel(trustScore);

                return (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onSelectTool(tool)}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-center w-full">
                        <h3 className="text-lg font-semibold text-gray-900">{toolName}</h3>
                        {vendorName && <p className="mt-1 text-sm text-gray-600">{vendorName}</p>}
                      </div>

                      {trustScore > 0 && (
                        <>
                          <TrustScoreDial score={trustScore} size="md" animated={false} />
                          <RiskLabel score={trustScore} label={riskLabel} size="md" />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
