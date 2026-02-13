import type { ReactNode } from "react";

export const metadata = {
  title: "Mers App",
  description: "Mers App — autonomous e-commerce COO",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return children;
}
