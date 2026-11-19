import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, Check, Expand, Layers, Sparkles, Users, WandSparkles } from "lucide-react";
import { authClient } from "@/services/api/auth";
import "./landing.css";

const models = ["GPT Image", "Gemini / Nano Banana", "Flux", "Kling", "Veo", "Seedance"];
const plans = [
    { name: "Free", monthly: 0, annual: 0, credits: 100 },
    { name: "Starter", monthly: 24, annual: 19, credits: 1500 },
    { name: "Pro", monthly: 49, annual: 39, credits: 4000, rollover: 3 },
    { name: "Max", monthly: 99, annual: 79, credits: 10000, rollover: 4 },
    { name: "Team", monthly: 59, annual: 45, credits: 4500 },
];

export default function LandingPage() {
    const { t } = useTranslation();
    const { data: session } = authClient.useSession();
    const [annual, setAnnual] = useState(false);
    const reducedMotion = useReducedMotion();
    const features = t("saas.features", { returnObjects: true }) as { title: string; text: string; detail: string }[];
    const questions = t("saas.questions", { returnObjects: true }) as { question: string; answer: string }[];
    const icons = [Expand, Layers, WandSparkles, Users];
    const cta = (
        <Link className="landing-cta" to={session ? "/app" : "/signup"}>
            {t(session ? "saas.openApp" : "saas.cta")}
            <ArrowRight size={17} />
        </Link>
    );

    return (
        <div className="landing h-dvh overflow-x-hidden overflow-y-auto">
            <header className="landing-nav">
                <Link to="/" className="flex items-center gap-2.5 text-lg font-medium tracking-tight">
                    <img src="/logo.svg" alt="" className="size-7 invert" />
                    infinite canvas<span className="ml-1 rounded border border-white/20 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-white/50">beta</span>
                </Link>
                <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
                    {["workflows", "models", "pricing", "faq"].map((key) => (
                        <a key={key} href={`#${key}`} className="hover:text-white">
                            {t(`saas.${key}`)}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center gap-5 text-sm">
                    {!session && (
                        <Link to="/login" className="hidden text-white/70 hover:text-white sm:block">
                            {t("saas.login")}
                        </Link>
                    )}
                    <Link to={session ? "/app" : "/signup"} className="rounded-full !bg-[#eff0e9] px-5 py-2.5 font-medium !text-[#131510]">
                        {t(session ? "saas.openApp" : "saas.signup")}
                    </Link>
                </div>
            </header>

            <main>
                <section className="landing-hero">
                    <motion.div initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="landing-eyebrow">
                            <span className="mr-2 inline-block size-1.5 rounded-full bg-[#dbfc7b]" />
                            {t("saas.eyebrow")}
                        </p>
                        <h1 className="whitespace-pre-line text-[clamp(3.5rem,7.8vw,7.5rem)] font-medium leading-[0.99] tracking-[-0.065em]">{t("saas.headline")}</h1>
                        <p className="mx-auto mb-8 mt-7 max-w-xl text-base leading-relaxed text-white/50 md:text-lg">{t("saas.description")}</p>
                        <div className="flex flex-wrap items-center justify-center gap-5">
                            {cta}
                            <a href="#workflows" className="flex items-center gap-2 text-sm text-white/70">
                                {t("saas.explore")}
                                <ArrowDown size={15} />
                            </a>
                        </div>
                        <p className="mt-4 text-xs text-white/35">{t("saas.noCard")}</p>
                    </motion.div>
                    <div className="landing-graph" role="img" aria-label={t("saas.graphLabel")}>
                        <div className="graph-scale">
                            <svg className="graph-edges" viewBox="0 0 1100 390" aria-hidden="true">
                                <defs>
                                    <linearGradient id="edge">
                                        <stop stopColor="#dbfc7b" />
                                        <stop offset="1" stopColor="#b5a4ef" />
                                    </linearGradient>
                                </defs>
                                <path d="M230 195 C285 195 270 140 325 140 M565 140 C625 140 600 235 660 235 M840 235 C890 235 870 140 925 140" />
                            </svg>
                            <div className="graph-node graph-prompt">
                                <div className="graph-title">
                                    <Sparkles size={14} />
                                    {t("saas.prompt")}
                                    <span>01</span>
                                </div>
                                <p className="p-5 text-left text-sm leading-relaxed text-white/65">{t("saas.promptText")}</p>
                                <div className="graph-dot" />
                            </div>
                            <div className="graph-node graph-image">
                                <div className="graph-title">
                                    <Layers size={14} />
                                    {t("saas.image")}
                                    <span>02</span>
                                </div>
                                <div className="graph-art">
                                    <div className="chrome-orb" />
                                    <span className="absolute bottom-3 left-3 rounded bg-black/30 px-2 py-1 text-[9px] tracking-wider">FLUX · 1024 × 1024</span>
                                </div>
                                <div className="graph-dot" />
                            </div>
                            <div className="graph-node graph-upscale">
                                <div className="graph-title">
                                    <Expand size={14} />
                                    {t("saas.upscale")}
                                    <span>03</span>
                                </div>
                                <div className="px-5 py-7 text-left">
                                    <span className="text-3xl tracking-tight">4×</span>
                                    <span className="ml-3 text-xs text-white/40">4096 × 4096</span>
                                    <div className="mt-4 h-1 rounded-full bg-white/10">
                                        <div className="h-full w-4/5 rounded-full bg-[#dbfc7b]" />
                                    </div>
                                </div>
                                <div className="graph-dot" />
                            </div>
                            <div className="graph-node graph-video">
                                <div className="graph-title">
                                    ▷ {t("saas.video")}
                                    <span>04</span>
                                </div>
                                <div className="graph-art graph-art-video">
                                    <div className="chrome-orb" />
                                    <span className="absolute bottom-3 right-3 text-xs">00:05</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="models" className="landing-models">
                    <p className="landing-eyebrow text-center">{t("saas.modelEyebrow")}</p>
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-lg font-medium tracking-tight text-white/55">
                        {models.map((model) => (
                            <span key={model}>{model}</span>
                        ))}
                    </div>
                </section>

                <section id="workflows" className="landing-section">
                    <p className="landing-eyebrow">{t("saas.featureEyebrow")}</p>
                    <h2 className="landing-heading max-w-2xl">{t("saas.featureTitle")}</h2>
                    <div className="mt-14 grid gap-5 md:grid-cols-2">
                        {features.map((feature, index) => {
                            const Icon = icons[index];
                            return (
                                <article key={feature.title} className={`landing-feature feature-${index}`}>
                                    <div className="feature-sketch" aria-hidden="true">
                                        {index === 0 ? (
                                            <div className="mini-nodes">
                                                <span />
                                                <i />
                                                <span />
                                                <i />
                                                <span />
                                            </div>
                                        ) : index === 1 ? (
                                            <div className="flex flex-wrap justify-center gap-2 px-5">
                                                {["GPT Image", "Flux", "Veo", "Kling"].map((model) => (
                                                    <span className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm text-white/65" key={model}>
                                                        {model}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : index === 2 ? (
                                            <div className="remix-orbs">
                                                <div />
                                                <div />
                                                <div />
                                            </div>
                                        ) : (
                                            <div className="flex -space-x-3">
                                                {["#dbfc7b", "#b4a6df", "#e7ba8e"].map((color, i) => (
                                                    <div key={color} style={{ background: color, zIndex: 3 - i }} className="grid size-16 place-content-center rounded-full border-4 border-[#1a1c18] text-[#303229]">
                                                        <Users size={22} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4 flex items-center gap-3">
                                        <Icon size={20} className="text-[#dbfc7b]" />
                                        <h3 className="text-2xl tracking-tight">{feature.title}</h3>
                                    </div>
                                    <p className="max-w-md text-sm leading-7 text-white/50">{feature.text}</p>
                                    <p className="mt-6 text-xs text-white/30">{feature.detail}</p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section id="pricing" className="landing-section text-center">
                    <p className="landing-eyebrow">{t("saas.pricingEyebrow")}</p>
                    <h2 className="landing-heading">{t("saas.pricingTitle")}</h2>
                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/45">{t("saas.pricingDescription")}</p>
                    <div className="my-10 inline-flex rounded-full border border-white/15 p-1">
                        {[false, true].map((value) => (
                            <button key={String(value)} aria-pressed={annual === value} onClick={() => setAnnual(value)} className={`rounded-full px-6 py-2 text-sm ${annual === value ? "bg-[#e9eddf] !text-[#161812]" : "!text-white/50"}`}>
                                {t(value ? "saas.annual" : "saas.monthly")}
                            </button>
                        ))}
                    </div>
                    <div className="grid gap-3 text-left sm:grid-cols-2 xl:grid-cols-5">
                        {plans.map((plan) => (
                            <article key={plan.name} className={`relative flex flex-col rounded-2xl border p-6 ${plan.name === "Pro" ? "border-[#dbfc7b]/70 bg-[#dbfc7b]/5" : "border-white/10 bg-white/[0.02]"}`}>
                                {plan.name === "Pro" && <span className="absolute -top-3 left-5 rounded-full bg-[#dbfc7b] px-3 py-1 text-[10px] font-medium text-[#161812]">{t("saas.popular")}</span>}
                                <h3 className="mb-6 text-lg">{plan.name}</h3>
                                <div>
                                    <span className="text-4xl tracking-tight">${annual ? plan.annual : plan.monthly}</span>
                                    <span className="ml-1 text-xs text-white/40">{t(plan.name === "Team" ? "saas.seat" : "saas.month")}</span>
                                </div>
                                <p className="mt-2 h-5 text-[11px] text-white/35">{annual && plan.monthly > 0 ? t("saas.annualNote") : "\u00a0"}</p>
                                <p className="mb-6 mt-5 text-sm text-[#dbfc7b]">{t(plan.name === "Team" ? "saas.seatCredits" : "saas.credits", { count: plan.credits })}</p>
                                <Link to="/signup" className={`mb-7 block rounded-lg py-2.5 text-center text-sm ${plan.name === "Pro" ? "!bg-[#dbfc7b] !text-[#161812]" : "border border-white/20 hover:!bg-white/5"}`}>
                                    {t("saas.signup")}
                                </Link>
                                <ul className="space-y-3 text-xs leading-5 text-white/50">
                                    {[t("saas.canvasIncluded"), t("saas.ownKeys"), t(plan.name === "Team" ? "saas.team" : "saas.personal"), ...(plan.rollover ? [t("saas.rollover", { count: plan.rollover })] : [])].map((item) => (
                                        <li key={item} className="flex gap-2">
                                            <Check size={13} className="mt-1 shrink-0 text-white/40" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="faq" className="landing-section grid gap-12 md:grid-cols-2">
                    <h2 className="landing-heading max-w-md">{t("saas.faqTitle")}</h2>
                    <div>
                        {questions.map((item) => (
                            <details key={item.question} className="group border-b border-white/10 py-6">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base">
                                    {item.question}
                                    <span className="text-2xl font-light text-white/40 group-open:rotate-45">+</span>
                                </summary>
                                <p className="pt-4 text-sm leading-7 text-white/50">{item.answer}</p>
                            </details>
                        ))}
                    </div>
                </section>
                <section className="landing-bottom">
                    <Sparkles className="mx-auto mb-7 text-[#dbfc7b]" size={30} />
                    <h2 className="landing-heading mx-auto mb-9 max-w-2xl">{t("saas.bottomTitle")}</h2>
                    {cta}
                </section>
            </main>
            <footer className="mx-auto flex max-w-7xl flex-wrap justify-between gap-5 border-t border-white/10 px-6 py-8 text-xs text-white/35">
                <span>infinite canvas — {t("saas.footer")}</span>
                <a className="hover:text-white/70" href="https://github.com/basketikun/infinite-canvas" target="_blank" rel="noreferrer">
                    {t("saas.attribution")}
                </a>
            </footer>
        </div>
    );
}
