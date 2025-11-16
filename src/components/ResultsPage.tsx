import { useState } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
  Briefcase,
  HelpCircle,
  GitCompare,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { TrustScoreDial } from "./TrustScoreDial";
import { RiskLabel } from "./RiskLabel";
import { EvidenceCoverageBadge } from "./EvidenceCoverageBadge";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { AssessmentData } from "../utils/api";

interface ResultsPageProps {
  assessment: AssessmentData;
  rawApiResponse?: unknown;
  responseTimestamp?: string | null;
  fetchTime?: number | null;
  onBack: () => void;
  onCompare?: (category: string) => void;
}

export function ResultsPage({
  assessment,
  rawApiResponse,
  responseTimestamp,
  fetchTime,
  onBack,
  onCompare,
}: ResultsPageProps) {
  const [copied, setCopied] = useState(false);
  const [rawJsonOpen, setRawJsonOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [briefSummaryExpanded, setBriefSummaryExpanded] = useState(false);

  const trustScoreExplanation = `Here's a summary of the scoring model:

The **Trust Score** is a number from 0 to 100, starting from a **baseline of 50 points**.

1. **Positive Points (up to +40):** The score increases based on evidence of good practices.

    - **Transparency (+20 pts):** Points are added for transparency, such as having a \`security.txt\` file.

    - **Security Controls (+20 pts):** Points are added for supporting features like SSO, MFA, RBAC, and audit logs.

2. **Risk Penalties (up to -30):** The score is reduced based on vulnerability risk.

 - **CVE Risk (-30 pts):** A risk score (0-10) is calculated as a weighted average of the product's total CVEs, recent CVEs, highest CVSS score, and any known exploits (KEVs). This risk score is then multiplied by 3 and subtracted from the total.

The final score is rounded and clamped between 0 and 100. A separate **Confidence** score (0 to 1) is also calculated, indicating how many of these three data categories (Transparency, Controls, CVEs) were available to create the score.`;

  // Safely access fields with fallbacks - check rawApiResponse first since it has the actual data
  // Then fall back to assessment object
  const data = (rawApiResponse as any) || (assessment as any);

  // Try multiple field name variations for vendor name
  const vendorName =
    data?.vendor ||
    data?.vendor_name ||
    (assessment as any)?.vendor ||
    (assessment as any)?.vendor_name ||
    "";

  // Try multiple field name variations for app name (supporting both old and new JSON structures)
  // If product is null/empty, fall back to vendor name, then query
  const productName =
    data?.product ||
    data?.appName ||
    data?.app_name ||
    (assessment as any)?.product ||
    (assessment as any)?.appName ||
    (assessment as any)?.app_name ||
    null;

  const query = data?.query || (assessment as any)?.query || "";

  const appName =
    productName && productName !== null && productName !== ""
      ? productName
      : vendorName && vendorName !== null && vendorName !== ""
        ? vendorName
        : query || "Unknown Product";

  const domain =
    data?.website ||
    data?.domain ||
    (assessment as any)?.website ||
    (assessment as any)?.domain ||
    "";
  const logoUrl = data?.logo || (assessment as any)?.logo || "";
  const logo = logoUrl && logoUrl.trim() !== "" ? logoUrl : null;
  const category =
    data?.category ||
    data?.controlsEvidence?.category ||
    (assessment as any)?.category ||
    (assessment as any)?.controlsEvidence?.category ||
    "";
  const trustScore = data?.trust_score ?? (assessment as any)?.trust_score ?? 0;
  const confidence = data?.confidence ?? (assessment as any)?.confidence ?? 0;
  const evidenceCoverage = data?.evidence_coverage ?? (assessment as any)?.evidence_coverage ?? 0;
  const scoringBreakdown = data?.scoring_breakdown || (assessment as any)?.scoring_breakdown || {};
  const briefMarkdown = data?.brief_markdown || (assessment as any)?.brief_markdown || "";
  const highlights = data?.highlights || (assessment as any)?.highlights || [];
  const securityEvidence = data?.securityEvidence || (assessment as any)?.securityEvidence || {};
  const cveStats = data?.cveStats || (assessment as any)?.cveStats || {};
  const latestCvesRaw = cveStats?.latestCves || [];
  // Sort CVEs by published date (most recent first)
  const latestCves = [...latestCvesRaw].sort((a: any, b: any) => {
    const dateA = a.published ? new Date(a.published).getTime() : 0;
    const dateB = b.published ? new Date(b.published).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });
  const controlsEvidence = data?.controlsEvidence || (assessment as any)?.controlsEvidence || {};

  // Extract new fields from controlsEvidence
  const usage = controlsEvidence?.usage || "";
  const description = controlsEvidence?.description || "";
  const vendorReputation = controlsEvidence?.vendor_reputation || "";

  // Calculate risk label from trust score if not provided
  const riskLabel =
    (assessment as any)?.risk_label ||
    (trustScore >= 70 ? "Lower Risk" : trustScore >= 40 ? "Medium Risk" : "High Risk");

  const showLowEvidenceWarning = evidenceCoverage > 0 && evidenceCoverage < 0.5;
  const hasScoringBreakdown = scoringBreakdown && Object.keys(scoringBreakdown).length > 0;

  // Get the date to display - use created_at from JSON if available, otherwise use response timestamp
  const createdAt = data?.created_at || (assessment as any)?.created_at;
  const dateToDisplay = createdAt || responseTimestamp;
  const formattedDate = dateToDisplay
    ? new Date(dateToDisplay).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // Format fetch time as seconds.tenths
  const formatFetchTime = (seconds: number | null | undefined): string | null => {
    if (seconds === null || seconds === undefined) return null;
    const wholeSeconds = Math.floor(seconds);
    const tenths = Math.floor((seconds - wholeSeconds) * 10);
    return `${wholeSeconds}.${tenths}s`;
  };

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

  // Format URL for display - add https:// if protocol is missing
  const formatUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  // Format date for CVE display
  const formatCveDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </button>

          {/* Header Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="mb-6 gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {logo && !logoError && (
                    <div className="flex-shrink-0">
                      <img
                        src={logo}
                        alt={`${appName} logo`}
                        className="h-12 w-12 object-contain rounded-lg border border-gray-200 bg-white p-1"
                        referrerPolicy="no-referrer"
                        onError={() => {
                          setLogoError(true);
                        }}
                        onLoad={() => {
                          setLogoError(false);
                        }}
                      />
                    </div>
                  )}
                  <h1 className="text-3xl font-bold text-gray-900">{appName}</h1>
                  {category && (
                    <>
                      <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
                        {category}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex flex-col sm:items-end gap-1">
                  {formattedDate && (
                    <p className="text-sm text-gray-500 sm:mt-0">Data fetched: {formattedDate}</p>
                  )}
                  {fetchTime !== null && fetchTime !== undefined && (
                    <p className="text-xs text-gray-400">Fetched in {formatFetchTime(fetchTime)}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-2 w-full justify-between items-center">
                <div className="flex flex-col gap-1 p-2">
                  {vendorName && <p className="text-lg text-gray-600">{vendorName}</p>}
                  {domain && (
                    <a
                      href={formatUrl(domain)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lg text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {domain}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <div>
                  {onCompare && (
                    <button
                      onClick={() => onCompare(category)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <GitCompare className="h-4 w-4" />
                      Compare
                    </button>
                  )}
                </div>{" "}
              </div>

              <div className="flex flex-col gap-2">
                {/* Description */}
                {description && (
                  <div className="p-2">
                    <p className="text-base text-gray-700 leading-relaxed">{description}</p>
                  </div>
                )}

                {/* Usage */}
                {usage && (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-100 p-2">
                    <Briefcase className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Meant for {usage}</span>
                  </div>
                )}

                {/* Vendor Reputation */}
                {vendorReputation && (
                  <div className="">
                    <div className="rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 rounded-full bg-amber-100 p-2">
                          <Star className="h-5 w-5 text-amber-600 fill-amber-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-amber-900 mb-1">
                            Vendor Reputation
                          </h3>
                          <p className="text-sm text-amber-800 leading-relaxed">
                            {vendorReputation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Score and Score Breakdown Section */}
            {(trustScore > 0 || hasScoringBreakdown) && (
              <div className="flex flex-col lg:flex-row gap-8 border-t border-gray-100 pt-8">
                {/* Trust Score Section - Left Side */}
                {trustScore > 0 && (
                  <div className="flex flex-col items-center gap-6 flex-shrink-0 lg:w-1/2 py-4">
                    <div className="text-center">
                      <div className="mb-2 flex items-center justify-center gap-2">
                        <h2 className="text-2xl font-semibold text-gray-900">Trust Score</h2>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label="Learn more about Trust Score"
                            >
                              <HelpCircle className="h-5 w-5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-96 max-w-[90vw] bg-gray-50">
                            <div className="prose prose-sm max-w-none">
                              <MarkdownRenderer content={trustScoreExplanation} />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <p className="text-sm text-gray-600">
                        Overall security and trustworthiness assessment
                      </p>
                    </div>

                    <TrustScoreDial score={trustScore} size="lg" animated={true} />
                    <RiskLabel score={trustScore} label={riskLabel} size="lg" />
                  </div>
                )}

                {/* Score Breakdown - Right Side */}
                {hasScoringBreakdown && (
                  <div className="flex-1">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">Score Breakdown</h2>
                    <div className="grid gap-4 sm:grid-cols-1">
                      {Object.entries(scoringBreakdown).map(([key, value]) => {
                        const numValue = typeof value === "number" ? value : 0;
                        // Handle both 0-1 scale (old) and 0-10 scale (new)
                        // If value > 1, assume it's 0-10 scale, otherwise 0-1 scale
                        const maxValue = numValue > 1 ? 10 : 1;
                        const percentage = Math.round((numValue / maxValue) * 100);
                        const displayValue = maxValue === 10 ? numValue : percentage;

                        // CVE Risk is inverted: higher is worse, lower is better
                        const isRiskMetric =
                          key.toLowerCase().includes("risk") || key.toLowerCase().includes("cve");
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
                            .replace(/_/g, " ") // Replace underscores with spaces
                            .replace(/([A-Z])/g, " $1") // Add space before capital letters
                            .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                            .replace(/Score$/i, "") // Remove "Score" suffix
                            .replace(/^Risk /i, "") // Remove leading "Risk"
                            .replace(/\bRisk$/i, " Risk") // Add " Risk" at the end if it's just "Risk"
                            .trim();

                          // Special handling for common field names
                          if (formatted.toLowerCase().includes("transparency")) {
                            formatted = "Transparency";
                          } else if (
                            formatted.toLowerCase().includes("controls") &&
                            !formatted.toLowerCase().includes("score")
                          ) {
                            formatted = "Controls";
                          } else if (
                            formatted.toLowerCase().includes("cve") ||
                            formatted.toLowerCase().includes("risk")
                          ) {
                            formatted = formatted
                              .replace(/cve/i, "CVE")
                              .replace(/\brisk\b/i, "Risk");
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
              </div>
            )}

            {/* Confidence and Coverage - Only show if data exists */}
            {(confidence > 0 || evidenceCoverage > 0) && (
              <div className="border-t border-gray-100 pt-8">
                <EvidenceCoverageBadge coverage={evidenceCoverage} confidence={confidence} />
              </div>
            )}

            {/* Low Evidence Warning */}
            {showLowEvidenceWarning && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
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

          {/* Brief Summary - Only show if brief_markdown exists */}
          {briefMarkdown && (
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Brief Summary</h2>
              <div>
                <div className="relative">
                  <div
                    className={`prose prose-sm max-w-none overflow-hidden transition-all duration-500 ease-in-out ${
                      briefSummaryExpanded ? "max-h-[2000px]" : "max-h-40"
                    }`}
                  >
                    <MarkdownRenderer content={briefMarkdown} />
                  </div>
                  {!briefSummaryExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                  )}
                </div>
                <button
                  onClick={() => setBriefSummaryExpanded(!briefSummaryExpanded)}
                  className="relative z-10 mt-2 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {briefSummaryExpanded ? (
                    <>
                      Show less
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show more
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Highlights Section - Show if highlights exist */}
          {highlights.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-8">
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
          {(securityEvidence.hasSecurityTxt !== undefined ||
            Object.keys(cveStats).length > 0 ||
            Object.keys(controlsEvidence).length > 0) && (
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">Security Details</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Security Evidence */}
                {securityEvidence.hasSecurityTxt !== undefined && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-900">Security Evidence</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Security TXT</span>
                        <span
                          className={`font-medium ${securityEvidence.hasSecurityTxt ? "text-green-600" : "text-red-600"}`}
                        >
                          {securityEvidence.hasSecurityTxt ? "Present" : "Not Found"}
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
                          <span
                            className={`font-medium ${controlsEvidence.sso_supported === "yes" ? "text-green-600" : "text-gray-400"}`}
                          >
                            {controlsEvidence.sso_supported === "yes"
                              ? "✓ Supported"
                              : "✗ Not Supported"}
                          </span>
                        </div>
                      )}
                      {controlsEvidence.mfa_supported && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">MFA</span>
                          <span
                            className={`font-medium ${controlsEvidence.mfa_supported === "yes" ? "text-green-600" : "text-gray-400"}`}
                          >
                            {controlsEvidence.mfa_supported === "yes"
                              ? "✓ Supported"
                              : "✗ Not Supported"}
                          </span>
                        </div>
                      )}
                      {controlsEvidence.rbac_supported && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">RBAC</span>
                          <span
                            className={`font-medium ${controlsEvidence.rbac_supported === "yes" ? "text-green-600" : "text-gray-400"}`}
                          >
                            {controlsEvidence.rbac_supported === "yes"
                              ? "✓ Supported"
                              : "✗ Not Supported"}
                          </span>
                        </div>
                      )}
                      {controlsEvidence.audit_logs && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Audit Logs</span>
                          <span
                            className={`font-medium ${controlsEvidence.audit_logs === "yes" ? "text-green-600" : "text-gray-400"}`}
                          >
                            {controlsEvidence.audit_logs === "yes"
                              ? "✓ Supported"
                              : "✗ Not Supported"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Latest CVEs with References */}
          {latestCves.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">Latest CVEs</h2>
              <div className="space-y-4">
                {latestCves.map((cve: any, index: number) => (
                  <div
                    key={cve.id || index}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div className="flex flex-row w-full items-center gap-4">
                        <a
                          href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cve.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          {cve.id}
                        </a>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {cve.published && <span>Published: {formatCveDate(cve.published)}</span>}
                          {cve.lastModified && cve.lastModified !== cve.published && (
                            <span>Modified: {formatCveDate(cve.lastModified)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {cve.references && cve.references.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <ul className="space-y-1.5">
                          {cve.references.map((ref: any, refIndex: number) => (
                            <li key={refIndex} className="flex items-start gap-2">
                              <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                              <a
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-words transition-colors"
                              >
                                {ref.url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw API Response Viewer - Moved to bottom, collapsible */}
          {rawApiResponse !== null && rawApiResponse !== undefined && (
            <Collapsible open={rawJsonOpen} onOpenChange={setRawJsonOpen}>
              <div className="rounded-xl border border-blue-200 bg-blue-50">
                <div className="flex w-full items-center justify-between p-6">
                  <CollapsibleTrigger className="flex-1 cursor-pointer text-left">
                    <h2 className="text-lg font-semibold text-gray-900">Raw API Response</h2>
                  </CollapsibleTrigger>
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
                    <CollapsibleTrigger className="cursor-pointer">
                      {rawJsonOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-600" />
                      )}
                    </CollapsibleTrigger>
                  </div>
                </div>
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
    </div>
  );
}
