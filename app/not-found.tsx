export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f7f5ef] px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
        Page not found
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        This page doesn&apos;t exist or was moved.
      </p>
      <a
        href="/"
        className="mt-8 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Back to home
      </a>
    </main>
  );
}
