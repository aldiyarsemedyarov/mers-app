import type { ReactNode } from "react";

export const metadata = {
  title: "Mers App",
  description: "Mers App — autonomous e-commerce COO",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {children}
      </div>
    </div>
  );
}
