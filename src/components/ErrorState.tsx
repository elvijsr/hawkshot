import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Failed to load assessment", onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <div className="rounded-full bg-red-50 p-4">
        <AlertCircle className="h-12 w-12 text-red-600" />
      </div>
      <h3 className="text-gray-900">{message}</h3>
      <p className="text-sm text-gray-600">
        Please try again or contact support if the problem persists.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
