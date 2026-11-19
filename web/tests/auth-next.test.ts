import { describe, expect, test } from "bun:test";
import { authReturnPath, hasSessionUser, loginRedirect, safeNext } from "../src/services/api/auth";
import { readAgentUrlBootstrap } from "../src/lib/agent/agent-url-bootstrap";

describe("session validation", () => {
    test("accepts a real user", () => {
        expect(hasSessionUser({ user: { id: "user-1", email: "user@example.com", name: "User" } })).toBe(true);
    });
    test("rejects empty sessions, HTML fallbacks and malformed user objects", () => {
        for (const data of [null, undefined, "<!doctype html><html></html>", {}, { user: null }, { user: {} }, { user: { id: "user-1" } }, { user: { id: "", email: "user@example.com", name: "User" } }]) {
            expect(hasSessionUser(data)).toBe(false);
        }
    });
});

describe("agent launch authentication", () => {
    test("keeps credentials in the fragment across login and signup", () => {
        const hash = "#agentUrl=http%3A%2F%2Flocalhost%3A3010&agentToken=test-token";
        const login = new URL(loginRedirect("/canvas", "?view=fit", hash), "https://canvas.example");
        expect(login.searchParams.get("next")).toBe("/canvas?view=fit");
        expect(login.search).not.toContain("test-token");
        expect(login.hash).toBe(hash);
        const destination = new URL(authReturnPath(login.searchParams.get("next"), login.hash), login.origin);
        expect(destination.pathname).toBe("/canvas");
        expect(readAgentUrlBootstrap(destination.hash)?.token).toBe("test-token");
    });
    test("supports missing fragments and rejects external return URLs", () => {
        expect(authReturnPath(null, "")).toBe("/app");
        expect(authReturnPath("https://evil.example", "#node")).toBe("/app#node");
        expect(loginRedirect("/app", "", "")).toBe("/login?next=%2Fapp");
    });
});

describe("authentication return path", () => {
    test("preserves app routes, queries and fragments", () => {
        expect(safeNext("/canvas/project-1?view=fit#node")).toBe("/canvas/project-1?view=fit#node");
        expect(safeNext("/app")).toBe("/app");
        expect(safeNext("/image?model=flux")).toBe("/image?model=flux");
    });
    test("defaults empty paths to the app", () => {
        expect(safeNext(null)).toBe("/app");
        expect(safeNext("")).toBe("/app");
    });
    test("rejects external URLs and non-app destinations", () => {
        for (const value of ["https://example.com", "//example.com", "/\\example.com", "/login", "/signup", "/api/auth/sign-out", "/canvas\\example.com", "/application"]) {
            expect(safeNext(value)).toBe("/app");
        }
    });
});
