import type { ReactNode } from "react";
import { Sidebar } from "@/components/dash/Sidebar";

export default function DashLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 bg-zinc-950 px-8 py-8">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </>
  );
}
