export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-[var(--color-muted)]">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-border)]"
        style={{ borderTopColor: 'var(--color-primary)' }}
      />
      <p className="text-sm">{label}</p>
    </div>
  );
}
