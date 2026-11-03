import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import enUS from "./src/i18n/locales/en-US";

function flatten(value: unknown, path = "", result: Record<string, string> = {}) {
    if (typeof value === "string") result[path] = value;
    else {
        assert(value && typeof value === "object", `Invalid locale value: ${path}`);
        for (const [key, child] of Object.entries(value)) flatten(child, path ? `${path}.${key}` : key, result);
    }
    return result;
}

const reference = flatten(enUS);
const tokens = (value: string) => [...value.matchAll(/\{\{.*?\}\}|<[^>]+>/g)].map(([token]) => token).sort();
for (const file of (await readdir(new URL("./src/i18n/locales/", import.meta.url))).filter((file) => file.endsWith(".ts")).sort()) {
    const { default: locale } = await import(`./src/i18n/locales/${file}`);
    const actual = flatten(locale);
    assert.deepEqual(Object.keys(actual).sort(), Object.keys(reference).sort(), `${file}: key mismatch`);
    for (const key of Object.keys(reference)) {
        assert(actual[key].trim() || !reference[key].trim(), `${file}: empty translation at ${key}`);
        assert.deepEqual(tokens(actual[key]), tokens(reference[key]), `${file}: placeholder/tag mismatch at ${key}`);
    }
    console.log(`${file}: ${Object.keys(actual).length} keys — keys, placeholders and HTML tags OK`);
}
