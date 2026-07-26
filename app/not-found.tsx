import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-950 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-brand-500">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-surface-50">Page Not Found</h2>
        <p className="mt-2 text-surface-400">The page you are looking for does not exist or has been moved.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Go Home
          </Link>
          <Link
            href="/support"
            className="rounded-xl border border-surface-700 px-6 py-3 font-semibold text-surface-300 transition hover:border-surface-600 hover:text-surface-100"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}