import { useState } from "react";
import { ArrowLeft, AlertTriangle, Copy, Check, FileText, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { TrustScoreDial } from "./TrustScoreDial";
import { RiskLabel } from "./RiskLabel";
import { EvidenceCoverageBadge } from "./EvidenceCoverageBadge";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { AssessmentData } from "../utils/api";

interface ResultsPageProps {
  assessment: AssessmentData;
  rawApiResponse?: unknown;
  onBack: () => void;
}

export function ResultsPage({ assessment, rawApiResponse, onBack }: ResultsPageProps) {
  const [copied, setCopied] = useState(false);
  const [rawJsonOpen, setRawJsonOpen] = useState(false);
  const [completeReportOpen, setCompleteReportOpen] = useState(false);
  
  // Safely access fields with fallbacks - check rawApiResponse first since it has the actual data
  // Then fall back to assessment object
  const data = (rawApiResponse as any) || (assessment as any);
  
  // Try multiple field name variations for vendor name
  const vendorName = data?.vendor || 
                     data?.vendor_name || 
                     (assessment as any)?.vendor ||
                     (assessment as any)?.vendor_name || "";
  
  // Try multiple field name variations for app name (supporting both old and new JSON structures)
  // If product is null/empty, fall back to vendor name
  const productName = data?.product || 
                      data?.appName || 
                      data?.app_name || 
                      (assessment as any)?.product ||
                      (assessment as any)?.appName || 
                      (assessment as any)?.app_name || 
                      null;
  
  const appName = (productName && productName !== null && productName !== "") 
                  ? productName 
                  : (vendorName || "Unknown Product");
  
  const domain = data?.website || 
                 data?.domain || 
                 (assessment as any)?.website ||
                 (assessment as any)?.domain || "";
  const category = data?.category || (assessment as any)?.category || "";
  const trustScore = data?.trust_score ?? (assessment as any)?.trust_score ?? 0;
  const confidence = data?.confidence ?? (assessment as any)?.confidence ?? 0;
  const evidenceCoverage = data?.evidence_coverage ?? (assessment as any)?.evidence_coverage ?? 0;
  const scoringBreakdown = data?.scoring_breakdown || (assessment as any)?.scoring_breakdown || {};
  const briefMarkdown = data?.brief_markdown || (assessment as any)?.brief_markdown || "";
  const highlights = data?.highlights || (assessment as any)?.highlights || [];
  const securityEvidence = data?.securityEvidence || (assessment as any)?.securityEvidence || {};
  const cveStats = data?.cveStats || (assessment as any)?.cveStats || {};
  const controlsEvidence = data?.controlsEvidence || (assessment as any)?.controlsEvidence || {};
  
  // Calculate risk label from trust score if not provided
  const riskLabel = (assessment as any)?.risk_label || 
    (trustScore >= 70 ? "Lower Risk" : trustScore >= 40 ? "Medium Risk" : "High Risk");
  
  const showLowEvidenceWarning = evidenceCoverage > 0 && evidenceCoverage < 0.5;
  const hasScoringBreakdown = scoringBreakdown && Object.keys(scoringBreakdown).length > 0;

  const handleCopyJson = async () => {
    if (!rawApiResponse) return;
    
    try {
      const jsonString = JSON.stringify(rawApiResponse, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy JSON:", error);
    }
  };

  const jsonString = rawApiResponse ? JSON.stringify(rawApiResponse, null, 2) : "";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </button>

        {/* Header Section */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">{appName}</h1>
            {domain && <p className="text-lg text-gray-600">{domain}</p>}
            {vendorName && <p className="text-lg text-gray-600">{vendorName}</p>}
            {category && (
              <span className="mt-3 inline-block rounded-full bg-blue-50 border border-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
                {category}
              </span>
            )}
          </div>

          {/* Trust Score Section - Only show if trust_score exists */}
          {trustScore > 0 && (
            <div className="flex flex-col items-center gap-6 border-t border-gray-100 pt-8">
              <div className="text-center">
                <h2 className="mb-2 text-2xl font-semibold text-gray-900">Trust Score</h2>
                <p className="text-sm text-gray-600">
                  Overall security and trustworthiness assessment
                </p>
              </div>

              <TrustScoreDial score={trustScore} size="lg" animated={true} />
              <RiskLabel score={trustScore} label={riskLabel} size="lg" />
            </div>
          )}

          {/* Confidence and Coverage - Only show if data exists */}
          {(confidence > 0 || evidenceCoverage > 0) && (
            <div className="mt-8 border-t border-gray-100 pt-8">
              <EvidenceCoverageBadge
                coverage={evidenceCoverage}
                confidence={confidence}
              />
            </div>
          )}

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

        {/* Score Breakdown - Only show if scoring_breakdown exists and has data */}
        {hasScoringBreakdown && (
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Score Breakdown</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(scoringBreakdown).map(([key, value]) => {
                const numValue = typeof value === 'number' ? value : 0;
                // Handle both 0-1 scale (old) and 0-10 scale (new)
                // If value > 1, assume it's 0-10 scale, otherwise 0-1 scale
                const maxValue = numValue > 1 ? 10 : 1;
                const percentage = Math.round((numValue / maxValue) * 100);
                const displayValue = maxValue === 10 ? numValue : percentage;
                
                // CVE Risk is inverted: higher is worse, lower is better
                const isRiskMetric = key.toLowerCase().includes('risk') || key.toLowerCase().includes('cve');
                let isHigh, isMedium;
                
                if (isRiskMetric) {
                  // For risk metrics, invert the logic: lower is better
                  isHigh = percentage <= 30; // Low risk = good
                  isMedium = percentage > 30 && percentage <= 60;
                } else {
                  // For other metrics, higher is better
                  isHigh = percentage >= 70;
                  isMedium = percentage >= 40 && percentage < 70;
                }
                
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
                
                // Format key names nicely (handle both camelCase and snake_case)
                const formatKey = (k: string) => {
                  let formatted = k
                    .replace(/_/g, ' ') // Replace underscores with spaces
                    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
                    .replace(/Score$/i, '') // Remove "Score" suffix
                    .replace(/^Risk /i, '') // Remove leading "Risk"
                    .replace(/\bRisk$/i, ' Risk') // Add " Risk" at the end if it's just "Risk"
                    .trim();
                  
                  // Special handling for common field names
                  if (formatted.toLowerCase().includes('transparency')) {
                    formatted = 'Transparency';
                  } else if (formatted.toLowerCase().includes('controls') && !formatted.toLowerCase().includes('score')) {
                    formatted = 'Controls';
                  } else if (formatted.toLowerCase().includes('cve') || formatted.toLowerCase().includes('risk')) {
                    formatted = formatted.replace(/cve/i, 'CVE').replace(/\brisk\b/i, 'Risk');
                  }
                  
                  return formatted;
                };
                
                return (
                  <div
                    key={key}
                    className={`rounded-lg border ${borderColor} ${bgColor} p-4`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {formatKey(key)}
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {maxValue === 10 ? `${displayValue}/10` : `${displayValue}%`}
                      </span>
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
        )}

        {/* Highlights Section - Show if highlights exist */}
        {highlights.length > 0 && (
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Key Highlights</h2>
            <ul className="space-y-3">
              {highlights.map((highlight: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 text-green-600">✓</span>
                  <span className="text-sm text-gray-700 leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Security Evidence & CVE Stats - Show if data exists */}
        {(securityEvidence.hasSecurityTxt !== undefined || Object.keys(cveStats).length > 0 || Object.keys(controlsEvidence).length > 0) && (
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Security Details</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Security Evidence */}
              {securityEvidence.hasSecurityTxt !== undefined && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">Security Evidence</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Security TXT</span>
                      <span className={`font-medium ${securityEvidence.hasSecurityTxt ? 'text-green-600' : 'text-red-600'}`}>
                        {securityEvidence.hasSecurityTxt ? 'Present' : 'Not Found'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CVE Stats */}
              {Object.keys(cveStats).length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">CVE Statistics</h3>
                  <div className="space-y-2 text-sm">
                    {cveStats.totalCves !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total CVEs</span>
                        <span className="font-medium text-gray-900">{cveStats.totalCves}</span>
                      </div>
                    )}
                    {cveStats.recentCves !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Recent CVEs</span>
                        <span className="font-medium text-gray-900">{cveStats.recentCves}</span>
                      </div>
                    )}
                    {cveStats.maxCvss !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Max CVSS</span>
                        <span className="font-medium text-gray-900">{cveStats.maxCvss}</span>
                      </div>
                    )}
                    {cveStats.kevCount !== undefined && cveStats.kevCount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">KEV Count</span>
                        <span className="font-medium text-red-600">{cveStats.kevCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Controls Evidence */}
              {Object.keys(controlsEvidence).length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">Security Controls</h3>
                  <div className="space-y-2 text-sm">
                    {controlsEvidence.sso_supported && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">SSO</span>
                        <span className={`font-medium ${controlsEvidence.sso_supported === 'yes' ? 'text-green-600' : 'text-gray-400'}`}>
                          {controlsEvidence.sso_supported === 'yes' ? '✓ Supported' : '✗ Not Supported'}
                        </span>
                      </div>
                    )}
                    {controlsEvidence.mfa_supported && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">MFA</span>
                        <span className={`font-medium ${controlsEvidence.mfa_supported === 'yes' ? 'text-green-600' : 'text-gray-400'}`}>
                          {controlsEvidence.mfa_supported === 'yes' ? '✓ Supported' : '✗ Not Supported'}
                        </span>
                      </div>
                    )}
                    {controlsEvidence.rbac_supported && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">RBAC</span>
                        <span className={`font-medium ${controlsEvidence.rbac_supported === 'yes' ? 'text-green-600' : 'text-gray-400'}`}>
                          {controlsEvidence.rbac_supported === 'yes' ? '✓ Supported' : '✗ Not Supported'}
                        </span>
                      </div>
                    )}
                    {controlsEvidence.audit_logs && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Audit Logs</span>
                        <span className={`font-medium ${controlsEvidence.audit_logs === 'yes' ? 'text-green-600' : 'text-gray-400'}`}>
                          {controlsEvidence.audit_logs === 'yes' ? '✓ Supported' : '✗ Not Supported'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detailed Assessment - Only show if brief_markdown exists */}
        {briefMarkdown && (
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Detailed Assessment</h2>
                <p className="mt-1 text-sm text-gray-600">Comprehensive security analysis and findings</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Overview Section - Only show if there's actual overview content */}
              {briefMarkdown.includes("## Overview") && (
                <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <MarkdownRenderer 
                      content={briefMarkdown.split("## ").find((s: string) => s.startsWith("Overview"))?.replace(/^Overview\n\n/, "") || 
                        briefMarkdown.split("## Overview")[1]?.split("## ")[0] || ""} 
                    />
                  </div>
                </div>
              )}

              {/* Note: Security Evidence, CVE Statistics, and Security Controls are shown in the "Security Details" section above to avoid duplication */}

              {/* Full Assessment Report - Collapsible */}
              <Collapsible open={completeReportOpen} onOpenChange={setCompleteReportOpen}>
                <div className="rounded-lg border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                  <CollapsibleTrigger className="w-full cursor-pointer">
                    <div className="flex w-full items-center justify-between p-6 text-left">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Complete Assessment Report</h3>
                      </div>
                      {completeReportOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-6 pb-6">
                      <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:mt-6 prose-h2:mb-4">
                        <MarkdownRenderer content={briefMarkdown} />
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </div>
          </div>
        )}

        {/* Raw API Response Viewer - Moved to bottom, collapsible */}
        {rawApiResponse !== null && rawApiResponse !== undefined && (
          <Collapsible open={rawJsonOpen} onOpenChange={setRawJsonOpen} className="mt-8">
            <div className="rounded-xl border border-blue-200 bg-blue-50">
              <CollapsibleTrigger className="w-full cursor-pointer">
                <div className="flex w-full items-center justify-between p-6 text-left">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Raw API Response</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyJson();
                      }}
                      className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900 hover:shadow-md cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy JSON
                        </>
                      )}
                    </button>
                    {rawJsonOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6">
                  <div className="max-h-96 overflow-auto rounded-lg border border-gray-200 bg-white p-4">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words font-mono">
                      {jsonString}
                    </pre>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}
      </div>
    </div>
  );
}
