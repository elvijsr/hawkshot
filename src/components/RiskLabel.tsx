import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface RiskLabelProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function RiskLabel({ score, label, size = "md" }: RiskLabelProps) {
  const getRiskData = (score: number) => {
    if (score >= 70) {
      return {
        label: "Lower Risk",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        icon: CheckCircle,
      };
    }
    if (score >= 40) {
      return {
        label: "Medium Risk",
        color: "text-orange-500",
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: AlertTriangle,
      };
    }
    return {
      label: "High Risk",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      icon: XCircle,
    };
  };

  const riskData = getRiskData(score);
  const Icon = riskData.icon;

  const sizes = {
    sm: { text: "text-sm", padding: "px-3 py-1", icon: "h-4 w-4" },
    md: { text: "text-base", padding: "px-4 py-2", icon: "h-5 w-5" },
    lg: { text: "text-lg", padding: "px-6 py-3", icon: "h-6 w-6" },
  };

  const sizeClasses = sizes[size];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${riskData.bg} ${riskData.border} ${sizeClasses.padding}`}
    >
      <Icon className={`${sizeClasses.icon} ${riskData.color}`} />
      <span className={`${sizeClasses.text} ${riskData.color}`}>
        {label || riskData.label}
      </span>
    </div>
  );
}
