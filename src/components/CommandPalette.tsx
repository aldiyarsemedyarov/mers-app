"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type Command = {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  category: string;
};

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const commands: Command[] = [
    { id: "analytics", label: "Analytics", icon: "📊", action: () => router.push("/app/analytics"), category: "Navigation" },
    { id: "tasks", label: "Tasks", icon: "✅", action: () => router.push("/app/tasks"), category: "Navigation" },
    { id: "knowledge", label: "Knowledge", icon: "🧠", action: () => router.push("/app/knowledge"), category: "Navigation" },
    { id: "playbooks", label: "Playbooks", icon: "📋", action: () => router.push("/app/playbooks"), category: "Navigation" },
    { id: "cashflow", label: "Cash Flow", icon: "💰", action: () => router.push("/app/cashflow"), category: "Navigation" },
    { id: "integrations", label: "Integrations", icon: "🔌", action: () => router.push("/app/integrations"), category: "Navigation" },
    { id: "settings", label: "Settings", icon: "⚙️", action: () => router.push("/app/settings"), category: "Navigation" },
  ];

  const filteredCommands = search
    ? commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(search.toLowerCase())
      )
    : commands;

  const handleCommand = useCallback((command: Command) => {
    command.action();
    setIsOpen(false);
    setSearch("");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2">
        <div className="mx-4 overflow-hidden rounded-2xl bg-zinc-900/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commands..."
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
              autoFocus
            />
            <kbd className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
              ESC
            </kbd>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-zinc-500">
                No commands found
              </div>
            ) : (
              filteredCommands.map((cmd, idx) => (
                <button
                  key={cmd.id}
                  onClick={() => handleCommand(cmd)}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-white/5"
                  style={{
                    animation: `staggerFade 0.2s ease ${idx * 30}ms both`,
                  }}
                >
                  <span className="text-xl">{cmd.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      {cmd.label}
                    </div>
                    <div className="text-xs text-zinc-500">{cmd.category}</div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-white/10 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Press ⌘K to toggle</span>
              <span>↵ to select</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
