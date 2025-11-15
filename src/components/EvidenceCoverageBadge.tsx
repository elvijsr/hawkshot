import { Database, TrendingUp } from "lucide-react";

interface EvidenceCoverageBadgeProps {
  coverage: number;
  confidence: number;
}

export function EvidenceCoverageBadge({ coverage, confidence }: EvidenceCoverageBadgeProps) {
  const getConfidenceLabel = (conf: number) => {
    if (conf >= 0.7) return "High";
    if (conf >= 0.4) return "Medium";
    return "Low";
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.7) return "text-green-600 bg-green-50 border-green-200";
    if (conf >= 0.4) return "text-orange-500 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const coveragePercent = Math.round(coverage * 100);
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2">
          <TrendingUp className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-600">Confidence:</span>
          <span className={`rounded px-2 py-0.5 text-sm border ${getConfidenceColor(confidence)}`}>
            {getConfidenceLabel(confidence)}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2">
          <Database className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-600">Evidence Coverage:</span>
          <span className="text-sm text-gray-900">{coveragePercent}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full transition-all duration-1000 ${
                confidence >= 0.7 ? "bg-green-500" : confidence >= 0.4 ? "bg-orange-400" : "bg-red-500"
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${coveragePercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
