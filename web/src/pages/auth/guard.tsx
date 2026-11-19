import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authClient } from "@/services/api/auth";

export function AuthGuard() {
    const { data, isPending, error, refetch } = authClient.useSession();
    const location = useLocation();
    const { t } = useTranslation();
    if (isPending) return <div className="grid min-h-dvh place-content-center">{t("saas.loading")}</div>;
    if (error)
        return (
            <div className="grid min-h-dvh place-content-center gap-4" role="alert">
                {t("saas.sessionError")}
                <button onClick={() => refetch()}>{t("saas.retry")}</button>
            </div>
        );
    if (!data) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search + location.hash)}`} replace />;
    return <Outlet />;
}
