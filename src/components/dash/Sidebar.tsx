"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { StoreSwitcher } from "../StoreSwitcher";
import { useEffect, useState } from "react";

const nav = [
  { href: "/app/analytics", label: "Analytics" },
  { href: "/app/tasks", label: "Tasks" },
  { href: "/app/knowledge", label: "Knowledge" },
  { href: "/app/playbooks", label: "Playbooks" },
  { href: "/app/cashflow", label: "Cash Flow" },
  { href: "/app/integrations", label: "Integrations" },
  { href: "/app/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [storeName, setStoreName] = useState("Slim&Fit");

  useEffect(() => {
    const storeId = searchParams.get("store");
    if (storeId) {
      fetch(`/api/stores`)
        .then((r) => r.json())
        .then((d) => {
          if (d.ok) {
            const store = d.data.stores.find((s: any) => s.id === storeId);
            setStoreName(store?.name || "Slim&Fit");
          }
        })
        .catch(() => setStoreName("Slim&Fit"));
    }
  }, [searchParams]);

  // Preserve store query param in nav links
  const storeParam = searchParams.get("store");
  const queryString = storeParam ? `?store=${storeParam}` : "";

  return (
    <aside className="w-[240px] shrink-0 border-r border-white/10 bg-zinc-950 px-4 py-6">
      <div className="mb-6">
        <div className="text-xs font-medium text-zinc-400">Mers App</div>
        <div className="mt-1 text-lg font-semibold tracking-tight">{storeName}</div>
        <div className="mt-3">
          <StoreSwitcher />
        </div>
      </div>

      <nav className="space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={`${item.href}${queryString}`}
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-xl bg-zinc-900/40 p-3 text-xs text-zinc-400 ring-1 ring-white/10">
        <div className="font-medium text-zinc-200">Multi-store ready</div>
        <div className="mt-1">Switch between stores using the dropdown above.</div>
      </div>
    </aside>
  );
}
