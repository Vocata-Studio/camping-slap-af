import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Tent, Caravan, Home, Sparkles, ShowerHead } from "lucide-react";

export default function AccommodationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Accommodation");

  const accommodations = [
    {
      key: "tent",
      icon: <Tent className="h-10 w-10" />,
      title: t("tent"),
      description: t("tentDescription"),
    },
    {
      key: "caravan",
      icon: <Caravan className="h-10 w-10" />,
      title: t("caravan"),
      description: t("caravanDescription"),
    },
    {
      key: "cabin",
      icon: <Home className="h-10 w-10" />,
      title: t("cabin"),
      description: t("cabinDescription"),
    },
    {
      key: "glamping",
      icon: <Sparkles className="h-10 w-10" />,
      title: t("glamping"),
      description: t("glampingDescription"),
    },
  ];

  return (
    <>
      {/* Page header */}
      <section className="bg-primary/5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Accommodation types */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2">
            {accommodations.map((item) => (
              <div
                key={item.key}
                className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Placeholder image */}
                <div className="flex aspect-[16/9] items-center justify-center bg-primary/10">
                  <div className="text-primary/40">{item.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-4 text-sm font-medium text-primary">
                    {t("priceTba")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShowerHead className="h-8 w-8" />
            </div>
            <h2 className="mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              {t("facilities")}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {t("facilitiesDescription")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
