import { useState } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ResultsPage } from "./components/ResultsPage";
import type { AssessmentData } from "./utils/mockApi";

type Page = "home" | "results";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentData | null>(null);

  const handleAssess = (assessment: AssessmentData) => {
    setCurrentAssessment(assessment);
    setCurrentPage("results");
  };

  const handleGoHome = () => {
    setCurrentPage("home");
    setCurrentAssessment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={handleGoHome} />
      
      {currentPage === "home" && <HomePage onAssess={handleAssess} />}
      
      {currentPage === "results" && currentAssessment && (
        <ResultsPage assessment={currentAssessment} onBack={handleGoHome} />
      )}
    </div>
  );
}
