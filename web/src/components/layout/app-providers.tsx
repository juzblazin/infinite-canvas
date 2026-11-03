import type { ReactNode } from "react";
import { useEffect } from "react";
import { ProConfigProvider } from "@ant-design/pro-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App, ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import zhCN from "antd/es/locale/zh_CN";
import esES from "antd/es/locale/es_ES";
import deDE from "antd/es/locale/de_DE";
import frFR from "antd/es/locale/fr_FR";
import ruRU from "antd/es/locale/ru_RU";
import ptBR from "antd/es/locale/pt_BR";
import trTR from "antd/es/locale/tr_TR";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "dayjs/locale/es";
import "dayjs/locale/de";
import "dayjs/locale/fr";
import "dayjs/locale/ru";
import "dayjs/locale/pt-br";
import "dayjs/locale/tr";
import { useTranslation } from "react-i18next";

import { ClientRootInit } from "@/components/layout/client-root-init";
import type { AppLocale } from "@/i18n";
import { getAntThemeConfig } from "@/lib/app-theme";
import { useThemeStore } from "@/stores/use-theme-store";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

const componentLocales = { "en-US": enUS, "zh-CN": zhCN, "es-ES": esES, "de-DE": deDE, "fr-FR": frFR, "ru-RU": ruRU, "pt-BR": ptBR, "tr-TR": trTR };
const dateLocales = { "en-US": "en", "zh-CN": "zh-cn", "es-ES": "es", "de-DE": "de", "fr-FR": "fr", "ru-RU": "ru", "pt-BR": "pt-br", "tr-TR": "tr" };

export function AppProviders({ children }: { children: ReactNode }) {
    const { i18n, t } = useTranslation();
    const theme = useThemeStore((state) => state.theme);
    const dark = theme === "dark";
    const locale = i18n.resolvedLanguage as AppLocale;

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
        document.documentElement.style.colorScheme = theme;
    }, [dark, theme]);

    useEffect(() => {
        document.documentElement.lang = locale;
        document.title = t("meta.title");
        document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));
        dayjs.locale(dateLocales[locale]);
    }, [locale, t]);

    return (
        <ConfigProvider locale={componentLocales[locale]} theme={getAntThemeConfig(dark)}>
            <ProConfigProvider dark={dark}>
                <App>
                    <QueryClientProvider client={queryClient}>
                        <ClientRootInit>{children}</ClientRootInit>
                    </QueryClientProvider>
                </App>
            </ProConfigProvider>
        </ConfigProvider>
    );
}
