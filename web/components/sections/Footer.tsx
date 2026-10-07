export function Footer() {
  return (
    <footer className="max-w-md pb-16 text-sm text-fg-muted sm:pb-0">
      <p>
        Layout inspired by{" "}
        <a
          href="https://brittanychiang.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-fg hover:text-accent"
        >
          Brittany Chiang
        </a>
        . Built with Next.js, Tailwind CSS and C# Azure Functions, deployed on Azure Static Web Apps.
      </p>
    </footer>
  );
}
