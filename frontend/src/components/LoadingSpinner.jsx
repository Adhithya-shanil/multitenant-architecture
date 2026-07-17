export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
