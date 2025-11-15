import React, { useState } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ResultsPage } from "./components/ResultsPage";
import { ComparePage } from "./components/ComparePage";
import type { AssessmentData } from "./utils/mockApi";

type Page = "home" | "results" | "compare";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentData | null>(null);

  const handleAssess = (assessment: AssessmentData) => {
    setCurrentAssessment(assessment);
    setCurrentPage("results");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    if (page === "home" || page === "compare") {
      setCurrentAssessment(null);
    }
  };

  const handleBack = () => {
    setCurrentPage("home");
    setCurrentAssessment(null);
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === "home" && <HomePage onAssess={handleAssess} />}
      
      {currentPage === "results" && currentAssessment && (
        <ResultsPage assessment={currentAssessment} onBack={handleBack} />
      )}
      
      {currentPage === "compare" && <ComparePage onBack={handleBackToHome} />}
    </div>
  );
}
