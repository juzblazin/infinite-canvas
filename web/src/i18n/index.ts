import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enUS from "@/i18n/locales/en-US";
import zhCN from "@/i18n/locales/zh-CN";
import esES from "@/i18n/locales/es-ES";
import deDE from "@/i18n/locales/de-DE";
import frFR from "@/i18n/locales/fr-FR";
import ruRU from "@/i18n/locales/ru-RU";
import ptBR from "@/i18n/locales/pt-BR";
import trTR from "@/i18n/locales/tr-TR";

export const appLanguages = [
    { value: "en-US", label: "English" },
    { value: "es-ES", label: "Español" },
    { value: "de-DE", label: "Deutsch" },
    { value: "fr-FR", label: "Français" },
    { value: "ru-RU", label: "Русский" },
    { value: "pt-BR", label: "Português" },
    { value: "tr-TR", label: "Türkçe" },
    { value: "zh-CN", label: "中文" },
] as const;

export type AppLocale = (typeof appLanguages)[number]["value"];

const LOCALE_STORAGE_KEY = "infinite-canvas:locale";
const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);

i18n.use(initReactI18next).init({
    resources: {
        "zh-CN": { translation: zhCN },
        "en-US": { translation: enUS },
        "es-ES": { translation: esES },
        "de-DE": { translation: deDE },
        "fr-FR": { translation: frFR },
        "ru-RU": { translation: ruRU },
        "pt-BR": { translation: ptBR },
        "tr-TR": { translation: trTR },
    },
    lng: appLanguages.find(({ value }) => value === storedLocale)?.value || "en-US",
    fallbackLng: "en-US",
    supportedLngs: appLanguages.map(({ value }) => value),
    initAsync: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
});

export function changeAppLocale(locale: AppLocale) {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    return i18n.changeLanguage(locale);
}

export default i18n;
