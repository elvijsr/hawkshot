// API types and utilities

export interface AssessmentData {
  app_name: string;
  vendor_name: string;
  category: string;
  trust_score: number;
  confidence: number;
  evidence_coverage: number;
  risk_label: string;
  scoring_breakdown: {
    identity: number;
    transparency: number;
    controls: number;
    compliance: number;
    cve_risk: number;
    incident_risk: number;
  };
  brief_markdown: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

// Get API webhook URL from environment variable or use default n8n webhook
const getWebhookUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || "https://bubapower.app.n8n.cloud/webhook/assess";
};

/**
 * Assess a product by name or URL
 * @param input - Product name, domain, or URL (e.g., "Slack", "slack.com", or "https://github.com/vercel/next.js")
 * @returns Assessment data
 * @throws ApiError if the request fails
 */
export const assessProduct = async (input: string): Promise<AssessmentData> => {
  const webhookUrl = getWebhookUrl();

  // Always use "query" as the parameter name
  const requestBody = { query: input };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || `API request failed with status ${response.status}`,
        status: response.status,
      } as ApiError;
    }

    // Check if response has content before trying to parse JSON
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      throw {
        message: "Failed to find service with this name. Please try rephrasing your query or check the spelling.",
        status: response.status,
      } as ApiError;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      throw {
        message: "Failed to find service with this name. Please try rephrasing your query or check the spelling.",
        status: response.status,
      } as ApiError;
    }
    
    // Transform n8n response to match AssessmentData interface
    // If the response already matches, return it directly
    // Otherwise, we may need to map fields based on actual n8n response structure
    // Store raw response for debugging (will be extracted in HomePage)
    (data as any)._rawResponse = JSON.parse(JSON.stringify(data));
    
    return data as AssessmentData;
  } catch (error) {
    // Handle network errors or other fetch failures
    if (error && typeof error === "object" && "message" in error) {
      throw error;
    }
    throw {
      message: error instanceof Error ? error.message : "Failed to assess product. Please try again.",
    } as ApiError;
  }
};

// Utility functions for risk color coding
export const getRiskColor = (score: number): string => {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-orange-500";
  return "text-red-600";
};

export const getRiskBgColor = (score: number): string => {
  if (score >= 70) return "bg-green-50";
  if (score >= 40) return "bg-orange-50";
  return "bg-red-50";
};

export const getRiskBorderColor = (score: number): string => {
  if (score >= 70) return "border-green-200";
  if (score >= 40) return "border-orange-200";
  return "border-red-200";
};

