"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { NAME_COOKIE, ROLE_HOME, SESSION_COOKIE } from "@/lib/jwt";
import type { AuthData } from "@/lib/types";

export type FormState =
  | { error?: string; values?: { name?: string; email?: string; role?: string } }
  | undefined;

const EMAIL = /^\S+@\S+\.\S+$/;

function text(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim();
}

async function startSession(data: AuthData) {
  const store = await cookies();
  const options = {
    httpOnly: true, // JavaScript in the browser cannot read it
    sameSite: "lax" as const, // blocks cross-site POSTs
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    path: "/",
    maxAge: 60 * 60 * 24, // 24 h, same as the JWT
  };
  store.set(SESSION_COOKIE, data.token, options);
  store.set(NAME_COOKIE, data.name, options);
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");

  if (!EMAIL.test(email) || password.length < 6) {
    return { error: "Enter a valid email and a password of at least 6 characters.", values: { email } };
  }

  let data: AuthData;
  try {
    data = await apiFetch<AuthData>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  } catch (e) {
    const invalid = e instanceof ApiError && e.status === 401;
    return {
      error: invalid ? "Invalid email or password." : "Something went wrong. Please try again.",
      values: { email },
    };
  }

  await startSession(data);
  redirect(ROLE_HOME[data.role]); // must be OUTSIDE try/catch (redirect works by throwing)
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = text(formData, "name");
  const email = text(formData, "email");
  const role = text(formData, "role");
  const password = String(formData.get("password") ?? "");
  const values = { name, email, role };

  if (name.length < 2) return { error: "Please enter your name.", values };
  if (!EMAIL.test(email)) return { error: "Enter a valid email address.", values };
  if (password.length < 6) return { error: "Password must be at least 6 characters.", values };
  if (role !== "BUYER" && role !== "SUPPLIER") return { error: "Choose Buyer or Supplier.", values };

  let data: AuthData;
  try {
    data = await apiFetch<AuthData>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      return { error: "An account with this email already exists.", values };
    }
    if (e instanceof ApiError && e.status === 400) return { error: e.message, values };
    return { error: "Something went wrong. Please try again.", values };
  }

  await startSession(data);
  redirect(ROLE_HOME[data.role]);
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(NAME_COOKIE);
  redirect("/login");
}