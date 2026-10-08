export function Footer() {
  return (
    <footer className="max-w-md pb-16 text-sm text-fg-muted sm:pb-0">
      <p>
        Built with Next.js, Tailwind CSS and C# Azure Functions, deployed on{" "}
        <a
          href="https://github.com/maazsalim/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-fg hover:text-accent"
        >
          Azure Static Web Apps
          <span className="sr-only"> (source code on GitHub, opens in a new tab)</span>
        </a>
        .
      </p>
    </footer>
  );
}
