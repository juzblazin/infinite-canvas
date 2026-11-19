import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export async function getAuthConfig(): Promise<{ googleEnabled: boolean }> {
    const response = await fetch("/api/config");
    if (!response.ok) throw new Error("Unable to load authentication configuration");
    return response.json();
}

export function safeNext(value: string | null) {
    if (!value || !/^\/(app|image|video|assets|prompts|canvas|config)(\/|\?|#|$)/.test(value) || value.includes("\\")) return "/app";
    return value;
}
