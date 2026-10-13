import type { Project } from "./types";

/** Display order = array order. Keep 3–5 projects, strongest first. */
export const projects: Project[] = [
  {
    slug: "parkitplace",
    title: "ParkItPlace",
    problem:
      "Commuters near McMaster struggle to find affordable parking while nearby driveways sit empty all day.",
    role: "Developer on a 6-person team · listings, search and suggested pricing, web and mobile",
    period: "Sep 2024 – Mar 2025",
    tech: ["React", "React Native", "Firebase", "Express", "Stripe Connect", "Leaflet", "Jest"],
    // No public source: the capstone repo is private.
    links: {},
    video: {
      src: "/videos/parkitplace-demo.mp4",
      poster: "/videos/parkitplace-demo-poster.jpg",
      description: "Walkthrough of ParkItPlace, under 2 minutes",
    },
    caseStudy: {
      problem:
        "Parking near McMaster is expensive and hard to find, while homeowners nearby have driveways that go unused for most of the day. ParkItPlace is a marketplace that connects the two: owners list a spot and earn from it, and commuters find, book and pay for one nearby, with ratings to build trust on both sides.",
      approach: [
        "Built by a six-person capstone team as a React web app and a React Native mobile app on Firebase (Firestore, Cloud Functions, Authentication), with an Express API for payments.",
        "I built the listing experience on the web: the listings page and listing cards that commuters browse, the listing detail page, and user profile pages.",
        "I built the create and update listing pages: a form for the address, description, per-hour or per-day pricing and photos, with a live preview that updates as the owner fills it in, and an edit flow that pre-fills from the saved listing.",
        "I built suggested pricing: when an owner creates a listing, the app finds listings in a bounding box around the address and recommends a price from their average, then checks a public events API and raises the suggestion by a set percentage when an event is happening nearby, so new owners don't have to guess and can earn more on busy days.",
        "I built search: a search bar matching on address and description, filters for price range, availability and dates, and sorting by price or date, all updating the results as you change them.",
        "Later, I brought the same listing and user pages to the React Native mobile app.",
      ],
      architecture: [
        "React and React Native clients read and write Firestore directly and subscribe to real-time updates.",
        "Listings are Firestore documents; create and update geocode the address so each listing carries coordinates for the map.",
        "Payments run through Express routes on Cloud Functions using Stripe Connect: owners onboard as Express accounts, commuters pay on a Stripe-hosted Checkout page, and payouts and refunds are recorded in Firestore.",
        "Teammates built the map, real-time chat, ratings and reviews, authentication, payments, and SMS and email notifications with Twilio and SendGrid.",
        "Deployment is automated with GitHub Actions; tests use Jest and React Testing Library.",
      ],
      challenges: [
        "One form, two jobs: the same page creates and edits listings, so editing had to pre-fill reliably from the stored listing, and the live preview had to stay in sync with every field change.",
        "Two pricing models: a spot can be priced per hour or per day, so the cards, detail page and preview had to show the right unit consistently, and price sorting and range filters had to rank hourly and daily listings correctly in the same results.",
        "Web to mobile: rebuilding the listing and user pages in React Native meant reworking layouts for small screens while keeping the same Firestore data and behaviour as the web app.",
      ],
      results: [
        "Delivered as the team's final-year capstone (Sep 2024 – Mar 2025); the demo above walks through the finished app.",
        "The features I built are where the marketplace happens: owners publish and price their spots through them, and commuters search and browse through them, on web and mobile.",
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
        "Lighthouse 100 in all four categories (performance, accessibility, best practices, SEO) on both mobile and desktop, measured on the live site.",
        "Every deploy is gated on lint, typecheck and the full xUnit suite passing in CI.",
      ],
    },
  },
];
