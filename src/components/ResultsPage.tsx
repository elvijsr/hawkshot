import { ArrowLeft, AlertTriangle } from "lucide-react";
import { TrustScoreDial } from "./TrustScoreDial";
import { RiskLabel } from "./RiskLabel";
import { EvidenceCoverageBadge } from "./EvidenceCoverageBadge";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { AssessmentData } from "../utils/mockApi";

interface ResultsPageProps {
  assessment: AssessmentData;
  onBack: () => void;
}

export function ResultsPage({ assessment, onBack }: ResultsPageProps) {
  const showLowEvidenceWarning = assessment.evidence_coverage < 0.5;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </button>

        {/* Header Section */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{assessment.app_name}</h1>
            <p className="text-lg text-gray-600">{assessment.vendor_name}</p>
            <span className="mt-3 inline-block rounded-full bg-blue-50 border border-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
              {assessment.category}
            </span>
          </div>

          {/* Trust Score Section */}
          <div className="flex flex-col items-center gap-6 border-t border-gray-100 pt-8">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">Trust Score</h2>
              <p className="text-sm text-gray-600">
                Overall security and trustworthiness assessment
              </p>
            </div>

            <TrustScoreDial score={assessment.trust_score} size="lg" animated={true} />
            <RiskLabel score={assessment.trust_score} label={assessment.risk_label} size="lg" />
          </div>

          {/* Confidence and Coverage */}
          <div className="mt-8 border-t border-gray-100 pt-8">
            <EvidenceCoverageBadge
              coverage={assessment.evidence_coverage}
              confidence={assessment.confidence}
            />
          </div>

          {/* Low Evidence Warning */}
          {showLowEvidenceWarning && (
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="text-red-900">Low Evidence Coverage</p>
                <p className="mt-1 text-sm text-red-700">
                  This assessment is based on incomplete public information. Some data sources
                  were unavailable or limited. The trust score may not reflect the full security
                  posture of this product.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Score Breakdown */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Score Breakdown</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(assessment.scoring_breakdown).map(([key, value]) => {
              const percentage = Math.round(value * 100);
              const isHigh = value >= 0.7;
              const isMedium = value >= 0.4 && value < 0.7;
              
              // All metrics follow the same logic: high = good (green), low = bad (red)
              const barColor = isHigh
                ? "bg-green-500"
                : isMedium
                ? "bg-orange-400"
                : "bg-red-500";
              const bgColor = isHigh
                ? "bg-green-50"
                : isMedium
                ? "bg-orange-50"
                : "bg-red-50";
              const borderColor = isHigh
                ? "border-green-200"
                : isMedium
                ? "border-orange-200"
                : "border-red-200";
              
              return (
                <div
                  key={key}
                  className={`rounded-lg border ${borderColor} ${bgColor} p-4 transition-shadow hover:shadow-md`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium capitalize text-gray-700">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-base font-semibold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full ${barColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Assessment */}
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Detailed Assessment</h2>
          <MarkdownRenderer content={assessment.brief_markdown} />
        </div>
      </div>
    </div>
  );
}
