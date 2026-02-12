import Link from "next/link";

export default function AppHome() {
  return (
    <div className="flex w-full items-center justify-center p-8">
      <div className="w-full max-w-xl rounded-2xl bg-zinc-900/60 p-6 ring-1 ring-white/10">
        <div className="text-sm text-zinc-400">Mers App</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Dashboard (transition in progress)</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          We’re porting the YC demo UI into this real app cleanly (React components) and wiring it to live Shopify/Meta APIs.
        </p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/app/analytics"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
          >
            Open Analytics
          </Link>
          <a
            href="/api/health"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-700"
          >
            API health
          </a>
        </div>
      </div>
    </div>
  );
}
