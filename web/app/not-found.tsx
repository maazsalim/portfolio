import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content" className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      <p className="text-sm font-semibold tracking-widest text-accent uppercase">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg-strong">Page not found</h1>
      <p className="mt-4">That page doesn&apos;t exist, or it moved.</p>
      <Link href="/" className="mt-8 font-semibold text-accent hover:underline">
        Back to the homepage
      </Link>
    </main>
  );
}
