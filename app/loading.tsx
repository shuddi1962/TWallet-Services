export default function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-700 border-t-brand-500" />
        <p className="text-sm text-surface-400">Loading...</p>
      </div>
    </div>
  );
}