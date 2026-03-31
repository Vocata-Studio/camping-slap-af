import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import {
  Baby,
  Fish,
  Flame,
  Circle,
  Mountain,
  Flower2,
  Microscope,
  Bike,
} from "lucide-react";

export default function ActivitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Activities");

  const onSite = [
    {
      key: "1",
      icon: <Baby className="h-6 w-6" />,
      title: t("activity1Title"),
      description: t("activity1Description"),
    },
    {
      key: "2",
      icon: <Fish className="h-6 w-6" />,
      title: t("activity2Title"),
      description: t("activity2Description"),
    },
    {
      key: "3",
      icon: <Flame className="h-6 w-6" />,
      title: t("activity3Title"),
      description: t("activity3Description"),
    },
    {
      key: "4",
      icon: <Circle className="h-6 w-6" />,
      title: t("activity4Title"),
      description: t("activity4Description"),
    },
  ];

  const nearby = [
    {
      key: "1",
      icon: <Mountain className="h-6 w-6" />,
      title: t("nearby1Title"),
      description: t("nearby1Description"),
    },
    {
      key: "2",
      icon: <Flower2 className="h-6 w-6" />,
      title: t("nearby2Title"),
      description: t("nearby2Description"),
    },
    {
      key: "3",
      icon: <Microscope className="h-6 w-6" />,
      title: t("nearby3Title"),
      description: t("nearby3Description"),
    },
    {
      key: "4",
      icon: <Bike className="h-6 w-6" />,
      title: t("nearby4Title"),
      description: t("nearby4Description"),
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

      {/* On-site activities */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {t("onSiteTitle")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {onSite.map((item) => (
              <div
                key={item.key}
                className="flex gap-4 rounded-xl border border-border/50 bg-card p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby attractions */}
      <section className="bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {t("nearbyTitle")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {nearby.map((item) => (
              <div
                key={item.key}
                className="flex gap-4 rounded-xl border border-border/50 bg-background p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
