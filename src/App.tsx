import { useState } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ResultsPage } from "./components/ResultsPage";
import { ComparePage } from "./components/ComparePage";
import type { AssessmentData } from "./utils/api";
import type { CompareTool } from "./utils/api";

type Page = "home" | "results" | "compare";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentData | null>(null);
  const [rawApiResponse, setRawApiResponse] = useState<unknown>(null);
  const [responseTimestamp, setResponseTimestamp] = useState<string | null>(null);
  const [fetchTime, setFetchTime] = useState<number | null>(null);
  const [compareCategory, setCompareCategory] = useState<string>("");

  const handleAssess = (
    assessment: AssessmentData,
    rawResponse?: unknown,
    timestamp?: string,
    time?: number
  ) => {
    setCurrentAssessment(assessment);
    setRawApiResponse(rawResponse || null);
    setResponseTimestamp(timestamp || null);
    setFetchTime(time || null);
    setCurrentPage("results");
  };

  const handleGoHome = () => {
    setCurrentPage("home");
    setCurrentAssessment(null);
    setCompareCategory("");
  };

  const handleCompare = (category: string) => {
    setCompareCategory(category);
    setCurrentPage("compare");
  };

  const handleSelectTool = (tool: CompareTool) => {
    // Convert CompareTool to AssessmentData format and navigate to results
    const assessment: AssessmentData = {
      app_name: tool.app_name || tool.product || "",
      vendor_name: tool.vendor_name || tool.vendor || "",
      category: tool.category || compareCategory,
      trust_score: tool.trust_score ?? 0,
      confidence: tool.confidence ?? 0,
      evidence_coverage: tool.evidence_coverage ?? 0,
      risk_label:
        tool.risk_label ||
        (tool.trust_score && tool.trust_score >= 70
          ? "Lower Risk"
          : tool.trust_score && tool.trust_score >= 40
            ? "Medium Risk"
            : "High Risk") ||
        "Unknown",
      scoring_breakdown: tool.scoring_breakdown || {},
      brief_markdown: tool.brief_markdown || "",
    };
    setCurrentAssessment(assessment);
    setRawApiResponse(tool);
    setResponseTimestamp(new Date().toISOString());
    setFetchTime(null);
    setCurrentPage("results");
  };

  return (
    <div className={`min-h-screen ${currentPage === "home" ? "bg-transparent" : "bg-gray-50"}`}>
      <Header onNavigate={handleGoHome} />

      {currentPage === "home" && <HomePage onAssess={handleAssess} />}

      {currentPage === "results" && currentAssessment && (
        <ResultsPage
          assessment={currentAssessment}
          rawApiResponse={rawApiResponse}
          responseTimestamp={responseTimestamp}
          fetchTime={fetchTime}
          onBack={handleGoHome}
          onCompare={handleCompare}
        />
      )}

      {currentPage === "compare" && compareCategory && (
        <ComparePage
          category={compareCategory}
          onBack={handleGoHome}
          onSelectTool={handleSelectTool}
        />
      )}
    </div>
  );
}
