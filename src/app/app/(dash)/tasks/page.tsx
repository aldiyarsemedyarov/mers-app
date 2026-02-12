export default function TasksPage() {
  return (
    <div className="rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/10">
      <div className="text-xs font-medium text-zinc-400">Tasks</div>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
        Coming soon
      </h1>
      <p className="mt-2 text-sm text-zinc-300">
        This will hold the execution queue (daily priorities, kill rules, scale
        triggers).
      </p>
    </div>
  );
}
