import type { SiteConfig } from "./types";

export const site: SiteConfig = {
  name: "Muhammad Maaz Salim",
  shortName: "Maaz",
  title: "Full-Stack Developer",
  pitch:
    "I build reliable software end to end, from database schemas and back-end services to the screens people actually use.",
  about: [
    "I'm a full-stack developer in Toronto who likes the unglamorous parts of software: data pipelines that don't drop records, reports people trust, and code the next developer can read.",
    "Right now I'm building C# integration services at Uqaab Consultants, replacing paid low-code workflows with tested Hangfire jobs. Before that, I spent 16 months at the Ontario Financing Authority building ASP.NET Core reporting tools for the risk team.",
    "I graduated Summa Cum Laude from McMaster University in 2025 with an Honours degree in Computer Science (Co-op).",
  ],
  email: "maazsalim@gmail.com",
  location: "Toronto, Ontario",
  // TODO: replace with the real URL once the Static Web App is created (stage 4).
  url: "https://TODO-portfolio.azurestaticapps.net",
  resumePath: "/resume.pdf",
  githubUsername: "maazsalim",
  links: {
    github: "https://github.com/maazsalim",
    linkedin: "https://www.linkedin.com/in/muhammad-salim-25059a235/",
  },
};
