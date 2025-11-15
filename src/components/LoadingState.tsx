import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Analyzing security posture..." }: LoadingStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <p className="text-gray-600">{message}</p>
      <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
        <p>• Checking vendor reputation</p>
        <p>• Analyzing vulnerability history</p>
        <p>• Reviewing compliance certifications</p>
        <p>• Evaluating security controls</p>
      </div>
    </div>
  );
}
