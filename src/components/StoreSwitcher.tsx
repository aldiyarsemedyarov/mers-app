"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Store = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
};

export function StoreSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const currentStoreId = searchParams.get("store");

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setStores(d.data.stores);
          // If no store selected and we have stores, select the first active one
          if (!currentStoreId && d.data.stores.length > 0) {
            const firstActive = d.data.stores.find((s: Store) => s.active);
            if (firstActive) {
              const newParams = new URLSearchParams(searchParams.toString());
              newParams.set("store", firstActive.id);
              router.replace(`?${newParams.toString()}`);
            }
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const currentStore = stores.find((s) => s.id === currentStoreId) || stores[0];

  const handleStoreChange = (storeId: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("store", storeId);
    router.push(`?${newParams.toString()}`);
    setIsOpen(false);
  };

  if (loading || stores.length <= 1) {
    return null; // Don't show switcher if only one store
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-zinc-900/60 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-900 transition-colors ring-1 ring-white/10"
      >
        <span>{currentStore?.name || "Select Store"}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl bg-zinc-900 p-2 shadow-lg ring-1 ring-white/10">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleStoreChange(store.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  store.id === currentStoreId
                    ? "bg-white/10 text-white font-medium"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{store.name}</span>
                  {store.id === currentStoreId && (
                    <svg
                      className="h-4 w-4 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
