import type { Project } from "./types";

/** Display order = array order. Keep 3–5 projects, strongest first. */
export const projects: Project[] = [
  {
    slug: "parkitplace",
    title: "ParkItPlace",
    problem:
      "Students can't find affordable parking near campus while nearby driveways sit empty all day.",
    role: "Full-stack developer (capstone team)", // TODO: confirm your exact role / team size
    period: "Sep 2024 – Mar 2025",
    tech: ["React Native", "React", "Firebase", "Stripe", "Google Maps API", "Twilio", "GitHub Actions"],
    links: {
      demo: undefined, // TODO: live demo or App Store / video link
      repo: undefined, // TODO: GitHub link (or leave empty if private)
    },
    caseStudy: {
      problem:
        "Parking near McMaster is expensive and scarce, while homeowners nearby have driveways that go unused during the day. There was no simple, trusted way for the two groups to find each other.",
      approach: [
        "Built a cross-platform app with React Native for iOS and Android, plus a responsive React web client from the same codebase.",
        "Used Firebase Authentication for accounts and Cloud Firestore for real-time listing availability.",
        "Integrated Stripe for payments, Google Maps for search by location, Twilio for SMS alerts and SendGrid for email receipts.",
      ],
      architecture: [
        "Clients (React Native / React) talk directly to Firestore for reads and real-time updates.",
        "Cloud Functions handle anything privileged: payment intents, booking confirmation, and outbound SMS/email.",
        "GitHub Actions runs Jest and React Testing Library on every push and deploys on merge.",
      ],
      challenges: [
        "TODO: a real challenge, e.g. preventing double-booking of the same driveway slot, and how you solved it.",
      ],
      results: [
        "TODO: an outcome, e.g. number of test users, listings, grade/award, or demo-day feedback.",
      ],
    },
  },
  {
    slug: "portfolio",
    title: "This Portfolio",
    problem:
      "A portfolio that is itself a working example of a production-style .NET + React deployment.",
    role: "Solo developer",
    period: "2026",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "C#", "Azure Functions", "xUnit", "Azure Static Web Apps"],
    links: {
      demo: "https://ambitious-cliff-0d6dd630f.5.azurestaticapps.net",
      repo: "https://github.com/maazsalim/portfolio",
    },
    caseStudy: {
      problem:
        "Recruiters skim portfolios in seconds, and most portfolio repos show nothing about back-end skills. I wanted a fast static site backed by a small, properly tested C# API.",
      approach: [
        "Statically exported Next.js site with typed content files, so copy changes never touch components.",
        "C# Azure Functions (isolated worker) for the contact form and a cached GitHub activity feed.",
        "Services behind interfaces, dependency injection, DTOs and server-side validation, all covered by xUnit tests.",
      ],
      architecture: [
        "Azure Static Web Apps serves the static site from a global CDN and hosts the managed Functions API under /api.",
        "POST /api/contact validates input, checks a honeypot and rate limit, then sends email through Resend.",
        "GET /api/github calls the GitHub REST API, trims the response to a small DTO, and caches it for an hour.",
        "GitHub Actions builds and deploys both halves on every push to main.",
      ],
      challenges: [
        "Keeping the site fully static (no server rendering) while still showing live data, solved by loading the GitHub feed client-side and degrading gracefully if the API fails.",
      ],
      results: [
        "TODO: Lighthouse scores once deployed.",
      ],
    },
  },
  {
    slug: "face-detection",
    title: "Deep Learning Face Detection",
    problem: "Train a reliable face detector from a very small hand-collected dataset.",
    role: "Solo developer",
    period: "Sep 2022",
    tech: ["Python", "TensorFlow / Keras", "OpenCV", "Albumentations"],
    links: {
      repo: undefined, // TODO: GitHub link
    },
    caseStudy: {
      problem:
        "Face detection models usually need thousands of labelled images. I wanted to see how far a small personal dataset could go with augmentation and transfer learning.",
      approach: [
        "Captured and labelled a small set of images with OpenCV.",
        "Used Albumentations to augment them into a much larger, more varied training set.",
        "Fine-tuned a pre-trained VGG16 backbone with new classification and bounding-box regression heads.",
      ],
      architecture: [
        "VGG16 feature extractor → two heads: a classifier (face / no face) and a regressor (bounding-box coordinates).",
      ],
      challenges: [
        "TODO: e.g. overfitting on a tiny dataset and how augmentation or layer freezing fixed it.",
      ],
      results: [
        "TODO: e.g. validation accuracy or real-time FPS on a webcam feed.",
      ],
    },
  },
];
