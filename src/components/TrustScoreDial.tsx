import { useEffect, useState } from "react";

interface TrustScoreDialProps {
  score: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function TrustScoreDial({ score, size = "lg", animated = true }: TrustScoreDialProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (!animated) return;
    
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [score, animated]);

  const getColor = (score: number) => {
    if (score >= 70) return { stroke: "#16a34a", text: "text-green-600" };
    if (score >= 40) return { stroke: "#f97316", text: "text-orange-500" };
    return { stroke: "#dc2626", text: "text-red-600" };
  };

  const sizes = {
    sm: { width: 120, strokeWidth: 8, fontSize: "text-2xl" },
    md: { width: 160, strokeWidth: 10, fontSize: "text-3xl" },
    lg: { width: 200, strokeWidth: 12, fontSize: "text-5xl" },
  };

  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;
  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width, height: width }}>
        <svg width={width} height={width} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${fontSize} ${color.text}`}>{Math.round(displayScore)}</span>
          <span className="text-gray-500 text-sm">/ 100</span>
        </div>
      </div>
    </div>
  );
}
