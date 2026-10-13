import type { Article } from "./types";

/**
 * Newest first. Table and column names in code samples are deliberately
 * generic: these describe real client systems.
 */
export const articles: Article[] = [
  {
    slug: "sync-2-5-hours-to-6-minutes",
    kicker: "Engineering notes",
    title: "How we cut a 2.5-hour sync to 6 minutes",
    summary:
      "Rebuilding a loyalty dashboard's nightly data sync taught us that the slow part wasn't the database work. It was everything we did around it.",
    published: "2026-10-13",
    body: [
      {
        type: "barChart",
        caption: "One full sync, drawn to the same scale",
        unit: "min",
        max: 150,
        ticks: [0, 30, 60, 90, 120, 150],
        bars: [
          { label: "Before · 45-second slices with waits between them", value: 150, display: "up to 150 min" },
          { label: "After · one continuous background job", value: 6, display: "≈ 6 min", highlight: true },
        ],
      },

      { type: "heading", text: "The setup" },
      {
        type: "paragraph",
        text: "The dashboard reports on a loyalty program with roughly half a million members. Once a day, it asks the marketing platform for an export of every member in the program, waits for the file to be prepared, downloads it, and saves each member's profile and activity into PostgreSQL. Everything else on the dashboard reads from those tables.",
      },
      {
        type: "paragraph",
        text: "The first version of the app was built quickly on a serverless platform, and it worked. But a full sync took between one and two and a half hours, saving around 50 to 100 members a second.",
      },

      { type: "heading", text: "Where the time actually went" },
      {
        type: "paragraph",
        text: "Our first guess was that the database was the bottleneck. It wasn't. Each batch of 200 members took well under a second to save. The real cost was the structure the platform forced on the job.",
      },
      {
        type: "list",
        items: [
          {
            lead: "A hard time limit.",
            text: "Serverless requests were cut off after about 55 seconds, so the sync could only work for 45 seconds at a time before stopping and saving its place.",
          },
          {
            lead: "Waiting to resume.",
            text: "A scheduled timer started the next slice roughly once a minute. Much of every minute was spent idle or starting up again.",
          },
          {
            lead: "Starting up again.",
            text: "Each new slice reloaded its position, re-read the export file from storage up to where the last one stopped, and refreshed locks and heartbeats so two slices never overlapped.",
          },
          {
            lead: "A long trip per batch.",
            text: "Every batch travelled over the internet through a hosted web API, under a tight per-query time limit.",
          },
          {
            lead: "Extra bookkeeping.",
            text: "To work out later who had left the program, every slice also wrote each member it had seen into a tracking table.",
          },
        ],
      },
      {
        type: "callout",
        text: "The batch size and the SQL were the same before and after: 200 members, saved in one database call. The speed-up came from removing the machinery around the work, not from doing the work differently.",
      },

      { type: "heading", text: "What we changed" },
      {
        type: "paragraph",
        text: "We rebuilt the app as a .NET service that runs continuously, with a direct connection to PostgreSQL. That removed the time limit, and with it the reason for most of the old design. The sync became one background job that runs from start to finish:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          { text: "Request the export and receive a download link." },
          { text: "Check every 5 seconds until the file is ready, then download it once." },
          { text: "Read it line by line and save members in batches of 200." },
          { text: "Finish in one pass: flag members who left the program and record the day's headline figures." },
        ],
      },

      { type: "subheading", text: "Same batch, shorter trip" },
      {
        type: "paragraph",
        text: "The original already did the smart part: each batch of 200 members travelled as one JSON list and was unpacked and saved inside the database in a single call. We kept that. Each batch is still one JSON parameter, unpacked with `jsonb_to_recordset`, with the member and its related records saved together in one transaction.",
      },
      {
        type: "paragraph",
        text: "What changed is the trip. Before, each batch left a serverless function, crossed the internet and went through a hosted web API to reach the database, under a tight per-query time limit that sometimes forced a batch to be split and retried. Now the app holds a direct connection to PostgreSQL, so the same batch takes a fraction of the time.",
      },
      {
        type: "code",
        language: "sql",
        caption: "The batch statement, unchanged from the original.",
        code: `INSERT INTO records (record_id, field_a, field_b, …)
SELECT record_id, field_a, field_b, …
FROM jsonb_to_recordset(@batch) AS r(record_id text, field_a text, field_b int, …)
ON CONFLICT (record_id) DO UPDATE SET
    field_a = EXCLUDED.field_a, field_b = EXCLUDED.field_b, …;`,
      },

      { type: "subheading", text: "Skip what hasn't changed" },
      {
        type: "paragraph",
        text: "Every member's line in the export gets a short fingerprint. If it matches the one saved last time, the member is skipped entirely. On a typical day most members haven't changed, so later syncs write far less than the first one.",
      },

      { type: "subheading", text: "Do the “who left?” check once" },
      {
        type: "paragraph",
        text: "Instead of writing a tracking row per member per slice, the job keeps the IDs it has seen in memory. At the end it streams them into a temporary table with PostgreSQL's binary `COPY` and flags everyone missing from the export with a single `UPDATE`.",
      },
      {
        type: "code",
        language: "sql",
        code: `CREATE TEMP TABLE seen (record_id text PRIMARY KEY) ON COMMIT DROP;
COPY seen (record_id) FROM STDIN (FORMAT BINARY);   -- every ID from this export
UPDATE records r SET is_active = false
WHERE r.is_active
  AND NOT EXISTS (SELECT 1 FROM seen s WHERE s.record_id = r.record_id);`,
      },

      { type: "subheading", text: "Stay polite to the database" },
      {
        type: "paragraph",
        text: "After each batch the job pauses for about a third of the time that batch took, at most 1.5 seconds. People can keep using the dashboard while a sync runs, and the job still finishes quickly.",
      },

      { type: "heading", text: "The results" },
      {
        type: "table",
        caption: "Before and after the rebuild",
        head: ["Measure", "Before", "After"],
        rows: [
          ["Full sync, about half a million members", "1 to 2.5 hours", "≈ 6 minutes"],
          ["Members saved per second", "50 to 100", "≈ 2,000+"],
          ["Members per batch", "200", "200"],
          [
            "Moving parts",
            "Slices, timer, cursor, locks, heartbeats, watchdog, stored export, tracking table",
            "One background job",
          ],
        ],
      },
      {
        type: "paragraph",
        text: "We checked the output, not just the speed. Every count the app produced was recalculated with independent SQL straight from the raw export data and matched exactly. Figures for a month that had already closed also matched the original system's exactly; more recent figures differed only where members had changed between the two runs.",
      },
      {
        type: "callout",
        text: "One caveat about the 6 minutes: we measured it with the database on the same machine as the app. In the cloud the database sits on another server, so each round trip takes longer. We expect a slower number there, still far below the original.",
      },

      { type: "heading", text: "What it cost us" },
      { type: "paragraph", text: "A long-running job has its own trade-offs, and we planned for them:" },
      {
        type: "list",
        items: [
          { lead: "The app must stay running.", text: "The schedule lives inside the app, so the host needs to keep it awake." },
          { lead: "One instance.", text: "The job assumes a single copy of the app. Running two would need a proper database lock." },
          {
            lead: "A restart stops the sync.",
            text: "It isn't resumed. The next sync starts fresh, which is quick because unchanged members are skipped.",
          },
          {
            lead: "A time limit on the wait, not the work.",
            text: "The job gives up if the export isn't ready within 30 minutes (configurable), so a stuck export can't block every later sync.",
          },
        ],
      },

      { type: "heading", text: "What we'd tell ourselves at the start" },
      {
        type: "list",
        items: [
          { text: "Measure where the time goes before optimising the obvious suspect." },
          { text: "Platform limits shape architecture. When the limit goes away, the workarounds built around it should go too." },
          { text: "Prefer set-based SQL. One statement over a batch or a temporary table beats many small calls." },
          { text: "Check correctness independently. A faster sync is only an improvement if the numbers are still right." },
        ],
      },
    ],
  },
];
