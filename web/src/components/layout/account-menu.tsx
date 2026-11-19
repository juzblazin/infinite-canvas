import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authClient, hasSessionUser } from "@/services/api/auth";

export function AccountMenu() {
    const { data } = authClient.useSession();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [busy, setBusy] = useState(false);
    if (!hasSessionUser(data)) return null;
    async function logout() {
        setBusy(true);
        setError(false);
        try {
            const result = await authClient.signOut();
            if (result.error) setError(true);
            else navigate("/login", { replace: true });
        } catch {
            setError(true);
        } finally {
            setBusy(false);
        }
    }
    return (
        <details className="relative text-sm">
            <summary className="!flex cursor-pointer list-none items-center gap-2 rounded px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10" aria-label={data.user.email}>
                <span className="grid size-6 place-content-center rounded-full border border-current/20 text-xs">{data.user.name.slice(0, 1).toUpperCase()}</span>
                <span className="hidden max-w-36 truncate lg:block">{data.user.email}</span>
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-border bg-background p-3 text-foreground shadow-sm">
                <p className="mb-2 truncate text-xs opacity-60">{data.user.email}</p>
                {error && (
                    <p role="alert" className="mb-2 whitespace-normal text-xs text-red-500">
                        {t("saas.authError")}
                    </p>
                )}
                <button disabled={busy} onClick={logout} className="w-full rounded px-2 py-2 text-left hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10">
                    {t(busy ? "saas.submitting" : "saas.logout")}
                </button>
            </div>
        </details>
    );
}
