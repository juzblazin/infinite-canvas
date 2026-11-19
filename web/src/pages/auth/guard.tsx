import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AUTH_FRAGMENT_KEY, authClient, loginRedirect } from "@/services/api/auth";

export function AuthGuard() {
    const { data, isPending, error, refetch } = authClient.useSession();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    useEffect(() => {
        if (!data?.user || location.hash) return;
        const hash = sessionStorage.getItem(AUTH_FRAGMENT_KEY);
        if (!hash) return;
        sessionStorage.removeItem(AUTH_FRAGMENT_KEY);
        navigate(location.pathname + location.search + hash, { replace: true });
    }, [data, location, navigate]);
    if (isPending) return <div className="grid min-h-dvh place-content-center">{t("saas.loading")}</div>;
    if (error)
        return (
            <div className="grid min-h-dvh place-content-center gap-4" role="alert">
                {t("saas.sessionError")}
                <button onClick={() => refetch()}>{t("saas.retry")}</button>
            </div>
        );
    if (!data) return <Navigate to={loginRedirect(location.pathname, location.search, location.hash)} replace />;
    return <Outlet />;
}
