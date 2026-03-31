import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Link } from "@/i18n/navigation";
import { CalendarDays, ArrowRight } from "lucide-react";

export default function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Booking");

  return (
    <>
      {/* Page header */}
      <section className="bg-primary/5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      {/* Coming soon */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CalendarDays className="h-10 w-10" />
          </div>
          <h2 className="mt-6 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {t("comingSoonTitle")}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {t("comingSoonText")}
          </p>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("contactCta")}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            {t("contactButton")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
