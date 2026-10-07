import type { Experience } from "./types";

/** Most recent first. */
export const experience: Experience[] = [
  {
    company: "Uqaab Consultants Inc.",
    role: "Software Developer",
    type: "Full-time",
    location: "Toronto, ON",
    start: "Jun 2026",
    end: "Present",
    bullets: [
      "Architected a reusable C# job pipeline on Hangfire with an Outbox pattern, converting legacy Boomi workflows into testable services and removing the dependency on Boomi's paid platform.",
      "Built end-to-end NetSuite integrations that read SQL Server staging tables through EF Core and call SOAP APIs with full field mapping, validation and error recovery, cutting manual data reconciliation.",
      "Designed SQL Server staging schemas and EF Core migrations aligned with upstream stored procedures for reliable syncs.",
    ],
    tech: ["C#", ".NET", "Hangfire", "EF Core", "SQL Server", "SOAP"],
  },
  {
    company: "Ontario Financing Authority",
    role: "Junior Developer (Co-op)",
    type: "Co-op",
    location: "Toronto, ON",
    start: "May 2023",
    end: "Aug 2024",
    bullets: [
      "Led design and development of a financial report for the Risk team (ASP.NET Core front end, SQL-backed data retrieval), saving about 5 hours of maintenance work per week.",
      "Migrated CORRA and SOFR rate sources from Bloomberg to the Bank of Canada and New York Fed, resolving decimal limitations and improving precision by about 25%.",
      "Supported the move of company email to a cloud platform, implementing OAuth token-based authentication.",
    ],
    tech: ["C#", "ASP.NET Core", "SQL Server", "OAuth"],
  },
];
