// Simple auth utilities for MVP
// TODO: Replace with full Supabase Auth later

import { prisma } from "./prisma";
import { cookies } from "next/headers";

const SESSION_COOKIE = "mers_session";

export async function getCurrentUser() {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE);
  if (!sessionCookie) return null;

  // For MVP, session value is just the user ID
  // TODO: Use proper JWT/session tokens
  const userId = sessionCookie.value;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        stores: {
          where: { active: true },
          include: {
            integrations: true,
          },
        },
      },
    });
    return user;
  } catch {
    return null;
  }
}

export async function getOrCreateDevUser() {
  // For MVP: create/return a dev user automatically
  const email = "dev@mers.app";

  let user = await prisma.user.findUnique({
    where: { email },
    include: {
      stores: {
        where: { active: true },
        include: {
          integrations: true,
        },
      },
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: "Aldiyar (Dev)",
      },
      include: {
        stores: {
          where: { active: true },
          include: {
            integrations: true,
          },
        },
      },
    });
  }

  return user;
}

export async function setSession(userId: string) {
  (await cookies()).set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
