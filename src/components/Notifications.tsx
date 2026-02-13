"use client";

import { useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
};

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New order received",
      message: "Order #1234 - $69.00",
      time: "2 min ago",
      read: false,
      type: "success",
    },
    {
      id: "2",
      title: "Low inventory alert",
      message: "DermaLuxe Roller - 5 units left",
      time: "1h ago",
      read: false,
      type: "warning",
    },
    {
      id: "3",
      title: "Ad campaign optimized",
      message: "ROAS improved by 15%",
      time: "3h ago",
      read: true,
      type: "info",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const typeColors = {
    info: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    success: "bg-green-500/10 text-green-400 ring-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
    error: "bg-red-500/10 text-red-400 ring-red-500/20",
  };

  const typeIcons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900/60 text-zinc-300 ring-1 ring-white/10 transition-all hover:bg-zinc-900 hover:text-white"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-zinc-950">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-80 rounded-2xl bg-zinc-900/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="text-sm font-semibold text-white">Notifications</div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-zinc-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notif, idx) => (
                  <div
                    key={notif.id}
                    className={`border-b border-white/5 px-4 py-3 transition-colors hover:bg-white/5 ${
                      !notif.read ? "bg-blue-500/5" : ""
                    }`}
                    style={{
                      animation: `slideIn 0.2s ease ${idx * 50}ms both`,
                    }}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ring-1 ${
                          typeColors[notif.type]
                        }`}
                      >
                        {typeIcons[notif.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">
                          {notif.title}
                        </div>
                        <div className="mt-1 text-xs text-zinc-400">
                          {notif.message}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          {notif.time}
                        </div>
                      </div>
                      {!notif.read && (
                        <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-4 py-3">
              <button className="w-full rounded-lg bg-white/5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
