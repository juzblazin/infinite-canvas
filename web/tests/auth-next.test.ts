import { describe, expect, test } from "bun:test";
import { safeNext } from "../src/services/api/auth";

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
