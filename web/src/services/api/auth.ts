import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const AUTH_FRAGMENT_KEY = "infinite-canvas:auth-fragment";

export function hasSessionUser(data: unknown): data is { user: { id: string; email: string; name: string } } {
    if (!data || typeof data !== "object" || !("user" in data)) return false;
    const user = data.user;
    return Boolean(user && typeof user === "object" && "id" in user && typeof user.id === "string" && user.id && "email" in user && typeof user.email === "string" && "name" in user && typeof user.name === "string");
}

export function loginRedirect(pathname: string, search: string, hash: string) {
    return `/login?next=${encodeURIComponent(pathname + search)}${hash}`;
}

export function authReturnPath(value: string | null, hash: string) {
    return safeNext(value).split("#")[0] + hash;
}

export async function getAuthConfig(): Promise<{ googleEnabled: boolean }> {
    const response = await fetch("/api/config");
    if (!response.ok) throw new Error("Unable to load authentication configuration");
    return response.json();
}

export function safeNext(value: string | null) {
    if (!value || !/^\/(app|image|video|assets|prompts|canvas|config)(\/|\?|#|$)/.test(value) || value.includes("\\")) return "/app";
    return value;
}
