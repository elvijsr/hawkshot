// Mock API responses and utilities

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

const mockBrief = `## Overview
This is a comprehensive cloud-based collaboration platform designed for team communication and project management. The platform has established itself as a leading solution in the enterprise communication space with millions of daily active users across organizations of all sizes.

## Vendor Reputation
The vendor has a strong track record in the SaaS industry with:
- Established market presence for over 10 years
- Strong financial backing and publicly traded status
- Regular security audits and compliance certifications
- Transparent communication during security incidents
- Active bug bounty program with responsible disclosure

## Vulnerability History
Recent security assessment shows:
- 12 CVEs identified in the past 3 years (mostly medium severity)
- Average remediation time: 14 days
- No critical vulnerabilities left unpatched for >30 days
- Regular third-party penetration testing
- Public security advisories published promptly

## Incidents / Security Context
Historical incident review:
- 2 data breach incidents in the past 5 years
- Both incidents properly disclosed within required timeframes
- Implemented corrective measures after each incident
- No evidence of data being sold or misused
- Transparent post-incident reporting

## Data Handling & Compliance
Compliance certifications and data practices:
- SOC 2 Type II certified
- GDPR compliant with EU data residency options
- HIPAA compliant tier available
- ISO 27001 certified
- Data encryption at rest and in transit (TLS 1.2+)
- Customer data retention policies clearly documented

## Admin & Deployment Controls
Enterprise security features available:
- ✅ Single Sign-On (SSO) via SAML 2.0
- ✅ Multi-Factor Authentication (MFA)
- ✅ Role-Based Access Control (RBAC)
- ✅ Comprehensive audit logs
- ✅ Session management controls
- ✅ IP allowlisting
- ⚠️  Limited data loss prevention (DLP) features

## Final Score Rationale
The trust score of 82/100 reflects:
- Strong vendor reputation and market presence
- Good compliance posture with major certifications
- Reasonable vulnerability management practices
- Transparent incident handling
- Comprehensive admin controls for enterprise customers
- Minor concerns around evidence coverage (60%) - some data sources unavailable

**Risk Level: Lower Risk** - Suitable for most enterprise deployments with proper configuration.

## Alternative Tools
Consider these alternatives for comparison:
- Microsoft Teams - Better Office 365 integration
- Discord - Gaming-focused with lower enterprise controls
- Mattermost - Self-hosted open-source option
- Rocket.Chat - Open-source with on-premise deployment
`;

const mockBriefB = `## Overview
This is a leading project management and team collaboration platform that combines task tracking, documentation, and databases into a unified workspace. Known for its flexibility and beautiful user interface.

## Vendor Reputation
The vendor is a well-funded startup with:
- Rapidly growing user base
- Strong design-first philosophy
- Active community and passionate users
- Transparent product roadmap
- Responsive customer support

## Vulnerability History
Security assessment indicates:
- 5 CVEs in the past 2 years (all low-medium severity)
- Quick response time to security reports
- Smaller attack surface due to simpler architecture
- Regular security updates
- Growing security team

## Incidents / Security Context
Minimal incident history:
- 0 major data breaches reported
- 1 minor service disruption due to DDoS attack
- Quick recovery and transparent communication
- Proactive security measures implemented

## Data Handling & Compliance
Compliance status:
- SOC 2 Type II in progress
- GDPR compliant
- Data encryption in transit and at rest
- Limited geographic data residency options
- Clear privacy policy

## Admin & Deployment Controls
Available security controls:
- ✅ SAML SSO (Enterprise plan)
- ✅ Basic RBAC
- ⚠️  Limited audit logging (Enterprise plan only)
- ❌ No advanced DLP features
- ⚠️  MFA available but not enforced by default

## Final Score Rationale
The trust score of 68/100 reflects:
- Younger company with less enterprise security maturity
- Good security fundamentals in place
- Limited compliance certifications (in progress)
- Strong user trust but less enterprise adoption
- Some critical controls locked behind higher pricing tiers

**Risk Level: Medium Risk** - Suitable for small-medium teams, requires careful evaluation for enterprise use.

## Alternative Tools
Consider these alternatives:
- Confluence - More mature enterprise features
- ClickUp - More task management focused
- Coda - Similar flexibility with different approach
`;

export const mockAssessments: Record<string, AssessmentData> = {
  slack: {
    app_name: "Slack",
    vendor_name: "Slack Technologies",
    category: "Team Collaboration",
    trust_score: 82,
    confidence: 0.78,
    evidence_coverage: 0.60,
    risk_label: "Lower Risk",
    scoring_breakdown: {
      identity: 0.9,
      transparency: 0.7,
      controls: 0.8,
      compliance: 0.85,
      cve_risk: 0.65,
      incident_risk: 0.7,
    },
    brief_markdown: mockBrief,
  },
  notion: {
    app_name: "Notion",
    vendor_name: "Notion Labs Inc",
    category: "Productivity & Collaboration",
    trust_score: 68,
    confidence: 0.65,
    evidence_coverage: 0.45,
    risk_label: "Medium Risk",
    scoring_breakdown: {
      identity: 0.75,
      transparency: 0.8,
      controls: 0.6,
      compliance: 0.55,
      cve_risk: 0.85,
      incident_risk: 0.9,
    },
    brief_markdown: mockBriefB,
  },
  "vercel/next.js": {
    app_name: "Next.js",
    vendor_name: "Vercel",
    category: "Web Framework / Open Source",
    trust_score: 88,
    confidence: 0.85,
    evidence_coverage: 0.75,
    risk_label: "Lower Risk",
    scoring_breakdown: {
      identity: 0.95,
      transparency: 0.95,
      controls: 0.7,
      compliance: 0.6,
      cve_risk: 0.9,
      incident_risk: 0.85,
    },
    brief_markdown: mockBrief.replace(/collaboration platform/g, "React framework").replace(/Slack/g, "Next.js"),
  },
};

export const assessProduct = async (input: string): Promise<AssessmentData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Parse input to determine product
  const normalized = input.toLowerCase().trim();
  
  if (normalized.includes("slack")) {
    return mockAssessments.slack;
  } else if (normalized.includes("notion")) {
    return mockAssessments.notion;
  } else if (normalized.includes("next.js") || normalized.includes("vercel/next")) {
    return mockAssessments["vercel/next.js"];
  }

  // Default mock for unknown products
  const randomScore = Math.floor(Math.random() * 40) + 50; // 50-90
  const riskLabel = randomScore >= 70 ? "Lower Risk" : randomScore >= 40 ? "Medium Risk" : "High Risk";

  return {
    app_name: input,
    vendor_name: `${input} Inc.`,
    category: "SaaS Product",
    trust_score: randomScore,
    confidence: 0.5,
    evidence_coverage: 0.3,
    risk_label: riskLabel,
    scoring_breakdown: {
      identity: Math.random(),
      transparency: Math.random(),
      controls: Math.random(),
      compliance: Math.random(),
      cve_risk: Math.random(),
      incident_risk: Math.random(),
    },
    brief_markdown: mockBrief.replace(/Slack/g, input),
  };
};

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
