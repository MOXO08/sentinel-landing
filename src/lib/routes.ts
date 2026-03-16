export const ROUTES = {
  home: "/",
  docs: "/docs",
  pricing: "/pricing",
  api: "/api",
  security: "/security",
  solutions: "/solutions",
  
  // AI Compliance Cluster
  aiCompliance: "/ai-compliance",
  aiComplianceTools: "/ai-compliance-tools",
  aiComplianceFaq: "/ai-compliance-faq",
  governanceComparison: "/sentinel-vs-governance-tools",
  
  // Legal
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  sovereignty: "/legal/sovereignty",
  dataResidency: "/legal/data-residency",
  vdp: "/legal/vdp",
  securityPolicy: "/.well-known/security.txt",
  
  // Use Cases
  useCases: {
    finance: "/use-cases/finance",
    healthcare: "/use-cases/healthcare",
    saas: "/use-cases/saas",
    government: "/use-cases/government",
    retail: "/use-cases/retail",
  },
  
  // External
  github: "https://github.com/MOXO08/sentinel",
  npm: "https://www.npmjs.com/package/@radu_api/sentinel-scan",
  downloads: "/#quickstart",
} as const;
