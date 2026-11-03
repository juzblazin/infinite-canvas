import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";

const values = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
    },
});
const { default: i18n, appLanguages, changeAppLocale } = await import("../src/i18n");

test("English is the default with empty storage", () => {
    expect(i18n.resolvedLanguage).toBe("en-US");
    expect(i18n.t("common.save")).toBe("Save");
});

test("every language switches UI strings and persists the selection", async () => {
    const saves = ["Save", "Guardar", "Speichern", "Enregistrer", "Сохранить", "Salvar", "Kaydet", "保存"];
    for (const [index, { value }] of appLanguages.entries()) {
        await changeAppLocale(value);
        expect(i18n.resolvedLanguage).toBe(value);
        expect(i18n.t("common.save")).toBe(saves[index]);
        expect(values.get("infinite-canvas:locale")).toBe(value);
        expect(i18n.t("common.created", { date: "2026-01-01" })).toContain("2026-01-01");
    }
});

test("reload restores supported choices and rejects invalid stored locales", () => {
    for (const stored of ["fr-FR", "pt-BR", "invalid", ""]) {
        const result = spawnSync(
            process.execPath,
            [
                "-e",
                `
            globalThis.localStorage = { getItem: () => ${JSON.stringify(stored)} };
            const { default: i18n } = await import('./src/i18n');
            console.log(i18n.resolvedLanguage);
        `,
            ],
            { cwd: new URL("..", import.meta.url), encoding: "utf8" },
        );
        expect(result.status).toBe(0);
        expect(result.stdout.trim()).toBe(stored && stored !== "invalid" ? stored : "en-US");
    }
});
