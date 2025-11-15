import React from "react";
import { Check, X } from "lucide-react";
import { TrustScoreDial } from "./TrustScoreDial";
import { RiskLabel } from "./RiskLabel";
import type { AssessmentData } from "../utils/mockApi";

interface AssessmentCardProps {
  assessment: AssessmentData;
}

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6 flex flex-col items-center gap-4">
        <h3 className="text-center text-lg font-semibold text-gray-900">{assessment.app_name}</h3>
        <p className="text-center text-sm text-gray-600">{assessment.vendor_name}</p>
        <TrustScoreDial score={assessment.trust_score} size="md" animated={false} />
        <RiskLabel score={assessment.trust_score} label={assessment.risk_label} size="sm" />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">Security Controls</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">SSO</span>
              {assessment.scoring_breakdown.identity >= 0.7 ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">MFA</span>
              {assessment.scoring_breakdown.controls >= 0.6 ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">RBAC</span>
              {assessment.scoring_breakdown.controls >= 0.7 ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Audit Logs</span>
              {assessment.scoring_breakdown.transparency >= 0.6 ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">Score Breakdown</h4>
          <div className="space-y-1.5">
            {Object.entries(assessment.scoring_breakdown).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="capitalize font-medium text-gray-600">{key.replace(/_/g, " ")}</span>
                <span className="font-semibold text-gray-900">{Math.round(value * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
