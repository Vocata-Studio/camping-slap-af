import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Trees, Users, Wind, ArrowRight, MapPin } from "lucide-react";
import { use } from "react";
import Image from "next/image";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Home");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[85vh] items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Text side */}
            <div className="relative z-10 py-16 sm:py-20 lg:py-24">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <MapPin className="h-3.5 w-3.5" />
                {t("heroLocation")}
              </div>
              <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
                {t("heroTitle")}
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {t("heroSubtitle")}
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/accommodation"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  {t("heroCta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  {t("heroSecondary")}
                </Link>
              </div>
            </div>

            {/* Image side */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/images/old-gerlis-placeholder.webp"
                  alt="Camping Slap Af — campingplads i Sejerslev, Mors"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl bg-primary/10" />
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-secondary/20" />
            </div>
          </div>
        </div>

        {/* Mobile background image */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/images/old-gerlis-placeholder.webp"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-background/85" />
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-3xl font-bold text-foreground sm:text-4xl">
            {t("highlightsTitle")}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <HighlightCard
              icon={<Trees className="h-8 w-8" />}
              title={t("highlight1Title")}
              description={t("highlight1Description")}
            />
            <HighlightCard
              icon={<Users className="h-8 w-8" />}
              title={t("highlight2Title")}
              description={t("highlight2Description")}
            />
            <HighlightCard
              icon={<Wind className="h-8 w-8" />}
              title={t("highlight3Title")}
              description={t("highlight3Description")}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("ctaDescription")}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            {t("ctaButton")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function HighlightCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
