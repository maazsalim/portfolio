import type { Experience } from "./types";

/** Most recent first. */
export const experience: Experience[] = [
  {
    company: "Valus",
    role: "Associate Product Developer",
    type: "Full-time",
    location: "Dubai, UAE",
    start: "Sep 2026",
    end: "Present",
    bullets: [
      "Led the rebuild of a 459K-member loyalty analytics platform from React/Supabase into a .NET 10 Blazor Server and PostgreSQL application (EF Core, MudBlazor), matching all 15 reporting pages while moving business logic from database functions into tested C#.",
      "Re-engineered the Braze data sync from serverless 45-second slices into a single background job with batched upserts, [cutting full syncs from up to 2.5 hours to about 6 minutes](/writing/sync-2-5-hours-to-6-minutes/), backed by 145 automated tests including end-to-end runs against a mock Braze API.",
      "Built an Azure DevOps CI/CD pipeline targeting Azure App Service and Azure Database for PostgreSQL, and designed the plan for migrating production data from Supabase.",
    ],
    tech: [".NET 10", "Blazor", "C#", "EF Core", "PostgreSQL", "MudBlazor", "Azure DevOps", "Azure App Service"],
    writeUp: { href: "/writing/sync-2-5-hours-to-6-minutes/", label: "Read the write-up on the sync rebuild" },
  },
  {
    company: "Uqaab Consultants Inc.",
    role: "Software Developer",
    type: "Contract",
    location: "Toronto, ON",
    start: "Jun 2026",
    end: "Present",
    bullets: [
      "Architected a reusable C# job pipeline on Hangfire with an Outbox pattern, converting legacy Boomi workflows into maintainable, testable services and removing the dependency on Boomi's paid integration platform.",
      "Built end-to-end NetSuite integrations that read SQL Server staging tables through EF Core and call SOAP APIs with full field mapping, validation and automatic error recovery, eliminating 3 hours of manual data reconciliation per week.",
      "Designed SQL Server staging schemas and EF Core migrations, coordinating with upstream stored procedures for reliable end-to-end syncs.",
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
      "Designed and built a financial risk report in ASP.NET Core (C#) with SQL-based data retrieval, working closely with the Risk team on requirements, reducing errors and saving about 5 hours of maintenance per week.",
      "Improved CORRA and SOFR rate precision from 2 decimal places to full published precision by migrating data sources from Bloomberg to the Bank of Canada and New York Fed.",
      "Supported the move of company email to a cloud platform, implementing OAuth token-based authentication.",
    ],
    tech: ["C#", "ASP.NET Core", "SQL Server", "OAuth"],
  },
];
