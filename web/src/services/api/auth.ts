import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const AUTH_FRAGMENT_KEY = "infinite-canvas:auth-fragment";

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
