import { useState } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ResultsPage } from "./components/ResultsPage";
import type { AssessmentData } from "./utils/api";

type Page = "home" | "results";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentData | null>(null);
  const [rawApiResponse, setRawApiResponse] = useState<unknown>(null);

  const handleAssess = (assessment: AssessmentData, rawResponse?: unknown) => {
    setCurrentAssessment(assessment);
    setRawApiResponse(rawResponse || null);
    setCurrentPage("results");
  };

  const handleGoHome = () => {
    setCurrentPage("home");
    setCurrentAssessment(null);
  };

  return (
    <div className={`min-h-screen ${currentPage === "home" ? "bg-transparent" : "bg-gray-50"}`}>
      <Header onNavigate={handleGoHome} />
      
      {currentPage === "home" && <HomePage onAssess={handleAssess} />}
      
      {currentPage === "results" && currentAssessment && (
        <ResultsPage 
          assessment={currentAssessment} 
          rawApiResponse={rawApiResponse}
          onBack={handleGoHome} 
        />
      )}
    </div>
  );
}
