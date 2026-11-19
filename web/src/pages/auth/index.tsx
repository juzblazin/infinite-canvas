import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { authClient, getAuthConfig, safeNext } from "@/services/api/auth";

export default function AuthPage() {
    const signup = useLocation().pathname === "/signup";
    const [params] = useSearchParams();
    const next = safeNext(params.get("next"));
    const navigate = useNavigate();
    const { t } = useTranslation();
    const session = authClient.useSession();
    const [google, setGoogle] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        getAuthConfig()
            .then((config) => setGoogle(config.googleEnabled))
            .catch(() => setGoogle(false));
    }, []);
    if (session.isPending) return <div className="grid min-h-dvh place-content-center">{t("saas.loading")}</div>;
    if (session.data) return <Navigate to={next} replace />;

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setError("");
        setBusy(true);
        try {
            const credentials = { email: String(form.get("email")), password: String(form.get("password")) };
            const result = signup ? await authClient.signUp.email({ ...credentials, name: String(form.get("name")) }) : await authClient.signIn.email(credentials);
            if (result.error) setError(result.error.message || t("saas.authError"));
            else navigate(next, { replace: true });
        } catch {
            setError(t("saas.authError"));
        } finally {
            setBusy(false);
        }
    }

    async function googleLogin() {
        setBusy(true);
        setError("");
        try {
            const result = await authClient.signIn.social({ provider: "google", callbackURL: new URL(next, window.location.origin).href });
            if (result.error) setError(result.error.message || t("saas.authError"));
        } catch {
            setError(t("saas.authError"));
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="min-h-dvh bg-[#101110] px-6 py-10 text-[#f3f2ec]">
            <Link to="/" className="inline-flex items-center gap-2 text-sm !text-white/60 hover:!text-white">
                <ArrowLeft size={16} />
                {t("saas.back")}
            </Link>
            <div className="mx-auto max-w-sm py-20">
                <img src="/logo.svg" className="mb-10 size-10 invert" alt="" />
                <h1 className="text-4xl tracking-tight">{t(signup ? "saas.signupTitle" : "saas.loginTitle")}</h1>
                <p className="mb-10 mt-4 text-white/50">{t("saas.authDescription")}</p>
                {error && (
                    <p role="alert" className="mb-5 rounded-lg border border-red-400/30 p-3 text-sm text-red-300">
                        {error}
                    </p>
                )}
                {google && (
                    <>
                        <button disabled={busy} onClick={googleLogin} className="mb-5 w-full rounded-lg border border-white/20 p-3 hover:bg-white/5 disabled:opacity-50">
                            {t("saas.google")}
                        </button>
                        <p className="mb-5 text-center text-xs text-white/40">{t("saas.or")}</p>
                    </>
                )}
                <form onSubmit={submit} className="space-y-5">
                    {signup && (
                        <label className="block text-sm">
                            {t("saas.name")}
                            <input name="name" autoComplete="name" required className="mt-2 block w-full rounded-lg border border-white/15 bg-white/5 p-3 outline-none focus:border-[#dbfc7b]" />
                        </label>
                    )}
                    <label className="block text-sm">
                        {t("saas.email")}
                        <input name="email" type="email" autoComplete="email" required className="mt-2 block w-full rounded-lg border border-white/15 bg-white/5 p-3 outline-none focus:border-[#dbfc7b]" />
                    </label>
                    <label className="block text-sm">
                        {t("saas.password")}
                        <input
                            name="password"
                            type="password"
                            minLength={8}
                            autoComplete={signup ? "new-password" : "current-password"}
                            required
                            placeholder={t("saas.passwordHint")}
                            className="mt-2 block w-full rounded-lg border border-white/15 bg-white/5 p-3 outline-none focus:border-[#dbfc7b]"
                        />
                    </label>
                    <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#dbfc7b] p-3 font-medium !text-[#101110] hover:bg-[#e8ffa8] disabled:opacity-50">
                        {t(busy ? "saas.submitting" : signup ? "saas.createAccount" : "saas.login")}
                        <ArrowRight size={16} />
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-white/50">
                    {t(signup ? "saas.haveAccount" : "saas.needAccount")}{" "}
                    <Link className="!text-[#dbfc7b]" to={`${signup ? "/login" : "/signup"}?next=${encodeURIComponent(next)}`}>
                        {t(signup ? "saas.login" : "saas.signup")}
                    </Link>
                </p>
            </div>
        </main>
    );
}
